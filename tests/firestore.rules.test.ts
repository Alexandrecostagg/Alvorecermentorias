import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { afterAll, afterEach, beforeAll, describe, it } from 'vitest'

const projectId = 'alvorecermentorias-rules-test'
let testEnv: RulesTestEnvironment

const baseUser = (uid: string, role: 'user' | 'admin' = 'user') => ({
  uid,
  role,
  name: `Usuário ${uid}`,
  email: `${uid}@example.test`,
  addresses: [],
})

async function seed(path: string, data: Record<string, unknown>) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), path), data)
  })
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8'),
    },
  })
})

afterEach(async () => {
  await testEnv.clearFirestore()
})

afterAll(async () => {
  await testEnv.cleanup()
})

describe('catálogo público', () => {
  it('permite leitura anônima de produtos e cursos', async () => {
    await seed('products/product-1', { title: 'Livro', price: 39.9 })
    await seed('cursos/course-1', { title: 'Curso', price: 99.9 })
    const guest = testEnv.unauthenticatedContext().firestore()

    await assertSucceeds(getDoc(doc(guest, 'products/product-1')))
    await assertSucceeds(getDoc(doc(guest, 'cursos/course-1')))
  })

  it('impede usuário comum de alterar o catálogo', async () => {
    const user = testEnv.authenticatedContext('user-a').firestore()

    await assertFails(setDoc(doc(user, 'products/product-1'), { title: 'Produto adulterado' }))
    await assertFails(deleteDoc(doc(user, 'cursos/course-1')))
  })

  it('permite administrador alterar o catálogo', async () => {
    await seed('users/admin-1', baseUser('admin-1', 'admin'))
    const admin = testEnv.authenticatedContext('admin-1').firestore()

    await assertSucceeds(setDoc(doc(admin, 'products/product-1'), { title: 'Produto aprovado' }))
  })
})

describe('perfis de usuário', () => {
  it('permite criar apenas o próprio perfil com papel de usuário', async () => {
    const user = testEnv.authenticatedContext('user-a').firestore()

    await assertSucceeds(setDoc(doc(user, 'users/user-a'), baseUser('user-a')))
    await assertFails(setDoc(doc(user, 'users/user-b'), baseUser('user-b')))
    await assertFails(setDoc(doc(user, 'users/admin-a'), baseUser('admin-a', 'admin')))
  })

  it('impede leitura do perfil de outra pessoa', async () => {
    await seed('users/user-b', baseUser('user-b'))
    const user = testEnv.authenticatedContext('user-a').firestore()

    await assertFails(getDoc(doc(user, 'users/user-b')))
  })

  it('permite atualizar campos pessoais e bloqueia elevação de privilégio', async () => {
    await seed('users/user-a', baseUser('user-a'))
    const user = testEnv.authenticatedContext('user-a').firestore()

    await assertSucceeds(updateDoc(doc(user, 'users/user-a'), { name: 'Nome atualizado' }))
    await assertFails(updateDoc(doc(user, 'users/user-a'), { role: 'admin' }))
    await assertFails(updateDoc(doc(user, 'users/user-a'), { email: 'outro@example.test' }))
  })

  it('permite administrador listar usuários', async () => {
    await seed('users/admin-1', baseUser('admin-1', 'admin'))
    await seed('users/user-a', baseUser('user-a'))
    const admin = testEnv.authenticatedContext('admin-1').firestore()

    await assertSucceeds(getDocs(collection(admin, 'users')))
  })
})

