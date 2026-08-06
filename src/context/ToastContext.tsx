import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextData {
  addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextData | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm
              animate-in slide-in-from-right fade-in duration-300
              ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : ''}
              ${toast.type === 'error' ? 'bg-red-50 text-red-900 border border-red-200' : ''}
              ${toast.type === 'info' ? 'bg-white text-slate-900 border border-slate-200' : ''}
            `}
            role="alert"
          >
            {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />}
            {toast.type === 'error' && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />}

            <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Fechar notificação"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
