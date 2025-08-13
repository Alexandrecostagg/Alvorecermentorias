// src/components/Mentoring.tsx
import React from 'react';
import MentoringCard from './MentoringCard'; // Certifique-se de que este componente existe e está correto.
import TestimonialCard from './TestimonialCard'; // Reutilizamos este componente.

const Mentoring: React.FC = () => {
  const mentoringPlans = [
    {
      id: 1,
      title: 'Homens de Valor e Propósito',
      subtitle: 'Jornada trimestral para o crescimento integral do homem cristão.',
      price: 'R$ 497,00', // Preço por mês, conforme seu modelo anterior
      originalPrice: 'R$ 697,00', // Exemplo
      period: '/mês',
      image: '/mentoring-homem-valor.png', // Caminho da arte gerada
      rating: 5.0,
      reviews: 89,
      features: [
        '8 encontros coletivos online (1h30-2h)',
        'Grupo exclusivo no WhatsApp/Telegram',
        'Materiais de apoio e desafios práticos',
        'Bônus: 1 sessão individual de 30 min',
        'Apoio e oração personalizada'
      ],
      badge: 'Novo',
      mentor: 'Alexandre G. Costa'
    },
    {
      id: 2,
      title: 'Mulheres Restauradas, Vidas que Inspiram',
      subtitle: 'Programa trimestral para cura, força e propósito feminino.',
      price: 'R$ 397,00', // Preço por mês, exemplo ajustado
      originalPrice: 'R$ 597,00', // Exemplo
      period: '/mês',
      image: '/mentoring-mulheres-restauradas.png', // Caminho da arte gerada
      rating: 4.9,
      reviews: 120,
      features: [
        '8 encontros coletivos online (1h30-2h)',
        'Comunidade vibrante no Telegram/WhatsApp',
        'Devocionais diários e convidadas especiais',
        'Momentos de oração e compartilhamento',
        'Identidade em Cristo e cura emocional'
      ],
      badge: 'Empoderador',
      mentor: 'Elaine Fernandes'
    },
    {
      id: 3,
      title: 'Liderança que Transforma e Multiplica',
      subtitle: 'Programa quadrimestral de capacitação para líderes cristãos.',
      price: 'R$ 697,00', // Preço por mês, exemplo ajustado
      originalPrice: 'R$ 997,00', // Exemplo
      period: '/mês',
      image: '/mentoring-lideranca.png', // Caminho da arte gerada
      rating: 5.0,
      reviews: 65,
      features: [
        '12 encontros coletivos online (1h30-2h)',
        'Masterminds e estudos de caso em grupo',
        'Acesso à plataforma e fórum exclusivo',
        '2 sessões individuais de 45 min com mentor',
        'Networking com outros líderes'
      ],
      badge: 'Premium',
      mentor: 'Alexandre G. Costa, Fabio Pagan, Pliany Pagan'
    }
  ];

  const testimonials = [
    // Mantenha seus testemunhos aqui. Adaptei os existentes para se alinharem mais:
    {
      id: 1,
      name: 'João Victor',
      role: 'Participante Mentoria Homens',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      content: 'A Mentoria "Homens de Valor" transformou minha visão de vida e fé. Encontrei direção e um propósito real em Cristo. Recomendo demais!',
      rating: 5,
      product: 'Mentoria Homens de Valor e Propósito'
    },
    {
      id: 2,
      name: 'Carolina Santos',
      role: 'Participante Mentoria Mulheres',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      content: 'Participei da Mentoria "Mulheres Restauradas" e foi um divisor de águas. Minha fé foi fortalecida e me sinto mais perto de Deus. Gratidão!',
      rating: 5,
      product: 'Mentoria Mulheres Restauradas'
    },
    // Adicione mais testemunhos se tiver
  ];

  return (
    <section id="mentoring" className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mentorias Espirituais
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Acompanhamento personalizado para acelerar seu crescimento espiritual e descobrir seu propósito em Cristo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mentoringPlans.map((plan) => (
            <MentoringCard key={plan.id} {...plan} />
          ))}
        </div>

        {/* Testimonials */}
        <div className="bg-amber-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Testemunhos de Mentorados
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            🙏 Não caminhe sozinho. Deixe-nos ajudá-lo a crescer espiritualmente.
          </p>
          <button className="bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors font-semibold"
                  aria-label="Agendar conversa gratuita sobre mentoria">
            Agendar Conversa Gratuita
          </button>
        </div>
      </div>
    </section>
  );
};

export default Mentoring;