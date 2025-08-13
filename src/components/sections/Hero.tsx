import { Play } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Cresça em fé com conteúdos feitos para o seu dia a dia
            </h1>
            <p className="mt-4 text-slate-600 md:text-lg">
              Devocionais, cursos e materiais para sua caminhada com Deus — tudo em um só lugar.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/courses" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-white font-medium shadow hover:opacity-95">
                Começar agora
              </Link>
              <a href="#trailer" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-slate-900 shadow border border-slate-200">
                <Play className="h-4 w-4"/> Ver trailer
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video w-full rounded-2xl bg-white shadow-lg ring-1 ring-slate-200 grid place-items-center">
              <span className="text-slate-400">(Área para imagem/ilustração)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
