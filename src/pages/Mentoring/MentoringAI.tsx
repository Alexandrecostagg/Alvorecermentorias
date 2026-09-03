import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Sparkles, Star, ArrowRight, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'
import { TRILHA_LABELS, TRILHA_ICONS, type MatchingResult, type MentoringTrilha, MATCHING_QUESTIONS } from '../../types/mentoring'

interface MentorData {
  id: string
  name: string
  photo: string
  specialty: string
  trilhas: MentoringTrilha[]
  rating: number
  bio: string
  matchScore?: number
  matchReasons?: string[]
}

const MENTORES_MOCK: MentorData[] = [
  {
    id: '1',
    name: 'Pr. Alexandre Gosta',
    photo: '/alexandre-gomes-costa.jpg',
    specialty: 'Liderança e Propósito',
    trilhas: ['lideranca', 'espiritual'],
    rating: 4.9,
    bio: 'Pastor e mentor com mais de 15 anos de experiência em liderança cristã.',
  },
  {
    id: '2',
    name: 'Ana Beatriz Santos',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    specialty: 'Família e Casamento',
    trilhas: ['familia', 'kids'],
    rating: 4.8,
    bio: 'Psicóloga e mentora familiar, especialista em relacionamentos.',
  },
  {
    id: '3',
    name: 'Carlos Eduardo Lima',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    specialty: 'Finanças e Generosidade',
    trilhas: ['financas', 'lideranca'],
    rating: 4.9,
    bio: 'Empresário e consultor financeiro, mestre em administração.',
  },
  {
    id: '4',
    name: 'Maria Clara Oliveira',
    photo: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    specialty: 'Vida Espiritual',
    trilhas: ['espiritual', 'familia'],
    rating: 4.7,
    bio: 'Coach certificada e mentora de vida espiritual há 10 anos.',
  },
  {
    id: '5',
    name: 'João Pedro Mendes',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    specialty: 'Propósito e Juventude',
    trilhas: ['lideranca', 'espiritual'],
    rating: 4.8,
    bio: 'Líder juvenil e mentor de jovens adultos há 8 anos.',
  },
  {
    id: '6',
    name: 'Fernanda Costa',
    photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    specialty: 'Alvorecer Kids',
    trilhas: ['kids', 'familia'],
    rating: 4.9,
    bio: 'Especialista em educação cristã infantil há 12 anos.',
  },
]

function generateMatchingResults(answers: string[]): MatchingResult[] {
  const scores: MatchingResult[] = MENTORES_MOCK.map(mentor => {
    let score = 60
    const reasons: string[] = []

    if (answers.includes('Fortalecer minha vida espiritual') && mentor.trilhas.includes('espiritual')) {
      score += 15
      reasons.push('Especialista em Vida Espiritual')
    }
    if (answers.includes('Melhorar meu relacionamento familiar') && mentor.trilhas.includes('familia')) {
      score += 15
      reasons.push('Experiência em Família e Casamento')
    }
    if (answers.includes('Desenvolver habilidades de liderança') && mentor.trilhas.includes('lideranca')) {
      score += 15
      reasons.push('Mentor de Liderança')
    }
    if (answers.includes('Organizar minhas finanças segundo a Bíblia') && mentor.trilhas.includes('financas')) {
      score += 15
      reasons.push('Especialista em Finanças Bíblicas')
    }
    if (answers.includes('Ajudar meus filhos na fé') && mentor.trilhas.includes('kids')) {
      score += 15
      reasons.push('Experiência com Alvorecer Kids')
    }

    if (mentor.rating >= 4.8) {
      score += 5
      reasons.push('Alta avaliação dos mentorados')
    }

    if (reasons.length === 0) {
      reasons.push('Perfil versátil e adaptável')
    }

    return { mentorId: mentor.id, score: Math.min(score, 100), reasons }
  })

  return scores.sort((a, b) => b.score - a.score)
}

