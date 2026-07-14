import { afterEach, describe, expect, it, vi } from 'vitest'
import { testables } from '../workers/asaas-checkout/src/index'

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
})
