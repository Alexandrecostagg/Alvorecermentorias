import { Link } from 'react-router-dom'
import { publicMedia } from '../../lib/media'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-semibold text-white text-xl mb-4">
            <img src={publicMedia('/logo-alvorecer.png')} alt="Alvorecer" className="h-8 w-8 object-contain" />
            <span>Alvorecer</span>
          </div>
          <p className="text-sm leading-relaxed">
            Livros e recursos cristãos para edificação, família e crescimento espiritual.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Plataforma</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/loja" className="hover:text-white transition-colors">Loja</Link></li>
            <li><Link to="/kids" className="hover:text-white transition-colors">Kids</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Institucional</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
            <li><Link to="/contato" className="hover:text-white transition-colors">Fale Conosco</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Minha conta</Link></li>
          </ul>
        </div>

      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Alvorecer Mentorias. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
