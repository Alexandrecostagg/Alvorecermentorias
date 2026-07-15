import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0B172A] text-white">
      <div className="absolute inset-0 opacity-40" aria-hidden="true">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#D7A93E]/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#1E3856]/80 to-transparent" />
      </div>

      <div className="relative mx-auto grid min-h-[660px] max-w-7xl items-center gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#F4C048]/30 bg-[#F4C048]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#F6CF72]">
            <Sparkles className="h-4 w-4" />
            Fé que amadurece. Propósito que transforma.
          </div>

          <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            Conteúdo bíblico para viver uma fé{' '}
            <span className="text-[#F4C048]">prática todos os dias.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 md:text-xl">
            Livros, recursos e experiências para fortalecer sua caminhada com Deus, sua família e seu chamado.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/loja"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F4C048] px-7 py-4 font-bold text-slate-950 shadow-lg shadow-[#F4C048]/15 transition hover:-translate-y-0.5 hover:bg-[#FFD36B]"
            >
              Explorar conteúdos
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/sobre"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Conheça nossa missão
            </Link>
          </div>

          <div className="mt-10 flex items-start gap-3 border-l-2 border-[#F4C048] pl-4 text-sm leading-6 text-slate-300">
            <BookOpen className="mt-0.5 h-5 w-5 flex-none text-[#F4C048]" />
            <p>Uma curadoria cristã criada para transformar conhecimento em vida.</p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:ml-auto">
          <div className="absolute -inset-4 rounded-[2.5rem] border border-white/10" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-800 shadow-2xl shadow-black/30">
            <img
              src="/alexandre-gomes-costa.jpg"
              alt="Alexandre Costa compartilhando uma mensagem"
              className="h-full w-full object-cover object-[50%_34%]"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091321] via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="max-w-sm font-serif text-xl font-semibold leading-snug sm:text-2xl">
                “Conhecer a verdade é o começo. Vivê-la é a transformação.”
              </p>
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#F4C048]">Alvorecer Mentorias</p>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 rounded-2xl border border-white/10 bg-white px-5 py-4 text-slate-900 shadow-xl sm:-left-8">
            <strong className="block text-2xl font-black text-[#A97916]">Um novo dia</strong>
            <span className="text-sm text-slate-600">para sua caminhada de fé</span>
          </div>
        </div>
      </div>
    </section>
  )
}
