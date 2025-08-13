// src/components/CourseCard.tsx
import React from 'react';
import { Star, BookOpen, Users, PlayCircle, ArrowRight } from 'lucide-react';

// Certifique-se de que a interface Course props inclua 'prelector'
interface CourseProps {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviews: number;
  students: number;
  lessons: number;
  badge: string;
  prelector: string; // Adicionado a propriedade prelector
}

const CourseCard: React.FC<CourseProps> = ({
  title,
  subtitle,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  students,
  lessons,
  badge,
  prelector, // Recebe a propriedade prelector
}) => {
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Mais Vendido':
        return 'bg-red-100 text-red-800';
      case 'Novo':
        return 'bg-blue-100 text-blue-800';
      case 'Destaque':
        return 'bg-green-100 text-green-800';
      case 'Essencial':
        return 'bg-purple-100 text-purple-800';
      case 'Inspiração':
        return 'bg-yellow-100 text-yellow-800';
      case 'Prático':
        return 'bg-orange-100 text-orange-800';
      case 'Conhecimento':
        return 'bg-teal-100 text-teal-800';
      case 'Transformador':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-2 border-transparent hover:border-red-200">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(badge)}`}>
            {badge}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-3">{subtitle}</p>

        {/* Botão "Conheça o Preletor" */}
        <div className="mb-4">
          <a href="#about" className="inline-flex items-center text-red-700 hover:text-red-800 font-semibold text-sm transition-colors">
            Conheça o Preletor: {prelector} <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        {/* Fim do botão "Conheça o Preletor" */}

        <div className="flex items-center justify-between mb-4 text-gray-600 text-sm">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
            <span>{rating} ({reviews})</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-blue-500" aria-hidden="true" />
            <span>{students} alunos</span>
          </div>
          <div className="flex items-center space-x-1">
            <PlayCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
            <span>{lessons} aulas</span>
          </div>
        </div>

        <div className="flex items-baseline mb-6">
          <span className="text-3xl font-bold text-gray-900">{price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">{originalPrice}</span>
          )}
        </div>

        <button className="w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-800 transition-colors flex items-center justify-center space-x-2 group"
                aria-label={`Comprar curso ${title}`}>
          <BookOpen className="h-5 w-5" aria-hidden="true" />
          <span>Comprar Curso</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default CourseCard;