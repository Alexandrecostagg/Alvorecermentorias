import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star,
  Calendar,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react'
import {
  type Mentor,
  type MentoringProgram,
  TRILHA_LABELS,
  TRILHA_ICONS,
} from '../../types/mentoring'
import { getMentorById, getPrograms } from '../../services/mentoring'

export default function MentorProfile() {
  const { id } = useParams<{ id: string }>()
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [programs, setPrograms] = useState<MentoringProgram[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      if (!id) return
      try {
        setLoading(true)
        const [mentorData, programsData] = await Promise.all([
          getMentorById(id),
          getPrograms(true, id),
        ])
        setMentor(mentorData)
        setPrograms(programsData)
      } catch (err) {
        console.error('Erro ao carregar dados do mentor:', err)
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
        <p className="text-sm font-medium">Carregando perfil do mentor...</p>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="min-h-[60vh] grid place-items-center p-8 text-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 max-w-md shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Mentor não encontrado</h1>
          <p className="text-slate-500 mb-6 text-sm">O mentor solicitado não existe ou não está disponível para atendimento no momento.</p>
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
            <span className="text-slate-900 font-medium">{mentor.name}</span>
          </nav>
        </div>
      </div>

      {/* Profile Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Photo & Quick Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <img
                    src={mentor.photo || '/alexandre-gomes-costa.jpg'}
                    alt={mentor.name}
                    className="w-full aspect-square object-cover bg-slate-100"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(mentor.rating ?? 5.0)
                                ? 'text-amber-500 fill-current'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-slate-500 font-medium">
                        {mentor.rating ?? 5.0} ({mentor.reviewCount ?? 0} avaliações)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {mentor.trilhas.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200/50"
                        >
                          {TRILHA_ICONS[t]} {TRILHA_LABELS[t]}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-2xl font-bold text-slate-900">{mentor.sessionCount ?? 0}</div>
                        <div className="text-xs text-slate-500">Sessões</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <div className="text-2xl font-bold text-slate-900">{mentor.reviewCount ?? 0}</div>
                        <div className="text-xs text-slate-500">Avaliações</div>
                      </div>
                    </div>

                    <Link
                      to={`/mentoria/agendar/${mentor.id}`}
                      className="w-full bg-amber-500 text-slate-950 py-3 rounded-xl font-bold text-center block hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-sm"
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                    <ShieldCheck className="h-3.5 w-3.5" /> Mentor Oficial Verificado
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{mentor.name}</h1>
                <p className="text-lg text-amber-700 font-semibold mb-4">{mentor.specialty}</p>
                <p className="text-slate-600 leading-relaxed text-base whitespace-pre-line">{mentor.bio}</p>
              </div>

              {/* Trilhas */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  Trilhas de Mentoria
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {mentor.trilhas.map((t) => (
                    <div key={t} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-2xl">{TRILHA_ICONS[t]}</span>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{TRILHA_LABELS[t]}</div>
                        <div className="text-xs text-slate-500">Encontros individuais • 50 min cada</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Programas Estruturados */}
              {programs.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-600" />
                    Programas Estruturados
                  </h2>
                  <div className="space-y-4">
                    {programs.map((prog) => (
                      <div
                        key={prog.id}
                        className="p-5 border border-slate-200 rounded-xl hover:border-amber-400 transition-all bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                              {TRILHA_LABELS[prog.trilha]}
                            </span>
                            <span className="text-xs text-slate-500">{prog.duration}</span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base">{prog.title}</h3>
                          <p className="text-slate-600 text-sm mt-1">{prog.description}</p>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <div className="text-lg font-extrabold text-slate-900">
                            R$ {prog.price.toFixed(2)}
                          </div>
                          <Link
                            to={`/mentoria/checkout/${mentor.id}?programId=${prog.id}`}
                            className="inline-flex items-center gap-1.5 mt-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                          >
                            Matricular-se <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
