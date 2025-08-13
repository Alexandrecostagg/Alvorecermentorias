export default function DonationStrip() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white">
      <div className="grid gap-6 p-6 md:grid-cols-4 md:p-8">
        {/* Coluna 1: Chamada */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold">Contribua com o ministério</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ajude a levar conteúdos bíblicos gratuitos e formar novos discípulos.
          </p>
        </div>

        {/* Coluna 2: Mensal */}
        <div className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold">Ofertas mensais</h3>
          <p className="mt-1 text-sm text-slate-600">
            Torne-se cooperador recorrente (sem consumir o limite do cartão).
          </p>
          <a
            href="/doar/mensal"
            className="mt-3 inline-flex items-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Doar agora
          </a>
        </div>

        {/* Coluna 3: Projetos */}
        <div className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold">Projetos especiais</h3>
          <p className="mt-1 text-sm text-slate-600">
            Financie literaturas e conteúdos gratuitos para abençoar mais pessoas.
          </p>
          <a
            href="/doar/projetos"
            className="mt-3 inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Ver projetos
          </a>
        </div>

        {/* Coluna 4: PIX / Conta */}
        <div className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold">PIX / Depósito</h3>
          <div className="mt-2 space-y-2 text-sm">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="font-medium">Chave PIX:</span>{" "}
              <span className="select-all">doacoes@alvorecer.app</span>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="font-medium">Banco:</span> Itaú — Ag. 0000 — C/C 00000-0
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
