import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Archive, Star, Eye, Search, Loader2, Sparkles, BookOpen, Users } from 'lucide-react'
import {
  type Mentor,
  type MentoringProgram,
  type MentoringTrilha,
  TRILHA_LABELS,
  TRILHA_ICONS,
} from '../../types/mentoring'
import {
  getMentors,
  saveMentor,
  archiveMentor,
  getPrograms,
  saveProgram,
  archiveProgram,
  INITIAL_OFFICIAL_MENTOR,
  INITIAL_OFFICIAL_PROGRAM,
} from '../../services/mentoring'
import { useToast } from '../../context/ToastContext'

const TRILHAS_OPTIONS: MentoringTrilha[] = ['familia', 'lideranca', 'financas', 'espiritual', 'kids']

export default function AdminMentoring() {
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<'mentores' | 'programas'>('mentores')

  // Estado dos Mentores
  const [mentores, setMentores] = useState<Mentor[]>([])
  const [loadingMentores, setLoadingMentores] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroTrilha, setFiltroTrilha] = useState<MentoringTrilha | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [editando, setEditando] = useState<Mentor | null>(null)

  // Estado dos Programas
  const [programas, setProgramas] = useState<MentoringProgram[]>([])
  const [loadingProgramas, setLoadingProgramas] = useState(true)
  const [showProgramForm, setShowProgramForm] = useState(false)
  const [editandoPrograma, setEditandoPrograma] = useState<MentoringProgram | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    bio: '',
    specialty: '',
    trilhas: [] as MentoringTrilha[],
    available: true,
    status: 'published' as 'draft' | 'published' | 'archived',
  })

  const [programFormData, setProgramFormData] = useState({
    mentorId: '',
    trilha: 'lideranca' as MentoringTrilha,
    title: '',
    description: '',
    objective: '',
    duration: '12 semanas',
    totalSessions: 12,
    price: 599,
    status: 'published' as 'draft' | 'published' | 'archived',
    targetAudience: '',
  })

  // Carrega mentores do Firestore
  const carregarMentores = useCallback(async () => {
    try {
      setLoadingMentores(true)
      const data = await getMentors(false)
      setMentores(data)
    } catch (err) {
      console.error(err)
      addToast('Erro ao carregar mentores do Firestore.', 'error')
    } finally {
      setLoadingMentores(false)
    }
  }, [addToast])

  // Carrega programas do Firestore
  const carregarProgramas = useCallback(async () => {
    try {
      setLoadingProgramas(true)
      const data = await getPrograms(false)
      setProgramas(data)
    } catch (err) {
      console.error(err)
      addToast('Erro ao carregar programas do Firestore.', 'error')
    } finally {
      setLoadingProgramas(false)
    }
  }, [addToast])

  useEffect(() => {
    carregarMentores()
    carregarProgramas()
  }, [carregarMentores, carregarProgramas])

  // Inicializa o mentor e programa oficial se o banco estiver vazio
  const handleInicializarOficial = async () => {
    if (!confirm('Deseja cadastrar o Pr. Alexandre Gomes da Costa como primeiro mentor oficial?')) return
    try {
      setSalvando(true)
      const mentorId = await saveMentor(INITIAL_OFFICIAL_MENTOR)
      await saveProgram({
        ...INITIAL_OFFICIAL_PROGRAM,
        mentorId,
      })
      addToast('Mentor e programa oficial inicializados com sucesso!', 'success')
      await carregarMentores()
      await carregarProgramas()
    } catch (err) {
      console.error(err)
      addToast('Erro ao inicializar mentor oficial.', 'error')
    } finally {
      setSalvando(false)
    }
  }

  const mentoresFiltrados = mentores.filter((m) => {
    const matchBusca =
      m.name.toLowerCase().includes(busca.toLowerCase()) ||
      m.specialty.toLowerCase().includes(busca.toLowerCase())
    const matchTrilha = filtroTrilha === 'all' || m.trilhas.includes(filtroTrilha)
    return matchBusca && matchTrilha
  })

  const handleNovoMentor = () => {
    setEditando(null)
    setFormData({
      name: '',
      photo: '/alexandre-gomes-costa.jpg',
      bio: '',
      specialty: '',
      trilhas: ['lideranca'],
      available: true,
      status: 'published',
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
      status: mentor.status || 'published',
    })
    setShowForm(true)
  }

  const handleArquivarMentor = async (id: string) => {
    if (!confirm('Deseja realmente arquivar este mentor? Ele não aparecerá no catálogo público.')) return
    try {
      await archiveMentor(id)
      addToast('Mentor arquivado com sucesso.', 'info')
      await carregarMentores()
    } catch (err) {
      console.error(err)
      addToast('Erro ao arquivar mentor.', 'error')
    }
  }

  const handleSalvarMentor = async () => {
    if (!formData.name.trim() || !formData.specialty.trim()) {
      addToast('Preencha ao menos o nome e a especialidade do mentor.', 'error')
      return
    }

    try {
      setSalvando(true)
      await saveMentor(formData, editando?.id)
      addToast(editando ? 'Mentor atualizado com sucesso!' : 'Mentor cadastrado com sucesso!', 'success')
      setShowForm(false)
      setEditando(null)
      await carregarMentores()
    } catch (err) {
      console.error(err)
      addToast('Erro ao salvar mentor no Firestore.', 'error')
    } finally {
      setSalvando(false)
    }
  }

  const handleNovoPrograma = () => {
    setEditandoPrograma(null)
    setProgramFormData({
      mentorId: mentores[0]?.id || '',
      trilha: 'lideranca',
      title: '',
      description: '',
      objective: '',
      duration: '12 semanas',
      totalSessions: 12,
      price: 599,
      status: 'published',
      targetAudience: '',
    })
    setShowProgramForm(true)
  }

  const handleEditarPrograma = (prog: MentoringProgram) => {
    setEditandoPrograma(prog)
    setProgramFormData({
      mentorId: prog.mentorId,
      trilha: prog.trilha,
      title: prog.title,
      description: prog.description,
      objective: prog.objective,
      duration: prog.duration,
      totalSessions: prog.totalSessions,
      price: prog.price,
      status: prog.status || 'published',
      targetAudience: prog.targetAudience,
    })
    setShowProgramForm(true)
  }

  const handleSalvarPrograma = async () => {
    if (!programFormData.title.trim() || !programFormData.mentorId) {
      addToast('Informe o título do programa e selecione um mentor.', 'error')
      return
    }

    try {
      setSalvando(true)
      await saveProgram(
        {
          ...programFormData,
          modules: editandoPrograma?.modules || [],
          materials: editandoPrograma?.materials || ['Apostila Digital', 'Plano de Ação'],
          prerequisites: editandoPrograma?.prerequisites || [],
          highlights: editandoPrograma?.highlights || [],
        },
        editandoPrograma?.id,
      )
      addToast(editandoPrograma ? 'Programa atualizado!' : 'Programa criado!', 'success')
      setShowProgramForm(false)
      setEditandoPrograma(null)
      await carregarProgramas()
    } catch (err) {
      console.error(err)
      addToast('Erro ao salvar programa.', 'error')
    } finally {
      setSalvando(false)
    }
  }

  const handleArquivarPrograma = async (id: string) => {
    if (!confirm('Deseja realmente arquivar este programa?')) return
    try {
      await archiveProgram(id)
      addToast('Programa arquivado.', 'info')
      await carregarProgramas()
    } catch (err) {
      console.error(err)
      addToast('Erro ao arquivar programa.', 'error')
    }
  }

  const toggleTrilha = (trilha: MentoringTrilha) => {
    setFormData((prev) => ({
      ...prev,
      trilhas: prev.trilhas.includes(trilha)
        ? prev.trilhas.filter((t) => t !== trilha)
        : [...prev.trilhas, trilha],
    }))
  }

  return (
    <div>
      {/* Header com Abas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mentoria</h1>
          <p className="text-slate-500 mt-1">Gerencie mentores oficiais, programas estruturados e disponibilidade</p>
        </div>
        <div className="flex items-center gap-3">
          {mentores.length === 0 && !loadingMentores && (
            <button
              onClick={handleInicializarOficial}
              disabled={salvando}
              className="bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 rounded-xl font-semibold hover:bg-amber-200 transition-all flex items-center gap-2 text-sm shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-amber-600" /> Inicializar Pr. Alexandre
            </button>
          )}
          {activeTab === 'mentores' ? (
            <button
              onClick={handleNovoMentor}
              className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl font-semibold hover:bg-amber-400 transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus className="h-5 w-5" /> Novo Mentor
            </button>
          ) : (
            <button
              onClick={handleNovoPrograma}
              className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl font-semibold hover:bg-amber-400 transition-all flex items-center gap-2 shadow-sm"
            >
              <Plus className="h-5 w-5" /> Novo Programa
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('mentores')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'mentores'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="h-4 w-4" /> Mentores ({mentores.length})
        </button>
        <button
          onClick={() => setActiveTab('programas')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'programas'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="h-4 w-4" /> Programas Estruturados ({programas.length})
        </button>
      </div>

      {/* Visão de Mentores */}
      {activeTab === 'mentores' && (
        <>
          {/* Filtros */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar mentor por nome ou especialidade..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
              <select
                value={filtroTrilha}
                onChange={(e) => setFiltroTrilha(e.target.value as MentoringTrilha | 'all')}
                className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="all">Todas as trilhas</option>
                {TRILHAS_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {TRILHA_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="text-2xl font-bold text-amber-600">{mentores.length}</div>
              <div className="text-sm text-slate-500">Total de Mentores</div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="text-2xl font-bold text-green-600">
                {mentores.filter((m) => m.available && m.status === 'published').length}
              </div>
              <div className="text-sm text-slate-500">Publicados & Ativos</div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mentores.reduce((a, m) => a + (m.sessionCount || 0), 0)}
              </div>
              <div className="text-sm text-slate-500">Sessões Realizadas</div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {mentores.reduce((a, m) => a + (m.reviewCount || 0), 0)}
              </div>
              <div className="text-sm text-slate-500">Avaliações</div>
            </div>
          </div>

          {/* Lista de Mentores */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {loadingMentores ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                <p className="text-sm font-medium">Carregando mentores do Firestore...</p>
              </div>
            ) : mentoresFiltrados.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p className="font-semibold text-lg text-slate-700">Nenhum mentor encontrado.</p>
                <p className="text-sm mt-1">Clique em "Inicializar Pr. Alexandre" ou "Novo Mentor" para começar.</p>
              </div>
            ) : (
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
                    {mentoresFiltrados.map((mentor) => (
                      <tr key={mentor.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={mentor.photo || '/alexandre-gomes-costa.jpg'}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-semibold text-slate-900 text-sm">{mentor.name}</div>
                              <div className="text-xs text-slate-500">{mentor.specialty}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap">
                            {mentor.trilhas.map((t) => (
                              <span
                                key={t}
                                className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full"
                              >
                                {TRILHA_ICONS[t]}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-amber-500 fill-current" />
                            <span className="text-sm font-medium">{mentor.rating ?? 5.0}</span>
                            <span className="text-xs text-slate-400">({mentor.reviewCount ?? 0})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {mentor.sessionCount ?? 0}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${
                              mentor.status === 'archived'
                                ? 'bg-red-100 text-red-700'
                                : mentor.available
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {mentor.status === 'archived'
                              ? 'Arquivado'
                              : mentor.available
                                ? 'Publicado'
                                : 'Indisponível'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <Link
                              to={`/mentoria/mentor/${mentor.id}`}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Visualizar Página Pública"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleEditar(mentor)}
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleArquivarMentor(mentor.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Arquivar Mentor"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Visão de Programas */}
      {activeTab === 'programas' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loadingProgramas ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              <p className="text-sm font-medium">Carregando programas estruturados...</p>
            </div>
          ) : programas.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="font-semibold text-lg text-slate-700">Nenhum programa cadastrado.</p>
              <p className="text-sm mt-1">Crie programas completos com módulos e valores para venda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Programa</th>
                    <th className="px-6 py-4">Trilha</th>
                    <th className="px-6 py-4">Duração / Sessões</th>
                    <th className="px-6 py-4">Preço</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {programas.map((prog) => (
                    <tr key={prog.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 text-sm">{prog.title}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{prog.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                          {TRILHA_LABELS[prog.trilha]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {prog.duration} ({prog.totalSessions} sessões)
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        R$ {prog.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            prog.status === 'published'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {prog.status === 'published' ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleEditarPrograma(prog)}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleArquivarPrograma(prog.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Arquivar Programa"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Form Mentor */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Ex: Pr. Alexandre Gomes da Costa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Foto (URL ou caminho local)</label>
                <input
                  type="text"
                  value={formData.photo}
                  onChange={(e) => setFormData((prev) => ({ ...prev, photo: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="/alexandre-gomes-costa.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Especialidade</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData((prev) => ({ ...prev, specialty: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Ex: Liderança Ministerial e Vida Espiritual"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio / Histórico</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                  placeholder="Histórico ministerial comprovado..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Trilhas de Atuação</label>
                <div className="flex flex-wrap gap-2">
                  {TRILHAS_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTrilha(t)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        formData.trilhas.includes(t)
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {TRILHA_ICONS[t]} {TRILHA_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData((prev) => ({ ...prev, available: e.target.checked }))}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="available" className="text-sm font-medium text-slate-700">
                  Disponível para receber novos mentorados
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditando(null)
                }}
                disabled={salvando}
                className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-xl font-semibold hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarMentor}
                disabled={salvando}
                className="flex-1 bg-amber-500 text-slate-950 py-2 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
              >
                {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
                {editando ? 'Salvar Alterações' : 'Criar Mentor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Programa */}
      {showProgramForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {editandoPrograma ? 'Editar Programa' : 'Novo Programa Estruturado'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mentor Responsável</label>
                <select
                  value={programFormData.mentorId}
                  onChange={(e) => setProgramFormData((prev) => ({ ...prev, mentorId: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="">Selecione um mentor...</option>
                  {mentores.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título do Programa</label>
                <input
                  type="text"
                  value={programFormData.title}
                  onChange={(e) => setProgramFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Ex: Liderança Cristã: Do Chamado à Prática"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trilha</label>
                <select
                  value={programFormData.trilha}
                  onChange={(e) =>
                    setProgramFormData((prev) => ({ ...prev, trilha: e.target.value as MentoringTrilha }))
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  {TRILHAS_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {TRILHA_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duração</label>
                  <input
                    type="text"
                    value={programFormData.duration}
                    onChange={(e) => setProgramFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="12 semanas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    value={programFormData.price}
                    onChange={(e) =>
                      setProgramFormData((prev) => ({ ...prev, price: Number(e.target.value) }))
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    placeholder="599"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <textarea
                  value={programFormData.description}
                  onChange={(e) => setProgramFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                  placeholder="Resumo do programa..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => {
                  setShowProgramForm(false)
                  setEditandoPrograma(null)
                }}
                disabled={salvando}
                className="flex-1 border border-slate-200 text-slate-700 py-2 rounded-xl font-semibold hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarPrograma}
                disabled={salvando}
                className="flex-1 bg-amber-500 text-slate-950 py-2 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
              >
                {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
                {editandoPrograma ? 'Salvar Alterações' : 'Criar Programa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
