// =============================
// src/pages/Checkout.tsx
// =============================
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { items, totalItems, totalPrice, clear } = useCart()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState<'pix' | 'card'>('pix')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !address) return alert('Preencha nome, e-mail e endereço.')
    setSubmitting(true)
    try {
      // Simulação de pedido
      await new Promise((r) => setTimeout(r, 600))
      clear()
      alert('Pedido realizado com sucesso! (simulação)')
      navigate('/')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-bold">Finalizar compra</h1>
      {items.length === 0 ? (
        <div className="mt-6 text-slate-600">
          Seu carrinho está vazio. <Link to="/kids" className="underline">Explorar Kids</Link>
        </div>
      ) : (
        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <form onSubmit={onSubmit} className="lg:col-span-2 card p-5">
            <h2 className="text-lg font-semibold">Dados do comprador</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-3">
              <input className="rounded-xl border border-slate-200 px-3 py-2 bg-white" placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} />
              <input className="rounded-xl border border-slate-200 px-3 py-2 bg-white" placeholder="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <textarea className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 bg-white" placeholder="Endereço completo" rows={3} value={address} onChange={e => setAddress(e.target.value)} />

            <h2 className="mt-6 text-lg font-semibold">Pagamento</h2>
            <div className="mt-2 grid md:grid-cols-2 gap-3">
              <label className="rounded-xl border border-slate-200 p-3 flex items-center gap-2">
                <input type="radio" name="payment" checked={payment === 'pix'} onChange={() => setPayment('pix')} /> PIX (recomendado)
              </label>
              <label className="rounded-xl border border-slate-200 p-3 flex items-center gap-2 opacity-70">
                <input type="radio" name="payment" disabled /> Cartão (em breve)
              </label>
            </div>

            <button disabled={submitting} className="mt-6 btn-primary w-full md:w-auto">
              {submitting ? 'Processando...' : 'Confirmar pedido'}
            </button>
            <p className="mt-2 text-xs text-slate-500">Simulação para testes. Nenhuma cobrança real será feita.</p>
          </form>

          <aside className="card p-5 h-fit">
            <h2 className="text-lg font-semibold">Resumo</h2>
            <div className="mt-4 grid gap-3">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <img src={product.image} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-medium line-clamp-1">{product.title}</div>
                    <div className="text-xs text-slate-600">Qtd: {qty}</div>
                  </div>
                  <div className="text-sm font-semibold">R$ {(product.price * qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
              <div className="text-slate-700">Itens: <strong>{totalItems}</strong></div>
              <div className="text-xl font-bold">Total: R$ {totalPrice.toFixed(2)}</div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

