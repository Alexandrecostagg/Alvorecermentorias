export type CepAddress = {
  zipCode: string
  street: string
  neighborhood: string
  city: string
  state: string
}

export type CepLookupErrorCode = 'invalid' | 'not-found' | 'unavailable'

export class CepLookupError extends Error {
  code: CepLookupErrorCode

  constructor(code: CepLookupErrorCode) {
    super(code)
    this.name = 'CepLookupError'
    this.code = code
  }
}

type BrasilApiResponse = {
  cep?: string
  state?: string
  city?: string
  neighborhood?: string
  street?: string
}

type ViaCepResponse = {
  cep?: string
  uf?: string
  localidade?: string
  bairro?: string
  logradouro?: string
  erro?: boolean | string
}

export function sanitizeCep(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8)
}

export function formatCep(value: string): string {
  const digits = sanitizeCep(value)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

function clean(value?: string): string {
  return value?.trim() ?? ''
}

async function lookupWithBrasilApi(cep: string, signal?: AbortSignal): Promise<CepAddress | null> {
  const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (response.status === 404) return null
  if (!response.ok) throw new Error(`BrasilAPI respondeu com HTTP ${response.status}`)

  const data = await response.json() as BrasilApiResponse
  if (!data.city || !data.state) throw new Error('Resposta inválida da BrasilAPI')

  return {
    zipCode: formatCep(data.cep ?? cep),
    street: clean(data.street),
    neighborhood: clean(data.neighborhood),
    city: clean(data.city),
    state: clean(data.state).toUpperCase(),
  }
}

async function lookupWithViaCep(cep: string, signal?: AbortSignal): Promise<CepAddress | null> {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) throw new Error(`ViaCEP respondeu com HTTP ${response.status}`)

  const data = await response.json() as ViaCepResponse
  if (data.erro === true || data.erro === 'true') return null
  if (!data.localidade || !data.uf) throw new Error('Resposta inválida do ViaCEP')

  return {
    zipCode: formatCep(data.cep ?? cep),
    street: clean(data.logradouro),
    neighborhood: clean(data.bairro),
    city: clean(data.localidade),
    state: clean(data.uf).toUpperCase(),
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export async function lookupCep(value: string, signal?: AbortSignal): Promise<CepAddress> {
  const cep = sanitizeCep(value)
  if (cep.length !== 8) throw new CepLookupError('invalid')

  let foundNotFoundResponse = false
  const providers = [lookupWithBrasilApi, lookupWithViaCep]

  for (const provider of providers) {
    try {
      const address = await provider(cep, signal)
      if (address) return address
      foundNotFoundResponse = true
    } catch (error) {
      if (isAbortError(error)) throw error
    }
  }

  throw new CepLookupError(foundNotFoundResponse ? 'not-found' : 'unavailable')
}
