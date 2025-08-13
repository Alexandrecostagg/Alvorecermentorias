import React from 'react';
import { BookOpen, Video, Users, Star, ArrowRight, Cross, Heart, Zap } from 'lucide-react';

const Resources: React.FC = () => {
  const products = [
    {
      id: 1,
      type: 'Livro',
      title: 'Caminhada com Cristo',
      subtitle: 'Descubra o propósito de Deus para sua vida',
      price: 'R$ 39,90',
      originalPrice: 'R$ 59,90',
      image: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      rating: 4.9,
      reviews: 847,
      icon: BookOpen,
      badge: 'Mais Amado'
    },
    {
      id: 2,
      type: 'Curso',
      title: 'Fundamentos da Fé',
      subtitle: 'Curso completo sobre os pilares do cristianismo',
      price: 'R$ 197,00',
      originalPrice: 'R$ 297,00',
      image: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      rating: 4.8,
      reviews: 592,
      icon: Video,
      badge: 'Essencial'
    },
    {
      id: 3,
      type: 'Mentoria',
      title: 'Mentoria Espiritual',
      subtitle: 'Acompanhamento personalizado em sua jornada cristã',
      price: 'R$ 897,00',
      originalPrice: 'R$ 1.297,00',
      image: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      rating: 5.0,
      reviews: 89,
      icon: Users,
      badge: 'Transformador'
    },
    {
      id: 4,
      type: 'Livro',
      title: 'Oração que Transforma',
      subtitle: 'O poder da oração na vida do cristão',
      price: 'R$ 29,90',
      originalPrice: 'R$ 49,90',
      image: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      rating: 4.7,
      reviews: 1256,
      icon: BookOpen,
      badge: 'Poderoso'
    },
    {
      id: 5,
      type: 'Curso',
      title: 'Liderança Cristã',
      subtitle: 'Como liderar segundo os princípios de Jesus',
      price: 'R$ 147,00',
      originalPrice: 'R$ 247,00',
      image: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      rating: 4.6,
      reviews: 443,
      icon: Video,
      badge: 'Inspirador'
    },
    {
      id: 6,
      type: 'Mentoria',
      title: 'Comunidade de Fé',
      subtitle: 'Crescimento espiritual em comunidade cristã',
      price: 'R$ 297,00',
      originalPrice: 'R$ 497,00',
      image: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      rating: 4.9,
      reviews: 234,
      icon: Users,
      badge: 'Comunhão'
    }
  ];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Mais Amado':
        return 'bg-yellow-100 text-yellow-800';
      case 'Essencial':
        return 'bg-red-100 text-red-800';
      case 'Transformador':
        return 'bg-purple-100 text-purple-800';
      case 'Poderoso':
        return 'bg-green-100 text-green-800';
      case 'Inspirador':
        return 'bg-amber-100 text-amber-800';
      case 'Comunhão':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="products" className="py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Recursos Espirituais
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Livros cristãos, cursos bíblicos e mentorias espirituais para fortalecer sua caminhada com Deus
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const IconComponent = product.icon;
            return (
              <div key={product.id} className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(product.badge)}`}>
                      {product.badge}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <IconComponent className="h-5 w-5 text-red-700" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-700">{product.type}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                      <span className="text-sm text-gray-400">({product.reviews})</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-4">{product.subtitle}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center space-x-2 group">
                    <Cross className="h-4 w-4" />
                    <span>Adquirir Agora</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Resources;