// src/pages/Admin/AdminPage.tsx
import { useEffect, useState, type FormEvent } from 'react';
import type { User } from 'firebase/auth';
import { app, db } from '../../lib/firebase';

export default function AdminPage() {
  // Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form curso
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSubtitle, setCourseSubtitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(''); // texto do input
  const [courseImageUrl, setCourseImageUrl] = useState('');
  const [courseRating, setCourseRating] = useState('5.0');
  const [courseReviews, setCourseReviews] = useState('0');
  const [courseStudents, setCourseStudents] = useState('0');
  const [courseLessons, setCourseLessons] = useState('0');
  const [courseBadge, setCourseBadge] = useState('Destaque');
  const [coursePrelector, setCoursePrelector] = useState('');

  // Observa estado de autenticação (import dinâmico)
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      const { getAuth, onAuthStateChanged } = await import('firebase/auth');
      const auth = getAuth(app);

      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Erro de login:', err);
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password') {
        setError('Email ou senha inválidos.');
      } else if (err?.code === 'auth/invalid-email') {
        setError('Formato de email inválido.');
      } else {
        setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
      }
    }
  }

  async function handleLogout() {
    try {
      const { getAuth, signOut } = await import('firebase/auth');
      const auth = getAuth(app);
      await signOut(auth);
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  }

  async function handleAddCourse(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!courseTitle || !coursePrice || !courseImageUrl || !coursePrelector) {
      setError('Preencha Título, Preço, URL da Imagem e Preletor.');
      return;
    }

    // Converte preço "69,90" ou "R$ 69,90" para número 69.90
    const priceAsNumber = Number.parseFloat(
      coursePrice.replace(/[^\d.,]/g, '').replace('.', '').replace(',', '.')
    );
    if (Number.isNaN(priceAsNumber)) {
      setError('Preço inválido. Use números (ex.: 69,90).');
      return;
    }

    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');

      await addDoc(collection(db, 'cursos'), {
        // Campos usados pela listagem dinâmica (CoursesSection)
        titulo: courseTitle,
        descricao: courseSubtitle,
        imagemCapaUrl: courseImageUrl,
        preco: priceAsNumber,

        // Campos alternativos (compatibilidade com outros componentes)
        title: courseTitle,
        subtitle: courseSubtitle,
        image: courseImageUrl,
        price: priceAsNumber,

        rating: Number.parseFloat(courseRating) || 0,
        reviews: Number.parseInt(courseReviews) || 0,
        students: Number.parseInt(courseStudents) || 0,
        lessons: Number.parseInt(courseLessons) || 0,
        badge: courseBadge,
        prelector: coursePrelector,

        dataCriacao: serverTimestamp(),
        ativo: true,
      });

      setSuccessMessage('Curso adicionado com sucesso!');
      setCourseTitle('');
      setCourseSubtitle('');
      setCoursePrice('');
      setCourseImageUrl('');
      setCourseRating('5.0');
      setCourseReviews('0');
      setCourseStudents('0');
      setCourseLessons('0');
      setCourseBadge('Destaque');
      setCoursePrelector('');
    } catch (err) {
      console.error('Erro ao adicionar curso:', err);
      setError('Ocorreu um erro ao adicionar o curso. Verifique o console para mais detalhes.');
    }
  }

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
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input
                id="email"
                type="email"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Senha:</label>
              <input
                id="password"
                type="password"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-full">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Painel quando logado
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Painel de Administração</h1>
            <p className="text-gray-600">Bem-vindo, {user.email || user.uid}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Sair
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Adicionar Novo Curso</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="courseTitle" className="block text-gray-700 text-sm font-semibold mb-2">Título do Curso *</label>
              <input
                id="courseTitle"
                type="text"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="coursePrelector" className="block text-gray-700 text-sm font-semibold mb-2">Preletor *</label>
              <input
                id="coursePrelector"
                type="text"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={coursePrelector}
                onChange={(e) => setCoursePrelector(e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="courseSubtitle" className="block text-gray-700 text-sm font-semibold mb-2">Subtítulo</label>
              <input
                id="courseSubtitle"
                type="text"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={courseSubtitle}
                onChange={(e) => setCourseSubtitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="coursePrice" className="block text-gray-700 text-sm font-semibold mb-2">Preço (R$) *</label>
              <input
                id="coursePrice"
                type="text"
                inputMode="decimal"
                placeholder="69,90"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="courseImageUrl" className="block text-gray-700 text-sm font-semibold mb-2">URL da Imagem de Capa *</label>
              <input
                id="courseImageUrl"
                type="url"
                placeholder="https://..."
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={courseImageUrl}
                onChange={(e) => setCourseImageUrl(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="courseRating" className="block text-gray-700 text-sm font-semibold mb-2">Avaliação (1–5)</label>
              <input
                id="courseRating"
                type="number"
                step={0.1}
                min={1}
                max={5}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={courseRating}
                onChange={(e) => setCourseRating(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="courseReviews" className="block text-gray-700 text-sm font-semibold mb-2">Avaliações</label>
              <input
                id="courseReviews"
                type="number"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={courseReviews}
                onChange={(e) => setCourseReviews(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="courseStudents" className="block text-gray-700 text-sm font-semibold mb-2">Alunos</label>
              <input
                id="courseStudents"
                type="number"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={courseStudents}
                onChange={(e) => setCourseStudents(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="courseLessons" className="block text-gray-700 text-sm font-semibold mb-2">Aulas</label>
              <input
                id="courseLessons"
                type="number"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={courseLessons}
                onChange={(e) => setCourseLessons(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="courseBadge" className="block text-gray-700 text-sm font-semibold mb-2">Badge</label>
              <input
                id="courseBadge"
                type="text"
                placeholder="Destaque, Novo, Essencial..."
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                value={courseBadge}
                onChange={(e) => setCourseBadge(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Adicionar Curso
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
