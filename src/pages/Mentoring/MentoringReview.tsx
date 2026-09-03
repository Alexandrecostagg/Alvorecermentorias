import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronRight, Star, MessageSquare, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'
import { TRILHA_LABELS, TRILHA_ICONS, type MentoringReview, type MentoringTrilha } from '../../types/mentoring'

interface MentorData {
  id: string
  name: string
  photo: string
  specialty: string
}

const MENTORES_MOCK: Record<string, MentorData> = {
  '1': { id: '1', name: 'Pr. Alexandre Gosta', photo: '/alexandre-gomes-costa.jpg', specialty: 'Liderança e Propósito' },
  '2': { id: '2', name: 'Ana Beatriz Santos', photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', specialty: 'Família e Casamento' },
  '3': { id: '3', name: 'Carlos Eduardo Lima', photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', specialty: 'Finanças e Generosidade' },
}

const MOCK_SESSIONS = [
  {
    id: '3',
    mentorId: '1',
    trilha: 'lideranca',
    date: '2026-08-25',
    duration: 50,
    status: 'completed' as const,
    notes: 'Conversamos sobre dons espirituais e liderança na igreja.',
  },
  {
    id: '4',
    mentorId: '3',
    trilha: 'financas',
    date: '2026-08-20',
    duration: 50,
    status: 'completed' as const,
    notes: 'Estudamos o princípio bíblico de dízimo e ofertas.',
  },
]

const RATING_LABELS: Record<number, string> = {
  1: 'Insatisfatório',
  2: 'Regular',
  3: 'Bom',
  4: 'Muito Bom',
  5: 'Excelente',
}

export default function MentoringReviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const navigate = useNavigate()

  const session = MOCK_SESSIONS.find(s => s.id === sessionId)
  const mentor = session ? MENTORES_MOCK[session.mentorId] : null

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!session || !mentor) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Sessão não encontrada</h1>
          <p className="text-slate-500 mb-6">A sessão que você procura não existe ou já foi avaliada.</p>
          <Link to="/mentoria/dashboard" className="text-alvorecer-gold font-semibold hover:underline">
            Voltar ao dashboard
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
    if (rating === 0) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const review: MentoringReview = {
        id: `review-${Date.now()}`,
        sessionId: session.id,
        mentorId: session.mentorId,
        menteeId: 'user-1',
        menteeName: 'Usuário',
        rating,
        comment,
        createdAt: new Date().toISOString(),
      }

      console.log('Review submitted:', review)
      setSubmitted(true)
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center">
        <div className="max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Avaliação Enviada!</h1>
          <p className="text-slate-500 mb-6">
            Obrigado por avaliar sua sessão com {mentor.name}. Sua opinião ajuda a melhorar a experiência de todos os mentorados.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/mentoria/dashboard"
              className="bg-alvorecer-gold text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all"
            >
              Voltar ao Dashboard
            </Link>
            <Link
              to="/mentoria/catalogo"
              className="border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all"
            >
              Agendar Outra Sessão
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
          <Link to="/mentoria" className="hover:text-alvorecer-gold transition-colors">Mentoria</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/mentoria/dashboard" className="hover:text-alvorecer-gold transition-colors">Dashboard</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 font-medium">Avaliar Sessão</span>
        </nav>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Avalie sua sessão</h1>
        <p className="text-slate-500 mb-8">Sua avaliação ajuda outros mentorados a escolherem o mentor certo.</p>

        {/* Session Info */}
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={mentor.photo}
              alt={mentor.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-alvorecer-gold"
            />
            <div>
              <h2 className="font-bold text-slate-900">{mentor.name}</h2>
              <p className="text-sm text-alvorecer-gold">{mentor.specialty}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <span>{TRILHA_ICONS[session.trilha as MentoringTrilha]} {TRILHA_LABELS[session.trilha as MentoringTrilha]}</span>
                <span>•</span>
                <span className="capitalize">{formattedDate}</span>
              </div>
            </div>
          </div>
          {session.notes && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Notas da sessão:</span> {session.notes}
              </p>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-alvorecer-gold" />
            Como foi a sessão?
          </h2>

          <div className="flex flex-col items-center py-4">
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'text-alvorecer-gold fill-current'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-700">
              {rating > 0 ? RATING_LABELS[rating] : 'Clique nas estrelas para avaliar'}
            </p>
          </div>
        </div>

        {/* Comment */}
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-alvorecer-gold" />
            Deixe um comentário (opcional)
          </h2>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte como foi sua experiência. Isso ajuda outros mentorados e o mentor a melhorar..."
            rows={4}
            className="w-full border border-slate-200 rounded-xl p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-alvorecer-gold/50 focus:border-alvorecer-gold resize-none"
          />

          <p className="text-xs text-slate-400 mt-2">
            {comment.length}/500 caracteres
          </p>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/mentoria/dashboard')}
            className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all"
          >
            Pular por enquanto
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="flex-1 bg-alvorecer-gold text-slate-900 py-3 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Enviando...
              </>
            ) : (
              <>
                Enviar Avaliação <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
