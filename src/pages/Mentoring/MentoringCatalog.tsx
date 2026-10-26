import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Star, Clock, ChevronRight, X, Users, Loader2 } from 'lucide-react'
import {
  type Mentor,
  type MentoringTrilha,
  TRILHA_LABELS,
  TRILHA_ICONS,
} from '../../types/mentoring'
import { getMentors } from '../../services/mentoring'

const TRILHAS = Object.keys(TRILHA_LABELS) as MentoringTrilha[]

export default function MentoringCatalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTrilha = searchParams.get('trilha') as MentoringTrilha | null
  const [search, setSearch] = useState('')
  const [mentores, setMentores] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true)
        const data = await getMentors(true)
        setMentores(data)
      } catch (err) {
        console.error('Erro ao buscar mentores do Firestore:', err)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  const filteredMentors = mentores.filter((mentor) => {
    const matchesTrilha = !activeTrilha || mentor.trilhas.includes(activeTrilha)
    const matchesSearch =
      !search ||
      mentor.name.toLowerCase().includes(search.toLowerCase()) ||
      mentor.specialty.toLowerCase().includes(search.toLowerCase())
    return matchesTrilha && matchesSearch && mentor.available
  })

  const handleTrilhaFilter = (trilha: MentoringTrilha | null) => {
    if (trilha) {
      setSearchParams({ trilha })
    } else {
      setSearchParams({})
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link to="/mentoria" className="hover:text-amber-600 transition-colors">
              Mentoria
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 font-medium">Catálogo de Mentores</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Encontre seu mentor
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Escolha um mentor verificado e experiente para guiá-lo na área da vida que você deseja desenvolver.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou especialidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Trilha filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <button
                onClick={() => handleTrilhaFilter(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  !activeTrilha
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos
              </button>
              {TRILHAS.map((trilha) => (
                <button
                  key={trilha}
                  onClick={() => handleTrilhaFilter(trilha)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTrilha === trilha
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {TRILHA_ICONS[trilha]} {TRILHA_LABELS[trilha]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{filteredMentors.length}</span> mentor(es) encontrado(s)
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <p className="text-sm font-medium">Carregando catálogo de mentores...</p>
          </div>
        ) : filteredMentors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum mentor disponível no momento</h3>
            <p className="text-slate-500 mb-6">Tente ajustar os filtros ou tente novamente mais tarde.</p>
            {search && (
              <button
                onClick={() => {
                  setSearch('')
                  handleTrilhaFilter(null)
                }}
                className="text-amber-600 font-semibold hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <Link
                key={mentor.id}
                to={`/mentoria/mentor/${mentor.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                  <img
                    src={mentor.photo || '/alexandre-gomes-costa.jpg'}
                    alt={mentor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 text-amber-500 fill-current" />
                    <span className="text-xs font-semibold text-slate-700">{mentor.rating ?? 5.0}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                      {mentor.name}
                    </h3>
                    <p className="text-amber-700 text-sm font-medium mb-3">{mentor.specialty}</p>

                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {mentor.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {mentor.trilhas.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium"
                        >
                          {TRILHA_ICONS[t]} {TRILHA_LABELS[t]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {mentor.sessionCount ?? 0} sessões
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-current" /> {mentor.reviewCount ?? 0} avaliações
                      </span>
                    </div>
                    <span className="text-amber-700 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Perfil <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
