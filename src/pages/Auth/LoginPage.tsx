import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, Calendar } from 'lucide-react'
import { getErrorCode, getErrorMessage } from '../../lib/errors'
import {
    getGoogleSignInErrorMessage,
    getPasswordResetErrorMessage,
    getPasswordSignInErrorMessage,
    PASSWORD_RESET_SUCCESS_MESSAGE,
} from '../../lib/auth-errors'

export default function LoginPage() {
    const { signInWithGoogle, loginWithEmail, registerWithEmail, resetPassword, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [isRegistering, setIsRegistering] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [cpf, setCpf] = useState('')
    const [birthDate, setBirthDate] = useState('')

    const [showPass, setShowPass] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [isResettingPassword, setIsResettingPassword] = useState(false)

    // Get the redirect path from state, or default to home
    const from = location.state?.from?.pathname || '/'

    const handleGoogleLogin = async () => {
        try {
            setError('')
            setMessage('')
            await signInWithGoogle()
            navigate(from, { replace: true })
        } catch (error: unknown) {
            console.error(error)
            setError(getGoogleSignInErrorMessage(error))
        }
    }

    const handlePasswordReset = async () => {
        const normalizedEmail = email.trim()
        setError('')
        setMessage('')

        if (!normalizedEmail) {
            setError('Digite seu e-mail para recuperar a senha.')
            return
        }

        setIsResettingPassword(true)
        try {
            await resetPassword(normalizedEmail)
            setMessage(PASSWORD_RESET_SUCCESS_MESSAGE)
        } catch (error: unknown) {
            console.error(error)
            setError(getPasswordResetErrorMessage(error))
        } finally {
            setIsResettingPassword(false)
        }
    }

    const validatePassword = (pass: string) => {
        if (pass.length < 8) return "Senha fraca: Mínimo 8 caracteres."
        if (!/[A-Z]/.test(pass)) return "Senha fraca: Faltou letra maiúscula."
        if (!/[0-9]/.test(pass)) return "Senha fraca: Faltou um número."
        return ""
    }

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1')
    }

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(formatCPF(e.target.value))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setMessage('')
        setPasswordError('')

        try {
            if (isRegistering) {
                if (!name.trim()) {
                    setError('Por favor, digite seu nome completo.')
                    return
                }
                if (cpf.length < 14) {
                    setError('CPF inválido')
                    return
                }
                if (!birthDate) {
                    setError('Data de nascimento é obrigatória')
                    return
                }
                const passErr = validatePassword(pass)
                if (passErr) {
                    setPasswordError(passErr)
                    return
                }
                if (pass !== confirmPass) {
                    setPasswordError('As senhas não coincidem.')
                    return
                }
                await registerWithEmail(email, pass, name, cpf, birthDate)
            } else {
                await loginWithEmail(email, pass)
            }
            navigate(from, { replace: true })
        } catch (error: unknown) {
            console.error(error)
            const code = getErrorCode(error)
            // Simple error handling
            if (code === 'auth/email-already-in-use') setError('Este e-mail já está cadastrado.')
            else if (code === 'auth/weak-password') setError('A senha deve ter pelo menos 6 caracteres.')
            else if (!isRegistering) setError(getPasswordSignInErrorMessage(error))
            else setError('Não foi possível criar a conta: ' + getErrorMessage(error, 'tente novamente.'))
        }
    }

    // If already logged in, redirect immediately
    if (user) {
        navigate(from, { replace: true })
        return null
    }

    return (
        <div className="min-h-screen grid place-items-center bg-[#FDFBF7] p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
                <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-slate-100 rounded-full">
                        {isRegistering ? <UserPlus className="h-10 w-10 text-slate-700" /> : <LogIn className="h-10 w-10 text-slate-700" />}
                    </div>
                </div>

                <h1 className="text-3xl font-serif font-bold text-center text-slate-900 mb-2">
                    {isRegistering ? 'Criar Conta' : 'Bem-vindo(a)'}
                </h1>
                <p className="text-slate-600 mb-8 text-center">
                    {isRegistering ? 'Preencha seus dados para continuar.' : 'Faça login para continuar sua compra.'}
                </p>

                {error && (
                    <div role="alert" className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                {message && (
                    <div role="status" className="bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg mb-4 text-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    {isRegistering && (
                        <>
                            <div className="relative animate-in slide-in-from-top-2 fade-in duration-300">
                                <UserPlus className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Nome Completo"
                                    required={isRegistering}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div className="relative animate-in slide-in-from-top-2 fade-in duration-300">
                                <div className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-400 rounded-sm">
                                    <span>ID</span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="CPF (000.000.000-00)"
                                    required={isRegistering}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                                    value={cpf}
                                    onChange={handleCpfChange}
                                    maxLength={14}
                                />
                            </div>
                            <div className="relative animate-in slide-in-from-top-2 fade-in duration-300">
                                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                <input
                                    type="date"
                                    required={isRegistering}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 text-slate-600"
                                    value={birthDate}
                                    onChange={e => setBirthDate(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <input
                            type="email"
                            placeholder="Seu e-mail"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                        <input
                            type={showPass ? "text" : "password"}
                            placeholder="Sua senha"
                            required
                            className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                            value={pass}
                            onChange={e => {
                                setPass(e.target.value)
                                if (isRegistering) {
                                    setPasswordError(validatePassword(e.target.value))
                                    if (confirmPass && e.target.value !== confirmPass) {
                                        // Logic to show generic error if needed or keep strictly invalid
                                    }
                                }
                            }}
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600">
                            {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>

                    {!isRegistering && (
                        <div className="-mt-2 text-right">
                            <button
                                type="button"
                                onClick={handlePasswordReset}
                                disabled={isResettingPassword}
                                className="text-sm font-semibold text-slate-700 hover:text-slate-950 hover:underline disabled:cursor-wait disabled:opacity-60"
                            >
                                {isResettingPassword ? 'Enviando instruções...' : 'Esqueci minha senha'}
                            </button>
                        </div>
                    )}

                    {isRegistering && (
                        <div className="relative animate-in slide-in-from-top-2 fade-in duration-300">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type={showPass ? "text" : "password"}
                                placeholder="Confirme sua senha"
                                required={isRegistering}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:border-slate-900 ${confirmPass && pass !== confirmPass ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                    }`}
                                value={confirmPass}
                                onChange={e => setConfirmPass(e.target.value)}
                            />
                        </div>
                    )}

                    {passwordError && isRegistering && <p className="text-xs text-red-500 ml-1">{passwordError}</p>}
                    {confirmPass && pass !== confirmPass && isRegistering && <p className="text-xs text-red-500 ml-1">As senhas não coincidem.</p>}

                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                        {isRegistering ? 'Cadastrar' : 'Entrar'}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-slate-500">ou</span></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-[#4285F4] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#3367d6] transition-colors shadow-sm hover:shadow-md"
                >
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google"
                        className="w-6 h-6 bg-white rounded-full p-0.5"
                    />
                    Entrar com Google
                </button>

                <p className="mt-8 text-center text-sm text-slate-600">
                    {isRegistering ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="ml-1 text-slate-900 font-bold hover:underline"
                    >
                        {isRegistering ? 'Fazer Login' : 'Criar agora'}
                    </button>
                </p>
            </div>
        </div>
    )
}
