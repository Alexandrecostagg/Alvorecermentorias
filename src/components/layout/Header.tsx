// src/components/Header.tsx
import React, { useState } from 'react';
import { Menu, X, Heart } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Alvorecer - Tamanho ajustado para h-10 */}
          <a href="#home" className="flex items-center space-x-3">
            <img src="/alvorecer-logo.png" alt="Logo Alvorecer" className="h-10 w-auto" />
          </a>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-red-700 transition-colors">
              Início
            </a>
            <a href="#about" className="text-gray-700 hover:text-red-700 transition-colors">
              Sobre
            </a>
            <a href="#courses" className="text-gray-700 hover:text-red-700 transition-colors">
              Cursos
            </a>
            <a href="#mentoring" className="text-gray-700 hover:text-red-700 transition-colors">
              Mentorias
            </a>
            {/* O Dropdown de "Recursos" (Produtos) está de volta */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-red-700 transition-colors flex items-center space-x-1">
                <span>Recursos</span> {/* Mantido como "Recursos" */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {/* Removidos links para Lançamentos e Todos os Recursos, pois não estarão na página principal */}
                  {/* <a href="#lancamentos" className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-red-700">Lançamentos</a> */}
                  {/* <a href="#products" className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-red-700">Todos os Recursos</a> */}
                  <a href="#bibles" className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-red-700">Bíblias</a>
                  <a href="#books" className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-red-700">Livros</a>
                  <a href="#accessories" className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-red-700">Acessórios</a>
                  <a href="#box-kits" className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-red-700">Box & Kits</a> {/* Mantido */}
                </div>
              </div>
            </div>
            <a href="#testimonials" className="text-gray-700 hover:text-red-700 transition-colors">
              Testemunhos
            </a>
            <a href="#contact" className="text-gray-700 hover:text-red-700 transition-colors">
              Contato
            </a>
          </nav>

          {/* Botão CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center space-x-2">
              <Heart className="h-4 w-4" aria-hidden="true" />
              <span>Começar Jornada</span>
            </button>
          </div>

          {/* Botão do menu mobile */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6 text-gray-700" aria-hidden="true" /> : <Menu className="h-6 w-6 text-gray-700" aria-hidden="true" />}
          </button>
        </div>

        {/* Navegação Mobile */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-red-700">
                Início
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-red-700">
                Sobre
              </a>
              <a href="#courses" className="block px-3 py-2 text-gray-700 hover:text-red-700">
                Cursos
              </a>
              <a href="#mentoring" className="block px-3 py-2 text-gray-700 hover:text-red-700">
                Mentorias
              </a>
              {/* Mantendo o dropdown de recursos no mobile também */}
              <a href="#box-kits" className="block px-3 py-2 text-gray-700 hover:text-red-700"> {/* Mantido */}
                Box & Kits
              </a>
              <a href="#bibles" className="block px-3 py-2 text-gray-700 hover:text-red-700">
                Bíblias
              </a>
              <a href="#books" className="block px-3 py-2 text-gray-700 hover:text-red-700">
                Livros
              </a>
              <a href="#accessories" className="block px-3 py-2 text-gray-700 hover:text-red-700">
                Acessórios
              </a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-red-700">
                Testemunhos
              </a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-red-700">
                Contato
              </a>
              <button className="w-full bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center space-x-2">
                <Heart className="h-4 w-4" aria-hidden="true" />
                <span>Começar Jornada</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;