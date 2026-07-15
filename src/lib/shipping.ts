import type { Product, ShippingPackage } from '../types'

export const SHIPPING_ORIGIN_POSTAL_CODE = '68513675'

const packageFields: Array<keyof ShippingPackage> = ['weightKg', 'widthCm', 'heightCm', 'lengthCm']

export function hasValidShippingPackage(product: Pick<Product, 'shippingRequired' | 'shipping'>) {
  if (product.shippingRequired === false) return true
  return packageFields.every(field => {
    const value = product.shipping?.[field]
    return typeof value === 'number' && Number.isFinite(value) && value > 0
  })
}

export function normalizeShippingPackage(shipping?: Partial<ShippingPackage>): ShippingPackage {
  return {
    weightKg: Number(shipping?.weightKg) || 0,
    widthCm: Number(shipping?.widthCm) || 0,
    heightCm: Number(shipping?.heightCm) || 0,
    lengthCm: Number(shipping?.lengthCm) || 0,
  }
}
