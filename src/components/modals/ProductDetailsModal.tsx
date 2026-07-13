import { X, ShoppingCart } from 'lucide-react'
import type { Product } from '../../types'
import { useCart } from '../../context/CartContext'
import { publicMedia } from '../../lib/media'

type Props = {
    product: Product | null
    onClose: () => void
}

export default function ProductDetailsModal({ product, onClose }: Props) {
    const { addItem } = useCart()

    if (!product) return null

    const handleAddToCart = () => {
        addItem(product)
        alert('Produto adicionado ao carrinho! 🛒')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white transition-colors"
                >
                    <X className="h-6 w-6 text-slate-900" />
                </button>

                <div className="grid md:grid-cols-2">
                    <div className="bg-slate-100 aspect-square md:aspect-auto h-full relative">
                        <img
                            src={publicMedia(product.image)}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="p-8 flex flex-col h-full">
                        <div className="flex-1">
                            <span className="text-xs font-bold text-sky-500 uppercase tracking-wider mb-2 block">
                                {product.category}
                            </span>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                                {product.title}
                            </h2>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl font-bold text-slate-900">
                                    R$ {product.price.toFixed(2)}
                                </span>
                                {product.badge && (
                                    <span className="bg-red-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {product.badge}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4 text-slate-600 mb-8">
                                <p>
                                    <strong>Faixa Etária:</strong> {product.ageRange} anos
                                </p>
                                <p>
                                    <strong>Estoque:</strong> {product.stock ? `${product.stock} unidades` : 'Disponível'}
                                </p>
                                <p className="leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
