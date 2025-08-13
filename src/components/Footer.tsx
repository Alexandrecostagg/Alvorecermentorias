export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="inline-block h-7 w-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700" />
              <span className="font-semibold">Alvorecer</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 max-w-md">
              Plataforma cristã com cursos, devocionais e ferramentas para estudo bíblico.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="hover:text-brand-600" href="/courses">Cursos</a></li>
              <li><a className="hover:text-brand-600" href="/blog">Blog</a></li>
              <li><a className="hover:text-brand-600" href="/about">Sobre</a></li>
              <li><a className="hover:text-brand-600" href="/contact">Contato</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="hover:text-brand-600" href="/terms">Termos</a></li>
              <li><a className="hover:text-brand-600" href="/privacy">Privacidade</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-xs text-slate-500 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
          <p>© {new Date().getFullYear()} Alvorecer. Todos os direitos reservados.</p>
          <p>Feito com ❤️ e propósito.</p>
        </div>
      </div>
    </footer>
  );
}
