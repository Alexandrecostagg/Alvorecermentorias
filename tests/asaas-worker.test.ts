import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateKeyPairSync } from 'node:crypto'
import worker, { testables } from '../workers/asaas-checkout/src/index'

describe('Asaas Worker', () => {
  afterEach(() => vi.restoreAllMocks())

  it('agrupa o mesmo produto e preserva a quantidade total', () => {
    expect(testables.normalizeItems([
      { productId: 'produto-1', quantity: 2 },
      { productId: 'produto-1', quantity: 3 },
    ])).toEqual([{ productId: 'produto-1', quantity: 5 }])
  })

  it('recusa quantidades inválidas ou superiores ao limite', () => {
    expect(() => testables.normalizeItems([{ productId: 'produto-1', quantity: 0 }])).toThrow('Item do carrinho inválido')
    expect(() => testables.normalizeItems([
      { productId: 'produto-1', quantity: 15 },
      { productId: 'produto-1', quantity: 6 },
    ])).toThrow('quantidade máxima')
  })

  it('normaliza e valida o endereço brasileiro', () => {
    expect(testables.normalizeAddress({
      street: ' Rua das Flores ',
      number: ' 10 ',
      neighborhood: ' Centro ',
      city: ' Belém ',
      state: 'pa',
      zipCode: '66000-000',
    })).toEqual({
      street: 'Rua das Flores',
      number: '10',
      complement: undefined,
      neighborhood: 'Centro',
      city: 'Belém',
      state: 'PA',
      zipCode: '66000000',
    })

    expect(() => testables.normalizeAddress({
      street: 'Rua',
      number: '10',
      neighborhood: 'Centro',
      city: 'Belém',
      state: 'Pará',
      zipCode: '123',
    })).toThrow('endereço de entrega completo')
  })

  it('aceita somente PIX ou cartão como forma de pagamento', () => {
    expect(testables.normalizeBillingType('PIX')).toBe('PIX')
    expect(testables.normalizeBillingType('CREDIT_CARD')).toBe('CREDIT_CARD')
    expect(() => testables.normalizeBillingType('BOLETO')).toThrow('Escolha PIX ou cartão')
    expect(() => testables.normalizeBillingType(undefined)).toThrow('Escolha PIX ou cartão')
  })

  it('impede pagamento de produto físico antes da cotação do frete', () => {
    expect(() => testables.assertPhysicalShippingIsQuoted([{
      product: { shippingRequired: true },
    }])).toThrow('frete ainda precisa ser calculado')
    expect(() => testables.assertPhysicalShippingIsQuoted([{
      product: { shippingRequired: false },
    }])).not.toThrow()
  })

  it('impede a venda digital antes do arquivo privado estar pronto', () => {
    expect(() => testables.assertDigitalProductsReady([{
      product: { shippingRequired: false, digitalDeliveryReady: false },
    }])).toThrow('não possui arquivo')
    expect(() => testables.assertDigitalProductsReady([{
      product: { shippingRequired: false, digitalDeliveryReady: true },
    }])).not.toThrow()
  })

  it('gera links assinados que expiram e rejeita adulteração', async () => {
    const now = Date.now()
    vi.spyOn(Date, 'now').mockReturnValue(now)
    const token = await testables.signDownloadToken({
      entitlementId: 'order_product',
      userId: 'user-1',
      expiresAt: now + 60_000,
    }, 'segredo-de-download')

    await expect(testables.verifyDownloadToken(token, 'segredo-de-download')).resolves.toMatchObject({
      entitlementId: 'order_product',
      userId: 'user-1',
    })
    await expect(testables.verifyDownloadToken(`${token}x`, 'segredo-de-download')).rejects.toThrow('inválido')
    vi.spyOn(Date, 'now').mockReturnValue(now + 60_001)
    await expect(testables.verifyDownloadToken(token, 'segredo-de-download')).rejects.toThrow('expirou')
  })

  it('trata download sem token como erro controlado', async () => {
    const response = await worker.fetch(new Request('https://worker.example/digital/download'), {
      FIREBASE_SERVICE_ACCOUNT_JSON: '{}',
      DOWNLOAD_TOKEN_SECRET: 'segredo-de-download',
      DIGITAL_ASSETS: { get: vi.fn(), put: vi.fn(), delete: vi.fn() },
    } as never)

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'Link de download inválido.' })
    expect(response.headers.get('Cache-Control')).toContain('no-store')
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
  })

  it('limita CORS à origem configurada', async () => {
    const env = { APP_ORIGIN: 'https://app.example.test' } as never
    const allowed = await worker.fetch(new Request('https://worker.example.test/checkout', {
      method: 'OPTIONS', headers: { Origin: 'https://app.example.test' },
    }), env)
    expect(allowed.status).toBe(204)
    expect(allowed.headers.get('Access-Control-Allow-Origin')).toBe('https://app.example.test')
    const denied = await worker.fetch(new Request('https://worker.example.test/checkout', {
      method: 'OPTIONS', headers: { Origin: 'https://other.example.test' },
    }), env)
    expect(denied.status).toBe(403)
    expect(denied.headers.get('Access-Control-Allow-Origin')).toBeNull()
  })

  it('aceita somente nomes seguros de PDF ou EPUB', () => {
    expect(testables.sanitizeDigitalFileName('Meu E-book Fé.pdf')).toBe('Meu-E-book-Fe.pdf')
    expect(() => testables.sanitizeDigitalFileName('../../arquivo.exe')).toThrow('PDF ou EPUB')
  })

  it('confere a assinatura real do arquivo digital antes do upload', async () => {
    await expect(testables.assertDigitalFileSignature(
      new File(['<script>teste</script>'], 'falso.pdf', { type: 'application/pdf' }),
      'application/pdf',
    )).rejects.toThrow('assinatura PDF')
    await expect(testables.assertDigitalFileSignature(
      new File(['%PDF-1.7\nconteúdo fictício'], 'teste.pdf', { type: 'application/pdf' }),
      'application/pdf',
    )).resolves.toBeUndefined()
  })

  it('rejeita programa de outro mentor, rascunho ou preço inválido', () => {
    const valid = { status: 'published', mentorId: 'mentor-1', price: 599 }
    expect(() => testables.assertBookableMentoringProgram(valid, 'mentor-1')).not.toThrow()
    expect(() => testables.assertBookableMentoringProgram({ ...valid, mentorId: 'mentor-2' }, 'mentor-1')).toThrow('não está disponível')
    expect(() => testables.assertBookableMentoringProgram({ ...valid, status: 'draft' }, 'mentor-1')).toThrow('não está disponível')
    expect(() => testables.assertBookableMentoringProgram({ ...valid, price: -1 }, 'mentor-1')).toThrow('não está disponível')
  })

  it('recusa horários inválidos ou passados para mentoria', () => {
    expect(() => testables.assertValidMentoringSlot('2030-02-30', '10:00')).toThrow('data válida')
    expect(() => testables.assertValidMentoringSlot('2030-03-01', '25:00')).toThrow('data e um horário válidos')
    expect(() => testables.assertValidMentoringSlot('2020-01-01', '10:00')).toThrow('futuros')
    expect(() => testables.assertValidMentoringSlot('2030-03-01', '21:30')).not.toThrow()
  })

  it('mantém sessão paga ou concluída diante de evento tardio de cancelamento', () => {
    const cancelled = { orderStatus: 'cancelled' as const, checkoutStatus: 'CANCELED' as const }
    expect(testables.resolveMentoringStatusAfterPaymentEvent('scheduled', cancelled)).toBe('scheduled')
    expect(testables.resolveMentoringStatusAfterPaymentEvent('completed', cancelled)).toBe('completed')
    expect(testables.resolveMentoringStatusAfterPaymentEvent('pending_payment', cancelled)).toBe('cancelled')
  })

  it('registra o evento fictício antes de processar o webhook e ignora repetição', async () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
    const serviceAccount = {
      client_email: 'worker@example.test',
      private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
      token_uri: 'https://oauth.example.test/token',
    }
    let eventCreated = false
    let eventProcessed = false
    let sessionUpdated = false
    let slotConfirmed = false
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const url = String(input)
      if (url === serviceAccount.token_uri) return Response.json({ access_token: 'token-ficticio', expires_in: 3600 })
      if (url.includes('/documents/paymentEvents?documentId=evt-test')) {
        if (eventCreated) return new Response(null, { status: 409 })
        eventCreated = true
        return Response.json({})
      }
      if (url.includes('/documents/paymentEvents/evt-test') && init?.method === 'PATCH') {
        if (!eventCreated) return new Response(null, { status: 404 })
        eventProcessed = true
        return Response.json({})
      }
      if (url.endsWith('/documents/paymentEvents/evt-test')) {
        return Response.json({ fields: { processed: { booleanValue: eventProcessed } } })
      }
      if (url.endsWith('/documents/mentoringSessions/sess_test')) {
        return Response.json({ updateTime: '2026-10-26T12:00:00Z', fields: {
          status: { stringValue: 'pending_payment' }, slotId: { stringValue: 'slot-test' },
        } })
      }
      if (url.endsWith('/documents:commit')) {
        const write = JSON.parse(String(init?.body)).writes[0]
        if (String(write.update.name).endsWith('/mentoringSlots/slot-test')) slotConfirmed = true
        if (String(write.update.name).endsWith('/mentoringSessions/sess_test')) sessionUpdated = true
        return Response.json({})
      }
      if (url.endsWith('/documents/mentoringSlots/slot-test')) {
        return Response.json({ updateTime: '2026-10-26T12:00:00Z', fields: {
          sessionId: { stringValue: 'sess_test' }, status: { stringValue: slotConfirmed ? 'confirmed' : 'held' },
        } })
      }
      throw new Error(`Requisição externa inesperada: ${url}`)
    })
    const env = {
      FIREBASE_SERVICE_ACCOUNT_JSON: JSON.stringify(serviceAccount),
      FIREBASE_PROJECT_ID: 'project-test', ASAAS_WEBHOOK_TOKEN: 'token-webhook-ficticio',
    } as never
    const request = () => new Request('https://worker.example.test/webhooks/asaas', {
      method: 'POST', headers: { 'asaas-access-token': 'token-webhook-ficticio' },
      body: JSON.stringify({ id: 'evt-test', event: 'CHECKOUT_PAID', externalReference: 'sess_test' }),
    })

    const first = await worker.fetch(request(), env)
    expect(first.status).toBe(200)
    expect(sessionUpdated).toBe(true)
    expect(eventProcessed).toBe(true)
    const second = await worker.fetch(request(), env)
    await expect(second.json()).resolves.toMatchObject({ duplicate: true })
    expect(fetchMock.mock.calls.some(([input]) => String(input).endsWith('/documents:commit'))).toBe(true)
  })

  it('migra o ID numérico de um carrinho antigo para o documento atual', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{
        document: {
          name: 'projects/project/databases/(default)/documents/products/produto-atual',
          fields: {
            id: { integerValue: '1' },
            title: { stringValue: 'Bíblia Alvorecer Kids' },
            price: { doubleValue: 89.9 },
            section: { stringValue: 'kids' },
          },
        },
      }]), { status: 200, headers: { 'Content-Type': 'application/json' } }))

    const products = await testables.loadProducts(
      [{ productId: '1', quantity: 1 }],
      {
        APP_ORIGIN: 'https://example.com',
        FIREBASE_PROJECT_ID: 'project',
        FIREBASE_WEB_API_KEY: 'firebase-key',
        FIREBASE_SERVICE_ACCOUNT_JSON: '{}',
        ASAAS_API_BASE_URL: 'https://api-sandbox.asaas.com/v3',
        ASAAS_ACCESS_TOKEN: 'asaas-key',
        ASAAS_WEBHOOK_TOKEN: 'webhook-key',
      },
      'google-token',
    )

    expect(products[0].product).toMatchObject({
      id: 'produto-atual',
      title: 'Bíblia Alvorecer Kids',
      price: 89.9,
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
    const query = JSON.parse(String(fetchMock.mock.calls[1][1]?.body))
    expect(query.structuredQuery.where.fieldFilter.value).toEqual({ integerValue: '1' })
  })

  it('não aplica estoque físico a um produto digital pronto', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      fields: {
        title: { stringValue: 'E-book Alvorecer' },
        price: { doubleValue: 29.9 },
        stock: { integerValue: '0' },
        shippingRequired: { booleanValue: false },
        digitalDeliveryReady: { booleanValue: true },
      },
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }))

    const products = await testables.loadProducts(
      [{ productId: 'ebook-1', quantity: 1 }],
      {
        APP_ORIGIN: 'https://example.com',
        FIREBASE_PROJECT_ID: 'project',
        FIREBASE_WEB_API_KEY: 'firebase-key',
        FIREBASE_SERVICE_ACCOUNT_JSON: '{}',
        ASAAS_API_BASE_URL: 'https://api-sandbox.asaas.com/v3',
        ASAAS_ACCESS_TOKEN: 'asaas-key',
        ASAAS_WEBHOOK_TOKEN: 'webhook-key',
      },
      'google-token',
    )

    expect(products[0].product).toMatchObject({
      id: 'ebook-1',
      shippingRequired: false,
      digitalDeliveryReady: true,
    })
  })

  it('só envia dados pessoais à Asaas quando o perfil tem CPF válido', () => {
    expect(testables.buildAsaasCustomerData(
      { name: 'Cliente', email: 'cliente@example.com' },
      { name: 'Cliente Teste', cpf: '529.982.247-25', phone: '(11) 99999-9999' },
    )).toEqual({
      name: 'Cliente Teste',
      email: 'cliente@example.com',
      cpfCnpj: '52998224725',
      phone: '11999999999',
    })

    expect(testables.buildAsaasCustomerData(
      { name: 'Cliente', email: 'cliente@example.com' },
      { cpf: '' },
    )).toBeUndefined()
    expect(testables.buildAsaasCustomerData(
      { name: 'Cliente', email: 'cliente@example.com' },
      { cpf: '111.111.111-11' },
    )).toBeUndefined()
  })

  it('salva no pedido os dados operacionais do cliente sem copiar o CPF', () => {
    expect(testables.buildOrderCustomer(
      { name: 'Nome do login', email: 'cliente@example.com' },
      { name: 'Cliente Teste', phone: '(11) 99999-9999', cpf: '529.982.247-25' },
    )).toEqual({
      name: 'Cliente Teste',
      email: 'cliente@example.com',
      phone: '(11) 99999-9999',
    })
  })

  it('mapeia apenas eventos financeiros conhecidos', () => {
    expect(testables.paymentTransitionFromAsaasEvent('CHECKOUT_PAID')).toEqual({
      orderStatus: 'paid',
      checkoutStatus: 'PAID',
    })
    expect(testables.paymentTransitionFromAsaasEvent('CHECKOUT_CANCELED')).toEqual({
      orderStatus: 'cancelled',
      checkoutStatus: 'CANCELED',
    })
    expect(testables.paymentTransitionFromAsaasEvent('CHECKOUT_EXPIRED')).toEqual({
      orderStatus: 'cancelled',
      checkoutStatus: 'EXPIRED',
    })
    expect(testables.paymentTransitionFromAsaasEvent('CHECKOUT_CREATED')).toBeUndefined()
  })

  it('não regride o andamento logístico quando chega outro evento financeiro', () => {
    const paidTransition = { orderStatus: 'paid' as const, checkoutStatus: 'PAID' as const }
    const cancelledTransition = { orderStatus: 'cancelled' as const, checkoutStatus: 'CANCELED' as const }

    expect(testables.resolveOrderStatusAfterPaymentEvent('processing', paidTransition)).toBe('processing')
    expect(testables.resolveOrderStatusAfterPaymentEvent('shipping', cancelledTransition)).toBe('shipping')
    expect(testables.resolveOrderStatusAfterPaymentEvent('pending', paidTransition)).toBe('paid')
  })

  it('extrai a referência do pedido em diferentes formatos de webhook', () => {
    expect(testables.extractOrderId({ externalReference: 'order_123' })).toBe('order_123')
    expect(testables.extractOrderId({ checkout: { externalReference: 'order_456' } })).toBe('order_456')
    expect(testables.extractOrderId({ payment: { externalReference: 'order_789' } })).toBe('order_789')
  })

  it('compara o token do webhook sem aceitar variações', () => {
    expect(testables.safeTokenEquals('segredo-forte', 'segredo-forte')).toBe(true)
    expect(testables.safeTokenEquals('segredo-fraco', 'segredo-forte')).toBe(false)
    expect(testables.safeTokenEquals(null, 'segredo-forte')).toBe(false)
  })

  it('envia ao Asaas somente os campos aceitos e identifica a aplicação', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      id: 'checkout-1',
      link: 'https://sandbox.asaas.com/checkoutSession/show/checkout-1',
      status: 'ACTIVE',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }))

    await testables.requestAsaasCheckout({
      orderId: 'order_123',
      products: [{
        quantity: 2,
        product: { id: 'produto-1', title: 'Livro', price: 49.9 },
      }],
      customerData: {
        email: 'cliente@example.com',
        name: 'Cliente',
        cpfCnpj: '52998224725',
      },
      billingType: 'PIX',
    }, {
      APP_ORIGIN: 'https://example.com',
      FIREBASE_PROJECT_ID: 'project',
      FIREBASE_WEB_API_KEY: 'firebase-key',
      FIREBASE_SERVICE_ACCOUNT_JSON: '{}',
      ASAAS_API_BASE_URL: 'https://api-sandbox.asaas.com/v3',
      ASAAS_ACCESS_TOKEN: 'asaas-key',
      ASAAS_WEBHOOK_TOKEN: 'webhook-key',
    })

    const [, request] = fetchMock.mock.calls[0]
    const headers = request?.headers as Record<string, string>
    const body = JSON.parse(String(request?.body)) as Record<string, unknown>

    expect(headers['User-Agent']).toContain('AlvorecerMentorias')
    expect(body.externalReference).toBe('order_123')
    expect(body.billingTypes).toEqual(['PIX'])
    expect(body.customerData).toEqual({
      name: 'Cliente',
      email: 'cliente@example.com',
      cpfCnpj: '52998224725',
    })
    expect(body).not.toHaveProperty('customerData.address')
  })

  it('deixa a Asaas coletar o CPF quando o perfil não possui documento válido', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      id: 'checkout-2',
      link: 'https://sandbox.asaas.com/checkoutSession/show/checkout-2',
      status: 'ACTIVE',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }))

    await testables.requestAsaasCheckout({
      orderId: 'order_456',
      products: [{
        quantity: 1,
        product: { id: 'produto-1', title: 'Livro', price: 49.9 },
      }],
      billingType: 'PIX',
    }, {
      APP_ORIGIN: 'https://example.com',
      FIREBASE_PROJECT_ID: 'project',
      FIREBASE_WEB_API_KEY: 'firebase-key',
      FIREBASE_SERVICE_ACCOUNT_JSON: '{}',
      ASAAS_API_BASE_URL: 'https://api-sandbox.asaas.com/v3',
      ASAAS_ACCESS_TOKEN: 'asaas-key',
      ASAAS_WEBHOOK_TOKEN: 'webhook-key',
    })

    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body)) as Record<string, unknown>
    expect(body).not.toHaveProperty('customerData')
  })

  it('extrai referência de sessão de mentoria (sess_) em webhook do Asaas', () => {
    expect(testables.extractOrderId({ externalReference: 'sess_12345' })).toBe('sess_12345')
    expect(testables.extractOrderId({ checkout: { externalReference: 'sess_99999' } })).toBe('sess_99999')
    expect(testables.extractOrderId({ payment: { externalReference: 'sess_abcdef' } })).toBe('sess_abcdef')
  })
})
