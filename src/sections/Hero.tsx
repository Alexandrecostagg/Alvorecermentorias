import React from 'react';
import { Play, ArrowRight, Star, Heart, Book } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Mais de 10.000 estudantes transformados</span>
                <span className="text-sm text-gray-600">Mais de 5.000 vidas transformadas por Cristo</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Desperte para uma nova vida
                <span className="text-amber-700 block">em Cristo Jesus</span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-lg">
                Descubra livros cristãos, cursos bíblicos e mentorias espirituais que vão transformar sua caminhada com Deus.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-amber-700 text-white px-8 py-4 rounded-lg hover:bg-amber-800 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                      aria-label="Explorar todos os recursos espirituais">
                <Heart className="h-5 w-5" aria-hidden="true" />
                <span className="font-semibold">Explorar Recursos</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
              
              <button className="border border-amber-300 text-amber-700 px-8 py-4 rounded-lg hover:bg-amber-50 transition-all flex items-center justify-center space-x-2"
                      aria-label="Assistir vídeo de testemunho">
                <Play className="h-5 w-5" aria-hidden="true" />
                <span>Assistir Testemunho</span>
              </button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-amber-700" aria-hidden="true" />
                </div>
                <span>Conteúdo bíblico</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-amber-700" aria-hidden="true" />
                </div>
                <span>Mentoria cristã</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Book className="h-4 w-4 text-amber-700" aria-hidden="true" />
                </div>
                <span>Crescimento espiritual</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src="/course-verdade-revelada.jpg" // Caminho da imagem ATUALIZADO para .jpg
                alt="Bíblia aberta, símbolo de espiritualidade e estudo"
                className="rounded-2xl shadow-2xl"
              />
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 transform rotate-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    📚
                  </div>
                  <div>
                    <p className="text-sm font-semibold">+30 Livros</p>
                    <p className="text-xs text-gray-600">Cristãos</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 transform -rotate-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    🎓
                  </div>
                  <div>
                    <p className="text-sm font-semibold">+15 Cursos</p>
                    <p className="text-xs text-gray-600">Bíblicos</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl transform rotate-6 opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl transform -rotate-6 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
