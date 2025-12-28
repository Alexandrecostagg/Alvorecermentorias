import { BookOpenText, PlayCircle, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

const items = [
  { id: 1, title: 'Plano de Leitura: 7 Dias de Gratidão', tag: 'Devocional', image: 'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', icon: BookOpenText },
  { id: 2, title: 'Sermão do Monte: Uma Jornada', tag: 'Curso', image: 'https://images.pexels.com/photos/372326/pexels-photo-372326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', icon: PlayCircle },
  { id: 3, title: 'Guia de Oração para Famílias', tag: 'Material', image: 'https://images.pexels.com/photos/1612461/pexels-photo-1612461.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', icon: FileText },
]

export default function ContentList() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Destaques da Semana</h2>
            <p className="mt-2 text-slate-600">Novos materiais adicionados recentemente.</p>
          </div>
          <Link to="/courses" className="hidden md:inline-flex text-sm font-semibold text-amber-600 hover:text-amber-700">Ver todos os recursos →</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((it) => (
            <div key={it.id} className="group cursor-pointer">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100 mb-4">
                <img src={it.image} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                    <it.icon className="h-3 w-3" /> {it.tag}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-xl text-slate-900 leading-snug group-hover:text-amber-600 transition-colors">
                {it.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                Comece hoje mesmo este estudo transformador para sua vida espiritual.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/courses" className="text-sm font-semibold text-amber-600 hover:text-amber-700">Ver todos os recursos →</Link>
        </div>
      </div>
    </section>
  )
}