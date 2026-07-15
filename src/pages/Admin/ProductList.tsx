import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { Product } from '../../types' // Make sure Product type exists or define it locally if needed for admin specific fields
import { Edit, Trash2, Plus, Search, PackageCheck, AlertTriangle, FileCheck2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { hasValidShippingPackage } from '../../lib/shipping'

// Reuse Product type or define a compatible one
// Assuming Product type is adequate from types/index.ts

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [])

    async function fetchProducts() {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'))
            const loadedProducts = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product))
            setProducts(loadedProducts)
        } catch (error) {
            console.error("Error fetching products", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string | number) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return
        try {
            await deleteDoc(doc(db, 'products', String(id)))
            setProducts(products.filter(p => p.id !== id))
        } catch (error) {
            console.error("Error deleting product", error)
            alert("Erro ao excluir produto")
        }
    }

    if (loading) return <div className="p-8">Carregando produtos...</div>

    const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')
    const visibleProducts = products.filter(product => !normalizedSearch
        || product.title.toLocaleLowerCase('pt-BR').includes(normalizedSearch)
        || product.category.toLocaleLowerCase('pt-BR').includes(normalizedSearch))

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Gerenciar Produtos</h1>
                <Link to="/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
                    <Plus className="h-4 w-4" /> Novo Produto
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            placeholder="Buscar produtos..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Produto</th>
                                <th className="px-6 py-4">Estoque</th>
                                <th className="px-6 py-4">Embalagem</th>
                                <th className="px-6 py-4">Preço</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {visibleProducts.map(product => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <img src={product.image} alt={product.title} className="w-12 h-12 object-cover rounded-lg border border-slate-100" />
                                        <div>
                                            <div className="font-bold text-slate-900">{product.title}</div>
                                            <div className="text-xs text-slate-500">{product.category}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.shippingRequired === false ? (
                                            <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-bold uppercase text-blue-700">Ilimitado</span>
                                        ) : (
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${product.stock && product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.stock || 0} unid.
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.shippingRequired === false ? (
                                            product.digitalDeliveryReady ? (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                                                    <FileCheck2 className="h-3.5 w-3.5" /> Digital pronto
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                                                    <AlertTriangle className="h-3.5 w-3.5" /> Arquivo pendente
                                                </span>
                                            )
                                        ) : hasValidShippingPackage(product) ? (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                                                <PackageCheck className="h-3.5 w-3.5" /> {product.shipping?.weightKg} kg
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                                                <AlertTriangle className="h-3.5 w-3.5" /> Pendente
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        R$ {product.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/admin/products/${product.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit className="h-5 w-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visibleProducts.length === 0 && (
                        <div className="p-10 text-center text-slate-500">Nenhum produto encontrado.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
