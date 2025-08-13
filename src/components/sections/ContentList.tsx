type Item = {
  id: string;
  title: string;
  excerpt: string;
  category: "Estudos" | "Notícias" | "Eventos" | "Lançamentos";
  date?: string;
};

const MOCK: Item[] = [
  { id: "1", title: "A beleza da unidade (Sl 133)", excerpt: "Reflexões sobre a comunhão dos santos.", category: "Estudos", date: "2025-07-20" },
  { id: "2", title: "Conferência Regional 2025", excerpt: "Veja as datas e cidades participantes.", category: "Eventos", date: "2025-09-05" },
  { id: "3", title: "Novo e-book gratuito", excerpt: "Baixe agora e compartilhe com sua igreja.", category: "Lançamentos", date: "2025-08-01" },
];

export default function ContentList() {
  return (
    <section>
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-semibold">Novidades</h2>
        <a href="/blog" className="text-sm font-medium text-brand-700 hover:underline">
          Ver todas
        </a>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {MOCK.map((p) => (
          <article key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="rounded-lg bg-brand-50 px-2 py-1 font-medium text-brand-700">{p.category}</span>
              {p.date && <time className="text-slate-500">{new Date(p.date).toLocaleDateString()}</time>}
            </div>
            <h3 className="mt-3 text-base font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{p.excerpt}</p>
            <a href={`/post/${p.id}`} className="mt-3 inline-flex text-sm font-medium text-brand-700 hover:underline">
              Ler mais
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
