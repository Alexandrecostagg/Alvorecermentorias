import type { User } from 'firebase/auth'
import type { LibraryItem } from '../types'

const apiBaseUrl = import.meta.env.VITE_PAYMENT_API_BASE_URL?.replace(/\/$/, '')

async function authorizedRequest(user: User, path: string, init?: RequestInit) {
  if (!apiBaseUrl) throw new Error('A entrega digital ainda não foi configurada neste ambiente.')

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      ...(init?.headers || {}),
    },
  })
  const body = await response.json().catch(() => ({})) as Record<string, unknown>
  if (!response.ok) throw new Error(typeof body.error === 'string' ? body.error : 'Não foi possível concluir a operação.')
  return body
}

export async function uploadDigitalAsset(user: User, productId: string, file: File) {
  const form = new FormData()
  form.set('productId', productId)
  form.set('file', file)
  const body = await authorizedRequest(user, '/admin/digital-assets', { method: 'POST', body: form })
  return {
    fileName: String(body.fileName || file.name),
    size: Number(body.size || file.size),
  }
}

export async function loadLibrary(user: User): Promise<LibraryItem[]> {
  const body = await authorizedRequest(user, '/library')
  return Array.isArray(body.items) ? body.items as LibraryItem[] : []
}

export async function createDigitalDownloadLink(user: User, entitlementId: string) {
  const body = await authorizedRequest(user, '/digital/download-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entitlementId }),
  })
  if (typeof body.url !== 'string') throw new Error('O link de download não foi gerado.')
  return body.url
}
