import { BadgeCheck, BookHeart, CreditCard, PackageCheck } from 'lucide-react'

const items = [
  { icon: BadgeCheck, title: 'Curadoria cristã', text: 'Conteúdo selecionado com propósito' },
  { icon: CreditCard, title: 'Pagamento seguro', text: 'Processado em ambiente protegido' },
  { icon: BookHeart, title: 'Entrega digital', text: 'Acesso após a confirmação' },
  { icon: PackageCheck, title: 'Seus pedidos', text: 'Acompanhe tudo pela sua conta' },
]

export default function TrustStrip() {
  return (
    <section aria-label="Benefícios da Alvorecer" className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 md:grid-cols-4 md:px-6">
        {items.map(({ icon: Icon, title, text }, index) => (
          <div key={title} className={`flex gap-3 px-3 py-6 md:px-5 ${index % 2 === 1 ? 'border-l border-slate-200' : ''} ${index > 1 ? 'border-t border-slate-200 md:border-t-0 md:border-l' : ''}`}>
            <Icon className="h-6 w-6 flex-none text-[#B58018]" />
            <div>
              <p className="text-sm font-bold text-slate-900">{title}</p>
              <p className="mt-0.5 text-xs leading-5 text-slate-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
