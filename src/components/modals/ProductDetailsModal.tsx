import { useEffect, useId, useRef, useState } from 'react'
import { CheckCircle, ShoppingCart, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { useCart } from '../../context/CartContext'
import ProductImage from '../ui/ProductImage'

type Props = {
  product: Product | null
  onClose: () => void
}

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export default function ProductDetailsModal({ product, onClose }: Props) {
  const { addItem } = useCart()
  const titleId = useId()
  const closeRef = useRef(onClose)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    setAdded(false)
    if (!product) return undefined

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [product])

  if (!product) return null

  const inStock = product.stock === undefined || product.stock > 0
  const handleAddToCart = () => {
    if (!inStock || added) return
    addItem(product)
    setAdded(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Fechar detalhes do produto" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <button type="button" aria-label="Fechar" onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors shadow-sm">
          <X className="h-6 w-6 text-slate-900" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="bg-slate-100 aspect-square md:aspect-auto min-h-72 relative">
            <ProductImage src={product.image} alt={product.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex-1">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2 block">{product.category}</span>
              <h2 id={titleId} className="text-2xl md:text-3xl font-black text-slate-900 mb-3 leading-tight">{product.title}</h2>
              {product.author && <p className="text-sm text-slate-500 mb-4">por {product.author}</p>}

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-slate-900">{money.format(product.price)}</span>
                {product.badge && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">{product.badge}</span>}
              </div>

              <dl className="space-y-2 text-sm text-slate-600 mb-6">
                {product.ageRange && <div><dt className="font-semibold inline">Faixa etária: </dt><dd className="inline">{product.ageRange} anos</dd></div>}
                {product.type && <div><dt className="font-semibold inline">Tipo: </dt><dd className="inline">{product.type}</dd></div>}
                <div>
                  <dt className="font-semibold inline">Disponibilidade: </dt>
                  <dd className="inline">{product.stock === undefined ? 'Disponível' : product.stock > 0 ? `${product.stock} unidades` : 'Esgotado'}</dd>
                </div>
              </dl>

              <p className="leading-relaxed text-slate-600 mb-8">
                {product.description || 'Descrição detalhada ainda não informada.'}
              </p>
            </div>

            {added ? (
              <div role="status" className="rounded-xl bg-green-50 border border-green-200 p-4 text-green-800">
                <p className="font-bold flex items-center gap-2"><CheckCircle className="h-5 w-5" />Produto adicionado</p>
                <Link to="/checkout" className="mt-3 inline-flex font-semibold underline underline-offset-4">Ir para o carrinho</Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-5 w-5" />
                {inStock ? 'Adicionar ao carrinho' : 'Produto esgotado'}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
