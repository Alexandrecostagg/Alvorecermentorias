export type MentoringTrilha =
  | 'familia'
  | 'lideranca'
  | 'financas'
  | 'espiritual'
  | 'kids'

export type Mentor = {
  id: string
  name: string
  photo: string
  bio: string
  specialty: string
  trilhas: MentoringTrilha[]
  rating: number
  reviewCount: number
  sessionCount: number
  available: boolean
  createdAt: string
}

export type MentoringSession = {
  id: string
  mentorId: string
  menteeId: string
  trilha: MentoringTrilha
  date: string
  duration: number
  format: '1:1' | 'group' | 'circle'
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  meetingUrl?: string
  notes?: string
  createdAt: string
}

export type GroupSessionParticipant = {
  id: string
  userId: string
  name: string
  photo: string
  joinedAt: string
  status: 'confirmed' | 'waitlist' | 'cancelled'
}

export type GroupSessionMessage = {
  id: string
  userId: string
  userName: string
  userPhoto: string
  content: string
  timestamp: string
}

export type GroupSession = {
  id: string
  mentorId: string
  trilha: MentoringTrilha
  title: string
  description: string
  date: string
  time: string
  duration: number
  maxParticipants: number
  currentParticipants: number
  participants: GroupSessionParticipant[]
  messages: GroupSessionMessage[]
  status: 'upcoming' | 'live' | 'completed' | 'cancelled'
  meetingUrl?: string
  createdAt: string
}

export type MentoringReview = {
  id: string
  sessionId: string
  mentorId: string
  menteeId: string
  menteeName: string
  rating: number
  comment: string
  createdAt: string
}

export type MentoringPlan = {
  id: string
  name: string
  type: 'single' | 'pack' | 'subscription'
  price: number
  sessions: number
  features: string[]
  highlighted?: boolean
  active: boolean
}

export type MatchingQuestion = {
  id: string
  question: string
  options: string[]
}

export type MatchingResult = {
  mentorId: string
  score: number
  reasons: string[]
}

export type SessionSummary = {
  id: string
  sessionId: string
  mentorId: string
  menteeId: string
  trilha: MentoringTrilha
  date: string
  title: string
  keyPoints: string[]
  actionItems: string[]
  nextSteps: string[]
  generatedAt: string
}

export const MATCHING_QUESTIONS: MatchingQuestion[] = [
  {
    id: 'goal',
    question: 'Qual o principal objetivo da sua jornada de mentoria?',
    options: [
      'Fortalecer minha vida espiritual',
      'Melhorar meu relacionamento familiar',
      'Desenvolver habilidades de liderança',
      'Organizar minhas finanças segundo a Bíblia',
      'Ajudar meus filhos na fé',
    ],
  },
  {
    id: 'experience',
    question: 'Há quanto tempo você está na fé?',
    options: [
      'Menos de 1 ano',
      '1 a 3 anos',
      '3 a 5 anos',
      '5 a 10 anos',
      'Mais de 10 anos',
    ],
  },
  {
    id: 'availability',
    question: 'Qual horário funciona melhor para você?',
    options: [
      'Manhã (8h - 12h)',
      'Tarde (13h - 17h)',
      'Noite (18h - 21h)',
      'Fim de semana',
      'Flexível',
    ],
  },
  {
    id: 'format',
    question: 'Qual formato de mentoria você prefere?',
    options: [
      'Sessão individual (1:1)',
      'Sessão em grupo',
      'Ambos',
      'Não tenho preferência',
    ],
  },
]

export const TRILHA_LABELS: Record<MentoringTrilha, string> = {
  familia: 'Família e Casamento',
  lideranca: 'Liderança e Ministério',
  financas: 'Finanças Bíblicas',
  espiritual: 'Vida Espiritual',
  kids: 'Alvorecer Kids',
}

export const TRILHA_COLORS: Record<MentoringTrilha, string> = {
  familia: 'from-amber-500 to-orange-500',
  lideranca: 'from-blue-500 to-indigo-500',
  financas: 'from-emerald-500 to-teal-500',
  espiritual: 'from-purple-500 to-violet-500',
  kids: 'from-pink-500 to-rose-500',
}

export const TRILHA_ICONS: Record<MentoringTrilha, string> = {
  familia: '🏠',
  lideranca: '🤝',
  financas: '💰',
  espiritual: '✝️',
  kids: '👶',
}
