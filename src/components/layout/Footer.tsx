import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-semibold text-white text-xl mb-4">
            <img src="https://production.alvorecer-flutter-app.pages.dev/icons/Icon-512.png" alt="Alvorecer" className="h-8 w-8 object-contain" />
            <span>Alvorecer</span>
          </div>
          <p className="text-sm leading-relaxed">
            Plataforma de mentorias e cursos cristãos para edificação e crescimento espiritual.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Plataforma</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/mentorias" className="hover:text-white transition-colors">Mentorias</Link></li>
            <li><Link to="/courses" className="hover:text-white transition-colors">Cursos</Link></li>
            <li><Link to="/loja" className="hover:text-white transition-colors">Loja</Link></li>
            <li><Link to="/kids" className="hover:text-white transition-colors">Kids</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Institucional</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
            <li><Link to="/contato" className="hover:text-white transition-colors">Fale Conosco</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Contato</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contato@alvorecer.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> (11) 99999-9999</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> São Paulo, SP</li>
          </ul>
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-white"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white"><Twitter className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Alvorecer Mentorias. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}