import type { OrderStatus } from '../types'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Aguardando pagamento',
  paid: 'Pago',
  processing: 'Em separação',
  shipping: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipping: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const OPERATIONAL_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus>> = {
  paid: 'processing',
  processing: 'shipping',
  shipping: 'delivered',
}

export function nextOperationalStatus(status: OrderStatus) {
  return OPERATIONAL_TRANSITIONS[status]
}

export function canApplyOperationalTransition(current: OrderStatus, next: OrderStatus) {
  return nextOperationalStatus(current) === next
}

export function formatOrderDate(value?: string) {
  if (!value) return 'Data não informada'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Data não informada' : date.toLocaleDateString('pt-BR')
}
