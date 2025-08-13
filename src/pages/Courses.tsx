import { useMemo, useState } from 'react'
import { BookOpenCheck, Tag } from 'lucide-react'

interface Course {
  id: number
  title: string
  level: 'iniciante'|'intermediário'|'avançado'
  cover: string
  tags: string[]
}

const allCourses: Course[] = [
  { id: 1, title: 'Fundamentos do Evangelho', level: 'iniciante', cover: '/images/course1.jpg', tags: ['Bíblia','Teologia'] },
  { id: 2, title: 'Sermão do Monte na Prática', level: 'intermediário', cover: '/images/course2.jpg', tags: ['Vida Cristã'] },
  { id: 3, title: 'Pentateuco: Panorama', level: 'avançado', cover: '/images/course3.jpg', tags: ['Antigo Testamento'] },
]

export default function Courses() {
  const [level, setLevel] = useState('')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    return allCourses.filter(c =>
      (level ? c.level === level : true) &&
      (q ? c.title.toLowerCase().includes(q.toLowerCase()) : true)
    )
  }, [level, q])

  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        <header>
          <h1 className="text-2xl md:text-3xl font-bold">Cursos</h1>
          <p className="text-slate-600 mt-1">Escolha seu próximo passo.</p>
        </header>

        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar cursos..." className="rounded-xl border border-slate-200 px-3 py-2 bg-white"/>
          <select value={level} onChange={e=>setLevel(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 bg-white">
            <option value="">Todos os níveis</option>
            <option value="iniciante">Iniciante</option>
            <option value="intermediário">Intermediário</option>
            <option value="avançado">Avançado</option>
          </select>
          <button className="rounded-xl bg-slate-900 text-white px-4 py-2 font-medium inline-flex items-center gap-2"><BookOpenCheck className="h-4 w-4"/> Ver Trilhas</button>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(c => (
            <article key={c.id} className="rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-200">
              <div className="aspect-video bg-slate-100">
                <img src={c.cover} alt={c.title} className="h-full w-full object-cover"/>
              </div>
              <div className="p-4">
                <span className="text-[10px] uppercase tracking-wide text-slate-500">{c.level}</span>
                <h3 className="font-semibold mt-1">{c.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                  {c.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1"><Tag className="h-3 w-3"/>{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}