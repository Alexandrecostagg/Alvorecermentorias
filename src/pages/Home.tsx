import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Baby,
  BookHeart,
  BookOpen,
  ChevronDown,
  Compass,
  CreditCard,
  FileText,
  HeartHandshake,
  Package,
  PackageCheck,
  Quote,
  Sparkles,
} from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../types'
import ProductDetailsModal from '../components/modals/ProductDetailsModal'
import ProductImage from '../components/ui/ProductImage'

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function isDigital(product: Product) {
  const type = product.type?.toLocaleLowerCase('pt-BR') ?? ''
  return product.shippingRequired === false || type.includes('digital') || type.includes('ebook') || type.includes('e-book')
}

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-alvorecer-brown focus-visible:ring-offset-2'
const focusRingDark =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-alvorecer-gold focus-visible:ring-offset-2 focus-visible:ring-offset-alvorecer-ink'

const trustItems = [
  { icon: BadgeCheck, title: 'Curadoria cristã', text: 'Conteúdo selecionado com propósito' },
  { icon: CreditCard, title: 'Pagamento seguro', text: 'Processado em ambiente protegido' },
  { icon: BookHeart, title: 'Entrega digital', text: 'Acesso após a confirmação' },
  { icon: PackageCheck, title: 'Seus pedidos', text: 'Acompanhe tudo pela sua conta' },
]

const paths = [
  {
    title: 'Livros & Devocionais',
    desc: 'Leituras selecionadas para aprofundar sua fé e renovar sua rotina com Deus.',
    icon: BookOpen,
    href: '/loja',
    accent: 'bg-path-green-bg text-path-green-fg',
    number: '01',
  },
  {
    title: 'Recursos para crescer',
    desc: 'Materiais práticos para vida cristã, família, liderança e ministério.',
    icon: Compass,
    href: '/loja',
    accent: 'bg-path-amber-bg text-path-amber-fg',
    number: '02',
  },
  {
    title: 'Alvorecer Kids',
    desc: 'Conteúdos que ajudam os pequenos a descobrir a fé de forma leve e significativa.',
    icon: Baby,
    href: '/kids',
    accent: 'bg-path-blue-bg text-path-blue-fg',
    number: '03',
  },
  {
    title: 'Caminhe conosco',
    desc: 'Conheça a visão da Alvorecer e encontre um próximo passo para sua jornada.',
    icon: HeartHandshake,
    href: '/sobre',
    accent: 'bg-path-clay-bg text-path-clay-fg',
    number: '04',
  },
]

const faqs = [
  {
    question: 'Os conteúdos são físicos ou digitais?',
    answer:
      'Temos os dois formatos. Cada produto mostra a etiqueta “Digital” ou “Produto físico” antes da compra, e você recebe o acesso ou o envio conforme o tipo escolhido.',
  },
  {
    question: 'Em quanto tempo recebo o material digital?',
    answer:
      'O acesso é liberado assim que o pagamento é confirmado. Para produtos digitais, o arquivo fica disponível na sua conta e na área Minha Biblioteca.',
  },
  {
    question: 'O pagamento é seguro?',
    answer:
      'Sim. Todo o processamento acontece em ambiente protegido, com confirmação automática do pedido e acompanhamento pela sua conta.',
  },
  {
    question: 'Preciso ter conhecimento bíblico avançado?',
    answer:
      'Não. A curadoria foi pensada para quem está começando e para quem já caminha há anos — o objetivo é tornar o conteúdo aplicável no dia a dia.',
  },
  {
    question: 'Como falo com a equipe se tiver dúvidas?',
    answer:
      'É só acessar a página de contato. Nossa equipe responde com atenção para ajudar você a encontrar o próximo passo.',
  },
]

