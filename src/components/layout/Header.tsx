import { NavLink, Link } from 'react-router-dom'
import { Baby, Home as HomeIcon, Library, Users, ShoppingBag, ShoppingCart, Info, Mail, LogIn, LogOut, Package, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { publicMedia } from '../../lib/media'

export default function Header() {
  const { user, userProfile, signInWithGoogle, logout } = useAuth()
  const { totalItems } = useCart()
  const base = 'px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/70 transition-colors flex items-center'
  const cls = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${base} bg-white text-slate-900 shadow-sm` : `${base} text-slate-700`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold group">
            <img src={publicMedia('/logo-alvorecer.png')} alt="Alvorecer" className="h-9 w-9 object-contain transform transition-transform group-hover:scale-110" />
            <span className="text-lg tracking-tight text-slate-900">Alvorecer</span>
          </Link>

          <nav className="hidden md:flex ml-auto items-center gap-1">
            <NavLink to="/" className={cls}><HomeIcon className="h-4 w-4 mr-2" />Home</NavLink>
            <NavLink to="/mentorias" className={cls}><Users className="h-4 w-4 mr-2" />Mentorias</NavLink>
            <NavLink to="/courses" className={cls}><Library className="h-4 w-4 mr-2" />Cursos</NavLink>
            <NavLink to="/loja" className={cls}><ShoppingBag className="h-4 w-4 mr-2" />Loja</NavLink>
            <NavLink to="/kids" className={cls}><Baby className="h-4 w-4 mr-2" />Kids</NavLink>
            <NavLink to="/sobre" className={cls}><Info className="h-4 w-4 mr-2" />Sobre</NavLink>
          </nav>

          <div className="ml-auto md:ml-4 flex items-center border-l border-slate-200 pl-4 gap-4">
            <Link to="/checkout" className="relative group p-1">
              <ShoppingCart className="h-6 w-6 text-slate-700 group-hover:text-alvorecer-gold transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                {userProfile?.role === 'admin' && (
                  <Link to="/admin" className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="Painel Administrativo">
                    <LayoutDashboard className="h-6 w-6 text-indigo-600" />
                  </Link>
                )}
                <Link to="/orders" className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="Meus Pedidos">
                  <Package className="h-6 w-6 text-slate-700" />
                </Link>
                <Link to="/profile" className="p-2 hover:bg-slate-100 rounded-full transition-colors" title="Meu Perfil">
                  <Users className="h-6 w-6 text-slate-700" />
                </Link>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors" onClick={() => logout()} title="Sair">
                  <LogOut className="h-6 w-6 text-slate-700" />
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
              >
                <LogIn className="h-4 w-4" /> Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
