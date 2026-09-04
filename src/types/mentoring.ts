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

export type MentoringModule = {
  id: string
  title: string
  description: string
  duration: string
  topics: string[]
}

export type MentoringProgram = {
  id: string
  mentorId: string
  trilha: MentoringTrilha
  title: string
  description: string
  objective: string
  duration: string
  totalSessions: number
  price: number
  modules: MentoringModule[]
  materials: string[]
  targetAudience: string
  prerequisites: string[]
  highlights: string[]
}

export const ALEXANDRE_PROGRAMS: MentoringProgram[] = [
  {
    id: 'prog-lideranca-1',
    mentorId: '1',
    trilha: 'lideranca',
    title: 'Liderança Cristã: Do Chamado à Prática',
    description: 'Programa completo de 12 semanas para desenvolver líderes cristãos que servem com excelência, humildade e propósito bíblico.',
    objective: 'Formar líderes que lideram pelo exemplo, servem com humildade e multiplicam discípulos segundo o modelo de Jesus.',
    duration: '12 semanas',
    totalSessions: 12,
    price: 599,
    modules: [
      {
        id: 'mod-1',
        title: 'Identidade de Líder',
        description: 'Quem é você em Cristo antes de liderar outros?',
        duration: '2 semanas',
        topics: ['Chamado vs. Cargo', 'Caráter antes de competência', 'Humildade na liderança', 'O exemplo de Jesus'],
      },
      {
        id: 'mod-2',
        title: 'Dons e Talentos',
        description: 'Descubra e use seus dons espirituais para servir.',
        duration: '2 semanas',
        topics: ['Teste de dons', '1 Coríntios 12', 'Romano 12', 'Ministração segundo os dons'],
      },
      {
        id: 'mod-3',
        title: 'Comunicação e Escuta',
        description: 'Comunique com sabedoria e escute com empatia.',
        duration: '2 semanas',
        topics: ['Comunicação não-violenta', 'Escuta ativa', 'Provérbios e comunicação', 'Feedback construtivo'],
      },
      {
        id: 'mod-4',
        title: 'Liderança Servidora',
        description: 'Lide pelo exemplo de serviço, não de poder.',
        duration: '2 semanas',
        topics: ['Lavagem dos pés', 'Liderança contra-cultural', 'Serviço vs. Posição', 'O пример de Paulo'],
      },
      {
        id: 'mod-5',
        title: 'Resolução de Conflitos',
        description: 'Encare conflitos com sabedoria e graça.',
        duration: '2 semanas',
        topics: ['Mateus 18', 'Mediação bíblica', 'Perdão e restauração', 'Conflitos saudáveis'],
      },
      {
        id: 'mod-6',
        title: 'Multiplicação de Discípulos',
        description: 'Faça discípulos que farão outros discípulos.',
        duration: '2 semanas',
        topics: ['Mateus 28:19-20', 'Mentoria em saúde', 'Formação de líderes', 'Legado eterno'],
      },
    ],
    materials: [
      'Apostila completa (120 páginas)',
      'Guia de estudo bíblico por módulo',
      'Ficha de autoavaliação de liderança',
      'Plano de desenvolvimento pessoal',
      'Lista de leitura complementar',
      'Templates de planejamento ministerial',
    ],
    targetAudience: 'Líderes de célula, diáconos, pastores auxiliares, jovens com chamado ministerial',
    prerequisites: ['Estar envolvido em algum ministério na igreja', 'Disponibilidade para estudos semanais'],
    highlights: [
      '12 sessões ao vivo com o Pr. Alexandre',
      'Material exclusivo de 120 páginas',
      'Avaliação de dons espirituais',
      'Plano de desenvolvimento personalizado',
      'Comunidade exclusiva de ex-alunos',
      'Certificado de conclusão',
    ],
  },
  {
    id: 'prog-espiritual-1',
    mentorId: '1',
    trilha: 'espiritual',
    title: 'Vida Espiritual: Intimidade com Deus',
    description: 'Jornada de 8 semanas para aprofundar sua vida de oração, estudo bíblico e comunhão com o Espírito Santo.',
    objective: 'Desenvolver uma vida espiritual vibrante, consistente e transformadora baseada nos princípios bíblicos.',
    duration: '8 semanas',
    totalSessions: 8,
    price: 449,
    modules: [
      {
        id: 'mod-esp-1',
        title: 'Fundamentos da Oração',
        description: 'Aprenda a orar com propósito e poder.',
        duration: '2 semanas',
        topics: ['Tipos de oração', 'Oração de fé', 'Jejum e oração', 'Ouvir a voz de Deus'],
      },
      {
        id: 'mod-esp-2',
        title: 'Estudo Bíblico Profundo',
        description: 'Estude a Bíblia de forma transformadora.',
        duration: '2 semanas',
        topics: ['Métodos de estudo', 'Contexto histórico', 'Aplicação pessoal', 'Memorização de versículos'],
      },
      {
        id: 'mod-esp-3',
        title: 'Espiritualidade Prática',
        description: 'Integre a fé no dia a dia.',
        duration: '2 semanas',
        topics: ['Devocional diário', 'Sabat', 'Generosidade', 'Testemunho'],
      },
      {
        id: 'mod-esp-4',
        title: 'Cura Interior e Liberdade',
        description: 'Experimente a cura de feridas emocionais.',
        duration: '2 semanas',
        topics: ['Identificação de traumas', 'Perdão', 'Renovação da mente', 'Liberdade em Cristo'],
      },
    ],
    materials: [
      'Caderno de oração guiada',
      'Guia de estudo bíblico por semana',
      'Playlist de adoração recomendada',
      'Ficha de acompanhamento espiritual',
      'Meditações diárias por 56 dias',
    ],
    targetAudience: 'Qualquer cristão que deseja aprofundar sua vida espiritual',
    prerequisites: ['Desejo de crescer na fé'],
    highlights: [
      '8 sessões ao vivo com o Pr. Alexandre',
      'Caderno de oração guiada (40 páginas)',
      '56 meditações diárias',
      'Avaliação de saúde espiritual',
      'Acompanhamento personalizado',
    ],
  },
  {
    id: 'prog-financas-1',
    mentorId: '1',
    trilha: 'financas',
    title: 'Finanças Bíblicas: Liberdade e Generosidade',
    description: 'Programa de 6 semanas para organizar suas finanças segundo princípios bíblicos e viver na liberdade financeira.',
    objective: 'Ensinar a gerenciar recursos com sabedoria, honrar a Deus nos dízimos e ser instrumento de generosidade.',
    duration: '6 semanas',
    totalSessions: 6,
    price: 349,
    modules: [
      {
        id: 'mod-fin-1',
        title: 'Princípios Bíblicos',
        description: 'Entenda o que a Bíblia diz sobre dinheiro.',
        duration: '2 semanas',
        topics: ['Dízimo bíblico', 'Ofertas voluntárias', 'Mamom vs. Deus', 'Parábola dos talentos'],
      },
      {
        id: 'mod-fin-2',
        title: 'Planejamento Prático',
        description: 'Organize suas finanças com ferramentas reais.',
        duration: '2 semanas',
        topics: ['Orçamento mensal', 'Controle de gastos', 'Reserva de emergência', 'Eliminação de dívidas'],
      },
      {
        id: 'mod-fin-3',
        title: 'Generosidade Estratégica',
        description: 'Seja um instrumento de bênção financeira.',
        duration: '2 semanas',
        topics: ['Generosidade intencional', 'Investimentos éticos', 'Herança para filhos', 'Impacto no Reino'],
      },
    ],
    materials: [
      'Planilha de controle financeiro',
      'Guia de orçamento mensal',
      'Estudo de caso bíblico',
      'Checklist de eliminação de dívidas',
      'Plano de generosidade pessoal',
    ],
    targetAudience: 'Casais, jovens adultos, líderes ministeriais',
    prerequisites: ['Abrir mão de prazeres momentâneos', 'Compromisso com honestidade financeira'],
    highlights: [
      '6 sessões ao vivo',
      'Planilha de controle financeiro',
      'Avaliação financeira personalizada',
      'Plano de liberdade financeira em 90 dias',
    ],
  },
]
