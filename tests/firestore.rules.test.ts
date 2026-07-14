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

  it('permite administrador ler e atualizar pedidos', async () => {
    await seed('users/admin-1', baseUser('admin-1', 'admin'))
    await seed('orders/order-1', order)
    const admin = testEnv.authenticatedContext('admin-1').firestore()

    await assertSucceeds(getDoc(doc(admin, 'orders/order-1')))
    await assertSucceeds(updateDoc(doc(admin, 'orders/order-1'), { status: 'paid' }))
  })
})

describe('negação padrão', () => {
  it('bloqueia caminhos não declarados', async () => {
    const guest = testEnv.unauthenticatedContext().firestore()
    const user = testEnv.authenticatedContext('user-a').firestore()

    await assertFails(getDoc(doc(guest, 'private/document-1')))
    await assertFails(setDoc(doc(user, 'private/document-1'), { exposed: true }))
  })
})
