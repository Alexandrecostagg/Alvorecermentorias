import { useState, useEffect } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const SLIDES = [
  {
    id: 1,
    src: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    alt: 'Paisagem ao amanhecer representando uma nova jornada de fé',
    tag: 'Livraria Alvorecer',
    title: <>Recursos para fortalecer sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-alvorecer-gold to-yellow-200">caminhada de fé.</span></>,
    desc: 'Encontre livros, devocionais e materiais selecionados para sua vida, família e ministério.',
    primaryAction: { text: 'Explorar a Loja', link: '/loja' },
    secondaryAction: { text: 'Conhecer a Alvorecer', link: '/sobre' }
  },
  {
    id: 2,
    src: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260',
    alt: 'Família reunida representando a coleção infantil Alvorecer',
    tag: 'Lançamento Loja',
    title: <>Coleção <span className="text-sky-400">Kids</span> Disponível</>,
    desc: 'Materiais lúdicos para ensinar o caminho da luz aos pequenos desde cedo.',
    primaryAction: { text: 'Ver Coleção Kids', link: '/kids' },
    secondaryAction: null
  }
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const next = () => setCurrent(p => (p + 1) % SLIDES.length)
  const prev = () => setCurrent(p => (p === 0 ? SLIDES.length - 1 : p - 1))

  return (
    <section className="relative h-[600px] lg:h-[700px] bg-slate-900 group overflow-hidden">

      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Background */}
          <div className="absolute inset-0">
            <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-20 h-full max-w-6xl mx-auto px-4 flex items-center">
            <div className="max-w-3xl transform transition-all duration-1000 translate-y-0 opacity-100">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-6 border bg-alvorecer-gold/20 text-alvorecer-gold border-alvorecer-gold/30">
                {slide.tag}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6 text-white">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
                {slide.desc}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {slide.primaryAction && (
                  <Link
                    to={slide.primaryAction.link}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-alvorecer-gold px-8 py-4 text-slate-900 font-bold hover:bg-alvorecer-gold/90 transition-all shadow-lg shadow-alvorecer-gold/20 hover:scale-105"
                  >
                    {slide.primaryAction.text}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                )}
                {slide.secondaryAction && (
                  <Link
                    to={slide.secondaryAction.link}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-8 py-4 text-white font-semibold hover:bg-white/20 transition-all border border-white/10"
                  >
                    {slide.secondaryAction.text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button aria-label="Slide anterior" onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button aria-label="Próximo slide" onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Exibir slide ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-alvorecer-gold w-8' : 'bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>

    </section>
  )
}