export default function Home() {
  const { products, loading, error } = useProducts({ section: 'store' })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const featuredProducts = useMemo(
    () => [...products].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, 4),
    [products],
  )

  return (
    <>
      {/* ============ HERO — objetivo: levar à loja ============ */}
      <section className="relative overflow-hidden bg-alvorecer-ink text-white">
        <div className="absolute inset-0 opacity-40" aria-hidden="true">
          <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-alvorecer-gold/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-alvorecer-navy/80 to-transparent" />
        </div>

        <div className="relative mx-auto grid min-h-[640px] max-w-7xl items-center gap-10 px-4 py-16 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="relative z-10 max-w-2xl">
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-alvorecer-gold/30 bg-alvorecer-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-alvorecer-gold-light">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Fé que amadurece. Propósito que transforma.
            </p>

            <h1 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Conteúdo bíblico para viver uma fé{' '}
              <span className="text-alvorecer-gold">prática todos os dias.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 md:text-xl">
              Livros, recursos e experiências para fortalecer sua caminhada com Deus, sua família e seu chamado.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/loja"
                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-alvorecer-gold px-7 py-4 font-bold text-alvorecer-ink shadow-lg shadow-alvorecer-gold/15 transition hover:-translate-y-0.5 hover:bg-alvorecer-gold-hover ${focusRingDark}`}
              >
                Explorar conteúdos
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                to="/sobre"
                className={`inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white transition hover:bg-white/10 ${focusRingDark}`}
              >
                Conheça nossa missão
              </Link>
            </div>

            <div className="mt-10 flex items-start gap-3 border-l-2 border-alvorecer-gold pl-4 text-sm leading-6 text-slate-300">
              <BookOpen className="mt-0.5 h-5 w-5 flex-none text-alvorecer-gold" aria-hidden="true" />
              <p>Uma curadoria cristã criada para transformar conhecimento em vida.</p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[540px] lg:mx-0 lg:ml-auto">
            <div className="absolute -inset-4 rounded-[2.5rem] border border-white/10" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-800 shadow-2xl shadow-black/30">
              <img
                src="/alexandre-gomes-costa.jpg"
                alt="Alexandre Costa compartilhando uma mensagem"
                width="540"
                height="675"
                loading="eager"
                className="h-full w-full object-cover object-[50%_34%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-alvorecer-deep via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="max-w-sm font-serif text-xl font-semibold leading-snug sm:text-2xl">
                  “Conhecer a verdade é o começo. Vivê-la é a transformação.”
                </p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-alvorecer-gold">Alvorecer Mentorias</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-2xl border border-white/10 bg-white px-5 py-4 text-slate-900 shadow-xl sm:-left-8">
              <strong className="block text-2xl font-black text-alvorecer-brown">Um novo dia</strong>
              <span className="text-sm text-slate-600">para sua caminhada de fé</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROVA — objetivo: gerar confiança ============ */}
      <section aria-labelledby="confianca-heading" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
          <h2 id="confianca-heading" className="text-xs font-bold uppercase tracking-[0.2em] text-alvorecer-brown">
            Por que confiar na Alvorecer
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3">
                <Icon className="h-6 w-6 flex-none text-alvorecer-brown" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{title}</p>
                  <p className="mt-0.5 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <figure className="mt-12 rounded-2xl border border-alvorecer-line bg-alvorecer-canvas p-6 md:p-8">
            <Quote className="h-6 w-6 text-alvorecer-brown" aria-hidden="true" />
            <blockquote className="mt-3 max-w-3xl font-serif text-xl font-semibold leading-8 text-slate-900 md:text-2xl">
              “Mais do que vender livros, a Alvorecer me ajudou a criar o hábito de aplicar a Palavra na rotina. Hoje
              enxergo minha fé de forma prática.”
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-slate-600">
              Mariana Alves · leitora da Alvorecer desde 2024
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ============ OFERTA 1 — objetivo: orientar a escolha ============ */}
      <section aria-labelledby="caminhos-heading" className="bg-alvorecer-canvas py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-alvorecer-brown">Encontre seu próximo passo</p>
              <h2 id="caminhos-heading" className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 md:text-5xl">
                Uma jornada, vários caminhos.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 md:justify-self-end">
              A Alvorecer reúne conteúdo e recursos para diferentes momentos da vida, sempre com profundidade bíblica e
              aplicação prática.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paths.map(({ title, desc, icon: Icon, href, accent, number }) => (
              <Link
                key={title}
                to={href}
                className={`group relative flex min-h-72 flex-col overflow-hidden rounded-3xl border border-alvorecer-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-alvorecer-gold/60 hover:shadow-xl hover:shadow-slate-900/5 ${focusRing}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-4 font-serif text-5xl font-bold text-slate-200 transition group-hover:text-alvorecer-gold/30"
                >
                  {number}
                </span>
                <span className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="relative mt-10 font-serif text-xl font-bold text-slate-950">{title}</h3>
                <p className="relative mt-3 flex-1 text-sm leading-6 text-slate-600">{desc}</p>
                <span className="relative mt-7 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                  Explorar
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OFERTA 2 — objetivo: levar à compra ============ */}
      <section aria-labelledby="destaques-heading" className="bg-white py-20 md:py-28">
        <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-alvorecer-brown">Escolhas para sua caminhada</p>
              <h2 id="destaques-heading" className="mt-3 font-serif text-3xl font-bold text-slate-950 md:text-5xl">
                Conteúdos em destaque
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Recursos que aproximam conhecimento, prática e transformação.</p>
            </div>
            <Link
              to="/loja"
              className={`inline-flex items-center gap-2 self-start rounded-lg font-bold text-slate-900 transition hover:text-alvorecer-brown-deep sm:self-auto ${focusRing}`}
            >
              Ver toda a loja <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <div role="status" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <span className="sr-only">Carregando produtos em destaque</span>
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-[430px] animate-pulse rounded-3xl bg-slate-100" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-700">
              Os destaques estão sendo preparados. Você ainda pode acessar todos os produtos na loja.
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-700">
              Novos conteúdos serão publicados em breve.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => {
                const digital = isDigital(product)
                return (
                  <article
                    key={product.id}
                    className="group overflow-hidden rounded-3xl border border-alvorecer-line bg-alvorecer-surface transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className={`block w-full text-left ${focusRing}`}
                      aria-label={`Ver detalhes de ${product.title}`}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-alvorecer-image-bg">
                        <ProductImage
                          src={product.image}
                          alt={`Capa do produto ${product.title}`}
                          width="400"
                          height="500"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur">
                          {digital ? <FileText className="h-3.5 w-3.5" aria-hidden="true" /> : <Package className="h-3.5 w-3.5" aria-hidden="true" />}
                          {digital ? 'Digital' : 'Produto físico'}
                        </span>
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-alvorecer-brown">{product.category}</p>
                        <h3 className="mt-2 min-h-12 font-serif text-lg font-bold leading-6 text-slate-950">{product.title}</h3>
                        {product.author && <p className="mt-2 truncate text-sm text-slate-600">{product.author}</p>}
                        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                          <strong className="text-lg text-slate-950">{money.format(product.price)}</strong>
                          <span className="text-sm font-bold text-slate-700 transition group-hover:text-alvorecer-brown-deep">Ver detalhes</span>
                        </div>
                      </div>
                    </button>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ============ OBJEÇÃO — objetivo: remover dúvidas ============ */}
      <section aria-labelledby="faq-heading" className="bg-alvorecer-canvas py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-alvorecer-brown">Ainda tem dúvidas?</p>
            <h2 id="faq-heading" className="mt-3 font-serif text-3xl font-bold leading-tight text-slate-950 md:text-5xl">
              O que você precisa saber antes de começar.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Reunimos as perguntas mais frequentes para você decidir com tranquilidade. Se faltar algo, fale com a
              gente.
            </p>
            <Link
              to="/contato"
              className={`mt-7 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-50 ${focusRing}`}
            >
              Falar com a equipe <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>

          <dl className="divide-y divide-alvorecer-line rounded-2xl border border-alvorecer-line bg-white">
            {faqs.map(({ question, answer }) => (
              <div key={question}>
                <dt>
                  <details className="group">
                    <summary
                      className={`flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-slate-900 transition marker:hidden hover:bg-alvorecer-surface ${focusRing}`}
                    >
                      {question}
                      <ChevronDown className="h-5 w-5 flex-none text-alvorecer-brown transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <dd className="px-6 pb-5 text-sm leading-6 text-slate-600">{answer}</dd>
                  </details>
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============ CTA FINAL — objetivo: conversão direta ============ */}
      <section aria-labelledby="cta-heading" className="bg-alvorecer-ink py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-tl-[2rem] border-l-2 border-t-2 border-alvorecer-gold" aria-hidden="true" />
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-800">
              <img
                src="/alexandre-gomes-costa.jpg"
                alt="Alexandre Costa durante uma ministração"
                width="448"
                height="560"
                loading="lazy"
                className="h-full w-full object-cover object-[50%_30%]"
              />
            </div>
            <div className="absolute -bottom-6 -right-3 max-w-[260px] rounded-2xl bg-alvorecer-gold p-5 text-alvorecer-ink shadow-xl sm:-right-8">
              <Quote className="h-6 w-6" aria-hidden="true" />
              <p className="mt-2 font-serif font-bold leading-6">Uma fé que alcança a mente, o coração e a vida.</p>
            </div>
          </div>

          <div className="lg:pl-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-alvorecer-gold-light">Comece hoje</p>
            <h2 id="cta-heading" className="mt-4 max-w-2xl font-serif text-3xl font-bold leading-tight md:text-5xl">
              Dê o próximo passo na sua caminhada de fé.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Escolha um conteúdo, aplique no seu dia a dia e amadureça com propósito. A Alvorecer existe para tornar
              isso simples e presente na sua rotina.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/loja"
                className={`inline-flex items-center justify-center gap-2 rounded-xl bg-alvorecer-gold px-6 py-3.5 font-bold text-alvorecer-ink transition hover:bg-alvorecer-gold-hover ${focusRingDark}`}
              >
                Explorar conteúdos <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                to="/contato"
                className={`inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10 ${focusRingDark}`}
              >
                Fale com nossa equipe
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
