import { Star, Users, Calendar, BookOpen, CheckCircle2, ChevronRight, Play, ArrowRight, Shield, Clock, Award, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const TRILHAS = [
  {
    id: 'familia',
    title: 'Família e Casamento',
    description: 'Fortalecer laços, comunicação e fé em família com base bíblica.',
    icon: '🏠',
    sessions: 8,
    mentors: 3,
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'lideranca',
    title: 'Liderança e Ministério',
    description: 'Desenvolver liderança cristã com propósito, caráter e competência.',
    icon: '🤝',
    sessions: 8,
    mentors: 3,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'financas',
    title: 'Finanças Bíblicas',
    description: 'Administrar recursos com sabedoria, generosidade e planejamento.',
    icon: '💰',
    sessions: 6,
    mentors: 2,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'espiritual',
    title: 'Vida Espiritual',
    description: 'Aprofundar relacionamento com Deus através de práticas devocionais.',
    icon: '✝️',
    sessions: 8,
    mentors: 3,
    color: 'from-purple-500 to-violet-500',
  },
  {
    id: 'kids',
    title: 'Alvorecer Kids',
    description: 'Guiar pais na formação espiritual e emocional dos filhos.',
    icon: '👶',
    sessions: 6,
    mentors: 2,
    color: 'from-pink-500 to-rose-500',
  },
]

const MENTORES_DESTAQUE = [
  {
    name: 'Pr. Alexandre Gosta',
    specialty: 'Liderança e Propósito',
    photo: '/alexandre-gomes-costa.jpg',
    rating: 4.9,
    sessions: 120,
    trilhas: ['Liderança', 'Vida Espiritual'],
  },
  {
    name: 'Ana Beatriz Santos',
    specialty: 'Família e Casamento',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    sessions: 95,
    trilhas: ['Família', 'Kids'],
  },
  {
    name: 'Carlos Eduardo Lima',
    specialty: 'Finanças e Generosidade',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    sessions: 80,
    trilhas: ['Finanças', 'Liderança'],
  },
]

const DEPOIMENTOS = [
  {
    text: 'A mentoria transformou meu casamento. Em 8 semanas, aprendi a comunicar melhor e a orar junto com minha esposa de forma consistente.',
    author: 'Marcos e Julia',
    role: 'Casal — Mentoria Família',
    rating: 5,
  },
  {
    text: 'Nunca achei que pudesse ter um mentor de verdade por um preço tão acessível. O Pr. Alexandre me ajudou a clarear meu propósito de vida.',
    author: 'Pedro Henrique',
    role: 'Jovem — Mentoria Liderança',
    rating: 5,
  },
  {
    text: 'As finanças da minha família mudaram depois das sessões. Conseguimos quitar dívidas e começar a guardar. Tudo com base bíblica.',
    author: 'Família Oliveira',
    role: 'Família — Mentoria Finanças',
    rating: 5,
  },
]

const PLANOS = [
  {
    name: 'Sessão Avulsa',
    price: 'R$ 99',
    period: 'por sessão',
    description: 'Para quem quer experimentar antes de se comprometer.',
    features: [
      '1 sessão individual (50 min)',
      'Videochamada com o mentor',
      'Material de apoio',
      'Agendamento flexível',
    ],
    highlighted: false,
    cta: 'Agendar Sessão',
  },
  {
    name: 'Pack 4 Sessões',
    price: 'R$ 349',
    period: 'por mês',
    description: 'O mais popular para quem quer resultados reais.',
    features: [
      '4 sessões individuais/mês',
      'Videochamada com o mentor',
      'Material exclusivo por sessão',
      'Acompanhamento entre sessões',
      'Portal do mentorado',
      'Suporte por WhatsApp',
    ],
    highlighted: true,
    cta: 'Começar Agora',
  },
  {
    name: 'Clube Alvorecer',
    price: 'R$ 199',
    period: 'por mês',
    description: 'Acesso ilimitado a mentorias em grupo e conteúdo exclusivo.',
    features: [
      'Mentorias em grupo ao vivo',
      'Todas as trilhas disponíveis',
      'Biblioteca de gravações',
      'Comunidade exclusiva',
      'Conteúdo bônus mensal',
      'Certificado de conclusão',
    ],
    highlighted: false,
    cta: 'Entrar no Clube',
  },
]

const COMO_FUNCIONA = [
  {
    step: 1,
    title: 'Escolha sua trilha',
    description: 'Selecione o área da vida que deseja desenvolver: família, liderança, finanças ou vida espiritual.',
    icon: BookOpen,
  },
  {
    step: 2,
    title: 'Conecte-se com um mentor',
    description: 'Escolha entre nossos mentores verificados e agende sua primeira sessão em poucos cliques.',
    icon: Users,
  },
  {
    step: 3,
    title: 'Cresça com acompanhamento',
    description: 'Realize sessões regulares, acompanhe seu progresso e transforme sua vida com base bíblica.',
    icon: Award,
  },
]

const FAQ = [
  {
    question: 'Como funciona a mentoria na Alvorecer?',
    answer: 'A mentoria é um acompanhamento personalizado com um mentor experiente e verificado. Você agenda sessões individuais ou participa de mentorias em grupo, todas com base bíblica e foco em resultados práticos.',
  },
  {
    question: 'As mentorias são presenciais ou online?',
    answer: 'Todas as mentorias são 100% online, por videochamada. Isso permite que você participe de qualquer lugar do Brasil, no horário que melhor funcionar para você.',
  },
  {
    question: 'Preciso ser cristão para participar?',
    answer: 'Nossa mentoria é fundamentada nos princípios bíblicos, mas abrimos espaço para pessoas em diferentes estágios da jornada de fé. O mais importante é a disposição para crescer e aprender.',
  },
  {
    question: 'Como são selecionados os mentores?',
    answer: 'Todos os mentores passam por um processo de seleção que inclui verificação de fé, experiência de vida, competência na área e referências. Só trabalhamos com quem realmente pode fazer a diferença.',
  },
  {
    question: 'Posso trocar de mentor?',
    answer: 'Sim! Se por qualquer motivo a conexão não estiver fluindo, você pode solicitar a troca de mentor sem custo adicional.',
  },
  {
    question: 'Qual a duração de cada sessão?',
    answer: 'Cada sessão individual tem 50 minutos. Mentorias em grupo duram 90 minutos e incluem tempo para perguntas e respostas.',
  },
]

export default function Mentoring() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/5940721/pexels-photo-5940721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Mentoria Bíblica"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alvorecer-gold/20 text-alvorecer-gold text-sm font-semibold mb-6 border border-alvorecer-gold/30">
              <Star className="h-3 w-3 fill-current" /> Mentoria Alvorecer
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Transforme sua vida com <span className="text-alvorecer-gold">orientação bíblica</span> personalizada.
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
              Conecte-se com mentores experientes que vão guiá-lo com sabedoria, fé e prática em cada área da sua vida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/mentoria/catalogo"
                className="bg-alvorecer-gold text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all flex items-center justify-center gap-2"
              >
                Começar Agora <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#como-funciona"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5 fill-current" /> Como Funciona
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-alvorecer-gold" /> Mentores Verificados
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-alvorecer-gold" /> 100% Online
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-alvorecer-gold" /> Base Bíblica
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-alvorecer-gold to-yellow-600 rounded-2xl blur opacity-30 animate-pulse" />
            <div className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="/alexandre-gomes-costa.jpg"
                  alt="Mentor"
                  className="w-14 h-14 rounded-full object-cover border-2 border-alvorecer-gold"
                />
                <div>
                  <h3 className="font-bold text-white">Pr. Alexandre Gosta</h3>
                  <p className="text-sm text-alvorecer-gold">Mentor de Liderança</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar className="h-4 w-4 text-alvorecer-gold" />
                  Próxima sessão: Quinta, 19h
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <BookOpen className="h-4 w-4 text-alvorecer-gold" />
                  Trilha: Liderança e Ministério
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MessageCircle className="h-4 w-4 text-alvorecer-gold" />
                  120 sessões realizadas
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-alvorecer-gold fill-current" />
                  ))}
                  <span className="text-sm text-slate-400 ml-2">4.9 (95 avaliações)</span>
                </div>
              </div>
              <Link
                to="/mentoria/catalogo"
                className="mt-4 w-full bg-alvorecer-gold text-slate-900 py-3 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all flex items-center justify-center gap-2"
              >
                Agendar com este mentor <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alvorecer-gold/10 text-alvorecer-gold text-sm font-semibold mb-4">
              Simples e Prático
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Como funciona a mentoria
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Três passos simples para começar sua jornada de crescimento espiritual e pessoal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {COMO_FUNCIONA.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-alvorecer-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-8 w-8 text-alvorecer-gold" />
                </div>
                <div className="text-sm font-bold text-alvorecer-gold mb-2">Passo {item.step}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trilhas */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alvorecer-gold/10 text-alvorecer-gold text-sm font-semibold mb-4">
              Escolha sua Jornada
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Trilhas de mentoria
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Cada trilha foi desenhada para ajudá-lo a crescer em uma área específica da vida, com acompanhamento personalizado.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRILHAS.map((trilha) => (
              <Link
                key={trilha.id}
                to={`/mentoria/catalogo?trilha=${trilha.id}`}
                className="group card p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${trilha.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {trilha.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-alvorecer-gold transition-colors">
                  {trilha.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                  {trilha.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {trilha.sessions} sessões
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {trilha.mentors} mentores
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-1 text-alvorecer-gold font-semibold text-sm group-hover:gap-2 transition-all">
                  Ver mentores <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mentores em Destaque */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alvorecer-gold/10 text-alvorecer-gold text-sm font-semibold mb-4">
                Nossos Mentores
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Mentores em destaque
              </h2>
            </div>
            <Link
              to="/mentoria/catalogo"
              className="hidden md:flex items-center gap-1 text-alvorecer-gold font-semibold text-sm hover:gap-2 transition-all"
            >
              Ver todos <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {MENTORES_DESTAQUE.map((mentor) => (
              <div key={mentor.name} className="card overflow-hidden hover:shadow-lg transition-all group">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={mentor.photo}
                    alt={mentor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{mentor.name}</h3>
                  <p className="text-alvorecer-gold text-sm font-medium mb-3">{mentor.specialty}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(mentor.rating) ? 'text-alvorecer-gold fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                    <span className="text-sm text-slate-500 ml-2">{mentor.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.trilhas.map((t) => (
                      <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{mentor.sessions} sessões</span>
                    <Link
                      to="/mentoria/catalogo"
                      className="text-alvorecer-gold font-semibold text-sm hover:underline flex items-center gap-1"
                    >
                      Agendar <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/mentoria/catalogo"
              className="inline-flex items-center gap-1 text-alvorecer-gold font-semibold text-sm hover:gap-2 transition-all"
            >
              Ver todos os mentores <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alvorecer-gold/10 text-alvorecer-gold text-sm font-semibold mb-4">
              Depoimentos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Vidas transformadas
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Veja o que nossos mentorados dizem sobre a experiência de mentoria na Alvorecer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {DEPOIMENTOS.map((dep, i) => (
              <div key={i} className="card p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(dep.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-alvorecer-gold fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 italic">
                  "{dep.text}"
                </p>
                <div>
                  <p className="font-bold text-slate-900">{dep.author}</p>
                  <p className="text-sm text-slate-500">{dep.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alvorecer-gold/10 text-alvorecer-gold text-sm font-semibold mb-4">
              Planos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Invista na sua transformação
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Escolha o plano que melhor se encaixa na sua jornada. Todos incluem acesso à plataforma e suporte.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANOS.map((plano) => (
              <div
                key={plano.name}
                className={`card p-8 relative ${plano.highlighted ? 'ring-2 ring-alvorecer-gold shadow-lg scale-105' : ''}`}
              >
                {plano.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-alvorecer-gold text-slate-900 text-xs font-bold rounded-full">
                    MAIS POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plano.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{plano.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">{plano.price}</span>
                  <span className="text-slate-500 text-sm ml-1">/{plano.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plano.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-alvorecer-gold mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/mentoria/catalogo"
                  className={`w-full py-3 rounded-xl font-bold text-center block transition-all ${
                    plano.highlighted
                      ? 'bg-alvorecer-gold text-slate-900 hover:bg-alvorecer-gold/90'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {plano.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alvorecer-gold/10 text-alvorecer-gold text-sm font-semibold mb-4">
              Dúvidas
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Perguntas frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <details key={i} className="card group">
                <summary className="p-6 cursor-pointer font-semibold text-slate-900 flex items-center justify-between list-none">
                  {item.question}
                  <ChevronRight className="h-5 w-5 text-slate-400 group-open:rotate-90 transition-transform shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Shield className="h-12 w-12 text-alvorecer-gold mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para transformar sua vida?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Comece hoje mesmo sua jornada de mentoria. Conecte-se com um mentor, escolha sua trilha e dê o primeiro passo hacia uma vida mais plena com base bíblica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/mentoria/catalogo"
              className="bg-alvorecer-gold text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all inline-flex items-center justify-center gap-2"
            >
              Explorar Mentores <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/contato"
              className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10 inline-flex items-center justify-center gap-2"
            >
              Falar com Suporte
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
