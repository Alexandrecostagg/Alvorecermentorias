import { Play, BookOpen, Star, Users, CheckCircle2, ChevronRight, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Mentoring() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section: "Ensino Profundo" (Autoridade Orvalho) */}
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
              <Star className="h-3 w-3 fill-current" /> Escola Alvorecer
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Mergulhe nas <br /><span className="text-alvorecer-gold">Escrituras</span> com profundidade.
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
              Uma plataforma completa de ensino bíblico, com a seriedade teológica que você busca e a flexibilidade que sua rotina precisa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-alvorecer-gold text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-alvorecer-gold/90 transition-all flex items-center justify-center gap-2">
                <Play className="h-5 w-5 fill-current" /> Começar Agora
              </button>
              <button className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center gap-2">
                Ver Planos
              </button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-alvorecer-gold" /> Certificado Incluso
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-alvorecer-gold" /> Acesso 100% Online
              </div>
            </div>
          </div>

          {/* Card Flutuante de Exemplo (Visual Streaming) */}
          <div className="hidden lg:block relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-alvorecer-gold to-yellow-600 rounded-2xl blur opacity-30 animate-pulse" />
            <div className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
              <div className="aspect-video rounded-lg bg-slate-900 mb-4 overflow-hidden relative group">
                <img src="https://images.pexels.com/photos/8373467/pexels-photo-8373467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Curso" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-alvorecer-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer border border-alvorecer-gold/50">
                    <Play className="h-6 w-6 text-alvorecer-gold fill-current" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Módulo 1 • Aula 3</span>
                  <span className="text-alvorecer-gold font-medium">12:45 min</span>
                </div>
                <h3 className="text-xl font-bold text-white">Fundamentos da Fé Cristã</h3>
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-alvorecer-gold rounded-full" />
                </div>
                <p className="text-xs text-slate-400">Progresso atual: 65%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories / Tracks (Netflix Style) */}
      <section className="py-16 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader title="Trilhas de Conhecimento" subtitle="Escolha por onde começar sua jornada" />

          <div className="mt-8 space-y-12">
            <CourseTrack title="Família e Casamento" movies={[101, 102, 103, 104]} />
            <CourseTrack title="Liderança e Ministério" movies={[201, 202, 203, 204]} />
            <CourseTrack title="Teologia Profunda" movies={[301, 302, 303, 304]} />
          </div>
        </div>
      </section>

      {/* Clube Alvorecer (Subscription Model) */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-alvorecer-gold/10 blur-[100px]" />
        <div className="mx-auto max-w-5xl px-4 relative z-10 text-center">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-alvorecer-gold to-yellow-500 mb-8">
            <span className="block px-4 py-1 rounded-full bg-slate-900 text-sm font-bold uppercase tracking-wider text-alvorecer-gold">
              Clube Alvorecer
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Acesso ilimitado a todo o conhecimento.
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Faça parte da nossa comunidade exclusiva. Assine o Clube Alvorecer e tenha acesso a todos os cursos, mentorias ao vivo e materiais extras.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <FeatureCard icon={BookOpen} title="Acervo Completo" desc="+50 cursos e masterclasses liberados imediatamente." />
            <FeatureCard icon={Users} title="Mentorias Ao Vivo" desc="Encontros mensais exclusivos para tirar dúvidas e orar." />
            <FeatureCard icon={Lock} title="Conteúdo Exclusivo" desc="Séries e documentários que você só encontra aqui." />
          </div>

          <button className="mt-12 bg-gradient-to-r from-alvorecer-gold to-yellow-500 text-slate-900 px-12 py-5 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-alvorecer-gold/20">
            Quero Assinar o Clube
          </button>
          <p className="mt-4 text-sm text-slate-500">Cancelamento grátis a qualquer momento.</p>
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 mt-1">{subtitle}</p>
      </div>
      <Link to="/courses" className="text-alvorecer-gold font-semibold text-sm hover:underline flex items-center gap-1">
        Ver todos <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function CourseTrack({ title, movies }: { title: string, movies: number[] }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-alvorecer-gold rounded-full" />
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map(id => (
          <div key={id} className="group relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-all">
            <img
              src={`https://images.pexels.com/photos/${267500 + id}/pexels-photo-${267500 + id}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
              alt="Curso Thumb"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
              <span className="text-xs font-bold text-alvorecer-gold uppercase tracking-wider mb-1 block">Novo Módulo</span>
              <h4 className="text-white font-bold leading-tight">Título do Curso {id}</h4>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity delay-100">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                <Play className="h-5 w-5 fill-current" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-left hover:bg-white/10 transition-colors">
      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-alvorecer-gold mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
