import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Star, Eye, Search } from 'lucide-react'
import { type Mentor, type MentoringTrilha, TRILHA_LABELS, TRILHA_ICONS } from '../../types/mentoring'

const MENTORES_INICIAIS: Mentor[] = [
  {
    id: '1',
    name: 'Pr. Alexandre Gosta',
    photo: '/alexandre-gomes-costa.jpg',
    bio: 'Pastor há mais de 15 anos, especialista em liderança cristã e vida espiritual. Formado em Teologia pelo Seminário Teológico Batista do Sul, com mestrado em Liderança Ministerial. Já orientou mais de 200 mentorados em sua jornada de fé. Sua paixão é ajudar pessoas a descobrirem seus dons e propósitos em Cristo.',
    specialty: 'Liderança e Propósito',
    trilhas: ['lideranca', 'espiritual', 'financas'],
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
    bio: 'Psicóloga clínica com especialização em Terapia de Casal e Família. Conselheira cristã com 10 anos de experiência. Ajuda casais a construírem relacionamentos saudáveis baseados em princípios bíblicos.',
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
    bio: 'Empresário cristão há 20 anos, consultor financeiro certificado. Especialista em planejamento financeiro bíblico e generosidade estratégica. Sua missão é libertar pessoas da escravidão financeira.',
    specialty: 'Finanças e Generosidade',
    trilhas: ['financas', 'lideranca'],
    rating: 4.9,
    reviewCount: 62,
    sessionCount: 80,
    available: true,
    createdAt: '2026-01-20',
  },
]

const TRILHAS_OPTIONS: MentoringTrilha[] = ['familia', 'lideranca', 'financas', 'espiritual', 'kids']

export default function AdminMentoring() {
  const [mentores, setMentores] = useState(MENTORES_INICIAIS)
  const [busca, setBusca] = useState('')
  const [filtroTrilha, setFiltroTrilha] = useState<MentoringTrilha | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Mentor | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    bio: '',
    specialty: '',
    trilhas: [] as MentoringTrilha[],
    available: true,
  })

  const mentoresFiltrados = mentores.filter(m => {
    const matchBusca = m.name.toLowerCase().includes(busca.toLowerCase()) ||
                       m.specialty.toLowerCase().includes(busca.toLowerCase())
    const matchTrilha = filtroTrilha === 'all' || m.trilhas.includes(filtroTrilha)
    return matchBusca && matchTrilha
  })

  const handleNovoMentor = () => {
    setEditando(null)
    setFormData({
      name: '',
      photo: '',
      bio: '',
      specialty: '',
      trilhas: [],
      available: true,
    })
    setShowForm(true)
  }

  const handleEditar = (mentor: Mentor) => {
    setEditando(mentor)
    setFormData({
      name: mentor.name,
      photo: mentor.photo,
      bio: mentor.bio,
      specialty: mentor.specialty,
      trilhas: mentor.trilhas,
      available: mentor.available,
    })
    setShowForm(true)
  }

  const handleExcluir = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este mentor?')) {
      setMentores(prev => prev.filter(m => m.id !== id))
    }
  }

  const handleSalvar = () => {
    if (!formData.name || !formData.specialty) return

    if (editando) {
      setMentores(prev => prev.map(m =>
        m.id === editando.id
          ? { ...m, ...formData }
          : m
      ))
    } else {
      const novoMentor: Mentor = {
        id: String(Date.now()),
        ...formData,
        rating: 0,
        reviewCount: 0,
        sessionCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setMentores(prev => [...prev, novoMentor])
    }

    setShowForm(false)
    setEditando(null)
  }

  const toggleTrilha = (trilha: MentoringTrilha) => {
    setFormData(prev => ({
      ...prev,
      trilhas: prev.trilhas.includes(trilha)
        ? prev.trilhas.filter(t => t !== trilha)
        : [...prev.trilhas, trilha]
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mentores</h1>
          <p className="text-slate-500 mt-1">Gerencie os mentores da plataforma</p>
        </div>
        <button
          onClick={handleNovoMentor}
          className="bg-alvorecer-gold text-slate-900 px-4 py-2 rounded-xl font-semibold hover:bg-alvorecer-gold/90 transition-all flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Novo Mentor
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar mentor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-alvorecer-gold/50"
            />
          </div>
          <select
            value={filtroTrilha}
            onChange={(e) => setFiltroTrilha(e.target.value as MentoringTrilha | 'all')}
            className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-alvorecer-gold/50"
          >
            <option value="all">Todas as trilhas</option>
            {TRILHAS_OPTIONS.map(t => (
              <option key={t} value={t}>{TRILHA_LABELS[t]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="text-2xl font-bold text-alvorecer-gold">{mentores.length}</div>
          <div className="text-sm text-slate-500">Total de Mentores</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="text-2xl font-bold text-green-600">{mentores.filter(m => m.available).length}</div>
          <div className="text-sm text-slate-500">Disponíveis</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="text-2xl font-bold text-blue-600">{mentores.reduce((a, m) => a + m.sessionCount, 0)}</div>
          <div className="text-sm text-slate-500">Sessões Realizadas</div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="text-2xl font-bold text-purple-600">{mentores.reduce((a, m) => a + m.reviewCount, 0)}</div>
          <div className="text-sm text-slate-500">Avaliações</div>
        </div>
      </div>

      {/* Lista de Mentores */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Mentor</th>
                <th className="px-6 py-4">Trilhas</th>
                <th className="px-6 py-4">Avaliação</th>
                <th className="px-6 py-4">Sessões</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mentoresFiltrados.map(mentor => (
                <tr key={mentor.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={mentor.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{mentor.name}</div>
                        <div className="text-xs text-slate-500">{mentor.specialty}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {mentor.trilhas.map(t => (
                        <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {TRILHA_ICONS[t]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-alvorecer-gold fill-current" />
                      <span className="text-sm font-medium">{mentor.rating}</span>
                      <span className="text-xs text-slate-400">({mentor.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{mentor.sessionCount}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      mentor.available ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {mentor.available ? 'Disponível' : 'Indisponível'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        to={`/mentoria/mentor/${mentor.id}`}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleEditar(mentor)}
                        className="p-2 text-slate-400 hover:text-alvorecer-gold hover:bg-alvorecer-gold/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleExcluir(mentor.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {editando ? 'Editar Mentor' : 'Novo Mentor'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-alvorecer-gold/50"
                  placeholder="Nome do mentor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Foto (URL)</label>
                <input
                  type="text"
                  value={formData.photo}
                  onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-alvorecer-gold/50"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Especialidade</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-alvorecer-gold/50"
                  placeholder="Ex: Liderança e Propósito"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-alvorecer-gold/50 resize-none"
                  placeholder="Sobre o mentor..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Trilhas</label>
                <div className="flex flex-wrap gap-2">
                  {TRILHAS_OPTIONS.map(t => (
                    <button
                      key={t}
                      onClick={() => toggleTrilha(t)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        formData.trilhas.includes(t)
                          ? 'bg-alvorecer-gold text-slate-900'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {TRILHA_ICONS[t]} {TRILHA_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                  className="rounded border-slate-300 text-alvorecer-gold focus:ring-alvorecer-gold"
                />
                <label htmlFor="available" className="text-sm text-slate-700">Disponível para mentorias</label>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => { setShowForm(false); setEditando(null) }}
                className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-xl font-semibold hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvar}
                className="flex-1 bg-alvorecer-gold text-slate-900 py-2 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all"
              >
                {editando ? 'Salvar Alterações' : 'Criar Mentor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
