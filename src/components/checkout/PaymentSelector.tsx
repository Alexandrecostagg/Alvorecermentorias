import { CheckCircle2, CreditCard, QrCode, ShieldCheck } from 'lucide-react'
import type { AsaasBillingType } from '../../lib/payments'

type Props = {
    selectedMethod: AsaasBillingType | null
    onSelect: (method: AsaasBillingType) => void
    disabled?: boolean
}

export default function PaymentSelector({ selectedMethod, onSelect, disabled = false }: Props) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-alvorecer-gold" />
                Forma de Pagamento
            </h2>

            <div role="radiogroup" aria-label="Forma de pagamento" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    type="button"
                    role="radio"
                    aria-checked={selectedMethod === 'PIX'}
                    disabled={disabled}
                    onClick={() => onSelect('PIX')}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 text-green-700 gap-2 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-green-200 disabled:cursor-wait disabled:opacity-60 ${
                        selectedMethod === 'PIX'
                            ? 'border-green-500 bg-green-50 shadow-sm'
                            : 'border-green-100 bg-green-50/60 hover:border-green-300 hover:bg-green-50'
                    }`}
                >
                    {selectedMethod === 'PIX' && <CheckCircle2 className="absolute right-3 top-3 h-5 w-5" aria-hidden="true" />}
                    <QrCode className="h-8 w-8" />
                    <span className="font-bold">PIX</span>
                    <span className="text-xs text-green-600 font-medium">Pagamento à vista</span>
                </button>

                <button
                    type="button"
                    role="radio"
                    aria-checked={selectedMethod === 'CREDIT_CARD'}
                    disabled={disabled}
                    onClick={() => onSelect('CREDIT_CARD')}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 text-sky-700 gap-2 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 disabled:cursor-wait disabled:opacity-60 ${
                        selectedMethod === 'CREDIT_CARD'
                            ? 'border-sky-500 bg-sky-50 shadow-sm'
                            : 'border-sky-100 bg-sky-50/60 hover:border-sky-300 hover:bg-sky-50'
                    }`}
                >
                    {selectedMethod === 'CREDIT_CARD' && <CheckCircle2 className="absolute right-3 top-3 h-5 w-5" aria-hidden="true" />}
                    <CreditCard className="h-8 w-8" />
                    <span className="font-bold">Cartão</span>
                    <span className="text-xs text-sky-600 font-medium">Dados processados pela Asaas</span>
                </button>
            </div>

            <div className="mt-6 flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                <ShieldCheck className="h-5 w-5 shrink-0 text-green-600" />
                <p>
                    {selectedMethod
                        ? `Ao continuar, você será direcionado à Asaas para concluir o pagamento por ${selectedMethod === 'PIX' ? 'PIX' : 'cartão'}.`
                        : 'Escolha PIX ou cartão para continuar no checkout seguro da Asaas.'}
                    {' '}Este site não recebe nem armazena dados de cartão.
                </p>
            </div>
        </div>
    )
}
