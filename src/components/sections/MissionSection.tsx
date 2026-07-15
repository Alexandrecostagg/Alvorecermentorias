import { ArrowRight, Quote } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MissionSection() {
  return (
    <section className="bg-[#0B172A] py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -left-4 -top-4 h-24 w-24 rounded-tl-[2rem] border-l-2 border-t-2 border-[#F4C048]" aria-hidden="true" />
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-800">
            <img
              src="/alexandre-gomes-costa.jpg"
              alt="Alexandre Costa durante uma ministração"
              className="h-full w-full object-cover object-[50%_30%]"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -right-3 max-w-[260px] rounded-2xl bg-[#F4C048] p-5 text-slate-950 shadow-xl sm:-right-8">
            <Quote className="h-6 w-6" />
            <p className="mt-2 font-serif font-bold leading-6">Uma fé que alcança a mente, o coração e a vida.</p>
          </div>
        </div>

        <div className="lg:pl-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F4C048]">Mais que uma plataforma</p>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl font-bold leading-tight md:text-5xl">Um lugar para começar de novo, crescer e servir com propósito.</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A Alvorecer nasceu para tornar o conhecimento bíblico acessível, aplicável e presente na rotina. Cada conteúdo é um convite para amadurecer na fé e transformar aquilo que você vive.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/sobre" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-slate-950 transition hover:bg-[#F4C048]">
              Conheça a Alvorecer <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/contato" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 font-semibold transition hover:bg-white/10">
              Fale com nossa equipe
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
