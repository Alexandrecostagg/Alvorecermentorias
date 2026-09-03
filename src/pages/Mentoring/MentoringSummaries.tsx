import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, FileText, Calendar, Sparkles, Download, ChevronDown, ChevronUp, ArrowRight, Loader2 } from 'lucide-react'
import { TRILHA_LABELS, TRILHA_ICONS, TRILHA_COLORS, type SessionSummary } from '../../types/mentoring'

interface MentorData {
  id: string
  name: string
  photo: string
  specialty: string
}

const MENTORES_MOCK: Record<string, MentorData> = {
  '1': { id: '1', name: 'Pr. Alexandre Gosta', photo: '/alexandre-gomes-costa.jpg', specialty: 'Liderança e Propósito' },
  '3': { id: '3', name: 'Carlos Eduardo Lima', photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', specialty: 'Finanças e Generosidade' },
}

const MOCK_SUMMARIES: SessionSummary[] = [
  {
    id: '1',
    sessionId: '3',
    mentorId: '1',
    menteeId: 'user-1',
    trilha: 'lideranca',
    date: '2026-08-25',
    title: 'Dons Espirituais e Liderança',
    keyPoints: [
      'Identificação dos dons espirituais pessoais',
      'Diferença entre dons e talentos naturais',
      'Como exercer liderança servil na igreja',
      'A importância da oração no ministério',
    ],
    actionItems: [
      'Fazer teste de dons espirituais',
      'Ler 1 Coríntios 12 e Romanos 12',
      'Agendar reunião com o líder da célula',
    ],
    nextSteps: [
      'Próxima sessão: Avaliação do teste de dons',
      'Estudo em grupo sobre dons na semana seguinte',
    ],
    generatedAt: '2026-08-25T16:30:00',
  },
  {
    id: '2',
    sessionId: '4',
    mentorId: '3',
    menteeId: 'user-1',
    trilha: 'financas',
    date: '2026-08-20',
    title: 'Princípios Bíblicos de Finanças',
    keyPoints: [
      'O princípio do dízimo no Antigo e Novo Testamento',
      'Ofertas voluntárias e generosidade',
      'Planejamento financeiro segundo a Bíblia',
      'Evitar as armadilhas do materialismo',
    ],
    actionItems: [
      'Criar planilha de controle financeiro',
      'Definir valor fixo para dízimo mensal',
      'Pesquisar sobre investimentos éticos',
    ],
    nextSteps: [
      'Próxima sessão: Plano financeiro personalizado',
      'Leitura: Malaquias 3:10 e 2 Coríntios 9:6-8',
    ],
    generatedAt: '2026-08-20T16:45:00',
  },
  {
    id: '3',
    sessionId: '5',
    mentorId: '1',
    menteeId: 'user-1',
    trilha: 'espiritual',
    date: '2026-08-15',
    title: 'Vida de Oração e Comunhão',
    keyPoints: [
      'A importância da disciplina diária de oração',
      'Tipos de oração: adoração, intercessão, ação de graças',
      'Como ouvir a voz de Deus',
      'Jejum e oração: quando e como praticar',
    ],
    actionItems: [
      'Estabelecer horário fixo de oração diária',
      'Manter um diário de oração',
      'Praticar jejum de 24h uma vez por mês',
    ],
    nextSteps: [
      'Próxima sessão: Relato da experiência de oração',
      'Compartilhar aprendizados na célula',
    ],
    generatedAt: '2026-08-15T16:20:00',
  },
]

function SummaryCard({ summary }: { summary: SessionSummary }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const mentor = MENTORES_MOCK[summary.mentorId]

  const date = new Date(summary.date + 'T12:00:00')
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="card overflow-hidden">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${TRILHA_COLORS[summary.trilha]} flex items-center justify-center text-white text-xl flex-shrink-0`}>
            {TRILHA_ICONS[summary.trilha]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-alvorecer-gold bg-alvorecer-gold/10 px-2 py-0.5 rounded-full">
                {TRILHA_LABELS[summary.trilha]}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Gerado por IA
              </span>
            </div>
            <h2 className="font-bold text-slate-900 mb-1">{summary.title}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              {mentor && (
                <span className="flex items-center gap-1">
                  <img src={mentor.photo} alt="" className="w-4 h-4 rounded-full" />
                  {mentor.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-600 line-clamp-2">
            <span className="font-medium">Pontos-chave:</span> {summary.keyPoints.slice(0, 2).join('; ')}...
          </p>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 flex items-center gap-1 text-sm font-medium text-alvorecer-gold hover:underline"
        >
          {isExpanded ? 'Recolher' : 'Ver resumo completo'}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-slate-50 p-6 border-t border-slate-100">
          {/* Key Points */}
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-lg">📌</span> Pontos-Chave
            </h3>
            <ul className="space-y-2">
              {summary.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 bg-alvorecer-gold rounded-full mt-1.5 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Items */}
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-lg">✅</span> Ações a Tomar
            </h3>
            <ul className="space-y-2">
              {summary.actionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="w-5 h-5 border border-slate-300 rounded flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Next Steps */}
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-lg">➡️</span> Próximos Passos
            </h3>
            <ul className="space-y-2">
              {summary.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <ArrowRight className="h-4 w-4 text-alvorecer-gold mt-0.5 flex-shrink-0" />
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button className="flex-1 border border-slate-200 text-slate-700 py-2 px-4 rounded-xl text-sm font-semibold hover:bg-white transition-all flex items-center justify-center gap-2">
              <Download className="h-4 w-4" /> Baixar PDF
            </button>
            <Link
              to={`/mentoria/avaliar/${summary.sessionId}`}
              className="flex-1 bg-alvorecer-gold text-slate-900 py-2 px-4 rounded-xl text-sm font-semibold hover:bg-alvorecer-gold/90 transition-all text-center"
            >
              Avaliar Sessão
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MentoringSummaries() {
  const [summaries] = useState(MOCK_SUMMARIES)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateAll = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-6 w-6 text-alvorecer-gold" />
                Resumos de Sessões
              </h1>
              <p className="text-slate-500 mt-1">Resumos gerados automaticamente por IA para cada sessão</p>
            </div>
            <button
              onClick={handleGenerateAll}
              disabled={isGenerating}
              className="bg-alvorecer-gold text-slate-900 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-alvorecer-gold/90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Gerar Todos
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/mentoria" className="hover:text-alvorecer-gold transition-colors">Mentoria</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/mentoria/dashboard" className="hover:text-alvorecer-gold transition-colors">Dashboard</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 font-medium">Resumos</span>
        </nav>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-alvorecer-gold">{summaries.length}</div>
            <div className="text-sm text-slate-500">Resumos gerados</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {summaries.reduce((acc, s) => acc + s.keyPoints.length, 0)}
            </div>
            <div className="text-sm text-slate-500">Pontos-chave</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {summaries.reduce((acc, s) => acc + s.actionItems.length, 0)}
            </div>
            <div className="text-sm text-slate-500">Ações a tomar</div>
          </div>
        </div>

        {/* Summaries List */}
        <div className="space-y-4">
          {summaries.length > 0 ? (
            summaries.map(summary => (
              <SummaryCard key={summary.id} summary={summary} />
            ))
          ) : (
            <div className="card p-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Nenhum resumo ainda</h3>
              <p className="text-sm text-slate-500">
                Complete algumas sessões de mentoria para gerar resumos automáticos
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 card p-4 bg-alvorecer-gold/5 border border-alvorecer-gold/20">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-alvorecer-gold mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Sobre os Resumos com IA</h3>
              <p className="text-xs text-slate-600 mt-1">
                Os resumos são gerados automaticamente após cada sessão, identificando pontos-chave,
                ações a tomar e próximos passos. Você pode baixar em PDF e acompanhar seu progresso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
