import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { isFirebaseConfigured } from '../lib/firebase'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-alvorecer-cream/30">
      <Header />
      {!isFirebaseConfigured && (
        <div className="bg-amber-50 px-4 py-3 text-center text-sm text-amber-900 border-b border-amber-200">
          Modo de visualização local: configure o Firebase em <code>.env.local</code> para habilitar login, pedidos e painel administrativo.
        </div>
      )}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
