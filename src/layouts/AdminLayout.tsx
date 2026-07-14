import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Package, LogOut, ExternalLink } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminLayout() {
    const { logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/orders', icon: Package, label: 'Pedidos' },
        { path: '/admin/products', icon: ShoppingBag, label: 'Produtos' },
    ]

    const isActive = (path: string) => {
        if (path === '/admin' && location.pathname === '/admin') return true
        if (path !== '/admin' && location.pathname.startsWith(path)) return true
        return false
    }

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full z-20 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-tight">Alvorecer Admin</h1>
                    <p className="text-slate-400 text-xs mt-1">Painel de Gerenciamento</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive(item.path)
                                    ? 'bg-alvorecer-gold text-white font-semibold'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        <ExternalLink className="h-5 w-5" />
                        Ver Loja
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-slate-800 transition-all text-left"
                    >
                        <LogOut className="h-5 w-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Mobile Header (TODO: Add toggle) */}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}
