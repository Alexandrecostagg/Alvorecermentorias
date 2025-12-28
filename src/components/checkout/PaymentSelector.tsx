import { CreditCard, QrCode, Barcode } from 'lucide-react'

type PaymentMethod = 'credit_card' | 'pix' | 'boleto'

interface PaymentSelectorProps {
    selectedMethod: PaymentMethod
    onSelect: (method: PaymentMethod) => void
}

export default function PaymentSelector({ selectedMethod, onSelect }: PaymentSelectorProps) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-alvorecer-gold" />
                Forma de Pagamento
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                    onClick={() => onSelect('pix')}
                    className={`
                        flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2
                        ${selectedMethod === 'pix'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-slate-100 hover:border-slate-300 text-slate-600'}
                    `}
                >
                    <QrCode className="h-8 w-8" />
                    <span className="font-bold">PIX</span>
                    <span className="text-xs text-green-600 font-medium">-5% OFF</span>
                </button>

                <button
                    onClick={() => onSelect('credit_card')}
                    className={`
                        flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2
                        ${selectedMethod === 'credit_card'
                            ? 'border-sky-500 bg-sky-50 text-sky-700'
                            : 'border-slate-100 hover:border-slate-300 text-slate-600'}
                    `}
                >
                    <CreditCard className="h-8 w-8" />
                    <span className="font-bold">Cartão</span>
                    <span className="text-xs text-slate-400">Até 12x</span>
                </button>

                <button
                    onClick={() => onSelect('boleto')}
                    className={`
                        flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2
                        ${selectedMethod === 'boleto'
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-slate-100 hover:border-slate-300 text-slate-600'}
                    `}
                >
                    <Barcode className="h-8 w-8" />
                    <span className="font-bold">Boleto</span>
                    <span className="text-xs text-slate-400">+2 dias úteis</span>
                </button>
            </div>

            {/* Dynamic Content based on selection */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-in fade-in">
                {selectedMethod === 'pix' && (
                    <div className="text-center">
                        <p className="text-sm text-slate-600 mb-2">O código PIX será gerado na próxima tela.</p>
                        <p className="text-xs text-slate-500">Aprovação imediata.</p>
                    </div>
                )}
                {selectedMethod === 'credit_card' && (
                    <div className="space-y-3">
                        <input placeholder="Número do Cartão" className="w-full p-3 rounded-lg border border-slate-300" disabled />
                        <div className="grid grid-cols-2 gap-3">
                            <input placeholder="MM/AA" className="w-full p-3 rounded-lg border border-slate-300" disabled />
                            <input placeholder="CVV" className="w-full p-3 rounded-lg border border-slate-300" disabled />
                        </div>
                        <input placeholder="Nome como no cartão" className="w-full p-3 rounded-lg border border-slate-300" disabled />
                        <p className="text-xs text-amber-600 flex items-center gap-1">
                            🔒 Ambiente seguro (Simulação)
                        </p>
                    </div>
                )}
                {selectedMethod === 'boleto' && (
                    <div className="text-center">
                        <p className="text-sm text-slate-600">O boleto será gerado após a confirmação.</p>
                        <p className="text-xs text-slate-500 mt-1">Vencimento em 3 dias úteis.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