describe('pedidos', () => {
  const order = {
    userId: 'user-a',
    total: 39.9,
    status: 'pending',
    items: [],
  }

  it('impede criação de pedido pelo navegador', async () => {
    const user = testEnv.authenticatedContext('user-a').firestore()

    await assertFails(setDoc(doc(user, 'orders/order-1'), order))
  })

  it('permite ao proprietário ler, mas não alterar o pedido', async () => {
    await seed('orders/order-1', order)
    const owner = testEnv.authenticatedContext('user-a').firestore()

    await assertSucceeds(getDoc(doc(owner, 'orders/order-1')))
    await assertFails(updateDoc(doc(owner, 'orders/order-1'), { status: 'paid' }))
  })

  it('impede outro usuário de ler o pedido', async () => {
    await seed('orders/order-1', order)
    const anotherUser = testEnv.authenticatedContext('user-b').firestore()

    await assertFails(getDoc(doc(anotherUser, 'orders/order-1')))
  })

  it('permite administrador ler e avançar a operação, sem forjar pagamento', async () => {
    await seed('users/admin-1', baseUser('admin-1', 'admin'))
    await seed('orders/order-1', order)
    const admin = testEnv.authenticatedContext('admin-1').firestore()

    await assertSucceeds(getDoc(doc(admin, 'orders/order-1')))
    await assertFails(updateDoc(doc(admin, 'orders/order-1'), { status: 'paid' }))
    await assertFails(updateDoc(doc(admin, 'orders/order-1'), { paymentStatus: 'CHECKOUT_PAID' }))
    await seed('orders/paid-order', { ...order, status: 'paid' })
    await assertSucceeds(updateDoc(doc(admin, 'orders/paid-order'), { status: 'processing', updatedAt: '2026-10-26T12:00:00Z' }))
  })
})

describe('negação padrão', () => {
  it('bloqueia caminhos não declarados', async () => {
    const guest = testEnv.unauthenticatedContext().firestore()
    const user = testEnv.authenticatedContext('user-a').firestore()

    await assertFails(getDoc(doc(guest, 'private/document-1')))
    await assertFails(setDoc(doc(user, 'private/document-1'), { exposed: true }))
  })

  it('mantém ativos e permissões digitais privados até para o comprador', async () => {
    await seed('digitalAssets/product-1', { assetKey: 'private/file.pdf' })
    await seed('digitalEntitlements/order-1_product-1', { userId: 'user-a', assetKey: 'private/file.pdf' })
    const owner = testEnv.authenticatedContext('user-a').firestore()
    const admin = testEnv.authenticatedContext('admin-1').firestore()

    await assertFails(getDoc(doc(owner, 'digitalAssets/product-1')))
    await assertFails(getDoc(doc(owner, 'digitalEntitlements/order-1_product-1')))
    await assertFails(getDoc(doc(admin, 'digitalAssets/product-1')))
  })

  it('mantém reservas de horário privadas para visitante, usuário e admin', async () => {
    await seed('mentoringSlots/slot-test', { sessionId: 'sess-test', status: 'held' })
    const guest = testEnv.unauthenticatedContext().firestore()
    const user = testEnv.authenticatedContext('user-a').firestore()
    const admin = testEnv.authenticatedContext('admin-1').firestore()
    await assertFails(getDoc(doc(guest, 'mentoringSlots/slot-test')))
    await assertFails(getDoc(doc(user, 'mentoringSlots/slot-test')))
    await assertFails(setDoc(doc(user, 'mentoringSlots/slot-test'), { status: 'released' }))
    await assertFails(getDoc(doc(admin, 'mentoringSlots/slot-test')))
  })
})

