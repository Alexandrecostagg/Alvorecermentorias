import { useEffect, useState } from 'react'
import { BookOpen, Download, Loader2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { createDigitalDownloadLink, loadLibrary } from '../../lib/digitalDelivery'
import type { LibraryItem } from '../../types'
import ProductImage from '../../components/ui/ProductImage'

export default function LibraryPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<LibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    loadLibrary(user)
      .then(setItems)
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Não foi possível carregar sua biblioteca.'))
      .finally(() => setLoading(false))
  }, [user])

  const handleDownload = async (item: LibraryItem) => {
    if (!user) return
    setDownloadingId(item.id)
    setError(null)
    try {
      const url = await createDigitalDownloadLink(user, item.id)
      const link = document.createElement('a')
      link.href = url
      link.rel = 'noopener'
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível baixar o arquivo.')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <section className="min-h-[70vh] bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-100 p-3"><BookOpen className="h-7 w-7 text-indigo-700" /></div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Minha Biblioteca</h1>
            <p className="text-slate-600">Seus materiais digitais liberados após a confirmação do pagamento.</p>
          </div>
        </div>

        {error && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-16 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" /> Carregando biblioteca...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
            <h2 className="mt-4 text-xl font-bold text-slate-900">Nenhum material liberado ainda</h2>
            <p className="mt-2 text-slate-600">Quando o pagamento de um produto digital for confirmado, ele aparecerá aqui automaticamente.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(item => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="aspect-[4/3] bg-slate-100">
                  <ProductImage src={item.image || ''} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-green-700">
                    <ShieldCheck className="h-4 w-4" /> Compra confirmada
                  </div>
                  <h2 className="font-bold text-slate-900">{item.title}</h2>
                  <p className="mt-1 truncate text-sm text-slate-500">{item.fileName}</p>
                  <button
                    type="button"
                    onClick={() => void handleDownload(item)}
                    disabled={downloadingId === item.id}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {downloadingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {downloadingId === item.id ? 'Preparando...' : 'Baixar arquivo'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
