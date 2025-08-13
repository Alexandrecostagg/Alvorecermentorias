// src/components/CoursesList.tsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseconfig'; // Importe a instância do Firestore
import { collection, getDocs } from 'firebase/firestore'; // Importe as funções do Firestore

// Interface para tipar os dados do curso
interface Course {
  id: string;
  titulo: string;
  descricao: string;
  imagemCapaUrl: string;
  preco: number;
  // Adicione outras propriedades do curso conforme a sua modelagem no Firestore
  mentorId?: string; // Opcional, se você for ter mentores
  modulos?: any[]; // Array de módulos, pode ser mais detalhado depois
  dataCriacao?: any; // Timestamp do Firestore
  ativo?: boolean; // Booleano para visibilidade
}

const CoursesList: React.FC = () => {
  const [cursos, setCursos] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Busca a coleção 'cursos' no Firestore
        const querySnapshot = await getDocs(collection(db, "cursos"));
        const coursesData: Course[] = [];
        
        // Itera sobre cada documento e extrai os dados
        querySnapshot.forEach((doc) => {
          // Garante que o ID do documento seja incluído nos dados
          coursesData.push({ id: doc.id, ...doc.data() as Omit<Course, 'id'> });
        });
        setCursos(coursesData);
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        setError("Não foi possível carregar os cursos. Verifique o console para mais detalhes.");
      } finally {
        setLoading(false); // Finaliza o estado de carregamento
      }
    };

    fetchCourses(); // Chama a função para buscar os cursos quando o componente é montado
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  // Exibe um indicador de carregamento enquanto os dados são buscados
  if (loading) {
    return (
      <section className="py-16 bg-gray-100 flex justify-center items-center">
        <p className="text-xl text-gray-700">Carregando cursos...</p>
      </section>
    );
  }

  // Exibe uma mensagem de erro se a busca falhar
  if (error) {
    return (
      <section className="py-16 bg-gray-100 flex justify-center items-center">
        <p className="text-xl text-red-600">{error}</p>
      </section>
    );
  }

  // Renderiza a lista de cursos
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Nossos Cursos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cursos.length > 0 ? (
            cursos.map((curso) => (
              <div key={curso.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105">
                {/* Imagem de capa do curso, com fallback */}
                <img 
                  src={curso.imagemCapaUrl || "https://placehold.co/600x400/cccccc/333333?text=Sem+Imagem"} 
                  alt={curso.titulo} 
                  className="w-full h-48 object-cover" 
                  onError={(e) => { 
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400/cccccc/333333?text=Erro+Imagem"; 
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{curso.titulo}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{curso.descricao}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-indigo-600">
                      {curso.preco ? `R$${curso.preco.toFixed(2)}` : 'Gratuito'}
                    </span>
                    <button className="bg-indigo-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 text-lg">Nenhum curso encontrado no momento.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesList;