describe('mentoria e programas', () => {
  const publishedMentor = {
    name: 'Alexandre Gomes da Costa',
    available: true,
    status: 'published',
  }

  const draftMentor = {
    name: 'Mentor Rascunho',
    available: true,
    status: 'draft',
  }

  const publishedProgram = {
    title: 'Liderança Cristã',
    status: 'published',
    price: 599,
  }

  const draftProgram = {
    title: 'Programa Em Desenvolvimento',
    status: 'draft',
    price: 399,
  }

  it('permite leitura pública de mentores e programas publicados', async () => {
    await seed('mentors/mentor-1', publishedMentor)
    await seed('mentoringPrograms/prog-1', publishedProgram)
    const guest = testEnv.unauthenticatedContext().firestore()

    await assertSucceeds(getDoc(doc(guest, 'mentors/mentor-1')))
    await assertSucceeds(getDoc(doc(guest, 'mentoringPrograms/prog-1')))
  })

  it('impede visitante ou usuário comum de ler mentores e programas em rascunho', async () => {
    await seed('mentors/mentor-draft', draftMentor)
    await seed('mentoringPrograms/prog-draft', draftProgram)
    const guest = testEnv.unauthenticatedContext().firestore()
    const user = testEnv.authenticatedContext('user-a').firestore()

    await assertFails(getDoc(doc(guest, 'mentors/mentor-draft')))
    await assertFails(getDoc(doc(guest, 'mentoringPrograms/prog-draft')))
    await assertFails(getDoc(doc(user, 'mentors/mentor-draft')))
    await assertFails(getDoc(doc(user, 'mentoringPrograms/prog-draft')))
  })

  it('permite admin criar, editar e ler rascunhos de mentores e programas', async () => {
    await seed('users/admin-1', baseUser('admin-1', 'admin'))
    await seed('mentors/mentor-draft', draftMentor)
    const admin = testEnv.authenticatedContext('admin-1').firestore()

    await assertSucceeds(getDoc(doc(admin, 'mentors/mentor-draft')))
    await assertSucceeds(setDoc(doc(admin, 'mentors/mentor-new'), publishedMentor))
    await assertSucceeds(updateDoc(doc(admin, 'mentors/mentor-draft'), { status: 'published' }))
    await assertSucceeds(setDoc(doc(admin, 'mentoringPrograms/prog-new'), publishedProgram))
  })

  it('impede exclusão física de mentor mesmo por admin', async () => {
    await seed('users/admin-1', baseUser('admin-1', 'admin'))
    await seed('mentors/mentor-1', publishedMentor)
    const admin = testEnv.authenticatedContext('admin-1').firestore()

    await assertFails(deleteDoc(doc(admin, 'mentors/mentor-1')))
  })

  it('restringe leitura de sessões ao próprio mentorado e ao admin', async () => {
    await seed('users/admin-1', baseUser('admin-1', 'admin'))
    await seed('mentoringSessions/sess-1', {
      menteeId: 'user-a',
      mentorId: 'mentor-1',
      status: 'scheduled',
    })

    const owner = testEnv.authenticatedContext('user-a').firestore()
    const anotherUser = testEnv.authenticatedContext('user-b').firestore()
    const admin = testEnv.authenticatedContext('admin-1').firestore()

    await assertSucceeds(getDoc(doc(owner, 'mentoringSessions/sess-1')))
    await assertFails(getDoc(doc(anotherUser, 'mentoringSessions/sess-1')))
    await assertSucceeds(getDoc(doc(admin, 'mentoringSessions/sess-1')))
    await assertFails(updateDoc(doc(admin, 'mentoringSessions/sess-1'), { paymentStatus: 'CHECKOUT_PAID' }))
    await assertSucceeds(updateDoc(doc(admin, 'mentoringSessions/sess-1'), { status: 'completed' }))
  })

  it('permite uma avaliação por sessão concluída e impede falsificação', async () => {
    await seed('mentoringSessions/sess-1', {
      menteeId: 'user-a', mentorId: 'mentor-1', status: 'completed',
    })
    await seed('mentoringSessions/sess-pending', {
      menteeId: 'user-a', mentorId: 'mentor-1', status: 'scheduled',
    })
    await seed('mentoringSessions/sess-2', {
      menteeId: 'user-a', mentorId: 'mentor-1', status: 'completed',
    })
    await seed('mentoringSessions/sess-3', {
      menteeId: 'user-a', mentorId: 'mentor-1', status: 'completed',
    })
    const user = testEnv.authenticatedContext('user-a').firestore()
    const anotherUser = testEnv.authenticatedContext('user-b').firestore()
    const review = {
      sessionId: 'sess-1', mentorId: 'mentor-1', menteeId: 'user-a',
      menteeName: 'Pessoa Fictícia', rating: 5, comment: 'Excelente sessão!',
      createdAt: serverTimestamp(),
    }

    await assertSucceeds(
      setDoc(doc(user, 'mentoringReviews/sess-1'), review),
    )
    await assertSucceeds(getDoc(doc(user, 'mentoringReviews/sess-1')))
    await assertFails(getDoc(doc(testEnv.unauthenticatedContext().firestore(), 'mentoringReviews/sess-1')))
    await assertFails(getDoc(doc(anotherUser, 'mentoringReviews/sess-1')))
    await assertFails(setDoc(doc(user, 'mentoringReviews/sess-1'), { ...review, rating: 1 }))
    await assertFails(setDoc(doc(user, 'mentoringReviews/rev-2'), review))
    await assertFails(setDoc(doc(anotherUser, 'mentoringReviews/sess-2'), { ...review, sessionId: 'sess-2', menteeId: 'user-b' }))
    await assertFails(setDoc(doc(user, 'mentoringReviews/sess-pending'), { ...review, sessionId: 'sess-pending' }))
    await assertFails(setDoc(doc(user, 'mentoringReviews/sess-3'), { ...review, sessionId: 'sess-3', rating: 100 }))
  })
})
