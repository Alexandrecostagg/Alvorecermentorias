import React from 'react';
import TestimonialCard from './TestimonialCard'; // Certifique-se que este arquivo existe

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Maria Silva',
      role: 'Membro da Igreja',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      content: 'Os livros do Alexandre transformaram completamente minha vida espiritual. Encontrei propósito em Cristo e hoje vivo uma vida abundante no Senhor.',
      rating: 5,
      product: 'Livro: Caminhada com Cristo'
    },
    {
      id: 2,
      name: 'Carlos Oliveira',
      role: 'Líder de Célula',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      content: 'A mentoria espiritual foi um divisor de águas na minha caminhada cristã. Hoje lidero uma célula e vejo Deus agindo poderosamente através do ministério.',
      rating: 5,
      product: 'Mentoria Espiritual'
    },
    {
      id: 3,
      name: 'Ana Santos',
      role: 'Missionária',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      content: 'O curso Fundamentos da Fé me deu base sólida na Palavra. Hoje sirvo como missionária e vejo vidas sendo transformadas pelo poder do Evangelho.',
      rating: 5,
      product: 'Curso: Fundamentos da Fé'
    },
    {
      id: 4,
      name: 'Pedro Costa',
      role: 'Diácono',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      content: 'O livro Oração que Transforma revolucionou minha vida de oração. Agora experimento milagres diários e vejo Deus respondendo de forma sobrenatural.',
      rating: 5,
      product: 'Livro: Oração que Transforma'
    },
    {
      id: 5,
      name: 'Beatriz Ferreira',
      role: 'Líder de Louvor',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      content: 'A Comunidade de Fé foi incrível! Cresci espiritualmente junto com outros irmãos e hoje lidero o ministério de louvor da nossa igreja.',
      rating: 5,
      product: 'Comunidade de Fé'
    },
    {
      id: 6,
      name: 'Roberto Lima',
      role: 'Pastor Auxiliar',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      content: 'O curso Liderança Cristã me capacitou para servir no ministério pastoral. Hoje pastoreio uma congregação e vejo o Reino de Deus se expandindo.',
      rating: 5,
      product: 'Curso: Liderança Cristã'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Testemunhos de Transformação
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Histórias reais de vidas transformadas pelo poder de Deus através dos nossos recursos espirituais
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;