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
      user: { email: 'cliente@example.com', name: 'Cliente' },
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
    expect(body.customerData).toEqual({ name: 'Cliente', email: 'cliente@example.com' })
    expect(body).not.toHaveProperty('customerData.address')
  })
})
