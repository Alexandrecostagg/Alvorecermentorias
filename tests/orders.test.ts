import { describe, expect, it } from 'vitest'
import { canApplyOperationalTransition, nextOperationalStatus } from '../src/lib/orders'

describe('fluxo operacional de pedidos', () => {
  it('permite somente a sequência de separação, envio e entrega', () => {
    expect(nextOperationalStatus('paid')).toBe('processing')
    expect(nextOperationalStatus('processing')).toBe('shipping')
    expect(nextOperationalStatus('shipping')).toBe('delivered')
  })

  it('não permite alterar manualmente o resultado financeiro', () => {
    expect(canApplyOperationalTransition('pending', 'paid')).toBe(false)
    expect(canApplyOperationalTransition('cancelled', 'paid')).toBe(false)
    expect(canApplyOperationalTransition('paid', 'shipping')).toBe(false)
  })
})
