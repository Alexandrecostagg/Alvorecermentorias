import { readFileSync } from 'node:fs'
import { initializeApp, deleteApp } from 'firebase/app'
import { collection, getDocs, getFirestore } from 'firebase/firestore'

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

function normalizeTitle(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function resolveImage(image, mediaBase) {
  if (!image) return ''
  if (/^https?:\/\//i.test(image)) return image
  return `${mediaBase.replace(/\/$/, '')}/${image.replace(/^\//, '')}`
}

async function checkImage(product, mediaBase) {
  const url = resolveImage(product.image, mediaBase)
  if (!url) return { documentId: product.documentId, legacyId: product.id, title: product.title, url, ok: false, status: 'missing' }

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    })

    return {
      documentId: product.documentId,
      legacyId: product.id,
      title: product.title,
      url,
      ok: response.ok,
      status: response.status,
    }
  } catch (error) {
    return {
      documentId: product.documentId,
      legacyId: product.id,
      title: product.title,
      url,
      ok: false,
      status: error instanceof Error ? error.message : 'request-failed',
    }
  }
}

const environment = readEnvironment('.env.local')
const requiredVariables = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_PUBLIC_MEDIA_BASE_URL',
]

const missingVariables = requiredVariables.filter((name) => !environment[name])
if (missingVariables.length) {
  throw new Error(`Variáveis ausentes em .env.local: ${missingVariables.join(', ')}`)
}

const app = initializeApp({
  apiKey: environment.VITE_FIREBASE_API_KEY,
  authDomain: environment.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: environment.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: environment.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: environment.VITE_FIREBASE_APP_ID,
})

try {
  const snapshot = await getDocs(collection(getFirestore(app), 'products'))
  const products = snapshot.docs.map((product) => ({
    ...product.data(),
    documentId: product.id,
  }))
  const duplicateMap = new Map()
  const titleMap = new Map()

  for (const product of products) {
    const key = `${product.section ?? 'unknown'}::${normalizeTitle(product.title)}`
    const group = duplicateMap.get(key) ?? []
    const summary = {
      documentId: product.documentId,
      legacyId: product.id ?? null,
      title: product.title,
      section: product.section,
      createdAt: product.createdAt?.toDate?.()?.toISOString?.() ?? product.createdAt ?? null,
    }
    group.push(summary)
    duplicateMap.set(key, group)

    const titleKey = normalizeTitle(product.title)
    const titleGroup = titleMap.get(titleKey) ?? []
    titleGroup.push(summary)
    titleMap.set(titleKey, titleGroup)
  }

  const duplicates = [...duplicateMap.values()].filter((group) => group.length > 1)
  const crossSectionConflicts = [...titleMap.values()].filter((group) => (
    new Set(group.map((product) => product.section)).size > 1
  ))
  const incomplete = products
    .filter((product) => !product.title || !product.section || !product.image || typeof product.price !== 'number')
    .map((product) => ({
      documentId: product.documentId,
      legacyId: product.id ?? null,
      title: product.title ?? null,
      section: product.section ?? null,
      hasImage: Boolean(product.image),
      priceType: typeof product.price,
    }))
  const images = await Promise.all(
    products.map((product) => checkImage(product, environment.VITE_PUBLIC_MEDIA_BASE_URL)),
  )
  const brokenImages = images.filter((image) => !image.ok)
  const externalImages = products.filter((product) => /^https?:\/\//i.test(product.image ?? ''))

  console.log(JSON.stringify({
    projectId: environment.VITE_FIREBASE_PROJECT_ID,
    totals: {
      products: products.length,
      store: products.filter((product) => product.section === 'store').length,
      kids: products.filter((product) => product.section === 'kids').length,
      duplicateGroups: duplicates.length,
      duplicateDocuments: duplicates.reduce((total, group) => total + group.length, 0),
      crossSectionConflicts: crossSectionConflicts.length,
      incomplete: incomplete.length,
      brokenImages: brokenImages.length,
      externalImages: externalImages.length,
    },
    duplicates,
    crossSectionConflicts,
    incomplete,
    brokenImages,
    externalImages: externalImages.map((product) => ({
      documentId: product.documentId,
      legacyId: product.id ?? null,
      title: product.title,
      image: product.image,
    })),
  }, null, 2))
} finally {
  await deleteApp(app)
}
