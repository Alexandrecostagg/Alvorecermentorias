import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { deleteApp, initializeApp } from 'firebase/app'
import { doc, getDoc, getFirestore, Timestamp } from 'firebase/firestore'

const cleanupPlan = [
  { documentId: 'uUa9ofp6qSGkQgjTtPW4', title: 'Bíblia Alvorecer Kids', section: 'kids' },
  { documentId: 'UodDnxCdB8AzUqMk77OG', title: 'Oração que Transforma', section: 'store' },
  { documentId: 'hDTmkcwcQDr7PPA44Y20', title: 'Kit Aventureiros da Fé', section: 'kids' },
  { documentId: 'GILaYMvmubuGLpC3R0xc', title: 'Leãozinho da Tribo (Pelúcia)', section: 'kids' },
  { documentId: 'orkDT4ilbVzBX01uUPJG', title: 'Fundamentos da Fé', section: 'store' },
  { documentId: 'RplLj9FPo9pznCCEWWJK', title: 'Caminhada com Cristo', section: 'store' },
  { documentId: 'pxSxgKMfxccaktuDkGmB', title: 'Camiseta Soldadinho (Dourada)', section: 'kids' },
  { documentId: 'QrHOPxgcTrpYEVSDxE01', title: 'Devocional Pequenos Guerreiros', section: 'kids' },
  { documentId: 'wR7O5n2AXpDAYun9JFVj', title: 'Liderança Cristã', section: 'store' },
  { documentId: 'wKwbKtGHup4tHQSvwaVn', title: 'Devocional Completo 2025', section: 'store' },
  { documentId: 'jll4hmWR7fZqSzNgu18w', title: 'Luminária Arca de Noé', section: 'kids' },
  { documentId: '0kReEP6dJtwX6GF90e1a', title: 'Educação de Filhos', section: 'kids' },
]

function readEnvironment(path) {
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separator = line.indexOf('=')
        return [line.slice(0, separator), line.slice(separator + 1).replace(/^['"]|['"]$/g, '')]
      }),
  )
}

function serialize(value) {
  if (value instanceof Timestamp) {
    return { __type: 'firestore/timestamp', value: value.toDate().toISOString() }
  }
  if (Array.isArray(value)) return value.map(serialize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, serialize(entry)]))
  }
  return value
}

const environment = readEnvironment('.env.local')
const app = initializeApp({
  apiKey: environment.VITE_FIREBASE_API_KEY,
  authDomain: environment.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: environment.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: environment.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: environment.VITE_FIREBASE_APP_ID,
})

try {
  if (environment.VITE_FIREBASE_PROJECT_ID !== 'alvorecermentorias') {
    throw new Error(`Projeto inesperado: ${environment.VITE_FIREBASE_PROJECT_ID}`)
  }

  const firestore = getFirestore(app)
  const documents = []

  for (const expected of cleanupPlan) {
    const snapshot = await getDoc(doc(firestore, 'products', expected.documentId))
    if (!snapshot.exists()) throw new Error(`Documento não encontrado: ${expected.documentId}`)

    const data = snapshot.data()
    if (data.title !== expected.title || data.section !== expected.section) {
      throw new Error(
        `Validação recusada para ${expected.documentId}: esperado ${expected.title}/${expected.section}, recebido ${data.title}/${data.section}`,
      )
    }

    documents.push({ path: snapshot.ref.path, data: serialize(data) })
  }

  mkdirSync('backups', { recursive: true })
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const outputPath = `backups/catalog-cleanup-${timestamp}.json`
  writeFileSync(outputPath, `${JSON.stringify({
    projectId: environment.VITE_FIREBASE_PROJECT_ID,
    createdAt: new Date().toISOString(),
    purpose: 'Backup anterior à remoção de duplicidades do catálogo',
    documents,
  }, null, 2)}\n`)

  console.log(JSON.stringify({ outputPath, validatedDocuments: documents.length }, null, 2))
} finally {
  await deleteApp(app)
}
