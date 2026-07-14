import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../../lib/firebase'
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import { Product } from '../../types'

export default function ProductForm() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = !!id

    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(isEditing)

    const [formData, setFormData] = useState<Partial<Product>>({
        title: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        image: '',
        section: 'store'
    })

    const fetchProduct = useCallback(async (productId: string) => {
        try {
            const docRef = doc(db, 'products', productId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                setFormData(docSnap.data() as Product)
            } else {
                alert('Produto não encontrado')
                navigate('/admin/products')
            }
        } catch (error) {
            console.error("Erro ao buscar produto", error)
        } finally {
            setInitialLoading(false)
        }
    }, [navigate])

    useEffect(() => {
        if (isEditing && id) {
            void fetchProduct(id)
        }
    }, [fetchProduct, id, isEditing])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const productData = {
                ...formData,
                updatedAt: new Date().toISOString()
            }

            if (isEditing && id) {
                await updateDoc(doc(db, 'products', id), productData)
            } else {
                await addDoc(collection(db, 'products'), {
                    ...productData,
                    createdAt: new Date().toISOString()
                })
            }
            navigate('/admin/products')
        } catch (error) {
            console.error("Erro ao salvar", error)
            alert("Erro ao salvar produto")
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) return <div className="p-8">Carregando...</div>

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" /> Voltar para Produtos
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEditing ? 'Editar Produto' : 'Novo Produto'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* Image Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700">Imagem do Produto</label>
                        <div className="flex items-start gap-6">
                            <div className="w-40 h-40 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="h-10 w-10 text-slate-300" />
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-slate-900"
                                    placeholder="https://media.seudominio.com/produtos/imagem.webp"
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Use a URL pública da imagem enviada ao Cloudflare R2. Recomendado: 800x800px em JPG, PNG ou WEBP.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Nome do Produto</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors"
                                placeholder="Ex: Kit Aventureiros da Fé"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Descrição</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors"
                                placeholder="Detalhes do produto, características, etc."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Preço (R$)</label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Estoque (Qtd)</label>
                            <input
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors bg-slate-50"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Categoria</label>
                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors"
                                placeholder="Ex: Livros, Kids..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Seção da Loja</label>
                            <select
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors"
                            >
                                <option value="store">Loja Geral</option>
                                <option value="kids">Kids</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="h-5 w-5" />
                            {loading ? 'Salvando...' : 'Salvar Produto'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
