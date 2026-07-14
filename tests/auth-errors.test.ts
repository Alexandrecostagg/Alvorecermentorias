import { describe, expect, it } from 'vitest'
import {
  getGoogleSignInErrorMessage,
  getPasswordResetErrorMessage,
  getPasswordSignInErrorMessage,
} from '../src/lib/auth-errors'

describe('mensagens de autenticação', () => {
  it('explica quando o domínio não está autorizado para Google', () => {
    expect(getGoogleSignInErrorMessage({ code: 'auth/unauthorized-domain' }))
      .toContain('não está autorizado')
  })

  it('não revela se o e-mail ou a senha estão incorretos', () => {
    expect(getPasswordSignInErrorMessage({ code: 'auth/user-not-found' }))
      .toBe('E-mail ou senha inválidos.')
    expect(getPasswordSignInErrorMessage({ code: 'auth/wrong-password' }))
      .toBe('E-mail ou senha inválidos.')
  })

  it('traduz erros de recuperação sem expor a existência da conta', () => {
    expect(getPasswordResetErrorMessage({ code: 'auth/too-many-requests' }))
      .toContain('Muitas solicitações')
  })
})
