import { CreditCard, QrCode, ShieldCheck } from 'lucide-react'

export default function PaymentSelector() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-alvorecer-gold" />
                Forma de Pagamento
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-green-100 bg-green-50 text-green-700 gap-2">
                    <QrCode className="h-8 w-8" />
                    <span className="font-bold">PIX</span>
                    <span className="text-xs text-green-600 font-medium">Confirmação pelo banco</span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-sky-100 bg-sky-50 text-sky-700 gap-2">
                    <CreditCard className="h-8 w-8" />
                    <span className="font-bold">Cartão</span>
                    <span className="text-xs text-sky-600 font-medium">Dados processados pela Asaas</span>
                </div>
            </div>

            <div className="mt-6 flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                <ShieldCheck className="h-5 w-5 shrink-0 text-green-600" />
                <p>Ao continuar, você será direcionado ao checkout seguro da Asaas para escolher PIX ou cartão. Este site não recebe nem armazena dados de cartão.</p>
            </div>
        </div>
    )
}
