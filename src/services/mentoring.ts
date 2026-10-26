import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import type { Mentor, MentoringProgram } from '../types/mentoring'

export const INITIAL_OFFICIAL_MENTOR: Omit<Mentor, 'id'> = {
  name: 'Pr. Alexandre Gomes da Costa',
  photo: '/alexandre-gomes-costa.jpg',
  bio: 'Pastor e conselheiro ministerial com ampla experiência em discipulado, mentoria de líderes e vida espiritual cristã segundo os princípios bíblicos.',
  specialty: 'Liderança Ministerial e Vida Espiritual',
  trilhas: ['lideranca', 'espiritual', 'financas'],
  rating: 5.0,
  reviewCount: 0,
  sessionCount: 0,
  available: true,
  status: 'published',
  createdAt: new Date().toISOString().split('T')[0],
}

export const INITIAL_OFFICIAL_PROGRAM: Omit<MentoringProgram, 'id'> = {
  mentorId: '', // Vinculado dinamicamente
  trilha: 'lideranca',
  title: 'Liderança Cristã: Do Chamado à Prática',
  description: 'Programa estruturado de 12 semanas focado em fundamentos bíblicos de liderança servidora, caráter e ministério.',
  objective: 'Desenvolver líderes comprometidos com o Evangelho, servindo com integridade, sabedoria bíblica e multiplicação de discípulos.',
  duration: '12 semanas',
  totalSessions: 12,
  price: 599,
  status: 'published',
  modules: [
    {
      id: 'mod-1',
      title: 'Identidade e Chamado Bíblico',
      description: 'Fundamentos da identidade em Cristo e propósito ministerial.',
      duration: '3 semanas',
      topics: ['Chamado vs. Posição', 'Caráter e Integridade', 'O modelo de servo de Jesus'],
    },
    {
      id: 'mod-2',
      title: 'Comunicação e Discipulado',
      description: 'Princípios bíblicos para pastorear, ensinar e ouvir.',
      duration: '3 semanas',
      topics: ['Escuta empática', 'Exortação em amor', 'Multiplicação de discípulos'],
    },
    {
      id: 'mod-3',
      title: 'Gestão de Ministérios e Conflitos',
      description: 'Liderança prática em momentos de crise e tomada de decisão.',
      duration: '3 semanas',
      topics: ['Mateus 18 e restauração', 'Organização ministerial', 'Liderança compartilhada'],
    },
    {
      id: 'mod-4',
      title: 'Perseverança e Próximos Passos',
      description: 'Planejamento sustentável da vida devocional e ministerial.',
      duration: '3 semanas',
      topics: ['Cuidado espiritual contínuo', 'Prestação de contas', 'Legado'],
    },
  ],
  materials: ['Guia de Estudo Devocional', 'Plano Semanal de Aplicação'],
  targetAudience: 'Líderes de ministérios, pastores, coordenadores e servos da igreja local',
  prerequisites: ['Compromisso com leitura bíblica semanal', 'Disponibilidade para encontros regulares'],
  highlights: ['Acompanhamento individualizado', 'Materiais práticos e bíblicos', 'Foco em aplicação real'],
}

/**
 * Busca mentores cadastrados no Firestore.
 */
export async function getMentors(onlyPublished = false): Promise<Mentor[]> {
  if (!isFirebaseConfigured) return []

  const mentorsRef = collection(db, 'mentors')
  const q = onlyPublished
    ? query(mentorsRef, where('status', '==', 'published'), where('available', '==', true))
    : query(mentorsRef)

  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Mentor[]
}

/**
 * Busca mentor por ID.
 */
export async function getMentorById(id: string): Promise<Mentor | null> {
  if (!isFirebaseConfigured || !id) return null

  const docRef = doc(db, 'mentors', id)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null

  return {
    id: snap.id,
    ...snap.data(),
  } as Mentor
}

/**
 * Salva ou atualiza um mentor no Firestore.
 */
export async function saveMentor(mentorData: Partial<Mentor>, id?: string): Promise<string> {
  const mentorsRef = collection(db, 'mentors')

  const payload = {
    ...mentorData,
    status: mentorData.status || 'published',
    available: mentorData.available !== undefined ? mentorData.available : true,
    rating: mentorData.rating ?? 5.0,
    reviewCount: mentorData.reviewCount ?? 0,
    sessionCount: mentorData.sessionCount ?? 0,
    createdAt: mentorData.createdAt || new Date().toISOString().split('T')[0],
  }

  if (id) {
    const docRef = doc(db, 'mentors', id)
    await setDoc(docRef, payload, { merge: true })
    return id
  } else {
    const newDoc = await addDoc(mentorsRef, payload)
    return newDoc.id
  }
}

/**
 * Arquiva um mentor (exclusão lógica).
 */
export async function archiveMentor(id: string): Promise<void> {
  const docRef = doc(db, 'mentors', id)
  await updateDoc(docRef, {
    status: 'archived',
    available: false,
  })
}

/**
 * Busca programas de mentoria cadastrados no Firestore.
 */
export async function getPrograms(onlyPublished = false, mentorId?: string): Promise<MentoringProgram[]> {
  if (!isFirebaseConfigured) return []

  const programsRef = collection(db, 'mentoringPrograms')
  let q = query(programsRef)

  if (onlyPublished) {
    q = query(q, where('status', '==', 'published'))
  }

  const snap = await getDocs(q)
  let programs = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as MentoringProgram[]

  if (mentorId) {
    programs = programs.filter((p) => p.mentorId === mentorId)
  }

  return programs
}

/**
 * Busca programa de mentoria por ID.
 */
export async function getProgramById(id: string): Promise<MentoringProgram | null> {
  if (!isFirebaseConfigured || !id) return null

  const docRef = doc(db, 'mentoringPrograms', id)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null

  return {
    id: snap.id,
    ...snap.data(),
  } as MentoringProgram
}

/**
 * Salva ou atualiza um programa de mentoria no Firestore.
 */
export async function saveProgram(programData: Partial<MentoringProgram>, id?: string): Promise<string> {
  const programsRef = collection(db, 'mentoringPrograms')

  const payload = {
    ...programData,
    status: programData.status || 'published',
  }

  if (id) {
    const docRef = doc(db, 'mentoringPrograms', id)
    await setDoc(docRef, payload, { merge: true })
    return id
  } else {
    const newDoc = await addDoc(programsRef, payload)
    return newDoc.id
  }
}

/**
 * Arquiva um programa de mentoria.
 */
export async function archiveProgram(id: string): Promise<void> {
  const docRef = doc(db, 'mentoringPrograms', id)
  await updateDoc(docRef, {
    status: 'archived',
  })
}

/**
 * Busca sessões de mentoria associadas ao usuário autenticado.
 */
export async function getUserMentoringSessions(userId: string) {
  if (!isFirebaseConfigured || !userId) return []

  const sessionsRef = collection(db, 'mentoringSessions')
  const q = query(sessionsRef, where('menteeId', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }))
}

/**
 * Registra avaliação legítima para uma sessão concluída.
 */
export async function submitMentoringReview(reviewData: {
  sessionId: string
  mentorId: string
  menteeId: string
  menteeName: string
  rating: number
  comment: string
}): Promise<string> {
  const docRef = doc(db, 'mentoringReviews', reviewData.sessionId)
  await setDoc(docRef, {
    ...reviewData,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}
