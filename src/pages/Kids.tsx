import { useMemo, useState } from 'react'
import { Filter, Star, Cloud, Sun } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import ProductDetailsModal from '../components/modals/ProductDetailsModal'
import ProductImage from '../components/ui/ProductImage'
import type { Product } from '../types'

const ageRanges = ['0-2', '3-5', '6-8', '9-12'] as const
const categories = ['Livros', 'Brincar & Aprender', 'Louvor', 'Decoração'] as const

export default function Kids() {
  const { products: kidsData, loading } = useProducts({ section: 'kids' })

  const [q, setQ] = useState('')
  const [age, setAge] = useState<string>('')
  const [cat, setCat] = useState<string>('')

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const list = useMemo(() => {
    return kidsData.filter(
      (p) =>
        (age ? p.ageRange === age : true) &&
        (cat ? p.category === cat : true) &&
        (q ? p.title.toLowerCase().includes(q.toLowerCase()) : true)
    )
  }, [kidsData, q, age, cat])

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#E6F3FF]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E6F3FF] relative overflow-hidden font-sans">
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 text-white/40 animate-pulse">
        <Cloud size={64} fill="currentColor" />
      </div>
      <div className="absolute top-40 right-20 text-white/40 animate-pulse delay-700">
        <Cloud size={80} fill="currentColor" />
      </div>

      {/* Organic Hero Section */}
      <section className="relative pt-24 pb-32 bg-sky-400">
        {/* Sun Decoration */}
        <div className="absolute top-10 right-10 text-yellow-300 animate-spin-slow">
          <Sun size={120} fill="currentColor" className="opacity-90" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block bg-white border-4 border-yellow-400 rounded-[2rem] px-8 py-2 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transform -rotate-2">
            <span className="text-xl font-black text-sky-500 tracking-wide">TURMINHA ALVORECER</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.1)] mb-6 tracking-tight leading-tight">
            Descobrindo o Amor <br className="hidden md:block" /> <span className="text-yellow-300">de Deus</span> Brincando!
          </h1>

          <p className="text-xl text-sky-100 font-medium max-w-2xl mx-auto mb-8 bg-sky-500/20 backdrop-blur-sm p-4 rounded-xl border border-sky-300/30">
            Livros, brinquedos e roupas feitos para semear a fé no coração dos pequenos.
          </p>
        </div>

        {/* Grass Divider (SVG Wave) */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#76C043]"></path>
          </svg>
        </div>
      </section>

      {/* Main Content Area with "Dirt/Nature" feel */}
      <div className="relative bg-gradient-to-b from-[#76C043] to-[#5FA032] min-h-[500px] px-4 pb-20 -mt-2">

        {/* Filters Container */}
        <div className="max-w-6xl mx-auto -translate-y-12 relative z-20">
          <div className="bg-white rounded-[2rem] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] border-4 border-[#8BC34A]">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-[#FFF8E1] rounded-xl p-2 border-2 border-yellow-400 flex items-center px-4">
                <span className="text-yellow-600 mr-2">🔍</span>
                <input
                  aria-label="Buscar produtos infantis"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="O que você procura?"
                  className="bg-transparent w-full text-slate-700 font-bold placeholder-slate-400 outline-none"
                />
              </div>

              <div className="bg-[#E3F2FD] rounded-xl p-2 border-2 border-sky-400 flex items-center px-4">
                <Filter className="w-5 h-5 text-sky-500 mr-2" />
                <select aria-label="Filtrar por idade" value={age} onChange={(e) => setAge(e.target.value)} className="bg-transparent w-full text-slate-700 font-bold outline-none cursor-pointer">
                  <option value="">Todas as idades</option>
                  {ageRanges.map((a) => <option key={a} value={a}>{a} anos</option>)}
                </select>
              </div>

              <div className="bg-[#FCE4EC] rounded-xl p-2 border-2 border-pink-400 flex items-center px-4">
                <Star className="w-5 h-5 text-pink-500 mr-2" />
                <select aria-label="Filtrar por categoria" value={cat} onChange={(e) => setCat(e.target.value)} className="bg-transparent w-full text-slate-700 font-bold outline-none cursor-pointer">
                  <option value="">Todas as categorias</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-6xl mx-auto mt-8 relative z-10">
          {list.length === 0 ? (
            <div className="text-center py-20 bg-white/10 rounded-3xl border-4 border-dashed border-white/30 text-white font-bold text-xl">
              Ops! Não encontramos nada com esses filtros. 🌱
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {list.map((p) => (
                <article
                  key={p.id}
                  className="group bg-white rounded-[2rem] p-4 shadow-lg hover:-translate-y-2 transition-transform duration-300 border-b-8 border-r-4 border-slate-200 hover:border-yellow-400"
                >
                  <div className="bg-slate-100 rounded-[1.5rem] overflow-hidden aspect-square mb-4 relative">
                    <ProductImage src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {p.badge && (
                      <span className="absolute top-3 right-3 bg-red-400 text-white text-xs font-black px-3 py-1 rounded-full shadow-md transform rotate-3">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="block text-xs font-extrabold text-sky-500 uppercase tracking-wider mb-1">{p.category}</span>
                    <h3 className="font-black text-slate-800 text-lg leading-tight mb-2 group-hover:text-amber-500 transition-colors">{p.title}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xl font-black text-slate-900">R$ {p.price.toFixed(2)}</span>
                      <button
                        type="button"
                        aria-label={`Ver detalhes de ${p.title}`}
                        onClick={() => setSelectedProduct(p)}
                        className="bg-yellow-400 text-yellow-900 w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md hover:bg-yellow-300 active:scale-95 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Decorative Footer Elements (Flowers/Ants could go here) */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      </div>
    </div>
  )
}
