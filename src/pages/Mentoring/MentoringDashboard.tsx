import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Video, Star, ChevronRight, BookOpen, Award, TrendingUp, ArrowRight, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { TRILHA_LABELS, TRILHA_ICONS, TRILHA_COLORS, type MentoringSession, type MentoringTrilha } from '../../types/mentoring'

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

const MOCK_SESSIONS: MentoringSession[] = [
  {
    id: '1',
    mentorId: '1',
    menteeId: 'user-1',
    trilha: 'lideranca',
    date: '2026-09-10',
    duration: 50,
    format: '1:1',
    status: 'scheduled',
    meetingUrl: 'https://meet.alvorecermentorias.com/abc123',
    createdAt: '2026-09-01',
  },
  {
    id: '2',
    mentorId: '2',
    menteeId: 'user-1',
    trilha: 'familia',
    date: '2026-09-15',
    duration: 50,
    format: '1:1',
    status: 'scheduled',
    meetingUrl: 'https://meet.alvorecermentorias.com/def456',
    createdAt: '2026-09-02',
  },
  {
    id: '3',
    mentorId: '1',
    menteeId: 'user-1',
    trilha: 'lideranca',
    date: '2026-08-25',
    duration: 50,
    format: '1:1',
    status: 'completed',
    notes: 'Conversamos sobre dons espirituais e liderança na igreja.',
    createdAt: '2026-08-15',
  },
  {
    id: '4',
    mentorId: '3',
    menteeId: 'user-1',
    trilha: 'financas',
    date: '2026-08-20',
    duration: 50,
    format: '1:1',
    status: 'completed',
    notes: 'Estudamos o princípio bíblico de dízimo e ofertas.',
    createdAt: '2026-08-10',
  },
  {
    id: '5',
    mentorId: '1',
    menteeId: 'user-1',
    trilha: 'espiritual',
    date: '2026-08-15',
    duration: 50,
    format: '1:1',
    status: 'completed',
    notes: 'Aprofundamos na vida de oração e comunhão com Deus.',
    createdAt: '2026-08-05',
  },
]

const TRILHA_PROGRESS: Record<MentoringTrilha, { completed: number; total: number }> = {
  lideranca: { completed: 3, total: 8 },
  familia: { completed: 1, total: 8 },
  financas: { completed: 2, total: 8 },
  espiritual: { completed: 1, total: 8 },
  kids: { completed: 0, total: 8 },
}

function StatusBadge({ status }: { status: MentoringSession['status'] }) {
  const styles = {
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    'no-show': 'bg-slate-100 text-slate-600',
  }

  const labels = {
    scheduled: 'Agendada',
    completed: 'Concluída',
    cancelled: 'Cancelada',
    'no-show': 'Não compareceu',
  }

  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function SessionCard({ session, mentor }: { session: MentoringSession; mentor?: MentorData }) {
  const date = new Date(session.date + 'T12:00:00')
  const formattedDate = date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={mentor?.photo || ''}
          alt={mentor?.name || ''}
          className="w-12 h-12 rounded-full object-cover border-2 border-alvorecer-gold flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 truncate">{mentor?.name}</h3>
            <StatusBadge status={session.status} />
          </div>
          <p className="text-sm text-slate-500 mb-2">{mentor?.specialty}</p>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <span>{TRILHA_ICONS[session.trilha]}</span>
              <span>{TRILHA_LABELS[session.trilha]}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="capitalize">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{session.duration} min</span>
            </div>
          </div>
          {session.notes && (
            <p className="text-xs text-slate-400 mt-2 line-clamp-1">{session.notes}</p>
          )}
        </div>
      </div>
      {session.status === 'scheduled' && session.meetingUrl && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <a
            href={session.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-alvorecer-gold hover:underline"
          >
            <Video className="h-4 w-4" />
            Entrar na videochamada
          </a>
        </div>
      )}
    </div>
  )
}

