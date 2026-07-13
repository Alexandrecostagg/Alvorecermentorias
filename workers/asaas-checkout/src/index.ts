interface Env {
  APP_ORIGIN: string
  FIREBASE_PROJECT_ID: string
  FIREBASE_WEB_API_KEY: string
  FIREBASE_SERVICE_ACCOUNT_JSON: string
  ASAAS_API_BASE_URL: string
  ASAAS_ACCESS_TOKEN: string
  ASAAS_WEBHOOK_TOKEN: string
}

type CheckoutItemRequest = { productId: string; quantity: number }
type AddressInput = {
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
}
type GoogleTokenCache = { token: string; expiresAt: number }

let googleTokenCache: GoogleTokenCache | undefined

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') return corsResponse(request, env)

    try {
      if (request.method === 'POST' && url.pathname === '/checkout') {
        assertAllowedOrigin(request, env)
        return json(await createCheckout(request, env), 201, corsHeaders(request, env))
      }

      if (request.method === 'POST' && url.pathname === '/webhooks/asaas') {
        return json(await receiveAsaasWebhook(request, env))
      }

      return json({ error: 'Rota não encontrada.' }, 404)
    } catch (error) {
      if (error instanceof HttpError) {
        return json({ error: error.message }, error.status, corsHeaders(request, env))
      }

      console.error(error)
      return json({ error: 'Não foi possível processar a solicitação.' }, 500, corsHeaders(request, env))
    }
  },
}

async function createCheckout(request: Request, env: Env) {
  ensureConfigured(env, [
    'FIREBASE_WEB_API_KEY',
    'FIREBASE_SERVICE_ACCOUNT_JSON',
    'ASAAS_ACCESS_TOKEN',
    'APP_ORIGIN',
  ])

  const payload = await request.json().catch(() => {
    throw new HttpError(400, 'Corpo da requisição inválido.')
  }) as { items?: CheckoutItemRequest[]; address?: AddressInput }
  const items = normalizeItems(payload.items)
  const address = normalizeAddress(payload.address)
  const user = await verifyFirebaseUser(request, env)
  const accessToken = await getGoogleAccessToken(env)
  const products = await loadProducts(items, env, accessToken)
  const orderId = `order_${crypto.randomUUID()}`
  const total = products.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const now = new Date().toISOString()

  await createFirestoreDocument('orders', orderId, {
    userId: user.uid,
    items: products.map(({ product, quantity }) => ({ product, qty: quantity })),
    total: roundMoney(total),
    status: 'pending',
    paymentMethod: 'asaas',
    address,
    createdAt: now,
    updatedAt: now,
  }, env, accessToken)

  const asaasCheckout = await requestAsaasCheckout({ orderId, products, user, address }, env)

  await updateFirestoreDocument('orders', orderId, {
    asaasCheckoutId: asaasCheckout.id,
    paymentStatus: 'awaiting_payment',
    updatedAt: new Date().toISOString(),
  }, env, accessToken)

  return { orderId, checkoutUrl: asaasCheckout.link }
}

async function receiveAsaasWebhook(request: Request, env: Env) {
  ensureConfigured(env, ['ASAAS_WEBHOOK_TOKEN', 'FIREBASE_SERVICE_ACCOUNT_JSON'])
  if (request.headers.get('asaas-access-token') !== env.ASAAS_WEBHOOK_TOKEN) {
    throw new HttpError(401, 'Webhook não autorizado.')
  }

  const payload = await request.json().catch(() => {
    throw new HttpError(400, 'Evento inválido.')
  }) as Record<string, unknown>
  const eventId = typeof payload.id === 'string' ? payload.id : undefined
  const event = typeof payload.event === 'string' ? payload.event : 'UNKNOWN'
  const orderId = extractOrderId(payload)
  if (!eventId || !orderId) return { received: true, ignored: true }

  const accessToken = await getGoogleAccessToken(env)
  const inserted = await createFirestoreDocument('paymentEvents', eventId, {
    event,
    orderId,
    receivedAt: new Date().toISOString(),
  }, env, accessToken, true)
  if (!inserted) return { received: true, duplicate: true }

  await updateFirestoreDocument('orders', orderId, {
    status: orderStatusFromAsaasEvent(event),
    paymentStatus: event,
    asaasEventId: eventId,
    updatedAt: new Date().toISOString(),
  }, env, accessToken)

  return { received: true }
}

function normalizeItems(value: unknown): CheckoutItemRequest[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) {
    throw new HttpError(400, 'Informe entre 1 e 20 itens.')
  }

  return value.map((item) => {
    const candidate = item as Partial<CheckoutItemRequest>
    const productId = typeof candidate.productId === 'string' ? candidate.productId.trim() : ''
    const quantity = Number(candidate.quantity)
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new HttpError(400, 'Item do carrinho inválido.')
    }
    return { productId, quantity }
  })
}

