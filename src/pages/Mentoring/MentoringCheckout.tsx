import { useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { ChevronRight, Calendar, Clock, CreditCard, QrCode, ArrowRight, Loader2, Shield, Star } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { TRILHA_LABELS, TRILHA_ICONS, type Mentor } from '../../types/mentoring'
import type { AsaasBillingType } from '../../lib/payments'

const MENTORES_MOCK: Record<string, Mentor> = {
  '1': {
    id: '1',
    name: 'Pr. Alexandre Gosta',
    photo: '/alexandre-gomes-costa.jpg',
    bio: 'Pastor e mentor com mais de 15 anos de experiência.',
    specialty: 'Liderança e Propósito',
    trilhas: ['lideranca', 'espiritual'],
    rating: 4.9,
    reviewCount: 95,
    sessionCount: 120,
    available: true,
    createdAt: '2026-01-15',
  },
  '2': {
    id: '2',
    name: 'Ana Beatriz Santos',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Psicóloga e mentora familiar.',
    specialty: 'Família e Casamento',
    trilhas: ['familia', 'kids'],
    rating: 4.8,
    reviewCount: 78,
    sessionCount: 95,
    available: true,
    createdAt: '2026-02-01',
  },
  '3': {
    id: '3',
    name: 'Carlos Eduardo Lima',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Empresário e consultor financeiro.',
    specialty: 'Finanças e Generosidade',
    trilhas: ['financas', 'lideranca'],
    rating: 4.9,
    reviewCount: 62,
    sessionCount: 80,
    available: true,
    createdAt: '2026-01-20',
  },
  '4': {
    id: '4',
    name: 'Maria Clara Oliveira',
    photo: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Coach certificada e mentora de vida espiritual.',
    specialty: 'Vida Espiritual',
    trilhas: ['espiritual', 'familia'],
    rating: 4.7,
    reviewCount: 54,
    sessionCount: 70,
    available: true,
    createdAt: '2026-03-01',
  },
  '5': {
    id: '5',
    name: 'João Pedro Mendes',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Líder juvenil e mentor de jovens adultos.',
    specialty: 'Propósito e Juventude',
    trilhas: ['lideranca', 'espiritual'],
    rating: 4.8,
    reviewCount: 41,
    sessionCount: 55,
    available: true,
    createdAt: '2026-02-15',
  },
  '6': {
    id: '6',
    name: 'Fernanda Costa',
    photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Especialista em educação cristã infantil.',
    specialty: 'Alvorecer Kids',
    trilhas: ['kids', 'familia'],
    rating: 4.9,
    reviewCount: 38,
    sessionCount: 60,
    available: true,
    createdAt: '2026-03-10',
  },
}

const PRECO_SESSAO = 99

export default function MentoringCheckout() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const dateStr = searchParams.get('date')
  const time = searchParams.get('time')
  const trilha = searchParams.get('trilha')

  const mentor = MENTORES_MOCK[id || '']
  const [paymentMethod, setPaymentMethod] = useState<AsaasBillingType | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!mentor || !dateStr || !time || !trilha) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dados incompletos</h1>
          <p className="text-slate-500 mb-6">Por favor, volte e selecione todos os dados do agendamento.</p>
          <Link to="/mentoria/catalogo" className="text-alvorecer-gold font-semibold hover:underline">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  const date = new Date(dateStr + 'T12:00:00')
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const handleCheckout = async () => {
    if (!user || !paymentMethod) return

    setIsProcessing(true)
    setError(null)

    try {
      const paymentApiBaseUrl = import.meta.env.VITE_PAYMENT_API_BASE_URL?.replace(/\/$/, '')

      if (!paymentApiBaseUrl) {
        throw new Error('O pagamento ainda não foi configurado neste ambiente.')
      }

      const token = await user.getIdToken()

      const response = await fetch(`${paymentApiBaseUrl}/mentoring-checkout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: mentor.id,
          mentorName: mentor.name,
          trilha,
          date: dateStr,
          time,
          billingType: paymentMethod,
          amount: PRECO_SESSAO,
        }),
      })

      const body = await response.json().catch(() => ({})) as { sessionId?: string; checkoutUrl?: string; error?: string }

      if (!response.ok || !body.checkoutUrl) {
        throw new Error(body.error || 'Não foi possível iniciar o pagamento.')
      }

      sessionStorage.setItem('alvorecer:last-mentoring-session', body.sessionId || '')
      window.location.assign(body.checkoutUrl)

    } catch (err) {
      console.error('Erro ao processar pagamento da mentoria:', err)
      setError(err instanceof Error ? err.message : 'Houve um erro ao iniciar o pagamento. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-4xl mb-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/mentoria" className="hover:text-alvorecer-gold transition-colors">Mentoria</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/mentoria/catalogo" className="hover:text-alvorecer-gold transition-colors">Catálogo</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/mentoria/mentor/${mentor.id}`} className="hover:text-alvorecer-gold transition-colors">{mentor.name}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 font-medium">Pagamento</span>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Finalizar Agendamento</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main - Payment */}
          <div className="md:col-span-2 space-y-6">
            {/* Session Summary */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Resumo da Sessão</h2>
              <div className="flex items-center gap-4">
                <img
                  src={mentor.photo}
                  alt={mentor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-alvorecer-gold"
                />
                <div>
                  <h3 className="font-bold text-slate-900">{mentor.name}</h3>
                  <p className="text-sm text-alvorecer-gold">{mentor.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-alvorecer-gold fill-current" />
                    <span className="text-xs text-slate-500">{mentor.rating}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{TRILHA_ICONS[trilha as keyof typeof TRILHA_ICONS]}</span>
                  <div>
                    <div className="text-xs text-slate-400">Trilha</div>
                    <div className="font-medium text-slate-700">{TRILHA_LABELS[trilha as keyof typeof TRILHA_LABELS]}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-400">Data</div>
                    <div className="font-medium text-slate-700 capitalize">{formattedDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-400">Horário</div>
                    <div className="font-medium text-slate-700">{time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <div>
                    <div className="text-xs text-slate-400">Duração</div>
                    <div className="font-medium text-slate-700">50 minutos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Forma de Pagamento</h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    paymentMethod === 'PIX'
                      ? 'border-alvorecer-gold bg-alvorecer-gold/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <QrCode className={`h-8 w-8 mx-auto mb-2 ${paymentMethod === 'PIX' ? 'text-alvorecer-gold' : 'text-slate-400'}`} />
                  <span className="font-semibold text-slate-900 text-sm">PIX</span>
                  <p className="text-xs text-slate-500 mt-1">Aprovação instantânea</p>
                </button>

                <button
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'border-alvorecer-gold bg-alvorecer-gold/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className={`h-8 w-8 mx-auto mb-2 ${paymentMethod === 'CREDIT_CARD' ? 'text-alvorecer-gold' : 'text-slate-400'}`} />
                  <span className="font-semibold text-slate-900 text-sm">Cartão</span>
                  <p className="text-xs text-slate-500 mt-1">Crédito ou débito</p>
                </button>
              </div>
            </div>

            {!user && (
              <div className="card p-6 border-amber-200 bg-amber-50">
                <p className="text-amber-800 text-sm">
                  <strong>Faça login</strong> para continuar com o pagamento. Você precisa ter uma conta na Alvorecer.
                </p>
                <Link
                  to="/login"
                  className="mt-3 inline-flex items-center gap-2 text-amber-900 font-semibold text-sm hover:underline"
                >
                  Entrar na conta <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {error && (
              <div className="card p-4 border-red-200 bg-red-50">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Summary */}
          <div className="md:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Resumo do Pedido</h3>

              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Sessão individual (50 min)</span>
                  <span>R$ {PRECO_SESSAO.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxa de plataforma</span>
                  <span>R$ 0,00</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg text-slate-900">
                  <span>Total</span>
                  <span>R$ {PRECO_SESSAO.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!paymentMethod || !user || isProcessing}
                className="w-full bg-alvorecer-gold text-slate-900 py-4 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Processando...
                  </>
                ) : (
                  <>
                    Confirmar e Pagar <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 justify-center">
                <Shield className="h-3 w-3" />
                <span>Pagamento seguro via Asaas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
