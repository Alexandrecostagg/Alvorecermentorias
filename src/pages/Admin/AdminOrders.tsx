import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore'
import { Order, OrderStatus } from '../../types'
import { Search, Filter, Eye, MoreVertical, CheckCircle, Truck, Package, XCircle, Clock } from 'lucide-react'

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    async function fetchOrders() {
        try {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
            const snapshot = await getDocs(q)
            setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)))
        } catch (error) {
            console.error("Erro ao buscar pedidos", error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        if (!confirm(`Tem certeza que deseja alterar o status para ${newStatus}?`)) return
        setUpdating(orderId)
        try {
            await updateDoc(doc(db, 'orders', orderId), { status: newStatus })

            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        } catch (error) {
            console.error("Erro ao atualizar status", error)
            alert("Erro ao atualizar")
        } finally {
            setUpdating(null)
        }
    }

    const statusColors = {
        pending: 'bg-amber-100 text-amber-800',
        paid: 'bg-blue-100 text-blue-800',
        shipping: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    }

    if (loading) return <div className="p-8">Carregando pedidos...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Gerenciar Pedidos</h1>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                        <Filter className="h-4 w-4" /> Filtrar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">
                        Exportar Relatório
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Filters Row */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, Cliente..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Pedido</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs text-slate-500 block">#{order.id.slice(0, 8)}</span>
                                        <div className="text-sm font-medium text-slate-900">{order.items.length} itens</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-900">{order.address?.recipient || 'N/A'}</div>
                                        <div className="text-xs text-slate-500">{order.address?.city}/{order.address?.state}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                        R$ {order.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || 'bg-slate-100'}`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            {/* Quick Actions based on status */}
                                            {order.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, 'paid')}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Marcar Pago"
                                                    disabled={updating === order.id}
                                                >
                                                    <CheckCircle className="h-5 w-5" />
                                                </button>
                                            )}
                                            {order.status === 'paid' && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, 'shipping')}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" title="Marcar Enviado"
                                                    disabled={updating === order.id}
                                                >
                                                    <Truck className="h-5 w-5" />
                                                </button>
                                            )}
                                            {order.status === 'shipping' && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, 'delivered')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Marcar Entregue"
                                                    disabled={updating === order.id}
                                                >
                                                    <Package className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
