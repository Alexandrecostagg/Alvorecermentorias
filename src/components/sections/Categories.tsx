import { ArrowUpRight, Baby, BookOpen, Compass, HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'

const paths = [
  {
    title: 'Livros & Devocionais',
    desc: 'Leituras selecionadas para aprofundar sua fé e renovar sua rotina com Deus.',
    icon: BookOpen,
    href: '/loja',
    accent: 'bg-[#E8F0EC] text-[#2F6650]',
    number: '01',
  },
  {
    title: 'Recursos para crescer',
    desc: 'Materiais práticos para vida cristã, família, liderança e ministério.',
    icon: Compass,
    href: '/loja',
    accent: 'bg-[#F8ECD0] text-[#9A6B0B]',
    number: '02',
  },
  {
    title: 'Alvorecer Kids',
    desc: 'Conteúdos que ajudam os pequenos a descobrir a fé de forma leve e significativa.',
    icon: Baby,
    href: '/kids',
    accent: 'bg-[#E8EFF8] text-[#315E91]',
    number: '03',
  },
  {
    title: 'Caminhe conosco',
    desc: 'Conheça a visão da Alvorecer e encontre um próximo passo para sua jornada.',
    icon: HeartHandshake,
    href: '/sobre',
    accent: 'bg-[#F5E8E2] text-[#9B513B]',
    number: '04',
  },
]

export default function Categories() {
  return (
    <section className="bg-[#F8F5EE] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A97916]">Encontre seu próximo passo</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 md:text-5xl">Uma jornada, vários caminhos.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600 md:justify-self-end">
            A Alvorecer reúne conteúdo e recursos para diferentes momentos da vida, sempre com profundidade bíblica e aplicação prática.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paths.map(({ title, desc, icon: Icon, href, accent, number }) => (
            <Link
              key={title}
              to={href}
              className="group relative flex min-h-72 flex-col overflow-hidden rounded-3xl border border-[#E8E1D4] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D7A93E]/50 hover:shadow-xl hover:shadow-slate-900/5"
            >
              <span className="absolute right-5 top-4 font-serif text-5xl font-bold text-slate-100 transition group-hover:text-[#F4C048]/20">{number}</span>
              <span className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="relative mt-10 font-serif text-xl font-bold text-slate-950">{title}</h3>
              <p className="relative mt-3 flex-1 text-sm leading-6 text-slate-600">{desc}</p>
              <span className="relative mt-7 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                Explorar
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
