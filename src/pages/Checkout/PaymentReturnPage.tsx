import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Clock3 } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function PaymentReturnPage() {
  const [params] = useSearchParams()
  const result = params.get('result')
  const { clear } = useCart()
  const orderId = sessionStorage.getItem('alvorecer:last-order-id')

  useEffect(() => {
    if (result === 'success') clear()
  }, [clear, result])

  const content = result === 'success'
    ? {
        icon: <CheckCircle className="h-12 w-12 text-green-600" />,
        title: 'Pagamento enviado',
        description: 'Estamos confirmando sua compra. O status final será atualizado automaticamente em Meus Pedidos.',
      }
    : result === 'expired'
      ? {
          icon: <Clock3 className="h-12 w-12 text-amber-600" />,
          title: 'Link de pagamento expirado',
          description: 'Seu carrinho foi preservado. Volte ao checkout para gerar um novo link seguro.',
        }
      : {
          icon: <XCircle className="h-12 w-12 text-slate-500" />,
          title: 'Pagamento não concluído',
          description: 'Nenhuma cobrança foi confirmada. Você pode voltar ao carrinho e tentar novamente quando quiser.',
        }

  return (
    <section className="min-h-[60vh] grid place-items-center px-4 py-12">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-slate-50">{content.icon}</div>
        <h1 className="text-2xl font-bold text-slate-900">{content.title}</h1>
        <p className="mt-3 text-slate-600">{content.description}</p>
        {orderId && <p className="mt-3 text-xs text-slate-400">Pedido {orderId.slice(-8).toUpperCase()}</p>}
        <div className="mt-7 flex justify-center gap-3">
          <Link to="/orders" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Meus pedidos</Link>
          {result === 'success' && <Link to="/library" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Minha biblioteca</Link>}
          <Link to="/checkout" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">Voltar ao carrinho</Link>
        </div>
      </div>
    </section>
  )
}
