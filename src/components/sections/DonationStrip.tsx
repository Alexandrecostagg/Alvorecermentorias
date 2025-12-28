export default function DonationStrip() {
  return (
    <section id="doar" className="bg-gradient-to-r from-pink-100 via-rose-100 to-orange-100 border-y border-slate-200/60">
      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-3 md:flex md:items-center md:justify-between">
        <p className="text-slate-800 font-medium">Apoie esse projeto e alcance mais vidas com a Palavra.</p>
        <div className="flex gap-2">
          <a className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium" href="#">Doar agora</a>
          <a className="rounded-xl bg-white text-slate-900 px-4 py-2 text-sm font-medium border border-slate-200" href="#">Saiba mais</a>
        </div>
      </div>
    </section>
  )
}