function normalizeAddress(value: unknown): AddressInput {
  if (!value || typeof value !== 'object') throw new HttpError(400, 'Endereço de entrega inválido.')
  const address = value as AddressInput
  const normalized = {
    street: cleanText(address.street),
    number: cleanText(address.number),
    complement: cleanText(address.complement),
    neighborhood: cleanText(address.neighborhood),
    city: cleanText(address.city),
    state: cleanText(address.state)?.toUpperCase(),
    zipCode: cleanText(address.zipCode)?.replace(/\D/g, ''),
  }
  if (!normalized.street || !normalized.number || !normalized.city || !normalized.state || !normalized.zipCode) {
    throw new HttpError(400, 'Preencha um endereço de entrega completo.')
  }
  return normalized
}

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 200) || undefined : undefined
}

async function verifyFirebaseUser(request: Request, env: Env) {
  const idToken = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
  if (!idToken) throw new HttpError(401, 'Faça login para iniciar o pagamento.')

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_WEB_API_KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  const result = await response.json() as { users?: Array<{ localId?: string; email?: string; displayName?: string }> }
  const account = result.users?.[0]
  if (!response.ok || !account?.localId || !account.email) throw new HttpError(401, 'Sua sessão expirou. Entre novamente.')

  return { uid: account.localId, email: account.email, name: account.displayName || 'Cliente Alvorecer' }
}

async function loadProducts(items: CheckoutItemRequest[], env: Env, accessToken: string) {
  return Promise.all(items.map(async ({ productId, quantity }) => {
    const document = await readFirestoreDocument('products', productId, env, accessToken)
    const data = fromFirestoreFields(document.fields as Record<string, unknown>) as Record<string, unknown>
    const price = Number(data.price)
    const title = typeof data.title === 'string' ? data.title : ''
    if (!title || !Number.isFinite(price) || price < 0 || data.active === false || data.ativo === false) {
      throw new HttpError(400, 'Um item do carrinho não está disponível.')
    }

    return {
      quantity,
      product: {
        id: productId,
        title,
        price: roundMoney(price),
        image: typeof data.image === 'string' ? data.image : '',
        category: typeof data.category === 'string' ? data.category : 'Loja',
        description: typeof data.description === 'string' ? data.description : undefined,
      },
    }
  }))
}

async function requestAsaasCheckout(
  data: {
    orderId: string
    products: Array<{ quantity: number; product: { id: string; title: string; price: number; description?: string } }>
    user: { email: string; name: string }
    address: AddressInput
  },
  env: Env,
) {
  const callbackBase = `${env.APP_ORIGIN.replace(/\/$/, '')}/checkout/status`
  const response = await fetch(`${env.ASAAS_API_BASE_URL.replace(/\/$/, '')}/checkouts`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      access_token: env.ASAAS_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      billingTypes: ['PIX', 'CREDIT_CARD'],
      chargeTypes: ['DETACHED'],
      minutesToExpire: 60,
      externalReference: data.orderId,
      callback: {
        successUrl: `${callbackBase}?result=success`,
        cancelUrl: `${callbackBase}?result=cancelled`,
        expiredUrl: `${callbackBase}?result=expired`,
      },
      items: data.products.map(({ product, quantity }) => ({
        externalReference: product.id,
        name: product.title,
        description: product.description,
        quantity,
        value: product.price,
      })),
      customerData: {
        name: data.user.name,
        email: data.user.email,
        postalCode: data.address.zipCode,
        address: data.address.street,
        addressNumber: data.address.number,
        complement: data.address.complement,
        province: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
      },
    }),
  })

  const result = await response.json() as { id?: string; link?: string; errors?: Array<{ description?: string }> }
  if (!response.ok || !result.id || !result.link) {
    console.error('Asaas checkout error', result)
    throw new HttpError(502, result.errors?.[0]?.description || 'A Asaas não conseguiu criar o checkout.')
  }

  return { id: result.id, link: result.link }
}

async function getGoogleAccessToken(env: Env) {
  if (googleTokenCache && googleTokenCache.expiresAt > Date.now() + 60_000) return googleTokenCache.token

  const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON) as {
    client_email: string
    private_key: string
    token_uri?: string
  }
  const issuedAt = Math.floor(Date.now() / 1000)
  const tokenUri = serviceAccount.token_uri || 'https://oauth2.googleapis.com/token'
  const unsignedJwt = `${base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64Url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: tokenUri,
    iat: issuedAt,
    exp: issuedAt + 3600,
  }))}`
  const key = await crypto.subtle.importKey('pkcs8', pemToArrayBuffer(serviceAccount.private_key), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsignedJwt))
  const assertion = `${unsignedJwt}.${base64Url(signature)}`
  const form = new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion })
  const response = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
  })
  const result = await response.json() as { access_token?: string; expires_in?: number }
  if (!response.ok || !result.access_token) throw new Error('Não foi possível autorizar o acesso ao Firestore.')

  googleTokenCache = { token: result.access_token, expiresAt: Date.now() + (result.expires_in || 3600) * 1000 }
  return googleTokenCache.token
}

