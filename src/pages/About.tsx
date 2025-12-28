import { Share2, Heart, Lightbulb } from 'lucide-react'

export default function About() {
  return (
    <div className="bg-alvorecer-cream/30 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/235615/pexels-photo-235615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <span className="inline-block text-alvorecer-gold font-bold tracking-wider uppercase text-sm mb-4">Nossa Essência</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Mais que uma plataforma,<br />um despertar espiritual.</h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            "As misericórdias do Senhor são a causa de não sermos consumidos... renovam-se a cada manhã." <br />
            <span className="text-alvorecer-gold mt-2 block font-serif italic">- Lamentações 3:22-23</span>
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl ring-1 ring-slate-200 bg-slate-100 relative">
                <img src="https://images.pexels.com/photos/3367850/pexels-photo-3367850.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Equipe Alvorecer" className="w-full h-full object-cover" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
                  <p className="text-sm font-medium text-slate-800">"Nosso sonho nasceu em uma pequena sala de oração."</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Como tudo começou</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                <p>
                  O <strong>Alvorecer</strong> não surgiu de um plano de negócios, mas de um incômodo no coração. Percebemos que, em meio a tanto ruído digital, muitas pessoas se sentiam sozinhas em sua caminhada de fé.
                </p>
                <p>
                  Como o sol que rompe a escuridão da madrugada, entendemos que nossa missão era trazer luz, direção e, acima de tudo, companhia para essa jornada.
                </p>
                <p>
                  O que começou como grupos pequenos de mentoria cresceu. Hoje somos uma comunidade vibrante, unida pelo desejo de conhecer a Deus profundamente e viver o Evangelho de forma prática, em família e na sociedade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Nossos Pilares</h2>
            <p className="mt-4 text-slate-600">Fundamentos inegociáveis que sustentam tudo o que construímos aqui.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lightbulb, title: 'Verdade Bíblica', desc: 'Não negociamos a Palavra. Todo nosso conteúdo é enraizado nas Escrituras, sem atalhos.' },
              { icon: Heart, title: 'Cuidado Intencional', desc: 'Cada mentoria, cada curso é pensado para curar feridas e fortalecer o caráter de Cristo em você.' },
              { icon: Share2, title: 'Comunidade Viva', desc: 'Acreditamos que a fé cresce na comunhão. Aqui você nunca caminha sozinho.' }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl hover:bg-alvorecer-cream/50 transition-colors border border-slate-100 hover:border-alvorecer-gold/30 group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-alvorecer-gold mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
