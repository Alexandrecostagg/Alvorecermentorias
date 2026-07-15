import { ArrowRight, FileText, Package } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import type { Product } from '../../types'
import ProductDetailsModal from '../modals/ProductDetailsModal'
import ProductImage from '../ui/ProductImage'

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function isDigital(product: Product) {
  const type = product.type?.toLocaleLowerCase('pt-BR') ?? ''
  return product.shippingRequired === false || type.includes('digital') || type.includes('ebook') || type.includes('e-book')
}

export default function FeaturedProducts() {
  const { products, loading, error } = useProducts({ section: 'store' })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const featuredProducts = useMemo(
    () => [...products].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, 4),
    [products],
  )

  return (
    <section className="bg-white py-20 md:py-28">
      <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A97916]">Escolhas para sua caminhada</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950 md:text-5xl">Conteúdos em destaque</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Recursos que aproximam conhecimento, prática e transformação.</p>
          </div>
          <Link to="/loja" className="inline-flex items-center gap-2 font-bold text-slate-900 transition hover:text-[#9A6B0B]">
            Ver toda a loja <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {loading ? (
          <div role="status" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <span className="sr-only">Carregando produtos em destaque</span>
            {[0, 1, 2, 3].map((item) => <div key={item} className="h-[430px] animate-pulse rounded-3xl bg-slate-100" />)}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
            Os destaques estão sendo preparados. Você ainda pode acessar todos os produtos na loja.
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
            Novos conteúdos serão publicados em breve.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => {
              const digital = isDigital(product)
              return (
                <article key={product.id} className="group overflow-hidden rounded-3xl border border-[#E8E1D4] bg-[#FDFBF7] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
                  <button type="button" onClick={() => setSelectedProduct(product)} className="block w-full text-left" aria-label={`Ver detalhes de ${product.title}`}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#F1EDE4]">
                      <ProductImage src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur">
                        {digital ? <FileText className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
                        {digital ? 'Digital' : 'Produto físico'}
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#A97916]">{product.category}</p>
                      <h3 className="mt-2 min-h-12 font-serif text-lg font-bold leading-6 text-slate-950">{product.title}</h3>
                      {product.author && <p className="mt-2 truncate text-sm text-slate-500">{product.author}</p>}
                      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                        <strong className="text-lg text-slate-950">{money.format(product.price)}</strong>
                        <span className="text-sm font-bold text-slate-700 transition group-hover:text-[#A97916]">Ver detalhes</span>
                      </div>
                    </div>
                  </button>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
