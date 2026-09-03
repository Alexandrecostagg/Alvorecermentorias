import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Star, Search, Filter, Users, Clock, ChevronRight, X } from 'lucide-react'
import { TRILHA_LABELS, TRILHA_ICONS, type MentoringTrilha, type Mentor } from '../../types/mentoring'

const MENTORES_MOCK: Mentor[] = [
  {
    id: '1',
    name: 'Pr. Alexandre Gosta',
    photo: '/alexandre-gomes-costa.jpg',
    bio: 'Pastor e mentor com mais de 15 anos de experiência em liderança ministerial e desenvolvimento de pessoas. Especialista em propósito de vida e liderança cristã.',
    specialty: 'Liderança e Propósito',
    trilhas: ['lideranca', 'espiritual'],
    rating: 4.9,
    reviewCount: 95,
    sessionCount: 120,
    available: true,
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    name: 'Ana Beatriz Santos',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Psicóloga e mentora familiar. Auxilia casais e famílias a fortalecerem vínculos com base em princípios bíblicos de amor e comunicação.',
    specialty: 'Família e Casamento',
    trilhas: ['familia', 'kids'],
    rating: 4.8,
    reviewCount: 78,
    sessionCount: 95,
    available: true,
    createdAt: '2026-02-01',
  },
  {
    id: '3',
    name: 'Carlos Eduardo Lima',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Empresário e consultor financeiro. Transforma a relação das pessoas com o dinheiro através de princípios bíblicos de administração e generosidade.',
    specialty: 'Finanças e Generosidade',
    trilhas: ['financas', 'lideranca'],
    rating: 4.9,
    reviewCount: 62,
    sessionCount: 80,
    available: true,
    createdAt: '2026-01-20',
  },
  {
    id: '4',
    name: 'Maria Clara Oliveira',
    photo: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Coach certificada e mentora de vida espiritual. Acompanha pessoas em processos de crescimento pessoal e espiritual com profundidade e acolhimento.',
    specialty: 'Vida Espiritual',
    trilhas: ['espiritual', 'familia'],
    rating: 4.7,
    reviewCount: 54,
    sessionCount: 70,
    available: true,
    createdAt: '2026-03-01',
  },
  {
    id: '5',
    name: 'João Pedro Mendes',
    photo: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Líder juvenil e mentor de jovens adultos. Especialista em ajudar jovens a encontrarem propósito e direção para a vida.',
    specialty: 'Propósito e Juventude',
    trilhas: ['lideranca', 'espiritual'],
    rating: 4.8,
    reviewCount: 41,
    sessionCount: 55,
    available: true,
    createdAt: '2026-02-15',
  },
  {
    id: '6',
    name: 'Fernanda Costa',
    photo: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Especialista em educação cristã infantil. Desenvolve metodologias para ensinar fé de forma prática e envolvente para crianças.',
    specialty: 'Alvorecer Kids',
    trilhas: ['kids', 'familia'],
    rating: 4.9,
    reviewCount: 38,
    sessionCount: 60,
    available: true,
    createdAt: '2026-03-10',
  },
]

const TRILHAS = Object.keys(TRILHA_LABELS) as MentoringTrilha[]

export default function MentoringCatalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTrilha = searchParams.get('trilha') as MentoringTrilha | null
  const [search, setSearch] = useState('')

  const filteredMentors = MENTORES_MOCK.filter((mentor) => {
    const matchesTrilha = !activeTrilha || mentor.trilhas.includes(activeTrilha)
    const matchesSearch = !search ||
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
            <Link to="/mentoria" className="hover:text-alvorecer-gold transition-colors">Mentoria</Link>
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
      <section className="sticky top-16 z-30 bg-white border-b border-slate-200">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-alvorecer-gold focus:ring-2 focus:ring-alvorecer-gold/20 outline-none transition-all text-sm"
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
                    ? 'bg-alvorecer-gold text-slate-900'
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
                      ? 'bg-alvorecer-gold text-slate-900'
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

        {filteredMentors.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Nenhum mentor encontrado</h3>
            <p className="text-slate-500 mb-6">Tente ajustar os filtros ou busca para encontrar o mentor ideal.</p>
            <button
              onClick={() => { setSearch(''); handleTrilhaFilter(null) }}
              className="text-alvorecer-gold font-semibold hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <Link
                key={mentor.id}
                to={`/mentoria/mentor/${mentor.id}`}
                className="card overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={mentor.photo}
                    alt={mentor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="h-3 w-3 text-alvorecer-gold fill-current" />
                    <span className="text-xs font-semibold text-slate-700">{mentor.rating}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-alvorecer-gold transition-colors">
                    {mentor.name}
                  </h3>
                  <p className="text-alvorecer-gold text-sm font-medium mb-3">{mentor.specialty}</p>

                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {mentor.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.trilhas.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg"
                      >
                        {TRILHA_ICONS[t]} {TRILHA_LABELS[t]}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {mentor.sessionCount} sessões
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-alvorecer-gold fill-current" /> {mentor.reviewCount} avaliações
                      </span>
                    </div>
                    <span className="text-alvorecer-gold font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
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
