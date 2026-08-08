import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import ProductImage from '../ui/ProductImage'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleCheckoutClick = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300 sm:rounded-l-2xl border-l border-slate-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <ShoppingBag className="h-5 w-5" />
            Meu Carrinho
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-slate-300" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">Seu carrinho está vazio</p>
                <p className="text-sm text-slate-500 mt-1">Explore nossa loja para adicionar itens.</p>
              </div>
              <button
                onClick={() => {
                  onClose()
                  navigate('/loja')
                }}
                className="mt-4 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="h-24 w-20 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {item.product.title}
                        </h3>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                          aria-label="Remover item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{item.product.category}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.qty - 1)}
                          disabled={item.qty <= 1}
                          className="p-1.5 hover:bg-slate-200 disabled:opacity-50 transition-colors rounded-l-lg"
                        >
                          <Minus className="h-3 w-3 text-slate-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-slate-900">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.qty + 1)}
                          disabled={item.qty >= 20}
                          className="p-1.5 hover:bg-slate-200 transition-colors rounded-r-lg"
                        >
                          <Plus className="h-3 w-3 text-slate-600" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        R$ {(item.product.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 p-6 bg-slate-50 sm:rounded-bl-2xl">
            <div className="flex justify-between text-base font-bold text-slate-900 mb-4">
              <p>Subtotal</p>
              <p>R$ {totalPrice.toFixed(2)}</p>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Frete e impostos serão calculados na próxima etapa.
            </p>
            <button
              onClick={handleCheckoutClick}
              className="w-full flex items-center justify-center bg-slate-900 text-white px-6 py-4 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl active:scale-95"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </Fragment>
  )
}
