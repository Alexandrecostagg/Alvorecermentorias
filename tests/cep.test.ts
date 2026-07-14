import { afterEach, describe, expect, it, vi } from 'vitest'
import { CepLookupError, formatCep, lookupCep, sanitizeCep } from '../src/lib/cep'

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('consulta de CEP', () => {
  it('remove caracteres extras e formata o CEP', () => {
    expect(sanitizeCep('75.195-000')).toBe('75195000')
    expect(formatCep('75195000')).toBe('75195-000')
  })

  it('preenche o endereço usando a BrasilAPI', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({
      cep: '01001000',
      street: 'Praça da Sé',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP',
    })))

    await expect(lookupCep('01001-000')).resolves.toEqual({
      zipCode: '01001-000',
      street: 'Praça da Sé',
      neighborhood: 'Sé',
      city: 'São Paulo',
      state: 'SP',
    })
  })

  it('usa o ViaCEP quando a primeira fonte não encontra o CEP', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({}, 404))
      .mockResolvedValueOnce(jsonResponse({
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        bairro: 'Sé',
        localidade: 'São Paulo',
        uf: 'SP',
      }))
    vi.stubGlobal('fetch', fetchMock)

    const address = await lookupCep('01001000')

    expect(address.city).toBe('São Paulo')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('informa quando nenhuma fonte encontra o CEP', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(jsonResponse({}, 404))
      .mockResolvedValueOnce(jsonResponse({ erro: true })))

    await expect(lookupCep('99999999')).rejects.toMatchObject<CepLookupError>({
      code: 'not-found',
    })
  })
})
