import { Baby, BookOpen, Heart, Music2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const cards = [
  { title: 'Devocionais', desc: 'Leituras diárias para fortalecer sua fé.', icon: Heart, href: '/courses' },
  { title: 'Cursos', desc: 'Trilhas de estudo para ir mais fundo.', icon: BookOpen, href: '/courses' },
  { title: 'Kids', desc: 'Conteúdos e produtos para crianças.', icon: Baby, href: '/kids' },
  { title: 'Louvor', desc: 'Playlists e indicações.', icon: Music2, href: '#' },
]

export default function Categories() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold">Explore por categorias</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ title, desc, icon: Icon, href }) => (
            <Link key={title} to={href} className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition">
              <Icon className="h-6 w-6"/>
              <h3 className="mt-3 font-semibold text-lg">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{desc}</p>
              <div className="mt-4 text-sm font-medium text-slate-900 group-hover:underline">Acessar →</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}