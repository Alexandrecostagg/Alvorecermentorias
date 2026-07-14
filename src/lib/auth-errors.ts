import { getErrorCode } from './errors'

export const PASSWORD_RESET_SUCCESS_MESSAGE =
  'Se existir uma conta com esse e-mail, você receberá as instruções para criar uma nova senha.'

export function getGoogleSignInErrorMessage(error: unknown): string {
  switch (getErrorCode(error)) {
    case 'auth/operation-not-allowed':
      return 'Login com Google não está ativado no Firebase.'
    case 'auth/unauthorized-domain':
      return 'Este endereço do site ainda não está autorizado para login com Google.'
    case 'auth/popup-blocked':
      return 'O navegador bloqueou a janela do Google. Permita pop-ups e tente novamente.'
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'O login com Google foi cancelado.'
    case 'auth/network-request-failed':
      return 'Não foi possível conectar ao Google. Verifique sua internet e tente novamente.'
    default:
      return 'Não foi possível entrar com Google. Tente novamente.'
  }
}

export function getPasswordSignInErrorMessage(error: unknown): string {
  switch (getErrorCode(error)) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
      return 'E-mail ou senha inválidos.'
    case 'auth/user-disabled':
      return 'Esta conta está desativada. Entre em contato com o suporte.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.'
    case 'auth/network-request-failed':
      return 'Falha de conexão. Verifique sua internet e tente novamente.'
    default:
      return 'Não foi possível entrar. Tente novamente.'
  }
}

export function getPasswordResetErrorMessage(error: unknown): string {
  switch (getErrorCode(error)) {
    case 'auth/invalid-email':
      return 'Digite um endereço de e-mail válido.'
    case 'auth/too-many-requests':
      return 'Muitas solicitações. Aguarde alguns minutos antes de tentar novamente.'
    case 'auth/network-request-failed':
      return 'Falha de conexão. Verifique sua internet e tente novamente.'
    default:
      return 'Não foi possível enviar o e-mail de recuperação. Tente novamente.'
  }
}
