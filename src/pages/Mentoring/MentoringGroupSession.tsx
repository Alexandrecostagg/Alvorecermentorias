import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, Calendar, Clock, Users, Video, Send, ArrowRight, CheckCircle2, Loader2, Star, MessageSquare } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { TRILHA_LABELS, TRILHA_ICONS, TRILHA_COLORS, type GroupSession, type GroupSessionMessage } from '../../types/mentoring'

interface MentorData {
  id: string
  name: string
  photo: string
  specialty: string
}

const MENTORES_MOCK: Record<string, MentorData> = {
  '1': { id: '1', name: 'Pr. Alexandre Gosta', photo: '/alexandre-gomes-costa.jpg', specialty: 'Liderança e Propósito' },
  '2': { id: '2', name: 'Ana Beatriz Santos', photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', specialty: 'Família e Casamento' },
}

const MOCK_GROUP_SESSIONS: GroupSession[] = [
  {
    id: '1',
    mentorId: '1',
    trilha: 'lideranca',
    title: 'Liderança Cristã no Século XXI',
    description: 'Sessão em grupo sobre como exercer liderança cristã nos dias atuais, enfrentando desafios modernos com sabedoria bíblica.',
    date: '2026-09-15',
    time: '19:00',
    duration: 90,
    maxParticipants: 12,
    currentParticipants: 8,
    participants: [
      { id: '1', userId: 'user-1', name: 'João Silva', photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', joinedAt: '2026-09-01', status: 'confirmed' },
      { id: '2', userId: 'user-2', name: 'Maria Santos', photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', joinedAt: '2026-09-02', status: 'confirmed' },
      { id: '3', userId: 'user-3', name: 'Pedro Costa', photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', joinedAt: '2026-09-03', status: 'confirmed' },
      { id: '4', userId: 'user-4', name: 'Ana Oliveira', photo: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', joinedAt: '2026-09-04', status: 'confirmed' },
      { id: '5', userId: 'user-5', name: 'Lucas Mendes', photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', joinedAt: '2026-09-05', status: 'confirmed' },
      { id: '6', userId: 'user-6', name: 'Juliana Lima', photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', joinedAt: '2026-09-06', status: 'confirmed' },
      { id: '7', userId: 'user-7', name: 'Fernando Alves', photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', joinedAt: '2026-09-07', status: 'confirmed' },
      { id: '8', userId: 'user-8', name: 'Camila Rocha', photo: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', joinedAt: '2026-09-08', status: 'confirmed' },
    ],
    messages: [
      { id: '1', userId: 'user-1', userName: 'João Silva', userPhoto: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', content: 'Pessoal, alguém já leu o livro "Liderança por Princípios" do John Maxwell?', timestamp: '2026-09-10T14:30:00' },
      { id: '2', userId: 'user-2', userName: 'Maria Santos', userPhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', content: 'Sim! Li ano passado. Tem insights muito bons sobre liderança servil.', timestamp: '2026-09-10T14:32:00' },
      { id: '3', userId: 'user-3', userName: 'Pedro Costa', userPhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', content: 'Vou adicionar na minha lista de leitura! Podemos discutir na sessão?', timestamp: '2026-09-10T14:35:00' },
      { id: '4', userId: 'user-1', userName: 'João Silva', userPhoto: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', content: 'Claro! O Pr. Alexandre vai adorar.', timestamp: '2026-09-10T14:37:00' },
    ],
    status: 'upcoming',
    meetingUrl: 'https://meet.alvorecermentorias.com/group-lideranca',
    createdAt: '2026-09-01',
  },
  {
    id: '2',
    mentorId: '2',
    trilha: 'familia',
    title: 'Comunicação no Casamento',
    description: 'Workshop prático sobre técnicas de comunicação eficaz para fortalecer o relacionamento conjugal.',
    date: '2026-09-20',
    time: '10:00',
    duration: 120,
    maxParticipants: 10,
    currentParticipants: 6,
    participants: [
      { id: '9', userId: 'user-9', name: 'Roberto Dias', photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', joinedAt: '2026-09-05', status: 'confirmed' },
      { id: '10', userId: 'user-10', name: 'Patricia Mendes', photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', joinedAt: '2026-09-06', status: 'confirmed' },
    ],
    messages: [],
    status: 'upcoming',
    meetingUrl: 'https://meet.alvorecermentorias.com/group-familia',
    createdAt: '2026-09-05',
  },
]

function ParticipantAvatar({ participant, size = 'md' }: { participant: { name: string; photo: string }; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  return (
    <div className="relative">
      <img
        src={participant.photo}
        alt={participant.name}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm`}
      />
    </div>
  )
}

function ChatMessage({ message }: { message: GroupSessionMessage }) {
  return (
    <div className="flex gap-3">
      <ParticipantAvatar participant={{ name: message.userName, photo: message.userPhoto }} size="sm" />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-slate-900 text-sm">{message.userName}</span>
          <span className="text-xs text-slate-400">
            {new Date(message.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{message.content}</p>
      </div>
    </div>
  )
}

export default function MentoringGroupSession() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const chatEndRef = useRef<HTMLDivElement>(null)

  const session = MOCK_GROUP_SESSIONS.find(s => s.id === id)
  const mentor = session ? MENTORES_MOCK[session.mentorId] : null

  const [newMessage, setNewMessage] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [messages, setMessages] = useState<GroupSessionMessage[]>(session?.messages || [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!session || !mentor) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Sessão não encontrada</h1>
          <p className="text-slate-500 mb-6">A sessão em grupo que você procura não existe.</p>
          <Link to="/mentoria/catalogo" className="text-alvorecer-gold font-semibold hover:underline">
            Voltar ao catálogo
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

  const spotsLeft = session.maxParticipants - session.currentParticipants

  const handleJoin = async () => {
    setIsJoining(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setJoined(true)
    setIsJoining(false)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return

    const message: GroupSessionMessage = {
      id: `msg-${Date.now()}`,
      userId: user.uid,
      userName: user.displayName || 'Usuário',
      userPhoto: user.photoURL || '',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
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
            <span className="text-slate-900 font-medium">Sessão em Grupo</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Header */}
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${TRILHA_COLORS[session.trilha]} flex items-center justify-center text-white text-2xl`}>
                  {TRILHA_ICONS[session.trilha]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-alvorecer-gold bg-alvorecer-gold/10 px-2 py-0.5 rounded-full">
                      {TRILHA_LABELS[session.trilha]}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      session.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      session.status === 'live' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {session.status === 'upcoming' ? 'Agendada' : session.status === 'live' ? 'Ao vivo' : 'Concluída'}
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-slate-900">{session.title}</h1>
                  <p className="text-sm text-slate-500 mt-1">{session.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="capitalize">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{session.time} ({session.duration} min)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>{session.currentParticipants}/{session.maxParticipants} participantes</span>
                </div>
              </div>

              {/* Mentor */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={mentor.photo}
                    alt={mentor.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-alvorecer-gold"
                  />
                  <div>
                    <p className="font-medium text-slate-900">{mentor.name}</p>
                    <p className="text-xs text-alvorecer-gold">{mentor.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    <Star className="h-4 w-4 text-alvorecer-gold fill-current" />
                    <span className="text-sm text-slate-600">4.9</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="card">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-alvorecer-gold" />
                  Chat da Sessão
                </h2>
              </div>

              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map(message => (
                    <ChatMessage key={message.id} message={message} />
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div>
                      <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">Nenhuma mensagem ainda</p>
                      <p className="text-xs text-slate-400">Seja o primeiro a comentar!</p>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={joined ? "Digite sua mensagem..." : "Entre na sessão para participar do chat"}
                    disabled={!joined}
                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-alvorecer-gold/50 focus:border-alvorecer-gold disabled:bg-slate-50 disabled:text-slate-400"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!joined || !newMessage.trim()}
                    className="bg-alvorecer-gold text-slate-900 px-4 py-2 rounded-xl font-medium hover:bg-alvorecer-gold/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Join Card */}
            <div className="card p-6 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Participar da Sessão</h3>

              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Vagas disponíveis</span>
                  <span className={`font-medium ${spotsLeft <= 3 ? 'text-amber-600' : 'text-slate-900'}`}>
                    {spotsLeft} de {session.maxParticipants}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Preço por pessoa</span>
                  <span className="font-bold text-slate-900">R$ 49,00</span>
                </div>
              </div>

              {spotsLeft <= 3 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-amber-700 font-medium">
                    ⚠️ Últimas {spotsLeft} vagas!
                  </p>
                </div>
              )}

              {joined ? (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-800">Você está inscrito!</p>
                    <p className="text-xs text-green-600 mt-1">Acesse a sessão no horário agendado</p>
                  </div>
                  {session.meetingUrl && (
                    <a
                      href={session.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-alvorecer-gold text-slate-900 py-3 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all flex items-center justify-center gap-2"
                    >
                      <Video className="h-5 w-5" /> Entrar na Sessão
                    </a>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={isJoining || spotsLeft === 0}
                  className="w-full bg-alvorecer-gold text-slate-900 py-3 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Processando...
                    </>
                  ) : spotsLeft === 0 ? (
                    'Esgotado'
                  ) : (
                    <>
                      Inscrever-se <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              )}

              {!user && (
                <p className="text-xs text-center text-slate-400 mt-3">
                  <Link to="/login" className="text-alvorecer-gold hover:underline">Faça login</Link> para se inscrever
                </p>
              )}
            </div>

            {/* Participants */}
            <div className="card p-4">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-alvorecer-gold" />
                Participantes ({session.currentParticipants})
              </h3>
              <div className="flex flex-wrap gap-2">
                {session.participants.map(participant => (
                  <div key={participant.id} className="relative group">
                    <ParticipantAvatar participant={participant} size="lg" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {participant.name}
                    </div>
                  </div>
                ))}
                {spotsLeft > 0 && (
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                    <span className="text-xs text-slate-400">+{spotsLeft}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Session Info */}
            <div className="card p-4">
              <h3 className="font-bold text-slate-900 mb-3">Sobre a Sessão</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-alvorecer-gold rounded-full" />
                  Duração: {session.duration} minutos
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-alvorecer-gold rounded-full" />
                  Formato: Videochamada em grupo
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-alvorecer-gold rounded-full" />
                  Gravação disponível após o evento
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-alvorecer-gold rounded-full" />
                  Material de apoio incluso
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
