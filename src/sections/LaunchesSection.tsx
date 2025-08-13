// src/components/LaunchesSection.tsx
import React from 'react';
import { BookOpen, PlayCircle, ArrowRight } from 'lucide-react';

const LaunchesSection: React.FC = () => {
  const launches = [
    {
      id: 1,
      type: 'E-book',
      title: 'Devocional: Café com Deus',
      subtitle: 'Comece seu dia com a Palavra e um coração renovado.',
      price: 'R$ 14,99',
      image: '/lancamento-ebook.png', // Caminho da imagem do devocional - JÁ ERA PNG
      features: [
        'Devocionais diários para 30 dias',
        'Reflexões inspiradoras e interativas',
        'Espaço para suas anotações e orações',
        'Acesso imediato após a compra'
      ]
    },
    {
      id: 2,
      type: 'Aula Online',
      title: 'Como Vencer a Ansiedade',
      subtitle: 'Estratégias bíblicas e práticas para encontrar a paz em meio ao caos.',
      price: 'R$ 9,99',
      image: '/lancamento-ansiedade.png', // Caminho da imagem da aula - JÁ ERA PNG
      prelector: 'Alexandre Gomes da Costa',
      duration: '40 min',
      features: [
        'Aula gravada de 40 minutos',
        'Exercícios práticos e aplicáveis',
        'Fundamentos bíblicos para a paz',
        'Acesso vitalício ao conteúdo'
      ]
    }
  ];

  return (
    <section id="lancamentos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lançamentos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Novidades exclusivas e recursos práticos para o seu crescimento espiritual e bem-estar.
          </p>
        </div>

        {/* Layout ajustado para centralizar e não esticar os 2 itens */}
        <div className="flex justify-center"> {/* Flexbox para centralizar */}
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-4xl"> {/* Limita a largura e usa 2 colunas */}
            {launches.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full md:w-1/3 h-48 md:h-auto object-cover rounded-lg shadow-md"
                />
                <div className="flex-1 text-center md:text-left">
                  <span className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-2 block">
                    {item.type} | Lançamento
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.subtitle}</p>

                  <ul className="space-y-2 mb-6 text-gray-700">
                    {item.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <ArrowRight className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {item.prelector && (
                      <li className="flex items-center">
                        <PlayCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" aria-hidden="true" />
                        <span>Preletor: {item.prelector} ({item.duration})</span>
                      </li>
                    )}
                  </ul>

                  <div className="flex items-baseline justify-center md:justify-start mb-6">
                    <span className="text-4xl font-bold text-gray-900">{item.price}</span>
                  </div>

                  <button className="w-full md:w-auto bg-red-700 text-white px-8 py-3 rounded-lg hover:bg-red-800 transition-colors font-semibold flex items-center justify-center space-x-2 group">
                    <BookOpen className="h-5 w-5" aria-hidden="true" />
                    <span>Saiba Mais e Adquira</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaunchesSection;