function TrilhaProgressCard({ trilha, progress }: { trilha: MentoringTrilha; progress: { completed: number; total: number } }) {
  const percentage = Math.round((progress.completed / progress.total) * 100)

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${TRILHA_COLORS[trilha]} flex items-center justify-center text-white text-lg`}>
          {TRILHA_ICONS[trilha]}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-sm">{TRILHA_LABELS[trilha]}</h3>
          <p className="text-xs text-slate-500">{progress.completed} de {progress.total} sessões</p>
        </div>
        <span className="text-sm font-bold text-slate-900">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${TRILHA_COLORS[trilha]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default function MentoringDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  const upcomingSessions = MOCK_SESSIONS.filter(s => s.status === 'scheduled')
  const pastSessions = MOCK_SESSIONS.filter(s => s.status === 'completed')
  const activeSessions = MOCK_SESSIONS.filter(s => s.menteeId === user?.uid || true)

  const totalSessionsCompleted = activeSessions.filter(s => s.status === 'completed').length
  const totalHours = Math.round((activeSessions.filter(s => s.status === 'completed').length * 50) / 60)
  const activeTrilhas = Object.keys(TRILHA_PROGRESS).filter(t => TRILHA_PROGRESS[t as MentoringTrilha].completed > 0).length

  if (!user) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Faça login</h1>
          <p className="text-slate-500 mb-6">Você precisa estar logado para acessar seu dashboard.</p>
          <Link to="/login" className="bg-alvorecer-gold text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all">
            Entrar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-alvorecer-gold/20 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-alvorecer-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Meu Painel de Mentoria</h1>
              <p className="text-slate-500">Acompanhe suas sessões e progresso</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-alvorecer-gold">{upcomingSessions.length}</div>
            <div className="text-sm text-slate-500">Próximas sessões</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{totalSessionsCompleted}</div>
            <div className="text-sm text-slate-500">Sessões concluídas</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{totalHours}h</div>
            <div className="text-sm text-slate-500">Tempo de mentoria</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{activeTrilhas}</div>
            <div className="text-sm text-slate-500">Trilhas ativas</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 pb-px">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === 'upcoming'
                    ? 'bg-white text-alvorecer-gold border border-b-0 border-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Próximas ({upcomingSessions.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === 'past'
                    ? 'bg-white text-alvorecer-gold border border-b-0 border-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Histórico ({pastSessions.length})
              </button>
            </div>

            {/* Sessions List */}
            <div className="space-y-3">
              {activeTab === 'upcoming' ? (
                upcomingSessions.length > 0 ? (
                  upcomingSessions.map(session => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      mentor={MENTORES_MOCK[session.mentorId]}
                    />
                  ))
                ) : (
                  <div className="card p-8 text-center">
                    <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-slate-900 mb-2">Nenhuma sessão agendada</h3>
                    <p className="text-sm text-slate-500 mb-4">Agende sua primeira sessão de mentoria</p>
                    <Link
                      to="/mentoria/catalogo"
                      className="inline-flex items-center gap-2 text-alvorecer-gold font-semibold hover:underline"
                    >
                      Ver mentores disponíveis <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )
              ) : (
                pastSessions.length > 0 ? (
                  pastSessions.map(session => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      mentor={MENTORES_MOCK[session.mentorId]}
                    />
                  ))
                ) : (
                  <div className="card p-8 text-center">
                    <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-semibold text-slate-900 mb-2">Nenhuma sessão anterior</h3>
                    <p className="text-sm text-slate-500">Suas sessões concluídas aparecerão aqui</p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Sidebar - Progress */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-alvorecer-gold" />
                Progresso das Trilhas
              </h2>
              <div className="space-y-3">
                {Object.entries(TRILHA_PROGRESS)
                  .filter(([, progress]) => progress.completed > 0)
                  .map(([trilha, progress]) => (
                    <TrilhaProgressCard
                      key={trilha}
                      trilha={trilha as MentoringTrilha}
                      progress={progress}
                    />
                  ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-4">
              <h3 className="font-bold text-slate-900 mb-3">Ações Rápidas</h3>
              <div className="space-y-2">
                <Link
                  to="/mentoria/catalogo"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-alvorecer-gold/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-alvorecer-gold" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Agendar nova sessão</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                </Link>
                <Link
                  to="/mentoria"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-alvorecer-gold/10 flex items-center justify-center">
                    <Award className="h-4 w-4 text-alvorecer-gold" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Explorar trilhas</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                </Link>
              </div>
            </div>

            {/* Achievements */}
            <div className="card p-4">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Star className="h-5 w-5 text-alvorecer-gold" />
                Conquistas
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2">
                  <div className="text-2xl mb-1">🌱</div>
                  <div className="text-xs text-slate-500">Primeira Sessão</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-2xl mb-1">📚</div>
                  <div className="text-xs text-slate-500">3 Trilhas</div>
                </div>
                <div className="text-center p-2 opacity-30">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs text-slate-500">10 Sessões</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
