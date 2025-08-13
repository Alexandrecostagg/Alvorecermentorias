import React from 'react';
import { Star, ArrowRight, BookOpen, Heart } from 'lucide-react'; // De Cross para Heart

interface ProductCardProps {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  type: 'Livro' | 'Devocional' | 'Ebook' | 'Bíblia' | 'Box' | 'Kit' | 'Acessório'; // Tipos de produto expandidos
  badge?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  subtitle,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  type,
  badge,
}) => {
  const getBadgeColor = (badgeText?: string) => {
    switch (badgeText) {
      case 'Lançamento':
        return 'bg-indigo-100 text-indigo-800'; // De purple para indigo
      case 'Mais Vendido':
        return 'bg-amber-100 text-amber-800'; // De red para amber
      case 'Economia':
        return 'bg-green-100 text-green-800';
      case 'Completo':
        return 'bg-orange-100 text-orange-800'; // Novo badge
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-2 border-transparent hover:border-amber-200"> {/* De hover:border-red-200 para hover:border-amber-200 */}
      <div className="relative">
        <img
          src={image}
          alt={`Capa do ${type}: ${title}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {badge && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(badge)}`}>
              {badge}
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <BookOpen className="h-5 w-5 text-amber-700" aria-hidden="true" /> {/* De text-red-700 para text-amber-700 */}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
            <span className="text-sm text-gray-600">{rating}</span>
            <span className="text-sm text-gray-400">({reviews})</span>
          </div>
          <span className="text-sm text-amber-700 font-medium">{type}</span> {/* De text-red-700 para text-amber-700 */}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{subtitle}</p>

        <div className="flex items-baseline justify-center mb-6">
          <span className="text-3xl font-bold text-gray-900">{price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">{originalPrice}</span>
          )}
        </div>

        <button className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition-colors flex items-center justify-center space-x-2 group"
                aria-label={`Ver detalhes do ${type} ${title}`}>
          <Heart className="h-4 w-4" aria-hidden="true" /> {/* De Cross para Heart */}
          <span>Ver Detalhes</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;