import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../lib/firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { Order } from '../../types'
import { Package, Truck, CheckCircle, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { publicMedia } from '../../lib/media'

export default function OrdersPage() {
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

    useEffect(() => {
        async function fetchOrders() {
            if (!user) return
            try {
                const q = query(
                    collection(db, 'orders'),
                    where('userId', '==', user.uid),
                    // Note: Composite index might be required for where + orderBy
                    // If it fails, remove orderBy and sort in client
                )

                const snapshot = await getDocs(q)
                const loadedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order))

                // Client-side sorting to avoid index requirement for now
                loadedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

                setOrders(loadedOrders)
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [user])

    const toggleOrder = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId)
    }

    const steps = [
        { status: 'pending', label: 'Pendente', icon: Clock },
        { status: 'paid', label: 'Pago', icon: CheckCircle },
        { status: 'shipping', label: 'Enviado', icon: Truck },
        { status: 'delivered', label: 'Entregue', icon: Package },
    ]

    const getStepStatus = (orderStatus: string, stepStatus: string) => {
        const orderIndex = steps.findIndex(s => s.status === orderStatus)
        const stepIndex = steps.findIndex(s => s.status === stepStatus)

        if (orderIndex >= stepIndex) return 'completed'
        if (orderIndex === stepIndex - 1) return 'current' // Optional: highlight next step
        return 'upcoming'
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                    <Package className="h-8 w-8" /> Meus Pedidos
                </h1>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-40 bg-white rounded-2xl animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="h-10 w-10 text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Nenhum pedido encontrado</h2>
                        <p className="text-slate-500 mb-8">Você ainda não realizou nenhuma compra conosco.</p>
                        <Link to="/loja" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                            Ir para a Loja
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                {/* Header */}
                                <div
                                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => toggleOrder(order.id)}
                                >
                                    <div className="flex items-start md:items-center gap-4">
                                        <div className="bg-slate-100 p-3 rounded-xl">
                                            <Package className="h-6 w-6 text-slate-600" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                            ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'}
                                        `}>
                                            {steps.find(s => s.status === order.status)?.label || order.status}
                                        </span>
                                        <div className="font-bold text-lg text-slate-900">
                                            R$ {order.total.toFixed(2)}
                                        </div>
                                        {expandedOrder === order.id ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {expandedOrder === order.id && (
                                    <div className="px-6 pb-8 border-t border-slate-100 animate-in slide-in-from-top-2">

                                        {/* Timeline */}
                                        <div className="py-8">
                                            <div className="relative">
                                                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
                                                <div
                                                    className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                                                    style={{ width: `${((steps.findIndex(s => s.status === order.status) / (steps.length - 1)) * 100)}%` }}
                                                />

                                                <div className="relative flex justify-between">
                                                    {steps.map((step, index) => {
                                                        const status = getStepStatus(order.status, step.status)
                                                        const Icon = step.icon

                                                        return (
                                                            <div key={step.status} className="flex flex-col items-center group">
                                                                <div className={`
                                                                    w-10 h-10 rounded-full flex items-center justify-center border-4 relative z-10 transition-colors
                                                                    ${status === 'completed' || step.status === order.status
                                                                        ? 'bg-green-500 border-green-500 text-white'
                                                                        : 'bg-white border-slate-200 text-slate-300'}
                                                                `}>
                                                                    <Icon className="h-5 w-5" />
                                                                </div>
                                                                <span className={`mt-2 text-xs font-bold transition-colors ${status === 'completed' || step.status === order.status ? 'text-slate-900' : 'text-slate-400'}`}>
                                                                    {step.label}
                                                                </span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="space-y-4 bg-slate-50 p-6 rounded-xl">
                                            <h4 className="font-bold text-slate-800 mb-2">Itens do Pedido</h4>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-200">
                                                    <img src={publicMedia(item.product.image)} alt={item.product.title} className="w-16 h-16 object-cover rounded-lg border border-slate-100" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-base font-semibold text-slate-900 leading-tight mb-1">{item.product.title}</p>
                                                        <p className="text-sm text-slate-500">Qtd: {item.qty}</p>
                                                    </div>
                                                    <p className="font-bold text-slate-900 whitespace-nowrap">R$ {item.product.price.toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Address Info */}
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-bold text-slate-800 mb-2">Endereço de Entrega</h4>
                                                <div className="text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-200">
                                                    <p>{order.address.street}, {order.address.number} {order.address.complement && `- ${order.address.complement}`}</p>
                                                    <p>{order.address.neighborhood} - {order.address.city}/{order.address.state}</p>
                                                    <p>CEP: {order.address.zipCode}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 mb-2">Pagamento</h4>
                                                <div className="text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-2">
                                                    <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">Pago</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
