import { generateKeyPairSync } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import worker, { testables } from '../workers/asaas-checkout/src/index'

const projectId = 'alvorecermentorias-reservation-test'
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST
const firestoreRoot = `http://${firestoreHost}/v1/projects/${projectId}/databases/(default)/documents`
const nativeFetch = globalThis.fetch.bind(globalThis)

function fields(data: Record<string, string | boolean | number>) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key,
    typeof value === 'string' ? { stringValue: value }
      : typeof value === 'boolean' ? { booleanValue: value } : { doubleValue: value },
  ]))
}

async function readDocument(collection: string, id: string) {
  const response = await nativeFetch(`${firestoreRoot}/${collection}/${id}`, {
    headers: { Authorization: 'Bearer owner' },
  })
  expect(response.ok).toBe(true)
  return response.json() as Promise<{ fields: Record<string, { stringValue?: string }> }>
}

describe('reserva concorrente de mentoria no Firestore Emulator', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>
  let checkoutCount = 0
  let environment: Parameters<typeof worker.fetch>[1]

  beforeAll(async () => {
    if (!firestoreHost) throw new Error('Execute este teste somente com o Firestore Emulator.')
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
    environment = {
      APP_ORIGIN: 'https://app.example.test',
      FIREBASE_PROJECT_ID: projectId,
      FIREBASE_WEB_API_KEY: 'firebase-ficticia',
      FIREBASE_SERVICE_ACCOUNT_JSON: JSON.stringify({
        client_email: 'worker@example.test',
        private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
        token_uri: 'https://oauth.example.test/token',
      }),
      ASAAS_API_BASE_URL: 'https://asaas.example.test/v3',
      ASAAS_ACCESS_TOKEN: 'asaas-ficticio',
      ASAAS_WEBHOOK_TOKEN: 'webhook-ficticio',
    } as never
    const seed = await nativeFetch(`${firestoreRoot}/mentors?documentId=mentor-1`, {
      method: 'POST',
      headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: fields({ name: 'Mentor Fictício', available: true, status: 'published' }) }),
    })
    expect(seed.ok).toBe(true)

    fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const url = String(input)
      if (url.startsWith('https://firestore.googleapis.com/v1/')) {
        const headers = new Headers(init?.headers)
        headers.set('Authorization', 'Bearer owner')
        return nativeFetch(url.replace('https://firestore.googleapis.com/v1', `http://${firestoreHost}/v1`), { ...init, headers })
      }
      if (url.startsWith('https://identitytoolkit.googleapis.com/')) {
        const token = JSON.parse(String(init?.body)).idToken as string
        return Response.json({ users: [{ localId: token, email: `${token}@example.test`, displayName: token }] })
      }
      if (url === 'https://oauth.example.test/token') return Response.json({ access_token: 'owner', expires_in: 3600 })
      if (url === 'https://asaas.example.test/v3/checkouts') {
        checkoutCount += 1
        return Response.json({ id: `checkout-${checkoutCount}`, link: `https://checkout.example.test/${checkoutCount}`, status: 'ACTIVE' })
      }
      throw new Error(`Saída da rede não prevista no teste: ${url}`)
    })
  })

  afterAll(() => fetchSpy?.mockRestore())

  it('permite uma reserva, libera após cancelamento e isola pagamento tardio', async () => {
    const checkoutRequest = (userId: string) => new Request('https://worker.example.test/mentoring-checkout', {
      method: 'POST',
      headers: { Origin: 'https://app.example.test', Authorization: `Bearer ${userId}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mentorId: 'mentor-1', date: '2030-03-01', time: '10:00', billingType: 'PIX' }),
    })
    const [first, second] = await Promise.all([
      worker.fetch(checkoutRequest('user-a'), environment),
      worker.fetch(checkoutRequest('user-b'), environment),
    ])
    expect([first.status, second.status].sort()).toEqual([201, 409])
    expect(checkoutCount).toBe(1)
    const winner = first.status === 201 ? first : second
    const loserId = first.status === 409 ? 'user-a' : 'user-b'
    const firstSessionId = (await winner.json() as { sessionId: string }).sessionId

    const webhook = (id: string, event: string, sessionId: string) => new Request('https://worker.example.test/webhooks/asaas', {
      method: 'POST',
      headers: { 'asaas-access-token': 'webhook-ficticio', 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, event, externalReference: sessionId }),
    })
    const cancelled = await worker.fetch(webhook('event-cancelled', 'CHECKOUT_CANCELED', firstSessionId), environment)
    expect(cancelled.status).toBe(200)

    const retry = await worker.fetch(checkoutRequest(loserId), environment)
    expect(retry.status).toBe(201)
    expect(checkoutCount).toBe(2)
    const secondSessionId = (await retry.json() as { sessionId: string }).sessionId

    const latePayment = await worker.fetch(webhook('event-late-paid', 'CHECKOUT_PAID', firstSessionId), environment)
    expect(latePayment.status).toBe(200)
    const oldSession = await readDocument('mentoringSessions', firstSessionId)
    expect(oldSession.fields.status.stringValue).toBe('payment_review')

    const secondPayment = await worker.fetch(webhook('event-paid', 'CHECKOUT_PAID', secondSessionId), environment)
    expect(secondPayment.status).toBe(200)
    const newSession = await readDocument('mentoringSessions', secondSessionId)
    expect(newSession.fields.status.stringValue).toBe('scheduled')
    expect(fetchSpy.mock.calls.some(([input]) => String(input).includes('api-sandbox.asaas.com'))).toBe(false)
  })

  it('reaproveita apenas reserva órfã expirada sem checkout associado', async () => {
    const seedSlot = async (date: string, time: string, checkoutId?: string) => {
      const id = await testables.mentoringSlotId('mentor-1', date, time)
      const response = await nativeFetch(`${firestoreRoot}/mentoringSlots?documentId=${id}`, {
        method: 'POST',
        headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: {
          ...fields({ mentorId: 'mentor-1', date, time, sessionId: 'sess_orphan', status: 'held', expiresAt: '2020-01-01T00:00:00Z' }),
          checkoutId: checkoutId ? { stringValue: checkoutId } : { nullValue: null },
        } }),
      })
      expect(response.ok).toBe(true)
      return id
    }
    const reclaimableId = await seedSlot('2030-03-02', '11:00')
    await seedSlot('2030-03-03', '11:00', 'checkout-active')
    const request = (date: string) => new Request('https://worker.example.test/mentoring-checkout', {
      method: 'POST',
      headers: { Origin: 'https://app.example.test', Authorization: 'Bearer user-c', 'Content-Type': 'application/json' },
      body: JSON.stringify({ mentorId: 'mentor-1', date, time: '11:00', billingType: 'PIX' }),
    })
    const before = checkoutCount
    const acquired = await worker.fetch(request('2030-03-02'), environment)
    expect(acquired.status).toBe(201)
    const sessionId = (await acquired.json() as { sessionId: string }).sessionId
    const slot = await readDocument('mentoringSlots', reclaimableId)
    expect(slot.fields.sessionId.stringValue).toBe(sessionId)
    const blocked = await worker.fetch(request('2030-03-03'), environment)
    expect(blocked.status).toBe(409)
    expect(checkoutCount).toBe(before + 1)
  })

  it('preserva estado consistente quando pago e cancelado chegam juntos', async () => {
    const checkout = await worker.fetch(new Request('https://worker.example.test/mentoring-checkout', {
      method: 'POST',
      headers: { Origin: 'https://app.example.test', Authorization: 'Bearer user-d', 'Content-Type': 'application/json' },
      body: JSON.stringify({ mentorId: 'mentor-1', date: '2030-03-04', time: '14:00', billingType: 'PIX' }),
    }), environment)
    expect(checkout.status).toBe(201)
    const sessionId = (await checkout.json() as { sessionId: string }).sessionId
    const event = (id: string, kind: string) => new Request('https://worker.example.test/webhooks/asaas', {
      method: 'POST',
      headers: { 'asaas-access-token': 'webhook-ficticio', 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, event: kind, externalReference: sessionId }),
    })
    const results = await Promise.all([
      worker.fetch(event('race-paid', 'CHECKOUT_PAID'), environment),
      worker.fetch(event('race-cancelled', 'CHECKOUT_CANCELED'), environment),
    ])
    expect(results.map(result => result.status)).toEqual([200, 200])
    const session = await readDocument('mentoringSessions', sessionId)
    const slotId = await testables.mentoringSlotId('mentor-1', '2030-03-04', '14:00')
    const slot = await readDocument('mentoringSlots', slotId)
    expect(['scheduled', 'payment_review']).toContain(session.fields.status.stringValue)
    expect(slot.fields.status.stringValue).toBe(session.fields.status.stringValue === 'scheduled' ? 'confirmed' : 'released')
  })

  it('processa sessões legadas sem slot e coloca conflito em análise', async () => {
    const seedLegacy = async (id: string) => {
      const response = await nativeFetch(`${firestoreRoot}/mentoringSessions?documentId=${id}`, {
        method: 'POST',
        headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: fields({
          mentorId: 'mentor-1', menteeId: id, date: '2030-05-01', time: '09:00', status: 'pending_payment',
        }) }),
      })
      expect(response.ok).toBe(true)
    }
    const paidWebhook = (id: string, sessionId: string) => new Request('https://worker.example.test/webhooks/asaas', {
      method: 'POST',
      headers: { 'asaas-access-token': 'webhook-ficticio', 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, event: 'CHECKOUT_PAID', externalReference: sessionId }),
    })
    await seedLegacy('sess_legacy_one')
    await seedLegacy('sess_legacy_two')
    expect((await worker.fetch(paidWebhook('legacy-event-one', 'sess_legacy_one'), environment)).status).toBe(200)
    const first = await readDocument('mentoringSessions', 'sess_legacy_one')
    expect(first.fields.status.stringValue).toBe('scheduled')
    expect(first.fields.slotId.stringValue).toBe(await testables.mentoringSlotId('mentor-1', '2030-05-01', '09:00'))

    expect((await worker.fetch(paidWebhook('legacy-event-two', 'sess_legacy_two'), environment)).status).toBe(200)
    const second = await readDocument('mentoringSessions', 'sess_legacy_two')
    expect(second.fields.status.stringValue).toBe('payment_review')
  })
})
