import { useEffect, useRef, useState } from 'react'
import { MapPin, Plus, Check, Home } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { CepLookupError, formatCep, lookupCep, sanitizeCep } from '../../lib/cep'
import type { Address } from '../../types'

type Props = {
    selectedAddressId: string | null
    onSelect: (id: string) => void
}

export default function AddressSelector({ selectedAddressId, onSelect }: Props) {
    const { userProfile, saveUserProfile, user } = useAuth()
    const [isAdding, setIsAdding] = useState(false)
    const [isLoadingCep, setIsLoadingCep] = useState(false)
    const [cepError, setCepError] = useState('')
    const [cepMessage, setCepMessage] = useState('')
    const cepRequestRef = useRef<AbortController | null>(null)
    const streetInputRef = useRef<HTMLInputElement | null>(null)
    const numberInputRef = useRef<HTMLInputElement | null>(null)

    // Form State
    const [street, setStreet] = useState('')
    const [number, setNumber] = useState('')
    const [complement, setComplement] = useState('')
    const [neighborhood, setNeighborhood] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')

    useEffect(() => () => cepRequestRef.current?.abort(), [])

    // Auto-select first address if none selected
    if (!selectedAddressId && userProfile?.addresses && userProfile.addresses.length > 0) {
        onSelect(userProfile.addresses[0].id)
    }

    const checkCEP = async (cep: string) => {
        const cleanCep = sanitizeCep(cep)
        if (cleanCep.length !== 8) return

        cepRequestRef.current?.abort()
        const controller = new AbortController()
        cepRequestRef.current = controller

        setIsLoadingCep(true)
        setCepError('')
        setCepMessage('')
        try {
            const address = await lookupCep(cleanCep, controller.signal)
            if (controller.signal.aborted) return

            setZipCode(address.zipCode)
            setStreet(address.street)
            setNeighborhood(address.neighborhood)
            setCity(address.city)
            setState(address.state)
            setCepMessage(
                address.street && address.neighborhood
                    ? 'Endereço encontrado. Confira os dados e informe o número.'
                    : 'CEP localizado. Complete rua, bairro e número.'
            )

            requestAnimationFrame(() => {
                const nextInput = address.street ? numberInputRef.current : streetInputRef.current
                nextInput?.focus()
            })
        } catch (error) {
            if (controller.signal.aborted) return

            if (error instanceof CepLookupError && error.code === 'not-found') {
                setCepError('CEP não encontrado. Confira os números ou preencha o endereço manualmente.')
            } else {
                setCepError('Não foi possível consultar o CEP agora. Preencha o endereço manualmente.')
            }
        } finally {
            if (cepRequestRef.current === controller) {
                setIsLoadingCep(false)
                cepRequestRef.current = null
            }
        }
    }

    const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = formatCep(e.target.value)
        setZipCode(val)
        setCepError('')
        setCepMessage('')

        if (sanitizeCep(val).length === 8) {
            void checkCEP(val)
        } else {
            cepRequestRef.current?.abort()
            cepRequestRef.current = null
            setIsLoadingCep(false)
        }
    }

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !userProfile) return

        const newAddress: Address = {
            id: crypto.randomUUID(),
            street,
            number,
            complement,
            neighborhood,
            city,
            state,
            zipCode
        }

        // Safely spread addresses
        const currentAddresses = userProfile.addresses || []
        const updatedAddresses = [...currentAddresses, newAddress]

        // Save to Firestore
        await saveUserProfile(user.uid, { addresses: updatedAddresses })

        // Auto select the new address
        onSelect(newAddress.id)

        // Clean up
        setIsAdding(false)
        setStreet('')
        setNumber('')
        setComplement('')
        setNeighborhood('')
        setCity('')
        setState('')
        setZipCode('')
        setCepError('')
        setCepMessage('')
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-alvorecer-gold" />
                Endereço de Entrega
            </h2>

            {/* List Addresses */}
            <div className="space-y-3 mb-6">
                {(userProfile?.addresses || []).map((addr) => (
                    <div
                        key={addr.id}
                        onClick={() => onSelect(addr.id)}
                        className={`
                            relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4
                            ${selectedAddressId === addr.id
                                ? 'border-sky-500 bg-sky-50'
                                : 'border-slate-100 hover:border-slate-300'
                            }
                        `}
                    >
                        <div className={`mt-1 p-2 rounded-full ${selectedAddressId === addr.id ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
                            {selectedAddressId === addr.id ? <Check className="h-4 w-4" /> : <Home className="h-4 w-4" />}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">{addr.street}, {addr.number}</p>
                            {addr.complement && <p className="text-sm text-slate-600">{addr.complement}</p>}
                            <p className="text-sm text-slate-600">{addr.neighborhood} - {addr.city}/{addr.state}</p>
                            <p className="text-xs text-slate-400 mt-1">CEP: {addr.zipCode}</p>
                        </div>
                    </div>
                ))}

                {(!userProfile?.addresses || userProfile.addresses.length === 0) && !isAdding && (
                    <p className="text-slate-500 text-sm py-2">Você ainda não tem endereços cadastrados.</p>
                )}
            </div>

            {/* Add Address Form or Button */}
            {isAdding ? (
                <form onSubmit={handleSaveAddress} className="bg-slate-50 p-4 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                    <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                        Novo Endereço
                        {isLoadingCep && <span className="text-xs text-slate-500 font-normal animate-pulse">Buscando CEP...</span>}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-2">
                            <input
                                required
                                inputMode="numeric"
                                autoComplete="postal-code"
                                aria-describedby="cep-feedback"
                                aria-invalid={Boolean(cepError)}
                                placeholder="CEP"
                                value={zipCode}
                                onChange={handleZipChange}
                                maxLength={9}
                                className="w-full p-2 rounded border border-slate-300 text-sm focus:border-slate-900 focus:outline-none"
                            />
                            <div id="cep-feedback" className="mt-1 min-h-5 text-xs">
                                {cepError && <p role="alert" className="text-red-600">{cepError}</p>}
                                {cepMessage && <p role="status" className="text-emerald-700">{cepMessage}</p>}
                            </div>
                        </div>
                        <div className="col-span-1">
                            <input
                                ref={streetInputRef}
                                required
                                placeholder="Rua / Av."
                                value={street}
                                onChange={e => setStreet(e.target.value)}
                                disabled={isLoadingCep}
                                className="w-full p-2 rounded border border-slate-300 text-sm bg-white disabled:bg-slate-100"
                            />
                        </div>
                        <div className="col-span-1">
                            <input ref={numberInputRef} required placeholder="Número" value={number} onChange={e => setNumber(e.target.value)} className="w-full p-2 rounded border border-slate-300 text-sm" />
                        </div>
                        <div className="col-span-2">
                            <input placeholder="Complemento / Ponto de Referência" value={complement} onChange={e => setComplement(e.target.value)} className="w-full p-2 rounded border border-slate-300 text-sm" />
                        </div>
                        <div className="col-span-2">
                            <input required placeholder="Bairro" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className="w-full p-2 rounded border border-slate-300 text-sm" />
                        </div>
                        <div className="col-span-1">
                            <input required placeholder="Cidade" value={city} onChange={e => setCity(e.target.value)} className="w-full p-2 rounded border border-slate-300 text-sm" />
                        </div>
                        <div className="col-span-1">
                            <input required placeholder="Estado (UF)" value={state} onChange={e => setState(e.target.value)} className="w-full p-2 rounded border border-slate-300 text-sm" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800">Salvar Endereço</button>
                        <button type="button" onClick={() => setIsAdding(false)} className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50">Cancelar</button>
                    </div>
                </form>
            ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-slate-400 hover:text-slate-700 transition-colors"
                >
                    <Plus className="h-5 w-5" /> Adicionar Novo Endereço
                </button>
            )}
        </div>
    )
}
