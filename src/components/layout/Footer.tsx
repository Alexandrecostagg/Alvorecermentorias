import { Link, NavLink } from 'react-router-dom'
import { Baby, BookOpenText, Home as HomeIcon, Library } from 'lucide-react'

export default function Header() {
  const linkBase = 'px-3 py-2 rounded-xl text-sm font-medium hover:bg-white/70 transition-colors'
  const active = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${linkBase} bg-white text-slate-900 shadow-sm` : `${linkBase} text-slate-700`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">A</span>
            <span>Alvorecer</span>
          </Link>
          <nav className="ml-auto flex items-center gap-1">
            <NavLink to="/" className={active}><HomeIcon className="h-4 w-4 mr-1"/>Home</NavLink>
            <NavLink to="/courses" className={active}><Library className="h-4 w-4 mr-1"/>Cursos</NavLink>
            <NavLink to="/kids" className={active}><Baby className="h-4 w-4 mr-1"/>Kids</NavLink>
            <a href="#doar" className={`${linkBase} text-pink-700`}>Doar</a>
          </nav>
        </div>
      </div>
    </header>
  )
}