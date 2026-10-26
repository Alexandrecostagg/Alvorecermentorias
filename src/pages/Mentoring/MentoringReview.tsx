import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, Star, MessageSquare, CheckCircle2, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { getMentorById, submitMentoringReview } from '../../services/mentoring'
import { TRILHA_LABELS, TRILHA_ICONS, type Mentor, type MentoringSession } from '../../types/mentoring'

const RATING_LABELS: Record<number, string> = {
  1: 'Insatisfatório',
  2: 'Regular',
  3: 'Bom',
  4: 'Muito Bom',
  5: 'Excelente',
}

export default function MentoringReviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const { user } = useAuth()

  const [session, setSession] = useState<MentoringSession | null>(null)
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)

  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      if (!sessionId) return
      try {
        setLoading(true)
        const snap = await getDoc(doc(db, 'mentoringSessions', sessionId))
        if (snap.exists()) {
          const sessData = { id: snap.id, ...snap.data() } as MentoringSession
          setSession(sessData)
          if (sessData.mentorId) {
            const mData = await getMentorById(sessData.mentorId)
            setMentor(mData)
          }
        }
      } catch (err) {
        console.error('Erro ao carregar sessão para avaliação:', err)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-8 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        <p className="text-sm font-medium">Carregando detalhes da sessão...</p>
      </div>
    )
  }

  if (!session || !mentor) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Sessão não encontrada</h1>
          <p className="text-slate-500 mb-6 text-sm">
            A sessão que você procura não foi encontrada ou não pertence a esta conta.
          </p>
          <Link
            to="/mentoria/dashboard"
            className="inline-block bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl hover:bg-amber-400 transition-all text-sm"
          >
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (session.status !== 'completed') {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Avaliação indisponível</h1>
          <p className="text-slate-500 mb-6 text-sm">A avaliação ficará disponível após a conclusão da sessão.</p>
          <Link to="/mentoria/dashboard" className="inline-block bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const date = new Date(session.date + 'T12:00:00')
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const handleSubmit = async () => {
    if (!user || rating === 0) return

    setIsSubmitting(true)
    setError(null)

    try {
      await submitMentoringReview({
        sessionId: session.id,
        mentorId: mentor.id,
        menteeId: user.uid,
        menteeName: user.displayName || 'Mentorado(a)',
        rating,
        comment: comment.trim(),
      })

      setSubmitted(true)
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err)
      setError('Não foi possível salvar a sua avaliação. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Avaliação Enviada!</h1>
          <p className="text-slate-500 mb-6 text-sm">
            Obrigado pelo seu feedback sobre a sessão com {mentor.name}. Sua opinião ajuda a manter a excelência ministerial de nossos mentores.
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/mentoria/dashboard"
              className="bg-amber-500 text-slate-950 px-6 py-2.5 rounded-xl font-bold hover:bg-amber-400 transition-all text-sm"
            >
              Voltar ao Meu Painel
            </Link>
            <Link
              to="/mentoria/catalogo"
              className="border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-all text-sm"
            >
              Explorar Outros Mentores
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-2xl mb-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link to="/mentoria" className="hover:text-amber-600 transition-colors">
            Mentoria
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/mentoria/dashboard" className="hover:text-amber-600 transition-colors">
            Meu Painel
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 font-medium">Avaliar Sessão</span>
        </nav>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Como foi seu encontro?</h1>
        <p className="text-slate-500 mb-6 text-sm">
          Sua avaliação ajuda a aprimorar o acompanhamento pastoral e ministerial.
        </p>

        {/* Session Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={mentor.photo || '/alexandre-gomes-costa.jpg'}
              alt={mentor.name}
              className="w-14 h-14 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-base">{mentor.name}</h3>
              <p className="text-amber-700 text-xs font-semibold">{mentor.specialty}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 capitalize">
                <span>{formattedDate}</span>
                <span>•</span>
                <span>{session.duration || 50} minutos</span>
                {session.trilha && (
                  <>
                    <span>•</span>
                    <span>
                      {TRILHA_ICONS[session.trilha]} {TRILHA_LABELS[session.trilha]}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <label className="block text-sm font-bold text-slate-900 mb-3">
              Nota geral do encontro
            </label>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-500 fill-current'
                        : 'text-slate-200'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-semibold text-amber-700">
              {RATING_LABELS[hoverRating || rating] || 'Selecione sua nota'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-600" />
              Depoimento / Comentários (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Compartilhe como essa mentoria impactou sua jornada cristã..."
              className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none text-slate-800"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="w-full bg-amber-500 text-slate-950 py-3.5 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Enviando avaliação...
              </>
            ) : (
              <>
                Confirmar Avaliação <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
