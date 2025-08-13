// src/sections/CoursesSection.tsx
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

type FirestoreTimestamp =
  | {
      seconds: number;
      nanoseconds: number;
    }
  | null;

interface Course {
  id: string;
  titulo: string;
  descricao: string;
  imagemCapaUrl: string;
  preco: number | null;
  mentorId?: string;
  modulos?: any[];
  dataCriacao?: FirestoreTimestamp;
  ativo?: boolean;
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function CoursesSection() {
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const snap = await getDocs(collection(db, 'cursos'));
        const data: Course[] = snap.docs.map((doc) => {
          const raw = doc.data() as Omit<Course, 'id'>;
          return { id: doc.id, ...raw };
        });
        setCursos(data);
      } catch (err) {
        console.error('Erro ao buscar cursos:', err);
        setError('Não foi possível carregar os cursos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-100 flex justify-center items-center">
        <p className="text-xl text-gray-700">Carregando cursos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-100 flex justify-center items-center">
        <p className="text-xl text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Nossos Cursos Disponíveis
        </h2>

        {cursos.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Nenhum curso encontrado no momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cursos.map((curso) => (
              <article
                key={curso.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]"
              >
                <img
                  src={
                    curso.imagemCapaUrl ||
                    'https://placehold.co/800x500/cccccc/333333?text=Sem+Imagem'
                  }
                  alt={curso.titulo}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://placehold.co/800x500/cccccc/333333?text=Erro+Imagem';
                  }}
                  loading="lazy"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
                    {curso.titulo}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                    {curso.descricao}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      {curso.preco && curso.preco > 0
                        ? currency.format(curso.preco)
                        : 'Gratuito'}
                    </span>

                    <button
                      type="button"
                      className="bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
                      onClick={() => {
                        // TODO: ajustar quando existir rota de detalhes
                        window.location.href = `/cursos`;
                      }}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
