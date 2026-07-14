import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { Order } from '../../types'
import { DollarSign, Package, ShoppingBag, TrendingUp } from 'lucide-react'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../lib/orders'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalProducts: 0
    })
    const [recentOrders, setRecentOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                // Orders
                const ordersSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5)))
                const allOrdersSnap = await getDocs(collection(db, 'orders'))

                let revenue = 0
                let pending = 0

                allOrdersSnap.docs.forEach(doc => {
                    const data = doc.data() as Order
                    if (['paid', 'processing', 'shipping', 'delivered'].includes(data.status)) revenue += data.total
                    if (data.status === 'paid' || data.status === 'processing') pending++
                })

                // Products
                const productsSnap = await getDocs(collection(db, 'products'))

                setStats({
                    totalRevenue: revenue,
                    totalOrders: allOrdersSnap.size,
                    pendingOrders: pending,
                    totalProducts: productsSnap.size
                })

                setRecentOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)))

            } catch (error) {
                console.error("Error fetching admin stats", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) return <div className="p-8">Carregando dashboard...</div>

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Receita Total</p>
                    <h3 className="text-2xl font-bold text-slate-900">R$ {stats.totalRevenue.toFixed(2)}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-xl">
                            <Package className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Total de Pedidos</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.totalOrders}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-amber-100 p-3 rounded-xl">
                            <TrendingUp className="h-6 w-6 text-amber-600" />
                        </div>
                        {stats.pendingOrders > 0 && (
                            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Ação Necessária</span>
                        )}
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Aguardando envio</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.pendingOrders}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-xl">
                            <ShoppingBag className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Produtos Cadastrados</p>
                    <h3 className="text-2xl font-bold text-slate-900">{stats.totalProducts}</h3>
                </div>
            </div>

            {/* Recent Orders Table Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 text-lg">Pedidos Recentes</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentOrders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-slate-500">#{order.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.customer?.name || order.address?.recipient || 'Cliente'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${ORDER_STATUS_COLORS[order.status]}`}>
                                            {ORDER_STATUS_LABELS[order.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">R$ {order.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
