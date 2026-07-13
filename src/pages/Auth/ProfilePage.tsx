import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { User, Mail, Phone, Save, Calendar, FileText } from 'lucide-react'

export default function ProfilePage() {
    const { userProfile, saveUserProfile, user } = useAuth()

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [cpf, setCpf] = useState('')
    const [photoURL, setPhotoURL] = useState('')

    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name)
            setPhone(userProfile.phone || '')
            setBirthDate(userProfile.birthDate || '')
            setCpf(userProfile.cpf || '')
            setPhotoURL(userProfile.photoURL || '')
        }
    }, [userProfile])

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1')
    }

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCpf(formatCPF(e.target.value))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setSaving(true)
        try {
            await saveUserProfile(user.uid, {
                name,
                phone,
                birthDate,
                cpf
            })
            setMessage('Perfil atualizado com sucesso! ✅')
        } catch (error) {
            console.error(error)
            setMessage('Erro ao salvar as alterações. ❌')
        } finally {
            setSaving(false)
            setTimeout(() => setMessage(''), 3000)
        }
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-serif font-bold text-slate-900 text-center mb-8">Meu Perfil</h1>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100 p-8">

                    {userProfile?.role === 'admin' && (
                        <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-indigo-900">Acesso Administrativo</h3>
                                <p className="text-sm text-indigo-700">Você tem permissões de administrador.</p>
                            </div>
                            <Link to="/admin" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                                Acessar Painel
                            </Link>
                        </div>
                    )}

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center relative">
                                {photoURL ? (
                                    <img src={photoURL} alt="Perfil" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl text-slate-400 font-bold">
                                        {name.charAt(0).toUpperCase()}
                                    </span>
                                )}

                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">A foto do perfil será integrada com upload privado via Cloudflare em uma próxima etapa.</p>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-center mb-8 font-medium animate-in fade-in slide-in-from-top-2 ${message.includes('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-colors"
                                        placeholder="Seu nome"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail (Não alterável)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={userProfile?.email || ''}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={cpf}
                                        onChange={handleCpfChange}
                                        maxLength={14}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-colors"
                                        placeholder="000.000.000-00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                    <input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-colors text-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-colors"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-slate-200"
                            >
                                <Save className="h-5 w-5" />
                                {saving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
