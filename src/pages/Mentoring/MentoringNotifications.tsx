import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Calendar, Clock, Star, CheckCircle2, ChevronRight, Video, Trash2, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface Notification {
  id: string
  type: 'session_scheduled' | 'session_reminder' | 'session_completed' | 'review_request' | 'system'
  title: string
  message: string
  date: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
  mentorId?: string
  mentorName?: string
  sessionId?: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'session_scheduled',
    title: 'Sessão Agendada',
    message: 'Sua sessão com Pr. Alexandre Gosta foi agendada para 10/09/2026 às 14:00.',
    date: '2026-09-01T10:30:00',
    read: true,
    actionUrl: '/mentoria/dashboard',
    actionLabel: 'Ver detalhes',
    mentorId: '1',
    mentorName: 'Pr. Alexandre Gosta',
    sessionId: '1',
  },
  {
    id: '2',
    type: 'session_reminder',
    title: 'Lembrete: Sessão Amanhã',
    message: 'Você tem uma sessão com Ana Beatriz Santos amanhã às 15:00. Prepare suas perguntas!',
    date: '2026-09-14T18:00:00',
    read: false,
    actionUrl: '/mentoria/dashboard',
    actionLabel: 'Ver sessão',
    mentorId: '2',
    mentorName: 'Ana Beatriz Santos',
    sessionId: '2',
  },
  {
    id: '3',
    type: 'session_reminder',
    title: 'Sessão em 1 hora',
    message: 'Sua sessão com Pr. Alexandre Gosta começa em 1 hora. Não esqueça de preparar seu ambiente!',
    date: '2026-09-10T13:00:00',
    read: false,
    actionUrl: 'https://meet.alvorecermentorias.com/abc123',
    actionLabel: 'Entrar na videochamada',
    mentorId: '1',
    mentorName: 'Pr. Alexandre Gosta',
    sessionId: '1',
  },
  {
    id: '4',
    type: 'session_completed',
    title: 'Sessão Concluída',
    message: 'Sua sessão com Carlos Eduardo Lima foi concluída. Avalie sua experiência!',
    date: '2026-08-20T16:00:00',
    read: true,
    actionUrl: '/mentoria/avaliar/4',
    actionLabel: 'Avaliar sessão',
    mentorId: '3',
    mentorName: 'Carlos Eduardo Lima',
    sessionId: '4',
  },
  {
    id: '5',
    type: 'review_request',
    title: 'Avalie sua experiência',
    message: 'Você ainda não avaliou sua sessão com Pr. Alexandre Gosta de 25/08. Sua opinião é importante!',
    date: '2026-08-27T10:00:00',
    read: true,
    actionUrl: '/mentoria/avaliar/3',
    actionLabel: 'Avaliar agora',
    mentorId: '1',
    mentorName: 'Pr. Alexandre Gosta',
    sessionId: '3',
  },
  {
    id: '6',
    type: 'system',
    title: 'Nova trilha disponível',
    message: 'A trilha "Liderança e Ministério" agora está disponível com novos conteúdos e exercícios.',
    date: '2026-08-15T09:00:00',
    read: true,
    actionUrl: '/mentoria',
    actionLabel: 'Explorar trilha',
  },
]

function NotificationIcon({ type }: { type: Notification['type'] }) {
  const iconClass = 'h-5 w-5'

  switch (type) {
    case 'session_scheduled':
      return <Calendar className={`${iconClass} text-blue-500`} />
    case 'session_reminder':
      return <Clock className={`${iconClass} text-amber-500`} />
    case 'session_completed':
      return <CheckCircle2 className={`${iconClass} text-green-500`} />
    case 'review_request':
      return <Star className={`${iconClass} text-alvorecer-gold`} />
    case 'system':
      return <Bell className={`${iconClass} text-purple-500`} />
    default:
      return <Bell className={`${iconClass} text-slate-400`} />
  }
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays} dias atrás`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} sem atrás`
  return `${Math.floor(diffDays / 30)} mês atrás`
}

export default function MentoringNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Faça login</h1>
          <p className="text-slate-500 mb-6">Você precisa estar logado para ver suas notificações.</p>
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
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-alvorecer-gold/20 flex items-center justify-center">
                <Bell className="h-6 w-6 text-alvorecer-gold" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Notificações</h1>
                <p className="text-sm text-slate-500">
                  {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Tudo lido'}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-alvorecer-gold font-medium hover:underline flex items-center gap-1"
              >
                <Check className="h-4 w-4" /> Marcar todas como lidas
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-alvorecer-gold/10 text-alvorecer-gold'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-alvorecer-gold/10 text-alvorecer-gold'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Não lidas ({unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`card p-4 transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-alvorecer-gold' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <NotificationIcon type={notification.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-semibold text-sm ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {timeAgo(notification.date)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{notification.message}</p>

                    <div className="flex items-center gap-3 mt-3">
                      {notification.actionUrl && (
                        <Link
                          to={notification.actionUrl}
                          onClick={() => markAsRead(notification.id)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-alvorecer-gold hover:underline"
                        >
                          {notification.actionLabel || 'Ver'} <ChevronRight className="h-4 w-4" />
                        </Link>
                      )}
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-slate-400 hover:text-slate-600"
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 text-slate-300 hover:text-red-500 transition-colors flex-shrink-0"
                    title="Excluir notificação"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">
              {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
            </h3>
            <p className="text-sm text-slate-500">
              {filter === 'unread'
                ? 'Todas as suas notificações foram lidas.'
                : 'Quando você tiver novas notificações, elas aparecerão aqui.'}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 card p-4">
          <h3 className="font-bold text-slate-900 mb-3">Ações Rápidas</h3>
          <div className="space-y-2">
            <Link
              to="/mentoria/dashboard"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-alvorecer-gold/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-alvorecer-gold" />
              </div>
              <span className="text-sm font-medium text-slate-700">Ver minhas sessões</span>
              <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
            </Link>
            <Link
              to="/mentoria/catalogo"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-alvorecer-gold/10 flex items-center justify-center">
                <Video className="h-4 w-4 text-alvorecer-gold" />
              </div>
              <span className="text-sm font-medium text-slate-700">Agendar nova sessão</span>
              <ChevronRight className="h-4 w-4 text-slate-400 ml-auto" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
