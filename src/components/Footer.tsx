import React from 'react';
import { Facebook, Instagram, Youtube, Mail, Phone, Heart } from 'lucide-react'; // Removi Cross e Twitter (se não for usar)

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-white"> {/* De bg-gray-900 para bg-stone-900 para um marrom escuro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/logo-alvorecer.png" alt="Logo Alvorecer" className="h-10 w-auto brightness-0 invert" /> {/* Usando a nova logo */}
            </div>
            <p className="text-gray-400">
              Disseminando a Palavra de Deus e transformando vidas através do amor de Cristo.
            </p>
            <div className="flex space-x-4">
              {/* Links Sociais (agora como <a> com ícones e aria-hidden) */}
              <a href="https://facebook.com/alvorecermentorias" target="_blank" rel="noopener noreferrer" aria-label="Página do Facebook">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-amber-500 cursor-pointer transition-colors" aria-hidden="true" /> {/* Hover para amber-500 */}
              </a>
              <a href="https://instagram.com/alvorecermentorias" target="_blank" rel="noopener noreferrer" aria-label="Perfil do Instagram">
                <Instagram className="h-5 w-5 text-gray-400 hover:text-amber-500 cursor-pointer transition-colors" aria-hidden="true" /> {/* Hover para amber-500 */}
              </a>
              {/* Se usar Twitter, adicione de volta:
              <a href="https://twitter.com/alvorecermentorias" target="_blank" rel="noopener noreferrer" aria-label="Perfil do Twitter">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-amber-500 cursor-pointer transition-colors" aria-hidden="true" />
              </a>
              */}
              <a href="https://youtube.com/alvorecermentorias" target="_blank" rel="noopener noreferrer" aria-label="Canal do YouTube">
                <Youtube className="h-5 w-5 text-gray-400 hover:text-amber-500 cursor-pointer transition-colors" aria-hidden="true" /> {/* Hover para amber-500 */}
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#books" className="hover:text-white transition-colors">Livros Cristãos</a></li> {/* Ajustado href para id real */}
              <li><a href="#courses" className="hover:text-white transition-colors">Cursos Bíblicos</a></li> {/* Ajustado href para id real */}
              <li><a href="#mentoring" className="hover:text-white transition-colors">Mentoria Espiritual</a></li> {/* Ajustado href para id real */}
              <li><a href="#" className="hover:text-white transition-colors">Comunidade de Fé</a></li> {/* Manter '#' se não tiver id */}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ministério</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Oração e Aconselhamento</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Missões</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>contato@alvorecermentorias.com.br</span> {/* Ajuste o email de contato */}
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>(11) 9 9999-9999</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 AlvorecerMentorias. Feito com <Heart className="h-4 w-4 inline text-amber-400" aria-hidden="true" /> para a glória de Deus. {/* De text-red-400 para text-amber-400 */}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;