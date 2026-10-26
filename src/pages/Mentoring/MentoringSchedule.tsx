import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  ChevronLeft,
  Clock,
  Calendar,
  Star,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { TRILHA_LABELS, TRILHA_ICONS, type Mentor } from '../../types/mentoring'
import { getMentorById } from '../../services/mentoring'

const HORARIOS_PADRAO = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '19:00',
  '20:00',
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
  const [searchParams] = useSearchParams()
  const programId = searchParams.get('programId')
  const navigate = useNavigate()

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)

  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedTrilha, setSelectedTrilha] = useState<string | null>(null)

  useEffect(() => {
    async function carregar() {
      if (!id) return
      try {
        setLoading(true)
        const data = await getMentorById(id)
        setMentor(data)
        if (data?.trilhas?.length) {
          setSelectedTrilha(data.trilhas[0])
        }
      } catch (err) {
        console.error('Erro ao carregar mentor para agendamento:', err)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-8 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        <p className="text-sm font-medium">Carregando horários do mentor...</p>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Mentor não encontrado</h1>
          <p className="text-slate-500 mb-6 text-sm">O mentor selecionado não foi encontrado ou não está disponível.</p>
          <Link
            to="/mentoria/catalogo"
            className="inline-block bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl hover:bg-amber-400 transition-all text-sm"
          >
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
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    )
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
    const year = selectedDate!.getFullYear()
    const month = String(selectedDate!.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate!.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    let url = `/mentoria/checkout/${mentor.id}?date=${dateStr}&time=${selectedTime}&trilha=${selectedTrilha}`
    if (programId) url += `&programId=${programId}`
    navigate(url)
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/mentoria" className="hover:text-amber-600 transition-colors">
              Mentoria
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/mentoria/catalogo" className="hover:text-amber-600 transition-colors">
              Catálogo
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/mentoria/mentor/${mentor.id}`} className="hover:text-amber-600 transition-colors">
              {mentor.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 font-medium">Agendar</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mentor Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 shadow-sm">
              <img
                src={mentor.photo || '/alexandre-gomes-costa.jpg'}
                alt={mentor.name}
                className="w-16 h-16 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h2 className="text-xl font-bold text-slate-900">{mentor.name}</h2>
                <p className="text-amber-700 font-medium text-sm">{mentor.specialty}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  <span className="text-sm font-semibold text-slate-700">{mentor.rating ?? 5.0}</span>
                  <span className="text-xs text-slate-400">({mentor.reviewCount ?? 0} avaliações)</span>
                </div>
              </div>
            </div>

            {/* Trilha Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">1. Escolha a Trilha de Foco</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {mentor.trilhas.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTrilha(t)}
                    className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      selectedTrilha === t
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{TRILHA_ICONS[t]}</span>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{TRILHA_LABELS[t]}</div>
                      <div className="text-xs text-slate-500">Encontro de 50 min</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">2. Selecione a Data</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="font-bold text-slate-900 capitalize text-sm min-w-32 text-center">
                    {monthName}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {DIAS_SEMANA.map((day) => (
                  <div key={day} className="text-xs font-bold text-slate-400 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {[...Array(firstDay)].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1
                  const past = isDatePast(day)
                  const todayFlag = isToday(day)
                  const selected = isSelected(day)

                  return (
                    <button
                      key={day}
                      disabled={past}
                      onClick={() => handleDateClick(day)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all relative ${
                        past
                          ? 'text-slate-300 cursor-not-allowed'
                          : selected
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                            : todayFlag
                              ? 'border-2 border-amber-500 text-amber-900 hover:bg-amber-50 font-bold'
                              : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">3. Selecione o Horário</h3>
                <p className="text-sm text-slate-500 mb-4 capitalize">{formatSelectedDate()}</p>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {HORARIOS_PADRAO.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-2 rounded-xl text-sm font-semibold border transition-all text-center ${
                        selectedTime === time
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Resumo do Agendamento</h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <img
                    src={mentor.photo || '/alexandre-gomes-costa.jpg'}
                    alt={mentor.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{mentor.name}</div>
                    <div className="text-xs text-amber-700">{mentor.specialty}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-600" />
                    <span className={selectedTrilha ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                      {selectedTrilha ? TRILHA_LABELS[selectedTrilha as keyof typeof TRILHA_LABELS] : 'Selecione a trilha'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    <span className={selectedDate ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                      {selectedDate ? formatSelectedDate() : 'Selecione o dia'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className={selectedTime ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                      {selectedTime ? `${selectedTime} (50 min)` : 'Selecione o horário'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-600 font-medium">Sessão individual</span>
                    <span className="font-extrabold text-slate-900 text-lg">R$ 99,00</span>
                  </div>
                </div>

                <button
                  onClick={handleProceed}
                  disabled={!canProceed}
                  className="w-full bg-amber-500 text-slate-950 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
