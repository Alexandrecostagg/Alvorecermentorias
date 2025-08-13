// src/pages/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { db, app } from '../firebaseconfig'; // Importe 'db' e 'app'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Importe funções do Firestore
// Removido: import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage não será usado para upload

const AdminPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados para o novo formulário de curso
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSubtitle, setCourseSubtitle] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseImageUrl, setCourseImageUrl] = useState(''); // <--- ALTERADO: Agora é uma URL (string)
  const [courseRating, setCourseRating] = useState('5.0');
  const [courseReviews, setCourseReviews] = useState('0');
  const [courseStudents, setCourseStudents] = useState('0');
  const [courseLessons, setCourseLessons] = useState('0');
  const [courseBadge, setCourseBadge] = useState('Destaque');
  const [coursePrelector, setCoursePrelector] = useState('');

  const auth = getAuth(app);
  // Removido: const storage = getStorage(app); // Storage não será usado para upload

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Erro de login:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email ou senha inválidos.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Formato de email inválido.');
      } else {
        setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
      }
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    console.log("handleAddCourse chamado!");
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validação agora verifica courseImageUrl (string)
    if (!courseTitle || !coursePrice || !courseImageUrl || !coursePrelector) {
      setError('Por favor, preencha todos os campos obrigatórios (Título, Preço, URL da Imagem, Preletor).');
      return;
    }

    try {
      // Removido: Lógica de upload de imagem para o Firebase Storage
      // let imageUrl = '';
      // if (courseImage) { ... }

      // 2. Adicionar os dados do curso ao Firestore
      const priceAsNumber = parseFloat(coursePrice.replace('R$ ', '').replace(',', '.'));

      await addDoc(collection(db, "cursos"), {
        title: courseTitle,
        subtitle: courseSubtitle,
        price: priceAsNumber,
        image: courseImageUrl, // <--- Agora usa a URL diretamente do input
        rating: parseFloat(courseRating),
        reviews: parseInt(courseReviews),
        students: parseInt(courseStudents),
        lessons: parseInt(courseLessons),
        badge: courseBadge,
        prelector: coursePrelector,
        dataCriacao: serverTimestamp(),
        ativo: true
      });

      setSuccessMessage('Curso adicionado com sucesso!');
      // Limpar formulário
      setCourseTitle('');
      setCourseSubtitle('');
      setCoursePrice('');
      setCourseImageUrl(''); // Limpa o campo de URL
      setCourseRating('5.0');
      setCourseReviews('0');
      setCourseStudents('0');
      setCourseLessons('0');
      setCourseBadge('Destaque');
      setCoursePrelector('');
    } catch (err: any) {
      console.error("Erro ao adicionar curso:", err);
      setError('Ocorreu um erro ao adicionar o curso. Verifique o console para mais detalhes.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-700">Carregando autenticação...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Login de Administrador</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Senha:</label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Se o usuário estiver logado, mostra o conteúdo do painel
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Painel de Administração</h1>
        <p className="text-gray-600 mb-6">Bem-vindo, {user.email || user.uid}!</p>
        <button
          onClick={() => auth.signOut()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sair
        </button>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Adicionar Novo Curso</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div>
              <label htmlFor="courseTitle" className="block text-gray-700 text-sm font-bold mb-2">Título do Curso:</label>
              <input type="text" id="courseTitle" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="courseSubtitle" className="block text-gray-700 text-sm font-bold mb-2">Subtítulo:</label>
              <input type="text" id="courseSubtitle" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={courseSubtitle} onChange={(e) => setCourseSubtitle(e.target.value)} />
            </div>
            <div>
              <label htmlFor="coursePrice" className="block text-gray-700 text-sm font-bold mb-2">Preço (R$):</label>
              <input type="number" id="coursePrice" step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} required />
            </div>
            {/* ALTERADO: Campo de imagem agora é um input de texto para URL */}
            <div>
              <label htmlFor="courseImageUrl" className="block text-gray-700 text-sm font-bold mb-2">URL da Imagem de Capa:</label>
              <input type="text" id="courseImageUrl" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={courseImageUrl} onChange={(e) => setCourseImageUrl(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="courseRating" className="block text-gray-700 text-sm font-bold mb-2">Avaliação (1-5):</label>
              <input type="number" id="courseRating" step="0.1" min="1" max="5" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={courseRating} onChange={(e) => setCourseRating(e.target.value)} />
            </div>
            <div>
              <label htmlFor="courseReviews" className="block text-gray-700 text-sm font-bold mb-2">Número de Avaliações:</label>
              <input type="number" id="courseReviews" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={courseReviews} onChange={(e) => setCourseReviews(e.target.value)} />
            </div>
            <div>
              <label htmlFor="courseStudents" className="block text-gray-700 text-sm font-bold mb-2">Número de Alunos:</label>
              <input type="number" id="courseStudents" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={courseStudents} onChange={(e) => setCourseStudents(e.target.value)} />
            </div>
            <div>
              <label htmlFor="courseLessons" className="block text-gray-700 text-sm font-bold mb-2">Número de Aulas:</label>
              <input type="number" id="courseLessons" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={courseLessons} onChange={(e) => setCourseLessons(e.target.value)} />
            </div>
            <div>
              <label htmlFor="courseBadge" className="block text-gray-700 text-sm font-bold mb-2">Badge (Ex: Destaque, Novo):</label>
              <input type="text" id="courseBadge" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={courseBadge} onChange={(e) => setCourseBadge(e.target.value)} />
            </div>
            <div>
              <label htmlFor="coursePrelector" className="block text-gray-700 text-sm font-bold mb-2">Preletor:</label>
              <input type="text" id="coursePrelector" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={coursePrelector} onChange={(e) => setCoursePrelector(e.target.value)} required />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Adicionar Curso
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