async function readFirestoreDocument(collection: string, documentId: string, env: Env, accessToken: string) {
  const response = await fetch(firestoreDocumentUrl(collection, documentId, env), { headers: { Authorization: `Bearer ${accessToken}` } })
  if (response.status === 404) throw new HttpError(400, 'Um item do carrinho não existe mais.')
  if (!response.ok) throw new Error('Não foi possível consultar o catálogo.')
  return response.json() as Promise<{ fields?: Record<string, unknown> }>
}

async function createFirestoreDocument(
  collection: string,
  documentId: string,
  data: Record<string, unknown>,
  env: Env,
  accessToken: string,
  ignoreAlreadyExists = false,
) {
  const url = new URL(`${firestoreCollectionUrl(collection, env)}?documentId=${encodeURIComponent(documentId)}`)
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  })
  if (ignoreAlreadyExists && response.status === 409) return false
  if (!response.ok) throw new Error('Não foi possível registrar o pedido.')
  return true
}

async function updateFirestoreDocument(collection: string, documentId: string, data: Record<string, unknown>, env: Env, accessToken: string) {
  const url = new URL(firestoreDocumentUrl(collection, documentId, env))
  Object.keys(data).forEach((field) => url.searchParams.append('updateMask.fieldPaths', field))
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  })
  if (!response.ok) throw new Error('Não foi possível atualizar o pedido.')
}

function firestoreCollectionUrl(collection: string, env: Env) {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(env.FIREBASE_PROJECT_ID)}/databases/(default)/documents/${collection}`
}

function firestoreDocumentUrl(collection: string, documentId: string, env: Env) {
  return `${firestoreCollectionUrl(collection, env)}/${encodeURIComponent(documentId)}`
}

function extractOrderId(payload: Record<string, unknown>) {
  const checkout = payload.checkout as Record<string, unknown> | undefined
  const payment = payload.payment as Record<string, unknown> | undefined
  const candidates = [payload.externalReference, checkout?.externalReference, payment?.externalReference]
  return candidates.find((value): value is string => typeof value === 'string' && value.startsWith('order_'))
}

function orderStatusFromAsaasEvent(event: string) {
  if (event.includes('PAID') || event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') return 'paid'
  if (event.includes('CANCEL') || event.includes('EXPIRED') || event.includes('DELETED')) return 'cancelled'
  return 'pending'
}

function toFirestoreFields(data: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined).map(([key, value]) => [key, toFirestoreValue(value)]))
}

function toFirestoreValue(value: unknown): Record<string, unknown> {
  if (value === null) return { nullValue: null }
  if (typeof value === 'string') return { stringValue: value }
  if (typeof value === 'number') return { doubleValue: value }
  if (typeof value === 'boolean') return { booleanValue: value }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } }
  if (typeof value === 'object') return { mapValue: { fields: toFirestoreFields(value as Record<string, unknown>) } }
  throw new Error('Tipo de dado não suportado.')
}

function fromFirestoreFields(fields: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, fromFirestoreValue(value as Record<string, unknown>)]))
}

function fromFirestoreValue(value: Record<string, unknown>): unknown {
  if ('stringValue' in value) return value.stringValue
  if ('doubleValue' in value) return Number(value.doubleValue)
  if ('integerValue' in value) return Number(value.integerValue)
  if ('booleanValue' in value) return value.booleanValue
  if ('nullValue' in value) return null
  if ('timestampValue' in value) return value.timestampValue
  if ('arrayValue' in value) {
    const arrayValue = value.arrayValue as { values?: Record<string, unknown>[] }
    return (arrayValue.values || []).map(fromFirestoreValue)
  }
  if ('mapValue' in value) {
    const mapValue = value.mapValue as { fields?: Record<string, unknown> }
    return fromFirestoreFields(mapValue.fields || {})
  }
  return undefined
}

function base64Url(value: string | ArrayBuffer) {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : new Uint8Array(value)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function pemToArrayBuffer(pem: string) {
  const binary = atob(pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '').replace(/\s/g, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function ensureConfigured(env: Env, keys: Array<keyof Env>) {
  if (keys.some((key) => !env[key])) throw new HttpError(500, 'O serviço de pagamento ainda não foi configurado.')
}

function assertAllowedOrigin(request: Request, env: Env) {
  if (request.headers.get('Origin') !== env.APP_ORIGIN) throw new HttpError(403, 'Origem não autorizada.')
}

function corsHeaders(request: Request, env: Env) {
  return request.headers.get('Origin') === env.APP_ORIGIN
    ? { 'Access-Control-Allow-Origin': env.APP_ORIGIN, Vary: 'Origin' }
    : {}
}

function corsResponse(request: Request, env: Env) {
  if (request.headers.get('Origin') !== env.APP_ORIGIN) return new Response(null, { status: 403 })
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders(request, env),
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  })
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } })
}
