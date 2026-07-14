import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import AddressSelector from '../../components/checkout/AddressSelector'
import PaymentSelector from '../../components/checkout/PaymentSelector'
import { startAsaasCheckout } from '../../lib/payments'
import ProductImage from '../../components/ui/ProductImage'

export default function CheckoutPage() {
    const { items, removeItem, updateQuantity, totalPrice, clear } = useCart()
    const { user, userProfile } = useAuth()

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [checkoutError, setCheckoutError] = useState<string | null>(null)

    const handleCheckout = async () => {
        if (!user || !selectedAddressId) return

        setIsProcessing(true)
        setCheckoutError(null)

        try {
            // Find full address object
            const deliveryAddress = userProfile?.addresses.find(a => a.id === selectedAddressId)

            if (!deliveryAddress) throw new Error('Selecione um endereço de entrega válido.')

            const { checkoutUrl, orderId } = await startAsaasCheckout({
                user,
                items,
                address: deliveryAddress,
            })

            sessionStorage.setItem('alvorecer:last-order-id', orderId)
            window.location.assign(checkoutUrl)

        } catch (error) {
            console.error('Erro ao processar pedido:', error)
            setCheckoutError(error instanceof Error ? error.message : 'Houve um erro ao iniciar o pagamento. Tente novamente.')
        } finally {
            setIsProcessing(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-slate-100 p-6 rounded-full mb-6">
                    <ShoppingBag className="h-12 w-12 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Seu carrinho está vazio</h2>
                <p className="text-slate-600 mb-8 max-w-sm">
                    Parece que você ainda não adicionou nenhum item. Que tal dar uma olhada na nossa loja?
                </p>
                <Link
                    to="/loja"
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                >
                    Voltar para a Loja
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8" /> Carrinho de Compras
                </h1>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Column */}
                    <div className="md:col-span-2 space-y-4">

                        {/* Address Selector */}
                        <AddressSelector
                            selectedAddressId={selectedAddressId}
                            onSelect={setSelectedAddressId}
                        />

                        {/* Payment Selector */}
                        <PaymentSelector />

                        {/* Cart Items List */}
                        {items.map((item) => (
                            <div key={item.product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                                <div className="h-24 w-24 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden">
                                    <ProductImage src={item.product.image} alt={item.product.title} className="h-full w-full object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-900 truncate">{item.product.title}</h3>
                                    <p className="text-sm text-slate-500 mb-2">{item.product.category}</p>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-slate-200 rounded-lg">
                                            <button
                                                type="button"
                                                aria-label={`Diminuir quantidade de ${item.product.title}`}
                                                onClick={() => updateQuantity(item.product.id, item.qty - 1)}
                                                className="p-1 hover:bg-slate-100 transition-colors disabled:opacity-50"
                                                disabled={item.qty <= 1}
                                            >
                                                <Minus className="h-4 w-4 text-slate-600" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                                            <button
                                                type="button"
                                                aria-label={`Aumentar quantidade de ${item.product.title}`}
                                                onClick={() => updateQuantity(item.product.id, item.qty + 1)}
                                                className="p-1 hover:bg-slate-100 transition-colors"
                                                disabled={item.qty >= 20}
                                            >
                                                <Plus className="h-4 w-4 text-slate-600" />
                                            </button>
                                        </div>
                                        <div className="font-bold text-slate-900">
                                            R$ {(item.product.price * item.qty).toFixed(2)}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    aria-label={`Remover ${item.product.title} do carrinho`}
                                    onClick={() => removeItem(item.product.id)}
                                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                                    title="Remover item"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={clear}
                            className="text-sm text-red-500 hover:underline px-2"
                        >
                            Limpar carrinho
                        </button>
                    </div>

                    {/* Warning / Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">

                            <h3 className="text-lg font-bold text-slate-900 mb-4">Resumo do Pedido</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>R$ {totalPrice.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-slate-600">
                                    <span>Frete</span>
                                    <span className="text-green-600 font-medium">Grátis</span>
                                </div>
                                <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-lg text-slate-900">
                                    <span>Total</span>
                                    <span>R$ {totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {!selectedAddressId && (
                                <div className="mb-4 text-xs text-center text-red-500 font-medium">
                                    Selecione um endereço de entrega para continuar.
                                </div>
                            )}

                            {checkoutError && (
                                <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {checkoutError}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleCheckout}
                                disabled={!selectedAddressId || isProcessing}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" /> Processando...
                                    </>
                                ) : (
                                    <>
                                        Ir para o pagamento seguro <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