export default function MentoringAI() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<MatchingResult[] | null>(null)
  const [selectedMentor, setSelectedMentor] = useState<MentorData | null>(null)

  const currentQuestion = MATCHING_QUESTIONS[step]
  const isLastStep = step === MATCHING_QUESTIONS.length - 1

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[step] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (!answers[step]) return

    if (isLastStep) {
      analyzeAnswers()
    } else {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const analyzeAnswers = async () => {
    setIsAnalyzing(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    const matchingResults = generateMatchingResults(answers)
    setResults(matchingResults)
    setIsAnalyzing(false)
  }

  const handleRestart = () => {
    setStep(0)
    setAnswers([])
    setResults(null)
    setSelectedMentor(null)
  }

  if (results) {
    const topMentors = results.slice(0, 3).map(result => {
      const mentor = MENTORES_MOCK.find(m => m.id === result.mentorId)
      return { ...mentor!, matchScore: result.score, matchReasons: result.reasons }
    })

    return (
      <div className="bg-slate-50 min-h-screen py-12 px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-alvorecer-gold to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Seus Mentores Ideais</h1>
            <p className="text-slate-500">Baseado nas suas respostas, recomendamos estes mentores para você</p>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {topMentors.map((mentor, index) => (
              <div
                key={mentor.id}
                className={`card p-6 transition-all hover:shadow-lg ${
                  selectedMentor?.id === mentor.id ? 'ring-2 ring-alvorecer-gold' : ''
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-alvorecer-gold text-slate-900 rounded-full flex items-center justify-center font-bold text-sm z-10">
                      {index + 1}
                    </div>
                    <img
                      src={mentor.photo}
                      alt={mentor.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-bold text-slate-900">{mentor.name}</h2>
                      <div className="flex items-center gap-1 bg-alvorecer-gold/10 px-2 py-0.5 rounded-full">
                        <Sparkles className="h-3 w-3 text-alvorecer-gold" />
                        <span className="text-xs font-bold text-alvorecer-gold">{mentor.matchScore}% match</span>
                      </div>
                    </div>

                    <p className="text-sm text-alvorecer-gold mb-2">{mentor.specialty}</p>
                    <p className="text-sm text-slate-500 mb-3">{mentor.bio}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-4 w-4 text-alvorecer-gold fill-current" />
                      <span className="text-sm text-slate-600">{mentor.rating} avaliação</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.trilhas.map(trilha => (
                        <span key={trilha} className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                          {TRILHA_ICONS[trilha]} {TRILHA_LABELS[trilha]}
                        </span>
                      ))}
                    </div>

                    <div className="bg-alvorecer-gold/5 rounded-xl p-3 mb-4">
                      <p className="text-xs font-medium text-alvorecer-gold mb-1">Por que este mentor?</p>
                      <ul className="space-y-1">
                        {mentor.matchReasons.map((reason, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={`/mentoria/mentor/${mentor.id}`}
                        className="flex-1 bg-alvorecer-gold text-slate-900 py-2 px-4 rounded-xl font-semibold text-sm hover:bg-alvorecer-gold/90 transition-all text-center"
                      >
                        Ver Perfil
                      </Link>
                      <Link
                        to={`/mentoria/agendar/${mentor.id}`}
                        className="flex-1 border border-slate-200 text-slate-700 py-2 px-4 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all text-center"
                      >
                        Agendar Sessão
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 text-center">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 text-alvorecer-gold font-semibold hover:underline"
            >
              <RefreshCw className="h-4 w-4" />
              Refazer matching
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-alvorecer-gold to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Analisando seu perfil...</h2>
          <p className="text-slate-500 mb-6">Estamos encontrando os mentores ideais para você</p>
          <div className="flex items-center justify-center gap-2 text-alvorecer-gold">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Processando respostas</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/mentoria" className="hover:text-alvorecer-gold transition-colors">Mentoria</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 font-medium">Matching com IA</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-alvorecer-gold to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Encontre seu Mentor Ideal</h1>
          <p className="text-slate-500">Responda algumas perguntas e nossa IA encontrará os melhores mentores para você</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Pergunta {step + 1} de {MATCHING_QUESTIONS.length}</span>
            <span className="text-sm font-medium text-alvorecer-gold">{Math.round(((step + 1) / MATCHING_QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="h-2 bg-gradient-to-r from-alvorecer-gold to-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / MATCHING_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="card p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map(option => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  answers[step] === option
                    ? 'border-alvorecer-gold bg-alvorecer-gold/5'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    answers[step] === option
                      ? 'border-alvorecer-gold bg-alvorecer-gold'
                      : 'border-slate-300'
                  }`}>
                    {answers[step] === option && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-slate-700">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" /> Voltar
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!answers[step]}
            className="flex-1 bg-alvorecer-gold text-slate-900 py-3 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastStep ? (
              <>
                Encontrar Mentores <Sparkles className="h-5 w-5" />
              </>
            ) : (
              <>
                Próxima <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
