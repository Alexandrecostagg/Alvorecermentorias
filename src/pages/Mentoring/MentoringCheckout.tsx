import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import {
  ChevronRight,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  CreditCard,
  QrCode,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { TRILHA_LABELS, type Mentor, type MentoringProgram } from '../../types/mentoring'
import { getMentorById, getProgramById } from '../../services/mentoring'
import type { AsaasBillingType } from '../../lib/payments'

export default function MentoringCheckout() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const dateStr = searchParams.get('date')
  const time = searchParams.get('time')
  const trilha = searchParams.get('trilha')
  const programId = searchParams.get('programId')

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [program, setProgram] = useState<MentoringProgram | null>(null)
  const [loading, setLoading] = useState(true)

  const [paymentMethod, setPaymentMethod] = useState<AsaasBillingType | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      if (!id) return
      try {
        setLoading(true)
        const [mentorData, progData] = await Promise.all([
          getMentorById(id),
          programId ? getProgramById(programId) : Promise.resolve(null),
        ])
        setMentor(mentorData)
        setProgram(progData)
      } catch (err) {
        console.error('Erro ao carregar dados do checkout:', err)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [id, programId])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-8 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        <p className="text-sm font-medium">Carregando detalhes do pagamento...</p>
      </div>
    )
  }

  if (!mentor || !dateStr || !time) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Dados incompletos</h1>
          <p className="text-slate-500 mb-6 text-sm">
            Por favor, selecione uma data e horário válidos para a sua mentoria.
          </p>
          <Link
            to="/mentoria/catalogo"
            className="inline-block bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl hover:bg-amber-400 transition-all text-sm"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  if (programId && (!program || program.mentorId !== mentor.id || program.status !== 'published')) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Programa indisponível</h1>
          <p className="text-slate-500 mb-6 text-sm">Selecione novamente um programa disponível para este mentor.</p>
          <Link to="/mentoria/catalogo" className="inline-block bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm">
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

  const valorTotal = program?.price ?? 99.0

  const handleCheckout = async () => {
    if (!user || !paymentMethod) return

    setIsProcessing(true)
    setError(null)

    try {
      const paymentApiBaseUrl = import.meta.env.VITE_PAYMENT_API_BASE_URL?.replace(/\/$/, '')

      if (!paymentApiBaseUrl) {
        throw new Error('O gateway de pagamentos ainda não foi configurado neste ambiente.')
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
          programId: program?.id,
          trilha: trilha || 'lideranca',
          date: dateStr,
          time,
          billingType: paymentMethod,
        }),
      })

      const body = (await response.json().catch(() => ({}))) as {
        sessionId?: string
        checkoutUrl?: string
        error?: string
      }

      if (!response.ok || !body.checkoutUrl) {
        throw new Error(body.error || 'Não foi possível iniciar o pagamento com a Asaas.')
      }

      sessionStorage.setItem('alvorecer:last-mentoring-session', body.sessionId || '')
      window.location.assign(body.checkoutUrl)
    } catch (err) {
      console.error('Erro ao processar pagamento da mentoria:', err)
      setError(
        err instanceof Error ? err.message : 'Houve um erro ao iniciar o pagamento. Tente novamente.',
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-4xl mb-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/mentoria" className="hover:text-amber-600 transition-colors">
            Mentoria
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/mentoria/catalogo" className="hover:text-amber-600 transition-colors">
            Catálogo
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/mentoria/mentor/${mentor.id}`} className="hover:text-amber-600 transition-colors">
            {mentor.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 font-medium">Checkout</span>
        </nav>
      </div>

      <div className="mx-auto max-w-4xl grid md:grid-cols-5 gap-8">
        {/* Main Details (Col 3) */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Confirmar Agendamento</h1>

            {/* Mentor Info */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
              <img
                src={mentor.photo || '/alexandre-gomes-costa.jpg'}
                alt={mentor.name}
                className="w-14 h-14 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h3 className="font-bold text-slate-900">{mentor.name}</h3>
                <p className="text-amber-700 text-sm">{mentor.specialty}</p>
                {trilha && (
                  <span className="text-xs bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                    {TRILHA_LABELS[trilha as keyof typeof TRILHA_LABELS]}
                  </span>
                )}
              </div>
            </div>

            {/* Program or Single Session */}
            {program && (
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/60 mb-6">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                  Programa Selecionado
                </span>
                <h4 className="font-bold text-slate-900 text-base mt-1">{program.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{program.duration} • Encontros regulares</p>
              </div>
            )}

            {/* Session Time & Date */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 mb-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Data do 1º Encontro</div>
                  <div className="font-semibold text-slate-900 text-sm capitalize">{formattedDate}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-500 font-medium">Horário</div>
                  <div className="font-semibold text-slate-900 text-sm">{time} (50 min)</div>
                </div>
              </div>
            </div>

            {/* Mentee Data */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-amber-600" />
                Seus Dados
              </h3>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">
                <p className="font-medium text-slate-900">{user?.displayName || 'Mentorado(a)'}</p>
                <p className="text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">Forma de Pagamento</h3>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('PIX')}
                className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  paymentMethod === 'PIX'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">PIX</div>
                  <div className="text-xs text-slate-500">Aprovação imediata</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT_CARD')}
                className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Cartão de Crédito</div>
                  <div className="text-xs text-slate-500">À vista ou parcelado</div>
                </div>
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2 mb-4">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={!paymentMethod || isProcessing}
              className="w-full bg-amber-500 text-slate-950 py-3.5 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Processando agendamento...
                </>
              ) : (
                <>
                  Ir para Checkout Seguro Asaas <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Ambiente seguro intermediado pela Asaas</span>
            </div>
          </div>
        </div>

        {/* Sidebar Summary (Col 2) */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4">Resumo dos Valores</h3>

            <div className="space-y-3 text-sm pb-4 border-b border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>{program ? program.title : 'Sessão Individual (50 min)'}</span>
                <span className="font-medium text-slate-900">R$ {valorTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxa de Agendamento</span>
                <span className="text-emerald-600 font-medium">Grátis</span>
              </div>
            </div>

            <div className="pt-4 mb-6">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900 text-base">Total</span>
                <span className="font-extrabold text-2xl text-slate-900">
                  R$ {valorTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/50 text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-900">Como funciona após o pagamento?</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Sua vaga é reservada imediatamente.</li>
                <li>O link do Google Meet é liberado no seu painel.</li>
                <li>Você receberá lembretes por e-mail antes da sessão.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
