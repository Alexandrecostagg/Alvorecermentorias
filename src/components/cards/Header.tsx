import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const nav = [
  { to: "/", label: "Início" },
  { to: "/courses", label: "Cursos" },
  { to: "/about", label: "Sobre" },
  { to: "/contact", label: "Contato" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b ${scrolled ? "shadow-sm" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-8 w-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700" />
          <span className="font-semibold text-lg tracking-tight">Alvorecer</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-brand-600 ${
                  isActive ? "text-brand-600" : "text-slate-700"
                }`
              }
            >
              {i.label}
            </NavLink>
          ))}
          <Link
            to="/signin"
            className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition"
          >
            Entrar
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition"
          >
            Criar conta
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-xl border p-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-2">
            {nav.map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-50 ${
                    isActive ? "text-brand-600" : "text-slate-700"
                  }`
                }
              >
                {i.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              <Link
                to="/signin"
                onClick={() => setOpen(false)}
                className="flex-1 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition"
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="flex-1 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition"
              >
                Criar conta
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
