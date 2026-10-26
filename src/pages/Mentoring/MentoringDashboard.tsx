import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Video,
  Star,
  ChevronRight,
  Award,
  TrendingUp,
  ArrowRight,
  MapPin,
  Loader2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  TRILHA_LABELS,
  TRILHA_ICONS,
  type MentoringSession,
  type Mentor,
} from '../../types/mentoring'
import { getUserMentoringSessions, getMentors } from '../../services/mentoring'

function StatusBadge({ status }: { status: MentoringSession['status'] }) {
  const styles: Record<string, string> = {
    scheduled: 'bg-green-100 text-green-800 border border-green-200',
    pending_payment: 'bg-amber-100 text-amber-800 border border-amber-200',
    payment_review: 'bg-orange-100 text-orange-800 border border-orange-200',
    completed: 'bg-blue-100 text-blue-800 border border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border border-red-200',
    'no-show': 'bg-slate-100 text-slate-800 border border-slate-200',
  }

  const labels: Record<string, string> = {
    scheduled: 'Confirmada',
    pending_payment: 'Aguardando Pagamento',
    payment_review: 'Pagamento em Análise',
    completed: 'Concluída',
    cancelled: 'Cancelada',
    'no-show': 'Não compareceu',
  }

  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles[status] || styles.scheduled}`}>
      {labels[status] || status}
    </span>
  )
}

function SessionCard({ session, mentor }: { session: MentoringSession; mentor?: Mentor }) {
  const date = new Date(session.date + 'T12:00:00')
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={mentor?.photo || '/alexandre-gomes-costa.jpg'}
          alt={mentor?.name || 'Mentor'}
          className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-900 truncate text-base">
              {mentor?.name || 'Mentor Oficial'}
            </h3>
            <StatusBadge status={session.status} />
          </div>
          <p className="text-sm text-slate-500 mb-2">{mentor?.specialty || 'Mentoria Cristã'}</p>
          <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
            {session.trilha && (
              <div className="flex items-center gap-1 font-medium text-slate-700">
                <span>{TRILHA_ICONS[session.trilha]}</span>
                <span>{TRILHA_LABELS[session.trilha]}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-amber-600" />
              <span className="capitalize">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span>{session.duration || 50} min</span>
            </div>
          </div>
          {session.notes && (
            <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
              {session.notes}
            </p>
          )}
        </div>
      </div>

      {session.status === 'scheduled' && session.meetingUrl && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <a
            href={session.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <Video className="h-4 w-4" />
            Entrar na videochamada (Google Meet)
          </a>
        </div>
      )}

      {session.status === 'completed' && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={`/mentoria/avaliar/${session.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline"
          >
            <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
            Avaliar Sessão
          </Link>
        </div>
      )}
    </div>
  )
}

export default function MentoringDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [sessions, setSessions] = useState<MentoringSession[]>([])
  const [mentorsMap, setMentorsMap] = useState<Record<string, Mentor>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const [userSessions, allMentors] = await Promise.all([
          getUserMentoringSessions(user.uid),
          getMentors(false),
        ])

        setSessions(userSessions as MentoringSession[])

        const map: Record<string, Mentor> = {}
        for (const m of allMentors) {
          map[m.id] = m
        }
        setMentorsMap(map)
      } catch (err) {
        console.error('Erro ao carregar sessões de mentoria:', err)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Faça login</h1>
          <p className="text-slate-500 mb-6 text-sm">
            Você precisa estar logado para acessar seu painel de mentorias.
          </p>
          <Link
            to="/login"
            className="inline-block bg-amber-500 text-slate-950 px-8 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all text-sm"
          >
            Entrar
          </Link>
        </div>
      </div>
    )
  }

  const upcomingSessions = sessions.filter((s) => s.status === 'scheduled' || s.status === 'pending_payment')
  const pastSessions = sessions.filter((s) => s.status === 'completed' || s.status === 'cancelled')

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link to="/mentoria" className="hover:text-amber-600 transition-colors">
              Mentoria
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 font-medium">Meu Painel</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Olá, {user.displayName?.split(' ')[0] || 'Mentorado'}!
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Acompanhe suas sessões, encontros agendados e materiais devocionais.
              </p>
            </div>
            <Link
              to="/mentoria/catalogo"
              className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold hover:bg-amber-400 transition-all text-sm shadow-sm"
            >
              <Calendar className="h-4 w-4" /> Agendar Nova Sessão
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-extrabold text-amber-600">{sessions.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Total de Sessões</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-extrabold text-green-600">{upcomingSessions.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Agendadas</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-extrabold text-blue-600">
              {sessions.filter((s) => s.status === 'completed').length}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Concluídas</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
            <div className="text-2xl font-extrabold text-purple-600">
              {Math.round((sessions.filter((s) => s.status === 'completed').length * 50) / 60)}h
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Tempo em Mentoria</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Sessions List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'upcoming'
                    ? 'border-amber-600 text-amber-700 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Próximas Sessões ({upcomingSessions.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'past'
                    ? 'border-amber-600 text-amber-700 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                Histórico ({pastSessions.length})
              </button>
            </div>

            {/* List */}
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3 bg-white rounded-2xl border border-slate-200">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                <p className="text-sm font-medium">Carregando suas sessões...</p>
              </div>
            ) : activeTab === 'upcoming' ? (
              upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      mentor={mentorsMap[session.mentorId]}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
                  <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-bold text-slate-900 mb-1">Nenhuma sessão agendada</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Você ainda não possui sessões futuras de mentoria.
                  </p>
                  <Link
                    to="/mentoria/catalogo"
                    className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-all text-sm"
                  >
                    Ver mentores disponíveis <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )
            ) : pastSessions.length > 0 ? (
              <div className="space-y-4">
                {pastSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    mentor={mentorsMap[session.mentorId]}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
                <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 mb-1">Nenhuma sessão no histórico</h3>
                <p className="text-sm text-slate-500">Suas sessões concluídas aparecerão aqui.</p>
              </div>
            )}
          </div>

          {/* Quick Actions & Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-base">
                <Award className="h-5 w-5 text-amber-600" />
                Como Aproveitar Sua Mentoria
              </h3>
              <ul className="text-xs text-slate-600 space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>Esteja em um ambiente tranquilo 5 minutos antes da sessão.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>Tenha em mãos sua Bíblia e um caderno para anotações.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>O link do Google Meet fica disponível nesta tela antes do encontro.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-3 text-base">Atalhos</h3>
              <div className="space-y-2">
                <Link
                  to="/mentoria/catalogo"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Explorar Catálogo</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                </Link>
                <Link
                  to="/library"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Minha Biblioteca</span>
                  <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
