// src/sections/ProductSections.tsx
import ProductCard, { type ProductCardProps } from '../components/cards/ProductCard';

export default function ProductSections() {
  // Tipagem explícita resolve o erro de "type: string"
  const products: ProductCardProps[] = [
    {
      id: 1,
      title: 'Caminhada com Cristo',
      subtitle: 'Um guia prático para sua jornada de fé',
      price: 'R$ 49,90',
      originalPrice: 'R$ 69,90',
      image:
        'https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      rating: 4.9,
      reviews: 150,
      type: 'Livro',
      badge: 'Mais Vendido',
    },
    {
      id: 2,
      title: 'Devocional Diário: Pão da Vida',
      subtitle: 'Alimente sua alma com a Palavra todos os dias',
      price: 'R$ 29,90',
      image:
        'https://images.pexels.com/photos/1034655/pexels-photo-1034655.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      rating: 4.8,
      reviews: 90,
      type: 'Devocional',
      badge: 'Novo',
    },
    {
      id: 3,
      title: 'Ebook: O Poder da Oração',
      subtitle: 'Desvende os segredos de uma vida de oração eficaz',
      price: 'R$ 19,90',
      originalPrice: 'R$ 39,90',
      image:
        'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      rating: 5.0,
      reviews: 75,
      type: 'Ebook', // aceita 'Ebook' e 'E-book'
      badge: 'Mais Vendido',
    },
    {
      id: 4,
      title: 'Vencendo Gigantes da Fé',
      subtitle: 'Estratégias bíblicas para superar desafios',
      price: 'R$ 59,90',
      image:
        'https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      rating: 4.7,
      reviews: 110,
      type: 'Livro',
      badge: 'Destaque',
    },
    {
      id: 5,
      title: 'Devocional: Minutos com o Mestre',
      subtitle: 'Reflexões diárias para aprofundar sua comunhão',
      price: 'R$ 34,90',
      originalPrice: 'R$ 44,90',
      image:
        'https://images.pexels.com/photos/1034655/pexels-photo-1034655.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      rating: 4.9,
      reviews: 85,
      type: 'Devocional',
      badge: 'Mais Vendido',
    },
    {
      id: 6,
      title: 'Ebook: Descobrindo Seu Propósito',
      subtitle: 'Guia para encontrar a vontade de Deus para sua vida',
      price: 'R$ 24,90',
      image:
        'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      rating: 4.8,
      reviews: 60,
      type: 'Ebook',
      badge: 'Essencial',
    },
    {
      id: 7,
      title: 'Devocional: Café com Deus',
      subtitle: 'Comece seu dia com a Palavra e um coração renovado.',
      price: 'R$ 14,99',
      image: '/lancamento-ebook.png',
      rating: 5.0,
      reviews: 0,
      type: 'E-book', // também aceito pelo union
      badge: 'NOVO Lançamento!',
    },
    {
      id: 8,
      title: 'Como Vencer a Ansiedade',
      subtitle:
        'Aula online com Alexandre Gomes: Estratégias bíblicas e práticas.',
      price: 'R$ 9,99',
      image: '/lancamento-ansiedade.png',
      rating: 5.0,
      reviews: 0,
      type: 'Aula Online',
      badge: 'Aula Especial!',
      prelector: 'Alexandre Gomes da Costa',
      duration: '40 min',
    },
  ];

  return (
    <section
      id="products"
      className="py-20 bg-gradient-to-b from-amber-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nossos Recursos Espirituais
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore nossa vasta biblioteca de recursos para aprofundar sua fé.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            className="bg-red-700 text-white px-8 py-3 rounded-lg hover:bg-red-800 transition-colors font-semibold"
            aria-label="Ver todos os recursos espirituais"
          >
            Ver Mais Recursos
          </button>
        </div>
      </div>
    </section>
  );
}
