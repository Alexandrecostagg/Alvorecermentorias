import { useParams, Link } from 'react-router-dom'
import { Star, Clock, ChevronRight, Calendar, BookOpen, CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react'
import { TRILHA_LABELS, TRILHA_ICONS, type Mentor, type MentoringReview } from '../../types/mentoring'

const MENTORES_MOCK: Record<string, Mentor> = {
  '1': {
    id: '1',
    name: 'Pr. Alexandre Gosta',
    photo: '/alexandre-gomes-costa.jpg',
    bio: 'Pastor e mentor com mais de 15 anos de experiência em liderança ministerial e desenvolvimento de pessoas. Especialista em propósito de vida e liderança cristã. Já acompanhou mais de 120 pessoas em processos de mentoria individual e grupo.',
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
    bio: 'Psicóloga e mentora familiar. Auxilia casais e famílias a fortalecerem vínculos com base em princípios bíblicos de amor e comunicação. Mais de 95 sessões realizadas com casais em diferentes estágios do relacionamento.',
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
    bio: 'Empresário e consultor financeiro. Transforma a relação das pessoas com o dinheiro através de princípios bíblicos de administração e generosidade. Especialista em planejamento financeiro familiar e eliminação de dívidas.',
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
    bio: 'Coach certificada e mentora de vida espiritual. Acompanha pessoas em processos de crescimento pessoal e espiritual com profundidade e acolhimento. Foco em formação de hábitos devocionais e vida de oração.',
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
    bio: 'Líder juvenil e mentor de jovens adultos. Especialista em ajudar jovens a encontrarem propósito e direção para a vida. Metodologia prática que combina teologia, autoconhecimento e ação.',
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
    bio: 'Especialista em educação cristã infantil. Desenvolve metodologias para ensinar fé de forma prática e envolvente para crianças. Autora de materiais devocionais para famílias com filhos pequenos.',
    specialty: 'Alvorecer Kids',
    trilhas: ['kids', 'familia'],
    rating: 4.9,
    reviewCount: 38,
    sessionCount: 60,
    available: true,
    createdAt: '2026-03-10',
  },
}

const REVIEWS_MOCK: MentoringReview[] = [
  {
    id: '1',
    sessionId: 's1',
    mentorId: '1',
    menteeId: 'u1',
    menteeName: 'Marcos S.',
    rating: 5,
    comment: 'O Pr. Alexandre tem uma capacidade incrível de conectar a Palavra com a vida prática. Em poucas sessões, minha visão de liderança mudou completamente.',
    createdAt: '2026-08-15',
  },
  {
    id: '2',
    sessionId: 's2',
    mentorId: '1',
    menteeId: 'u2',
    menteeName: 'Pedro H.',
    rating: 5,
    comment: 'Excelente mentor. Muito atencioso, pontual e com conteúdo de qualidade. Recomendo para quem busca crescimento espiritual e profissional.',
    createdAt: '2026-08-10',
  },
  {
    id: '3',
    sessionId: 's3',
    mentorId: '1',
    menteeId: 'u3',
    menteeName: 'Ana L.',
    rating: 4,
    comment: 'Muito boa a experiência. O mentor é preparado e dedicado. Só não dou 5 estrelas porque queria mais材料 de apoio entre as sessões.',
    createdAt: '2026-07-28',
  },
]

const HORARIOS_DISPONIVEIS = [
  'Segunda 19:00',
  'Terça 14:00',
  'Quarta 19:00',
  'Quinta 10:00',
  'Sexta 14:00',
  'Sábado 09:00',
]

export default function MentorProfile() {
  const { id } = useParams<{ id: string }>()
  const mentor = MENTORES_MOCK[id || '']
  const reviews = REVIEWS_MOCK.filter((r) => r.mentorId === id)

  if (!mentor) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mentor não encontrado</h1>
          <p className="text-slate-500 mb-6">O mentor que você procura não existe ou não está disponível.</p>
          <Link to="/mentoria/catalogo" className="text-alvorecer-gold font-semibold hover:underline">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/mentoria" className="hover:text-alvorecer-gold transition-colors">Mentoria</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/mentoria/catalogo" className="hover:text-alvorecer-gold transition-colors">Catálogo</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 font-medium">{mentor.name}</span>
          </nav>
        </div>
      </div>

      {/* Profile Header */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Photo & Quick Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="card overflow-hidden">
                  <img
                    src={mentor.photo}
                    alt={mentor.name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(mentor.rating) ? 'text-alvorecer-gold fill-current' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-500">{mentor.rating} ({mentor.reviewCount})</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.trilhas.map((t) => (
                        <span key={t} className="px-2 py-1 bg-alvorecer-gold/10 text-alvorecer-gold text-xs font-medium rounded-lg">
                          {TRILHA_ICONS[t]} {TRILHA_LABELS[t]}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="text-2xl font-bold text-slate-900">{mentor.sessionCount}</div>
                        <div className="text-xs text-slate-500">Sessões</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3">
                        <div className="text-2xl font-bold text-slate-900">{mentor.reviewCount}</div>
                        <div className="text-xs text-slate-500">Avaliações</div>
                      </div>
                    </div>

                    <Link
                      to={`/mentoria/agendar/${mentor.id}`}
                      className="w-full bg-alvorecer-gold text-slate-900 py-3 rounded-xl font-bold text-center block hover:bg-alvorecer-gold/90 transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="h-5 w-5" /> Agendar Sessão
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{mentor.name}</h1>
                <p className="text-lg text-alvorecer-gold font-medium mb-4">{mentor.specialty}</p>
                <p className="text-slate-600 leading-relaxed">{mentor.bio}</p>
              </div>

              {/* Trilhas */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-alvorecer-gold" />
                  Trilhas de Mentoria
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {mentor.trilhas.map((t) => (
                    <div key={t} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <span className="text-2xl">{TRILHA_ICONS[t]}</span>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{TRILHA_LABELS[t]}</div>
                        <div className="text-xs text-slate-500">8 sessões • 50 min cada</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Horários */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-alvorecer-gold" />
                  Horários Disponíveis
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {HORARIOS_DISPONIVEIS.map((horario) => (
                    <button
                      key={horario}
                      className="p-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-alvorecer-gold hover:bg-alvorecer-gold/5 transition-all text-left"
                    >
                      <Calendar className="h-4 w-4 text-alvorecer-gold mb-1" />
                      {horario}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-3">Horários sujeitos a disponibilidade. Confirme no agendamento.</p>
              </div>

              {/* Como funciona */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-alvorecer-gold" />
                  Como Funciona
                </h2>
                <div className="space-y-4">
                  {[
                    { step: 1, text: 'Escolha o horário e confirme o agendamento' },
                    { step: 2, text: 'Receba a confirmação por e-mail com o link da videochamada' },
                    { step: 3, text: 'Participe da sessão (50 minutos)' },
                    { step: 4, text: 'Avalie a sessão e acompanhe seu progresso' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-alvorecer-gold/10 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-alvorecer-gold">{item.step}</span>
                      </div>
                      <p className="text-slate-600 text-sm pt-1">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-alvorecer-gold" />
                  Avaliações ({mentor.reviewCount})
                </h2>
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-slate-900 text-sm">{review.menteeName}</span>
                          <div className="flex items-center gap-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 text-alvorecer-gold fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                        <p className="text-xs text-slate-400 mt-2">{new Date(review.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">Nenhuma avaliação ainda.</p>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-slate-900 rounded-2xl p-8 text-center text-white">
                <h3 className="text-xl font-bold mb-2">Pronto para começar?</h3>
                <p className="text-slate-300 mb-6">Agende sua primeira sessão com {mentor.name} e dê o primeiro passo na sua jornada.</p>
                <Link
                  to={`/mentoria/agendar/${mentor.id}`}
                  className="bg-alvorecer-gold text-slate-900 px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-alvorecer-gold/90 transition-all"
                >
                  Agendar Agora <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
