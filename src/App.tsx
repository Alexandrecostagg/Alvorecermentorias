// src/App.tsx
import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Mentoring from './components/Mentoring';
import BoxKitsSection from './components/BoxKitsSection';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CoursesList from './components/CoursesList';

// Lazy import da página Admin (carrega sob demanda)
const AdminPage = lazy(() => import('./pages/AdminPage'));

/** Componente Home: reúne as seções da landing page */
function Home() {
  return (
    <>
      <Hero />
      <About />
      <CoursesList />
      <Mentoring />
      <BoxKitsSection />
      <Testimonials />
      <Contact />
    </>
  );
}

/** Scroll to top ao trocar de rota */
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

/** Placeholder de proteção de rota admin (adicione sua lógica de auth aqui) */
function RequireAdmin({ children }: { children: React.ReactNode }) {
  // TODO: plugue aqui sua verificação (ex.: contexto de auth / token / role)
  const isAdmin = true; // trocar por sua lógica
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/** 404 simples e elegante */
function NotFound() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Página não encontrada</h1>
        <p className="text-gray-600 mb-6">
          A página que você tentou acessar não existe ou foi movida.
        </p>
        <a
          href="/"
          className="inline-block rounded-lg px-5 py-3 bg-black text-white hover:opacity-90 transition"
        >
          Voltar para a Home
        </a>
      </div>
    </div>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white font-inter">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppShell>
        <Suspense
          fallback={
            <div className="min-h-[40vh] flex items-center justify-center">
              <span className="animate-pulse text-gray-500">
                Carregando...
              </span>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPage />
                </RequireAdmin>
              }
            />
            {/* Exemplo (futuro): <Route path="/cursos/:id" element={<CourseDetails />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppShell>
    </Router>
  );
}

export default App;
