import React from 'react';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  product?: string; // Opcional, pois nem todo depoimento pode ter um produto associado
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  avatar,
  content,
  rating,
  product,
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" aria-hidden="true" />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-600">{rating}.0</span>
      </div>

      <div className="relative mb-6">
        <Quote className="h-8 w-8 text-amber-700 opacity-20 absolute -top-2 -left-2" aria-hidden="true" />
        <p className="text-gray-700 italic leading-relaxed pl-6">
          {content}
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <img
          src={avatar}
          alt={`Foto de perfil de ${name}`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
          {product && ( // Linha 49: Início da condição do 'product'
            <p className="text-xs text-amber-700 mt-1">{product}</p> // Linha 50: Onde o erro aponta
          )} {/* Linha 51: Fechamento da condição do 'product' */}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;