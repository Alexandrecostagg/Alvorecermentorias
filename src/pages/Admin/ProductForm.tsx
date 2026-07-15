import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../../lib/firebase'
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore'
import { ArrowLeft, Save, Image as ImageIcon, Package, FileText, Upload, Loader2, CheckCircle2 } from 'lucide-react'
import type { Product, ShippingPackage } from '../../types'
import { hasValidShippingPackage, normalizeShippingPackage } from '../../lib/shipping'
import { useAuth } from '../../context/AuthContext'
import { uploadDigitalAsset } from '../../lib/digitalDelivery'

export default function ProductForm() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { id } = useParams()
    const isEditing = !!id

    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(isEditing)
    const [digitalFile, setDigitalFile] = useState<File | null>(null)
    const [uploadingDigitalFile, setUploadingDigitalFile] = useState(false)
    const [digitalUploadError, setDigitalUploadError] = useState<string | null>(null)

    const [formData, setFormData] = useState<Partial<Product>>({
        title: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        image: '',
        section: 'store',
        shippingRequired: true,
        shipping: normalizeShippingPackage(),
    })

    const fetchProduct = useCallback(async (productId: string) => {
        try {
            const docRef = doc(db, 'products', productId)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const product = docSnap.data() as Product
                setFormData({
                    ...product,
                    shippingRequired: product.shippingRequired !== false,
                    shipping: normalizeShippingPackage(product.shipping),
                })
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

    const handleShippingChange = (field: keyof ShippingPackage, value: string) => {
        setFormData(previous => ({
            ...previous,
            shipping: {
                ...normalizeShippingPackage(previous.shipping),
                [field]: Number(value),
            },
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!hasValidShippingPackage(formData)) {
            alert('Informe peso, largura, altura e comprimento da embalagem do produto.')
            return
        }
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

    const handleDigitalUpload = async () => {
        if (!user || !id || !digitalFile) return
        setUploadingDigitalFile(true)
        setDigitalUploadError(null)
        try {
            const uploaded = await uploadDigitalAsset(user, id, digitalFile)
            setFormData(previous => ({
                ...previous,
                digitalDeliveryReady: true,
                digitalFileName: uploaded.fileName,
            }))
            setDigitalFile(null)
        } catch (error) {
            setDigitalUploadError(error instanceof Error ? error.message : 'Não foi possível enviar o arquivo.')
        } finally {
            setUploadingDigitalFile(false)
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
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                {formData.shippingRequired === false ? 'Disponibilidade' : 'Estoque (Qtd)'}
                            </label>
                            {formData.shippingRequired === false ? (
                                <div className="w-full rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 font-semibold text-blue-700">Ilimitada</div>
                            ) : (
                                <input
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 transition-colors bg-slate-50"
                                />
                            )}
                            {formData.shippingRequired === false && <p className="mt-1 text-xs text-slate-500">Produtos digitais não são bloqueados por estoque.</p>}
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

                    <fieldset className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                    <Package className="h-5 w-5" /> Embalagem para envio
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Meça o produto já embalado. Esses dados serão enviados ao Melhor Envio para calcular o preço real.
                                </p>
                            </div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={formData.shippingRequired !== false}
                                    onChange={event => setFormData(previous => ({ ...previous, shippingRequired: event.target.checked }))}
                                    className="h-4 w-4 rounded border-slate-300"
                                />
                                Produto físico
                            </label>
                        </div>

                        {formData.shippingRequired !== false ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <label className="text-sm font-bold text-slate-700">
                                    Peso (kg)
                                    <input
                                        type="number"
                                        min="0.001"
                                        step="0.001"
                                        required
                                        value={formData.shipping?.weightKg || ''}
                                        onChange={event => handleShippingChange('weightKg', event.target.value)}
                                        placeholder="Ex.: 0,450"
                                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-900"
                                    />
                                </label>
                                <label className="text-sm font-bold text-slate-700">
                                    Largura (cm)
                                    <input
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        required
                                        value={formData.shipping?.widthCm || ''}
                                        onChange={event => handleShippingChange('widthCm', event.target.value)}
                                        placeholder="Ex.: 16"
                                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-900"
                                    />
                                </label>
                                <label className="text-sm font-bold text-slate-700">
                                    Altura (cm)
                                    <input
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        required
                                        value={formData.shipping?.heightCm || ''}
                                        onChange={event => handleShippingChange('heightCm', event.target.value)}
                                        placeholder="Ex.: 4"
                                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-900"
                                    />
                                </label>
                                <label className="text-sm font-bold text-slate-700">
                                    Comprimento (cm)
                                    <input
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        required
                                        value={formData.shipping?.lengthCm || ''}
                                        onChange={event => handleShippingChange('lengthCm', event.target.value)}
                                        placeholder="Ex.: 23"
                                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-900"
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="space-y-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                                <div className="flex items-start gap-3 text-blue-800">
                                    <FileText className="mt-0.5 h-5 w-5 flex-none" />
                                    <div>
                                        <p className="font-semibold">Entrega digital automática</p>
                                        <p className="text-sm">O arquivo ficará privado e será liberado na biblioteca somente após a confirmação do pagamento.</p>
                                    </div>
                                </div>

                                {formData.digitalDeliveryReady && formData.digitalFileName && (
                                    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                                        <CheckCircle2 className="h-4 w-4" /> Arquivo atual: {formData.digitalFileName}
                                    </div>
                                )}

                                {id ? (
                                    <div className="space-y-3">
                                        <input
                                            type="file"
                                            accept=".pdf,.epub,application/pdf,application/epub+zip"
                                            onChange={event => setDigitalFile(event.target.files?.[0] || null)}
                                            className="block w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:font-semibold file:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => void handleDigitalUpload()}
                                            disabled={!digitalFile || uploadingDigitalFile}
                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                                        >
                                            {uploadingDigitalFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                            {formData.digitalDeliveryReady ? 'Substituir arquivo' : 'Enviar arquivo'}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="rounded-lg bg-white px-3 py-2 text-sm text-blue-700">Salve o produto primeiro. Depois, abra-o novamente para enviar o e-book.</p>
                                )}

                                {digitalUploadError && <p role="alert" className="text-sm font-medium text-red-700">{digitalUploadError}</p>}
                            </div>
                        )}
                    </fieldset>

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
