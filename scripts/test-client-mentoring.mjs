import { readFileSync } from 'node:fs'
import { initializeApp, deleteApp } from 'firebase/app'
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'

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

const env = readEnvironment('.env.local')
const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
})

try {
  const db = getFirestore(app)
  const q = query(collection(db, 'mentors'), where('status', '==', 'published'), where('available', '==', true))
  const snap = await getDocs(q)

  console.log(`Leitura pública de mentores pelo SDK Cliente: OK (${snap.docs.length} encontrado(s))`)
  for (const doc of snap.docs) {
    console.log(` - [${doc.id}] ${doc.data().name} (${doc.data().specialty})`)
  }

  const progSnap = await getDocs(query(collection(db, 'mentoringPrograms'), where('status', '==', 'published')))
  console.log(`\nLeitura pública de programas pelo SDK Cliente: OK (${progSnap.docs.length} encontrado(s))`)
  for (const doc of progSnap.docs) {
    console.log(` - [${doc.id}] ${doc.data().title} - R$ ${doc.data().price}`)
  }
} finally {
  await deleteApp(app)
}
