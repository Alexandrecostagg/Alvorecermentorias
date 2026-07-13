import { ShoppingCart } from 'lucide-react'
import type { Product } from '../../types'
import { publicMedia } from '../../lib/media'

export default function ProductCard({ product, onAdd }: { product: Product, onAdd?: (p: Product) => void }) {
  return (
    <div className="group rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition">
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
        <img src={publicMedia(product.image)} alt={product.title} className="h-full w-full object-cover group-hover:scale-[1.02] transition" />
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold leading-tight line-clamp-2">{product.title}</h3>
          {product.badge && (
            <span className="ml-2 shrink-0 rounded-full bg-pink-100 text-pink-800 text-[10px] font-semibold px-2 py-0.5">{product.badge}</span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-600">{product.category} • {product.ageRange}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold">R$ {product.price.toFixed(2)}</span>
          <button onClick={() => onAdd?.(product)} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-white text-sm font-medium">
            <ShoppingCart className="h-4 w-4" /> Comprar
          </button>
        </div>
      </div>
    </div>
  )
}
