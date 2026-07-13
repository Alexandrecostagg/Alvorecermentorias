import { useState, useMemo } from 'react'
import { Search, ChevronDown, Check, Star, ShoppingBag, Heart } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import ProductDetailsModal from '../../components/modals/ProductDetailsModal'
import type { Product } from '../../types'
import { publicMedia } from '../../lib/media'

// Categorias dinâmicas poderiam vir do banco também, mantendo estático por enquanto para simplificar filtros
const CATEGORIES = ['Todos', 'Vida Cristã', 'Teologia', 'Liderança', 'Oração', 'Devocional', 'Família']
const AUTHORS = ['Todos', 'Luciano Subirá', 'Hernandes Dias Lopes', 'Alexandre Costa', 'Escola Orvalho', 'Café com Deus Pai']

export default function StorePage() {
    const { products, loading } = useProducts({ section: 'store' })

    const [selectedCategory, setSelectedCategory] = useState('Todos')
    const [selectedAuthor, setSelectedAuthor] = useState('Todos')
    const [searchQuery, setSearchQuery] = useState('')

    // Manage modal state
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory
            const matchAuth = selectedAuthor === 'Todos' || p.author === selectedAuthor
            const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || (p.author?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
            return matchCat && matchAuth && matchSearch
        })
    }, [products, selectedCategory, selectedAuthor, searchQuery])

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center bg-[#FDFBF7]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alvorecer-gold"></div>
            </div>
        )
    }

    return (
        <div className="bg-[#FDFBF7] min-h-screen font-sans">
            <ProductDetailsModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

            {/* Hero "Boutique" */}
            <div className="bg-[#F4F1EA] border-b border-[#Eae5d8] py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4 tracking-tight">Livraria & Recursos</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed font-light">
                        Uma curadoria de materiais profundos para edificar sua fé e capacitar seu ministério.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">

                {/* Sidebar (Filtros) */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar título ou autor..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-alvorecer-gold text-slate-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-serif text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
                            Categorias <ChevronDown className="h-4 w-4" />
                        </h3>
                        <ul className="space-y-2">
                            {CATEGORIES.map(cat => (
                                <li key={cat}>
                                    <button
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === cat ? 'bg-alvorecer-gold text-white font-medium shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Authors */}
                    <div>
                        <h3 className="font-serif text-lg font-bold text-slate-900 mb-4 border-t border-slate-200 pt-6">Autores</h3>
                        <div className="space-y-2">
                            {AUTHORS.map(auth => (
                                <label key={auth} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedAuthor === auth ? 'bg-slate-900 border-slate-900' : 'border-slate-300 bg-white group-hover:border-slate-400'}`}>
                                        {selectedAuthor === auth && <Check className="h-3 w-3 text-white" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="author"
                                        className="hidden"
                                        checked={selectedAuthor === auth}
                                        onChange={() => setSelectedAuthor(auth)}
                                    />
                                    <span className={`text-sm ${selectedAuthor === auth ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>{auth}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                        <span className="text-slate-500 text-sm">Mostrando <strong>{filteredProducts.length}</strong> resultados</span>
                        <div className="flex items-center gap-4">
                            <select className="bg-transparent border-none text-slate-700 font-medium text-sm focus:ring-0 cursor-pointer">
                                <option>Mais Relevantes</option>
                                <option>Menor Preço</option>
                                <option>Maior Preço</option>
                            </select>
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            <ShoppingBag className="mx-auto h-12 w-12 mb-4 opacity-20" />
                            <p>Nenhum produto encontrado. Verifique se o Admin Seeder foi executado.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onView={() => setSelectedProduct(product)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ProductCard({ product, onView }: any) {
    return (
        <div
            className="group bg-white rounded-sm border border-transparent hover:border-[#Eae5d8] hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={onView}
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F4F1EA]">
                <img src={publicMedia(product.image)} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />

                {product.featured && (
                    <span className="absolute top-0 left-0 bg-slate-900 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1">
                        Destaque
                    </span>
                )}

                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 text-slate-400 hover:text-red-500 shadow-sm">
                    <Heart className="h-5 w-5" />
                </button>

                {/* Overlay Button */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/95 backdrop-blur-sm border-t border-[#Eae5d8]">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onView?.(product)
                        }}
                        className="w-full bg-slate-900 text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-alvorecer-gold transition-colors"
                    >
                        Ver Detalhes
                    </button>
                </div>
            </div>

            <div className="p-5">
                <span className="text-xs text-alvorecer-gold font-bold uppercase tracking-wider mb-1 block">{product.category}</span>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-1 leading-tight group-hover:text-alvorecer-brown transition-colors">{product.title}</h3>
                <p className="text-sm text-slate-500 mb-3 italic">{product.author}</p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-col">
                        {product.originalPrice > 0 && (
                            <span className="text-xs text-slate-400 line-through">R$ {product.originalPrice?.toFixed(2)}</span>
                        )}
                        <span className="text-lg font-bold text-slate-900">R$ {product.price?.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-slate-400">{product.rating}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
