import { describe, expect, it } from 'vitest'
import { cartRequiresShipping, hasValidShippingPackage, normalizeShippingPackage, SHIPPING_ORIGIN_POSTAL_CODE } from '../src/lib/shipping'

describe('dados de frete', () => {
  it('mantém o CEP de origem sem formatação', () => {
    expect(SHIPPING_ORIGIN_POSTAL_CODE).toBe('68513675')
  })

  it('exige peso e todas as dimensões para produto físico', () => {
    expect(hasValidShippingPackage({
      shippingRequired: true,
      shipping: { weightKg: 0.5, widthCm: 16, heightCm: 4, lengthCm: 23 },
    })).toBe(true)
    expect(hasValidShippingPackage({
      shippingRequired: true,
      shipping: { weightKg: 0, widthCm: 16, heightCm: 4, lengthCm: 23 },
    })).toBe(false)
    expect(hasValidShippingPackage({ shippingRequired: false })).toBe(true)
  })

  it('normaliza campos vazios sem inventar medidas', () => {
    expect(normalizeShippingPackage()).toEqual({
      weightKg: 0,
      widthCm: 0,
      heightCm: 0,
      lengthCm: 0,
    })
  })

  it('diferencia carrinhos físicos de carrinhos digitais', () => {
    expect(cartRequiresShipping([{
      product: { id: '1', title: 'Livro', image: '', price: 89.9, category: 'Livros', shippingRequired: true },
      qty: 1,
    }])).toBe(true)
    expect(cartRequiresShipping([{
      product: { id: '2', title: 'Curso', image: '', price: 109.9, category: 'Cursos', shippingRequired: false },
      qty: 1,
    }])).toBe(false)
  })
})
