// src/components/BoxKitsSection.tsx
import React from 'react';
// Importe ProductCard se for usá-lo para exibir os Box & Kits
// import ProductCard from './ProductCard';

const BoxKitsSection: React.FC = () => {
  // Array de Box & Kits vazio por enquanto
  const boxKits: any[] = []; 

  return (
    <section id="box-kits" className="py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Box & Kits Especiais
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra combinações exclusivas de livros, devocionais e acessórios para sua jornada de fé.
          </p>
        </div>

        {boxKits.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            <p>Nenhum Box ou Kit disponível no momento. Volte em breve para novidades imperdíveis!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Este mapeamento só acontecerá se houver Box & Kits no array */}
            {boxKits.map((item) => (
              // <ProductCard key={item.id} {...item} /> // Descomente e use se tiver Box & Kits
              <div key={item.id}>{/* Conteúdo temporário */}</div>
            ))}
          </div>
        )}

        {/* Botão opcional para "Ver Todos os Box & Kits" */}
        {/*
        <div className="text-center mt-12">
          <button className="bg-red-700 text-white px-8 py-3 rounded-lg hover:bg-red-800 transition-colors font-semibold">
            Ver Todos os Box & Kits
          </button>
        </div>
        */}
      </div>
    </section>
  );
};

export default BoxKitsSection;