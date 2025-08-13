// src/sections/CoursesStatic.tsx
import CourseCard from '../components/cards/CourseCard';

export default function CoursesStatic() {
  const courses = [
    {
      id: 1,
      title: 'O Homem Segundo o Coração de Deus',
      subtitle: 'Uma jornada para a masculinidade cristã autêntica.',
      price: 'R$ 69,90',
      image: '/course-homem-deus.jpg',
      rating: 5.0,
      reviews: 180,
      students: 3100,
      lessons: 10,
      badge: 'Destaque',
      prelector: 'Alexandre Gomes da Costa',
    },
    {
      id: 2,
      title: 'A Verdade Revelada',
      subtitle: 'Desvende as profundezas da Palavra de Deus.',
      price: 'R$ 69,90',
      image: '/course-verdade-revelada.jpg',
      rating: 4.9,
      reviews: 150,
      students: 2800,
      lessons: 12,
      badge: 'Mais Procurado',
      prelector: 'Alexandre Gomes da Costa',
    },
    {
      id: 3,
      title: 'Princípios da Fé Cristã',
      subtitle: 'As bases inabaláveis para sua caminhada com Cristo.',
      price: 'R$ 69,90',
      image: '/course-principios-fe.jpg',
      rating: 4.8,
      reviews: 110,
      students: 2100,
      lessons: 8,
      badge: 'Essencial',
      prelector: 'Elaine Fernandes',
    },
    {
      id: 4,
      title: 'O Missionário de Deus',
      subtitle: 'Prepare-se para impactar vidas ao redor do mundo.',
      price: 'R$ 69,90',
      image: '/course-missionario-deus.jpg',
      rating: 5.0,
      reviews: 95,
      students: 1500,
      lessons: 10,
      badge: 'Inspiração',
      prelector: 'Elaine Fernandes',
    },
    {
      id: 5,
      title: 'Finanças à Luz da Bíblia',
      subtitle: 'Sabedoria divina para uma vida financeira próspera.',
      price: 'R$ 69,90',
      image: '/course-financas-biblia.jpg',
      rating: 4.7,
      reviews: 80,
      students: 1900,
      lessons: 7,
      badge: 'Prático',
      prelector: 'Pliany Pagan',
    },
    {
      id: 6,
      title: 'Teologia Para Leigos',
      subtitle: 'Compreenda a fé de forma clara e acessível.',
      price: 'R$ 69,90',
      image: '/course-teologia-leigos.jpg',
      rating: 4.9,
      reviews: 70,
      students: 1600,
      lessons: 9,
      badge: 'Conhecimento',
      prelector: 'Fabio Pagan',
    },
    {
      id: 7,
      title: 'Mulheres Restauradoras',
      subtitle: 'Cura, força e propósito para a mulher cristã.',
      price: 'R$ 109,90',
      image: '/course-mulheres-restauradoras.png',
      rating: 5.0,
      reviews: 120,
      students: 2300,
      lessons: 10,
      badge: 'Transformador',
      prelector: 'Elaine Fernandes',
    },
  ];

  return (
    <section
      id="courses"
      className="py-20 bg-gradient-to-b from-white to-amber-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cursos Bíblicos Online
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Aprofunde-se na Palavra de Deus e cresça em conhecimento e fé com
            nossos cursos interativos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            className="bg-red-700 text-white px-8 py-3 rounded-lg hover:bg-red-800 transition-colors font-semibold"
            aria-label="Ver todos os cursos bíblicos"
          >
            Ver Todos os Cursos
          </button>
        </div>
      </div>
    </section>
  );
}
