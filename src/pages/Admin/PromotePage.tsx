import { useState } from 'react'
import { db } from '../../lib/firebase'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { CheckCircle, AlertCircle, Shield } from 'lucide-react'

export default function PromotePage() {
    const [status, setStatus] = useState<string>('')
    const [loading, setLoading] = useState(false)

    const adminsToPromote = [
        'alexandrecostagg@gmail.com',
        'saudeelaine@gmail.com'
    ]

    const handlePromote = async () => {
        setLoading(true)
        setStatus('Buscando usuários...')

        try {
            let successCount = 0

            for (const email of adminsToPromote) {
                const q = query(collection(db, 'users'), where('email', '==', email))
                const querySnapshot = await getDocs(q)

                if (querySnapshot.empty) {
                    setStatus(prev => prev + `\n⚠️ Usuário ${email} não encontrado no banco de dados. Ele precisa se cadastrar primeiro.`)
                } else {
                    const userDoc = querySnapshot.docs[0]
                    await updateDoc(doc(db, 'users', userDoc.id), {
                        role: 'admin'
                    })
                    setStatus(prev => prev + `\n✅ ${email} agora é ADMIN!`)
                    successCount++
                }
            }

            if (successCount > 0) {
                setStatus(prev => prev + `\n\n🎉 Sucesso! Atualize a página e tente acessar o /admin`)
            }

        } catch (error) {
            console.error(error)
            setStatus(`Erro crítico: ${error}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Promover Admins</h1>
                    <p className="text-slate-500 mt-2">Ferramenta de uso interno para conceder permissões.</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-200">
                    <p className="font-semibold text-slate-700 mb-2">Usuários a promover:</p>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                        {adminsToPromote.map(email => (
                            <li key={email}>{email}</li>
                        ))}
                    </ul>
                </div>

                {status && (
                    <div className={`mb-6 p-4 rounded-xl text-sm whitespace-pre-line ${status.includes('Erro') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {status}
                    </div>
                )}

                <button
                    onClick={handlePromote}
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? 'Processando...' : 'Aplicar Permissões de Admin'}
                </button>
            </div>
        </div>
    )
}
