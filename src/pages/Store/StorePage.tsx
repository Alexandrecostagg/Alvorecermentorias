import { useMemo, useState } from 'react'
import { Check, Search, ShoppingBag, SlidersHorizontal, Star, X } from 'lucide-react'
import ProductDetailsModal from '../../components/modals/ProductDetailsModal'
import ProductImage from '../../components/ui/ProductImage'
import { useProducts } from '../../hooks/useProducts'
import type { Product } from '../../types'

type SortOption = 'relevance' | 'price-asc' | 'price-desc'

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export default function StorePage() {
  const { products, loading, error } = useProducts({ section: 'store' })
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedAuthor, setSelectedAuthor] = useState('Todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('relevance')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const categories = useMemo(
    () => ['Todos', ...new Set(products.map((product) => product.category).filter(Boolean))],
    [products],
  )
  const authors = useMemo(
    () => ['Todos', ...new Set(products.map((product) => product.author).filter((author): author is string => Boolean(author)))],
    [products],
  )

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase('pt-BR')
    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
      const matchesAuthor = selectedAuthor === 'Todos' || product.author === selectedAuthor
      const matchesSearch = !normalizedSearch
        || product.title.toLocaleLowerCase('pt-BR').includes(normalizedSearch)
        || product.author?.toLocaleLowerCase('pt-BR').includes(normalizedSearch)

      return matchesCategory && matchesAuthor && Boolean(matchesSearch)
    })

    return [...filtered].sort((first, second) => {
      if (sort === 'price-asc') return first.price - second.price
      if (sort === 'price-desc') return second.price - first.price
      return Number(Boolean(second.featured)) - Number(Boolean(first.featured))
    })
  }, [products, searchQuery, selectedAuthor, selectedCategory, sort])

  const activeFilters = Number(selectedCategory !== 'Todos')
    + Number(selectedAuthor !== 'Todos')
    + Number(Boolean(searchQuery.trim()))

  const clearFilters = () => {
    setSelectedCategory('Todos')
    setSelectedAuthor('Todos')
    setSearchQuery('')
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#FDFBF7]" role="status">
        <span className="sr-only">Carregando produtos</span>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alvorecer-gold" />
      </div>
    )
  }

  return (
    <div className="bg-[#FDFBF7] min-h-screen font-sans">
      <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      <div className="bg-[#F4F1EA] border-b border-[#Eae5d8] py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4 tracking-tight">Livraria & Recursos</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Uma curadoria de materiais para edificar sua fé e capacitar seu ministério.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <button
          type="button"
          aria-expanded={filtersOpen}
          aria-controls="store-filters"
          onClick={() => setFiltersOpen((open) => !open)}
          className="md:hidden w-full mb-6 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filtros {activeFilters > 0 && `(${activeFilters})`}
          </span>
          {filtersOpen ? <X className="h-5 w-5" /> : <SlidersHorizontal className="h-5 w-5" />}
        </button>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          <aside
            id="store-filters"
            className={`${filtersOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 space-y-8 rounded-2xl bg-white md:bg-transparent p-5 md:p-0 border border-slate-200 md:border-0`}
          >
            <div>
              <label htmlFor="store-search" className="block text-sm font-bold text-slate-800 mb-2">Buscar</label>
              <div className="relative">
                <input
                  id="store-search"
                  type="search"
                  placeholder="Título ou autor"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-alvorecer-gold text-slate-700"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <fieldset>
              <legend className="font-serif text-lg font-bold text-slate-900 mb-4">Categorias</legend>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category ? 'bg-alvorecer-gold text-white font-medium shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </fieldset>

            <fieldset className="border-t border-slate-200 pt-6">
              <legend className="font-serif text-lg font-bold text-slate-900 mb-4">Autores</legend>
              <div className="space-y-2">
                {authors.map((author) => (
                  <label key={author} className="flex items-center gap-3 cursor-pointer group">
                    <span className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedAuthor === author ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white group-hover:border-slate-400'}`}>
                      {selectedAuthor === author && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <input
                      type="radio"
                      name="author"
                      className="sr-only"
                      checked={selectedAuthor === author}
                      onChange={() => setSelectedAuthor(author)}
                    />
                    <span className={`text-sm ${selectedAuthor === author ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>{author}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {activeFilters > 0 && (
              <button type="button" onClick={clearFilters} className="text-sm font-semibold text-slate-700 underline underline-offset-4">
                Limpar filtros
              </button>
            )}
          </aside>

          <main className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-200">
              <span className="text-slate-500 text-sm">Mostrando <strong>{visibleProducts.length}</strong> resultados</span>
              <div>
                <label htmlFor="store-sort" className="sr-only">Ordenar produtos</label>
                <select
                  id="store-sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                  className="w-full sm:w-auto bg-white sm:bg-transparent border border-slate-200 sm:border-0 rounded-lg px-3 py-2 text-slate-700 font-medium text-sm cursor-pointer"
                >
                  <option value="relevance">Mais relevantes</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                </select>
              </div>
            </div>

            {error ? (
              <div role="alert" className="text-center py-16 rounded-2xl bg-red-50 text-red-700 px-6">
                Não foi possível carregar os produtos agora. Tente novamente em instantes.
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <ShoppingBag className="mx-auto h-12 w-12 mb-4 opacity-30" />
                <p>Nenhum produto corresponde aos filtros selecionados.</p>
                <button type="button" onClick={clearFilters} className="mt-4 font-semibold underline underline-offset-4">Limpar filtros</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onView={() => setSelectedProduct(product)} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product, onView }: { product: Product; onView: () => void }) {
  return (
    <article className="group bg-white rounded-xl border border-[#Eae5d8] hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F4F1EA]">
        <ProductImage src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        {product.featured && (
          <span className="absolute top-0 left-0 bg-slate-900 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1">Destaque</span>
        )}
      </div>

      <div className="p-5">
        <span className="text-xs text-alvorecer-gold font-bold uppercase tracking-wider mb-1 block">{product.category}</span>
        <h2 className="font-serif text-lg font-bold text-slate-900 mb-1 leading-tight">{product.title}</h2>
        {product.author && <p className="text-sm text-slate-500 mb-3 italic">{product.author}</p>}

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col">
            {Boolean(product.originalPrice && product.originalPrice > 0) && (
              <span className="text-xs text-slate-400 line-through">{money.format(product.originalPrice ?? 0)}</span>
            )}
            <span className="text-lg font-bold text-slate-900">{money.format(product.price)}</span>
          </div>
          {typeof product.rating === 'number' && (
            <div className="flex items-center gap-1 text-amber-400 text-xs" aria-label={`Avaliação ${product.rating} de 5`}>
              <Star className="h-3 w-3 fill-current" />
              <span className="text-slate-500">{product.rating}</span>
            </div>
          )}
        </div>

        <button type="button" onClick={onView} className="mt-5 w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-alvorecer-gold transition-colors">
          Ver detalhes
        </button>
      </div>
    </article>
  )
}
