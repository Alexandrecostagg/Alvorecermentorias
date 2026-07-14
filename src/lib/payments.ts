import type { Address } from '../types'
import type { CartItem } from '../context/CartContext'

type AuthenticatedUser = {
  getIdToken: () => Promise<string>
}

type StartCheckoutParams = {
  user: AuthenticatedUser
  items: CartItem[]
  address: Address
}

const paymentApiBaseUrl = import.meta.env.VITE_PAYMENT_API_BASE_URL?.replace(/\/$/, '')

export async function startAsaasCheckout({ user, items, address }: StartCheckoutParams) {
  if (!paymentApiBaseUrl) {
    throw new Error('O pagamento ainda não foi configurado neste ambiente.')
  }

  const response = await fetch(`${paymentApiBaseUrl}/checkout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: items.map(({ product, qty }) => ({
        productId: String(product.id),
        quantity: qty,
      })),
      address,
    }),
  })

  const body = await response.json().catch(() => ({})) as { orderId?: string; checkoutUrl?: string; error?: string }
  if (!response.ok || !body.orderId || !body.checkoutUrl) {
    throw new Error(body.error || 'Não foi possível iniciar o pagamento.')
  }

  return { orderId: body.orderId, checkoutUrl: body.checkoutUrl }
}
