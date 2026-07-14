import { useEffect, useMemo, useState } from 'react'
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
} from 'firebase/firestore'
import {
    CheckCircle,
    Copy,
    Download,
    ExternalLink,
    Eye,
    Mail,
    MapPin,
    Package,
    Phone,
    Search,
    Truck,
    User,
} from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { db } from '../../lib/firebase'
import {
    canApplyOperationalTransition,
    formatOrderDate,
    ORDER_STATUS_COLORS,
    ORDER_STATUS_LABELS,
} from '../../lib/orders'
import type { Order, OrderStatus, UserProfile } from '../../types'

type CustomerDirectory = Record<string, Pick<UserProfile, 'name' | 'email' | 'phone'>>

const allStatuses: Array<{ value: 'all' | OrderStatus; label: string }> = [
    { value: 'all', label: 'Todos os status' },
    ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
        value: value as OrderStatus,
        label,
    })),
]

function formatAddress(order: Order) {
    const address = order.address
    if (!address) return 'Endereço não informado'
    return [
        `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''}`,
        `${address.neighborhood} - ${address.city}/${address.state}`,
        `CEP: ${address.zipCode}`,
    ].join('\n')
}

function csvCell(value: unknown) {
    return `"${String(value ?? '').split('"').join('""')}"`
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [customers, setCustomers] = useState<CustomerDirectory>({})
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const [carrier, setCarrier] = useState('')
    const [trackingCode, setTrackingCode] = useState('')
    const [trackingUrl, setTrackingUrl] = useState('')

    useEffect(() => {
        const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
        return onSnapshot(ordersQuery, async (snapshot) => {
            const loadedOrders = snapshot.docs.map(item => ({ id: item.id, ...item.data() } as Order))
            setOrders(loadedOrders)
            setLoading(false)

            const missingUserIds = [...new Set(loadedOrders
                .filter(order => !order.customer?.name && !customers[order.userId])
                .map(order => order.userId))]

            if (missingUserIds.length === 0) return
            const entries = await Promise.all(missingUserIds.map(async userId => {
                try {
                    const profile = await getDoc(doc(db, 'users', userId))
                    if (!profile.exists()) return [userId, undefined] as const
                    const data = profile.data() as UserProfile
                    return [userId, { name: data.name, email: data.email, phone: data.phone }] as const
                } catch (profileError) {
                    console.error('Erro ao buscar cliente do pedido', profileError)
                    return [userId, undefined] as const
                }
            }))

            const loadedCustomers = entries.reduce<CustomerDirectory>((directory, [userId, profile]) => {
                if (profile) directory[userId] = profile
                return directory
            }, {})
            setCustomers(current => ({ ...current, ...loadedCustomers }))
        }, snapshotError => {
            console.error('Erro ao buscar pedidos', snapshotError)
            setError('Não foi possível carregar os pedidos. Tente novamente.')
            setLoading(false)
        })
        // O diretório de clientes é somente um cache; a assinatura deve continuar estável.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const selectedOrder = selectedOrderId
        ? orders.find(order => order.id === selectedOrderId) ?? null
        : null

    const customerFor = (order: Order) => ({
        name: order.customer?.name || order.address?.recipient || customers[order.userId]?.name || 'Nome não informado',
        email: order.customer?.email || customers[order.userId]?.email || 'E-mail não informado',
        phone: order.customer?.phone || customers[order.userId]?.phone || 'Telefone não informado',
    })

    const filteredOrders = useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase('pt-BR')
        return orders.filter(order => {
            if (statusFilter !== 'all' && order.status !== statusFilter) return false
            if (!normalizedSearch) return true
            const customer = customerFor(order)
            return [
                order.id,
                customer.name,
                customer.email,
                order.address?.city,
                order.address?.zipCode,
                order.shipment?.trackingCode,
            ].some(value => String(value || '').toLocaleLowerCase('pt-BR').includes(normalizedSearch))
        })
        // customerFor usa apenas os estados listados abaixo.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orders, customers, search, statusFilter])

    function openOrder(order: Order) {
        setSelectedOrderId(order.id)
        setCarrier(order.shipment?.carrier || '')
        setTrackingCode(order.shipment?.trackingCode || '')
        setTrackingUrl(order.shipment?.trackingUrl || '')
        setError('')
        setNotice('')
    }

    async function applyStatus(order: Order, newStatus: OrderStatus) {
        if (!canApplyOperationalTransition(order.status, newStatus)) {
            setError('Essa mudança não faz parte do fluxo operacional permitido.')
            return
        }

        const action = newStatus === 'processing' ? 'iniciar a separação' : 'marcar o pedido como entregue'
        if (!confirm(`Confirma que deseja ${action}?`)) return

        setUpdating(order.id)
        setError('')
        try {
            const now = new Date().toISOString()
            await updateDoc(doc(db, 'orders', order.id), {
                status: newStatus,
                updatedAt: now,
                ...(newStatus === 'processing' ? { processingAt: now } : {}),
                ...(newStatus === 'delivered' ? { deliveredAt: now } : {}),
            })
            setNotice(newStatus === 'processing' ? 'Pedido movido para separação.' : 'Pedido marcado como entregue.')
        } catch (statusError) {
            console.error('Erro ao atualizar pedido', statusError)
            setError('Não foi possível atualizar o pedido.')
        } finally {
            setUpdating(null)
        }
    }

    async function saveShipment(order: Order) {
        if (order.status !== 'processing' && order.status !== 'shipping') {
            setError('Inicie a separação antes de registrar o envio.')
            return
        }
        if (!carrier.trim() || !trackingCode.trim()) {
            setError('Informe a transportadora e o código de rastreio.')
            return
        }

        setUpdating(order.id)
        setError('')
        try {
            const now = new Date().toISOString()
            await updateDoc(doc(db, 'orders', order.id), {
                status: 'shipping',
                shipment: {
                    carrier: carrier.trim(),
                    trackingCode: trackingCode.trim(),
                    trackingUrl: trackingUrl.trim(),
                    shippedAt: order.shipment?.shippedAt || now,
                },
                updatedAt: now,
            })
            setNotice(order.status === 'processing' ? 'Envio registrado e cliente liberado para acompanhar.' : 'Rastreio atualizado.')
        } catch (shipmentError) {
            console.error('Erro ao registrar envio', shipmentError)
            setError('Não foi possível registrar o envio.')
        } finally {
            setUpdating(null)
        }
    }

    async function copyAddress(order: Order) {
        try {
            await navigator.clipboard.writeText(formatAddress(order))
            setNotice('Endereço copiado.')
        } catch {
            setError('Não foi possível copiar automaticamente. Selecione o endereço manualmente.')
        }
    }

    function exportOrders() {
        const header = ['Pedido', 'Cliente', 'E-mail', 'Telefone', 'Data', 'Total', 'Status', 'Endereço', 'Transportadora', 'Rastreio']
        const rows = filteredOrders.map(order => {
            const customer = customerFor(order)
            return [
                order.id,
                customer.name,
                customer.email,
                customer.phone,
                formatOrderDate(order.createdAt),
                order.total.toFixed(2),
                ORDER_STATUS_LABELS[order.status],
                formatAddress(order).split('\n').join(' | '),
                order.shipment?.carrier,
                order.shipment?.trackingCode,
            ]
        })
        const csv = [header, ...rows].map(row => row.map(csvCell).join(';')).join('\n')
        const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `pedidos-alvorecer-${new Date().toISOString().slice(0, 10)}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    if (loading) return <div className="p-8">Carregando pedidos...</div>

    return (
        <div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gerenciar Pedidos</h1>
                    <p className="text-sm text-slate-500 mt-1">Separe, envie e acompanhe cada compra em um só lugar.</p>
                </div>
                <button
                    onClick={exportOrders}
                    disabled={filteredOrders.length === 0}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                >
                    <Download className="h-4 w-4" /> Exportar pedidos
                </button>
            </div>

            {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {notice && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">{notice}</div>}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        <input
                            value={search}
                            onChange={event => setSearch(event.target.value)}
                            type="search"
                            placeholder="Buscar por pedido, cliente, CEP ou rastreio..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={event => setStatusFilter(event.target.value as 'all' | OrderStatus)}
                        className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-slate-400"
                        aria-label="Filtrar pedidos por status"
                    >
                        {allStatuses.map(status => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
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
                                <th className="px-6 py-4 text-right">Operação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.map(order => {
                                const customer = customerFor(order)
                                return (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs text-slate-500 block">#{order.id.slice(0, 12)}</span>
                                            <div className="text-sm font-medium text-slate-900">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-slate-900">{customer.name}</div>
                                            <div className="text-xs text-slate-500">{order.address?.city}/{order.address?.state}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{formatOrderDate(order.createdAt)}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">R$ {order.total.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${ORDER_STATUS_COLORS[order.status]}`}>
                                                {ORDER_STATUS_LABELS[order.status]}
                                            </span>
                                            {order.status === 'shipping' && !order.shipment?.trackingCode && (
                                                <div className="text-xs text-red-600 mt-1">Sem rastreio</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openOrder(order)}
                                                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                                                >
                                                    <Eye className="h-4 w-4" /> Ver pedido
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="p-12 text-center text-slate-500">Nenhum pedido corresponde aos filtros.</div>
                    )}
                </div>
            </div>

            <Modal
                open={Boolean(selectedOrder)}
                onClose={() => setSelectedOrderId(null)}
                title={selectedOrder ? `Pedido #${selectedOrder.id.slice(0, 12).toUpperCase()}` : undefined}
                size="lg"
            >
                {selectedOrder && (() => {
                    const customer = customerFor(selectedOrder)
                    return (
                        <div className="max-h-[75vh] overflow-y-auto pr-1 space-y-6">
                            <div className="flex items-center justify-between gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${ORDER_STATUS_COLORS[selectedOrder.status]}`}>
                                    {ORDER_STATUS_LABELS[selectedOrder.status]}
                                </span>
                                <span className="font-bold text-slate-900">R$ {selectedOrder.total.toFixed(2)}</span>
                            </div>

                            <section className="rounded-xl border border-slate-200 p-4">
                                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><User className="h-4 w-4" /> Cliente</h3>
                                <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-600">
                                    <p className="font-semibold text-slate-900">{customer.name}</p>
                                    <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {customer.email}</p>
                                    <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {customer.phone}</p>
                                    <p>Pagamento: {selectedOrder.paymentMethod === 'pix' ? 'PIX' : 'Cartão'}</p>
                                </div>
                            </section>

                            <section className="rounded-xl border border-slate-200 p-4">
                                <div className="flex items-center justify-between gap-3 mb-3">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2"><MapPin className="h-4 w-4" /> Endereço de entrega</h3>
                                    <button onClick={() => copyAddress(selectedOrder)} className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900">
                                        <Copy className="h-3.5 w-3.5" /> Copiar
                                    </button>
                                </div>
                                <p className="text-sm text-slate-600 whitespace-pre-line">{formatAddress(selectedOrder)}</p>
                            </section>

                            <section>
                                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Package className="h-4 w-4" /> Itens para separar</h3>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={`${item.product.id}-${index}`} className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-3 text-sm">
                                            <div>
                                                <p className="font-semibold text-slate-900">{item.product.title}</p>
                                                <p className="text-slate-500">Quantidade: {item.qty}</p>
                                            </div>
                                            <span className="font-semibold whitespace-nowrap">R$ {(item.product.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {selectedOrder.status === 'pending' && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                    Aguarde a confirmação automática da Asaas. O painel não permite marcar pagamentos manualmente.
                                </div>
                            )}

                            {selectedOrder.status === 'paid' && (
                                <button
                                    onClick={() => applyStatus(selectedOrder, 'processing')}
                                    disabled={updating === selectedOrder.id}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    <Package className="h-5 w-5" /> Iniciar separação
                                </button>
                            )}

                            {(selectedOrder.status === 'processing' || selectedOrder.status === 'shipping') && (
                                <section className="rounded-xl border border-slate-200 p-4 space-y-3">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2"><Truck className="h-4 w-4" /> Dados do envio</h3>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        <label className="text-sm text-slate-600">
                                            Transportadora
                                            <input value={carrier} onChange={event => setCarrier(event.target.value)} placeholder="Ex.: Correios, Jadlog" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" />
                                        </label>
                                        <label className="text-sm text-slate-600">
                                            Código de rastreio
                                            <input value={trackingCode} onChange={event => setTrackingCode(event.target.value)} placeholder="Código da etiqueta" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" />
                                        </label>
                                    </div>
                                    <label className="block text-sm text-slate-600">
                                        Link de acompanhamento (opcional)
                                        <input value={trackingUrl} onChange={event => setTrackingUrl(event.target.value)} type="url" placeholder="https://..." className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900" />
                                    </label>
                                    <button
                                        onClick={() => saveShipment(selectedOrder)}
                                        disabled={updating === selectedOrder.id}
                                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                                    >
                                        <Truck className="h-5 w-5" /> {selectedOrder.status === 'processing' ? 'Registrar envio' : 'Atualizar rastreio'}
                                    </button>
                                    {selectedOrder.shipment?.trackingUrl && (
                                        <a href={selectedOrder.shipment.trackingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-blue-700 hover:underline">
                                            Abrir rastreamento <ExternalLink className="h-4 w-4" />
                                        </a>
                                    )}
                                </section>
                            )}

                            {selectedOrder.status === 'shipping' && (
                                <button
                                    onClick={() => applyStatus(selectedOrder, 'delivered')}
                                    disabled={updating === selectedOrder.id}
                                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    <CheckCircle className="h-5 w-5" /> Marcar como entregue
                                </button>
                            )}
                        </div>
                    )
                })()}
            </Modal>
        </div>
    )
}
