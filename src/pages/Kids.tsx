import { useMemo, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import kidsData from '@/data/kids'
import { Filter } from 'lucide-react'

const ageRanges = ['0-2', '3-5', '6-8', '9-12'] as const
const categories = ['Livros', 'Brincar & Aprender', 'Louvor', 'Decoração'] as const

export default function Kids() {
  const [q, setQ] = useState('')
  const [age, setAge] = useState<string>('')
  const [cat, setCat] = useState<string>('')

  const list = useMemo(() => {
    return kidsData.filter(
      (p) =>
        (age ? p.ageRange === age : true) &&
        (cat ? p.category === cat : true) &&
        (q ? p.title.toLowerCase().includes(q.toLowerCase()) : true)
    )
  }, [q, age, cat])

  return (
    <div className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Kids — Produtos exclusivos para crianças</h1>
          <p className="text-slate-600 mt-1">Materiais com linguagem e design pensados para cada fase da infância.</p>
        </header>

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-slate-50">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por nome..."
                className="w-full bg-transparent outline-none"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-slate-50">
              <Filter className="h-4 w-4" />
              <select value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-transparent outline-none">
                <option value="">Faixa etária</option>
                {ageRanges.map((a) => (
                  <option key={a} value={a}>
                    {a} anos
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 bg-slate-50">
              <Filter className="h-4 w-4" />
              <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full bg-transparent outline-none">
                <option value="">Categoria</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={(prod) => console.log('add to cart', prod)} />
          ))}
        </div>

        {list.length === 0 && <div className="text-center py-16 text-slate-500">Nenhum item encontrado com esses filtros.</div>}
      </div>
    </div>
  )
}
