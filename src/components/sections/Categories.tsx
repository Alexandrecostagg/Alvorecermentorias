import { Baby, BookOpen, Heart, Info, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const cards = [
  { title: 'Livros e Devocionais', desc: 'Leituras para fortalecer sua caminhada.', icon: Heart, href: '/loja', color: 'bg-rose-100 text-rose-600' },
  { title: 'Recursos Cristãos', desc: 'Materiais para sua vida e ministério.', icon: BookOpen, href: '/loja', color: 'bg-blue-100 text-blue-600' },
  { title: 'Infantil / Kids', desc: 'Materiais para semear a fé nos pequenos.', icon: Baby, href: '/kids', color: 'bg-amber-100 text-amber-600' },
  { title: 'Nossa História', desc: 'Conheça o propósito da Alvorecer.', icon: Info, href: '/sobre', color: 'bg-purple-100 text-purple-600' },
]

export default function Categories() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Explore por categorias</h2>
          <p className="mt-2 text-slate-600">Encontre o recurso ideal para o seu momento.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ title, desc, icon: Icon, href, color }) => (
            <Link key={title} to={href} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">{desc}</p>

              <div className="flex items-center text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                Acessar <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
