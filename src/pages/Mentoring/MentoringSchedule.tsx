import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Clock, Calendar, Star, CheckCircle2, ArrowRight } from 'lucide-react'
import { TRILHA_LABELS, TRILHA_ICONS, type Mentor } from '../../types/mentoring'

const MENTORES_MOCK: Record<string, Mentor> = {
  '1': {
    id: '1',
    name: 'Pr. Alexandre Gosta',
    photo: '/alexandre-gomes-costa.jpg',
    bio: 'Pastor e mentor com mais de 15 anos de experiência.',
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
    bio: 'Psicóloga e mentora familiar.',
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
    bio: 'Empresário e consultor financeiro.',
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
    bio: 'Coach certificada e mentora de vida espiritual.',
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
    bio: 'Líder juvenil e mentor de jovens adultos.',
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
    bio: 'Especialista em educação cristã infantil.',
    specialty: 'Alvorecer Kids',
    trilhas: ['kids', 'familia'],
    rating: 4.9,
    reviewCount: 38,
    sessionCount: 60,
    available: true,
    createdAt: '2026-03-10',
  },
}

const HORARIOS = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '19:00', '20:00',
]

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function MentoringSchedule() {
  const { id } = useParams<{ id: string }>()
  const mentor = MENTORES_MOCK[id || '']

  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedTrilha, setSelectedTrilha] = useState<string | null>(null)

  if (!mentor) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mentor não encontrado</h1>
          <p className="text-slate-500 mb-6">O mentor que você procura não existe.</p>
          <Link to="/mentoria/catalogo" className="text-alvorecer-gold font-semibold hover:underline">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)
  const todayDate = today.getDate()
  const todayMonth = today.getMonth()
  const todayYear = today.getFullYear()

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day)
    if (clickedDate < new Date(todayYear, todayMonth, todayDate)) return
    setSelectedDate(clickedDate)
    setSelectedTime(null)
  }

  const isDatePast = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    return date < new Date(todayYear, todayMonth, todayDate)
  }

  const isToday = (day: number) => {
    return day === todayDate && currentMonth === todayMonth && currentYear === todayYear
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear
  }

  const formatSelectedDate = () => {
    if (!selectedDate) return ''
    return selectedDate.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const canProceed = selectedDate && selectedTime && selectedTrilha

  const handleProceed = () => {
    if (!canProceed) return
    const dateStr = selectedDate!.toISOString().split('T')[0]
    window.location.href = `/mentoria/checkout/${mentor.id}?date=${dateStr}&time=${selectedTime}&trilha=${selectedTrilha}`
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

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
            <Link to={`/mentoria/mentor/${mentor.id}`} className="hover:text-alvorecer-gold transition-colors">{mentor.name}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 font-medium">Agendar</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar & Time Selection */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Agende sua sessão</h1>
            <p className="text-slate-500">Escolha a trilha, o dia e o horário que melhor funcionam para você.</p>

            {/* Trilha Selection */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-xl">📚</span> 1. Escolha a trilha
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {mentor.trilhas.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTrilha(t)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedTrilha === t
                        ? 'border-alvorecer-gold bg-alvorecer-gold/5'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{TRILHA_ICONS[t]}</span>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{TRILHA_LABELS[t]}</div>
                        <div className="text-xs text-slate-500">8 sessões • 50 min</div>
                      </div>
                      {selectedTrilha === t && (
                        <CheckCircle2 className="h-5 w-5 text-alvorecer-gold ml-auto" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-alvorecer-gold" /> 2. Escolha o dia
              </h2>

              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-600" />
                </button>
                <h3 className="font-semibold text-slate-900 capitalize">{monthName}</h3>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-slate-600" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {DIAS_SEMANA.map((dia) => (
                  <div key={dia} className="text-center text-xs font-medium text-slate-400 py-2">
                    {dia}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const past = isDatePast(day)
                  const today标记 = isToday(day)
                  const selected = isSelected(day)

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      disabled={past}
                      className={`aspect-square rounded-xl text-sm font-medium transition-all ${
                        past
                          ? 'text-slate-300 cursor-not-allowed'
                          : selected
                          ? 'bg-alvorecer-gold text-slate-900 shadow-md'
                          : today标记
                          ? 'bg-alvorecer-gold/10 text-alvorecer-gold font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-alvorecer-gold" /> 3. Escolha o horário
                </h2>
                <p className="text-sm text-slate-500 mb-4">
                  Horários disponíveis para <span className="font-medium text-slate-700">{formatSelectedDate()}</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {HORARIOS.map((hora) => (
                    <button
                      key={hora}
                      onClick={() => setSelectedTime(hora)}
                      className={`p-3 rounded-xl border-2 text-center font-medium transition-all ${
                        selectedTime === hora
                          ? 'border-alvorecer-gold bg-alvorecer-gold/5 text-alvorecer-gold'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Mentor & Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Mentor Card */}
              <div className="card p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={mentor.photo}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-alvorecer-gold"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900">{mentor.name}</h3>
                    <p className="text-sm text-alvorecer-gold">{mentor.specialty}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-alvorecer-gold fill-current" />
                      <span className="text-xs text-slate-500">{mentor.rating} ({mentor.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 mb-4">Resumo do Agendamento</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedTrilha ? TRILHA_ICONS[selectedTrilha as keyof typeof TRILHA_ICONS] : '📚'}</span>
                    <span className={selectedTrilha ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                      {selectedTrilha ? TRILHA_LABELS[selectedTrilha as keyof typeof TRILHA_LABELS] : 'Selecione a trilha'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className={selectedDate ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                      {selectedDate ? formatSelectedDate() : 'Selecione o dia'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className={selectedTime ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                      {selectedTime || 'Selecione o horário'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-600">Sessão individual (50 min)</span>
                    <span className="font-bold text-slate-900">R$ 99,00</span>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  disabled={!canProceed}
                  className="w-full bg-alvorecer-gold text-slate-900 py-3 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar para Pagamento <ArrowRight className="h-5 w-5" />
                </button>

                {!canProceed && (
                  <p className="text-xs text-center text-slate-400 mt-2">
                    Selecione trilha, dia e horário para continuar
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
