interface Env {
  APP_ORIGIN: string
  FIREBASE_PROJECT_ID: string
  FIREBASE_WEB_API_KEY: string
  FIREBASE_SERVICE_ACCOUNT_JSON: string
  ASAAS_API_BASE_URL: string
  ASAAS_ACCESS_TOKEN: string
  ASAAS_WEBHOOK_TOKEN: string
  SHIPPING_ORIGIN_POSTAL_CODE: string
}

type CheckoutItemRequest = { productId: string; quantity: number }
type AsaasBillingType = 'PIX' | 'CREDIT_CARD'
type AddressInput = {
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
}
type GoogleTokenCache = { token: string; expiresAt: number }
type PaymentTransition = {
  orderStatus: 'paid' | 'cancelled'
  checkoutStatus: 'PAID' | 'CANCELED' | 'EXPIRED'
}
type AsaasCustomerData = {
  name: string
  email: string
  cpfCnpj: string
  phone?: string
}

let googleTokenCache: GoogleTokenCache | undefined

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') return corsResponse(request, env)

    try {
      if (request.method === 'POST' && url.pathname === '/checkout') {
        assertAllowedOrigin(request, env)
        return json(await createCheckout(request, env), 201, corsHeaders(request, env))
      }

      if (request.method === 'POST' && url.pathname === '/webhooks/asaas') {
        return json(await receiveAsaasWebhook(request, env))
      }

      return json({ error: 'Rota não encontrada.' }, 404)
    } catch (error) {
      if (error instanceof HttpError) {
        return json({ error: error.message }, error.status, corsHeaders(request, env))
      }

      console.error(error)
      return json({ error: 'Não foi possível processar a solicitação.' }, 500, corsHeaders(request, env))
    }
  },
}

async function createCheckout(request: Request, env: Env) {
  ensureConfigured(env, [
    'FIREBASE_WEB_API_KEY',
    'FIREBASE_SERVICE_ACCOUNT_JSON',
    'ASAAS_ACCESS_TOKEN',
    'APP_ORIGIN',
  ])

  const payload = await request.json().catch(() => {
    throw new HttpError(400, 'Corpo da requisição inválido.')
  }) as { items?: CheckoutItemRequest[]; address?: AddressInput; billingType?: unknown }
  const items = normalizeItems(payload.items)
  const address = normalizeAddress(payload.address)
  const billingType = normalizeBillingType(payload.billingType)
  const user = await verifyFirebaseUser(request, env)
  const accessToken = await getGoogleAccessToken(env)
  const products = await loadProducts(items, env, accessToken)
  assertPhysicalShippingIsQuoted(products)
  const profile = await loadUserProfile(user.uid, env, accessToken)
  const customerData = buildAsaasCustomerData(user, profile)
  const orderCustomer = buildOrderCustomer(user, profile)
  const orderId = `order_${crypto.randomUUID()}`
  const total = products.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const now = new Date().toISOString()

  await createFirestoreDocument('orders', orderId, {
    userId: user.uid,
    items: products.map(({ product, quantity }) => ({ product, qty: quantity })),
    total: roundMoney(total),
    status: 'pending',
    paymentMethod: billingType === 'PIX' ? 'pix' : 'credit_card',
    asaasBillingType: billingType,
    paymentStatus: 'creating_checkout',
    address,
    customer: orderCustomer,
    createdAt: now,
    updatedAt: now,
  }, env, accessToken)

  let asaasCheckout: { id: string; link: string; status: string }
  try {
    asaasCheckout = await requestAsaasCheckout({ orderId, products, customerData, billingType }, env)
  } catch (error) {
    await markCheckoutFailure(orderId, env, accessToken)
    throw error
  }

  try {
    await createFirestoreDocument('checkoutOrders', asaasCheckout.id, {
      orderId,
      createdAt: new Date().toISOString(),
    }, env, accessToken)
    await updateFirestoreDocument('orders', orderId, {
      asaasCheckoutId: asaasCheckout.id,
      asaasCheckoutUrl: asaasCheckout.link,
      asaasCheckoutStatus: asaasCheckout.status,
      paymentStatus: 'awaiting_payment',
      updatedAt: new Date().toISOString(),
    }, env, accessToken)
  } catch {
    console.error('Failed to associate Asaas checkout with order', orderId)
    await cancelAsaasCheckout(asaasCheckout.id, env)
    await markCheckoutFailure(orderId, env, accessToken)
    throw new HttpError(502, 'O checkout foi cancelado porque não foi possível registrar a cobrança com segurança.')
  }

  return { orderId, checkoutUrl: asaasCheckout.link }
}

async function receiveAsaasWebhook(request: Request, env: Env) {
  ensureConfigured(env, ['ASAAS_WEBHOOK_TOKEN', 'FIREBASE_SERVICE_ACCOUNT_JSON'])
  if (!safeTokenEquals(request.headers.get('asaas-access-token'), env.ASAAS_WEBHOOK_TOKEN)) {
    throw new HttpError(401, 'Webhook não autorizado.')
  }

  const payload = await request.json().catch(() => {
    throw new HttpError(400, 'Evento inválido.')
  }) as Record<string, unknown>
  const eventId = typeof payload.id === 'string' ? payload.id : undefined
  const event = typeof payload.event === 'string' ? payload.event : 'UNKNOWN'
  const transition = paymentTransitionFromAsaasEvent(event)
  if (!eventId || !transition) return { received: true, ignored: true }

  const accessToken = await getGoogleAccessToken(env)
  const orderId = await resolveOrderId(payload, env, accessToken)
  if (!orderId) return { received: true, ignored: true }

  const inserted = await createFirestoreDocument('paymentEvents', eventId, {
    event,
    orderId,
    receivedAt: new Date().toISOString(),
    processed: false,
  }, env, accessToken, true)
  if (!inserted) {
    const existingEvent = await readFirestoreDocument('paymentEvents', eventId, env, accessToken)
    const existingData = fromFirestoreFields(existingEvent.fields || {}) as Record<string, unknown>
    if (existingData.processed === true) return { received: true, duplicate: true }
  }

  const orderDocument = await readFirestoreDocument('orders', orderId, env, accessToken)
  const order = fromFirestoreFields(orderDocument.fields || {}) as Record<string, unknown>
  const orderStatus = resolveOrderStatusAfterPaymentEvent(order.status, transition)

  await updateFirestoreDocument('orders', orderId, {
    status: orderStatus,
    paymentStatus: event,
    asaasCheckoutStatus: transition.checkoutStatus,
    asaasEventId: eventId,
    updatedAt: new Date().toISOString(),
  }, env, accessToken)
  await updateFirestoreDocument('paymentEvents', eventId, {
    processed: true,
    processedAt: new Date().toISOString(),
  }, env, accessToken)

  return { received: true }
}

function normalizeItems(value: unknown): CheckoutItemRequest[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) {
    throw new HttpError(400, 'Informe entre 1 e 20 itens.')
  }

  const normalized = value.map((item) => {
    const candidate = item as Partial<CheckoutItemRequest>
    const productId = typeof candidate.productId === 'string' ? candidate.productId.trim() : ''
    const quantity = Number(candidate.quantity)
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw new HttpError(400, 'Item do carrinho inválido.')
    }
    return { productId, quantity }
  })

  const grouped = new Map<string, number>()
  for (const item of normalized) {
    const quantity = (grouped.get(item.productId) || 0) + item.quantity
    if (quantity > 20) throw new HttpError(400, 'A quantidade máxima por produto é 20.')
    grouped.set(item.productId, quantity)
  }
  return [...grouped.entries()].map(([productId, quantity]) => ({ productId, quantity }))
}

function normalizeBillingType(value: unknown): AsaasBillingType {
  if (value === 'PIX' || value === 'CREDIT_CARD') return value
  throw new HttpError(400, 'Escolha PIX ou cartão para continuar.')
}

function normalizeAddress(value: unknown): AddressInput {
  if (!value || typeof value !== 'object') throw new HttpError(400, 'Endereço de entrega inválido.')
  const address = value as AddressInput
  const normalized = {
    street: cleanText(address.street),
    number: cleanText(address.number),
    complement: cleanText(address.complement),
    neighborhood: cleanText(address.neighborhood),
    city: cleanText(address.city),
    state: cleanText(address.state)?.toUpperCase(),
    zipCode: cleanText(address.zipCode)?.replace(/\D/g, ''),
  }
  if (
    !normalized.street
    || !normalized.number
    || !normalized.neighborhood
    || !normalized.city
    || !/^[A-Z]{2}$/.test(normalized.state || '')
    || !/^\d{8}$/.test(normalized.zipCode || '')
  ) {
    throw new HttpError(400, 'Preencha um endereço de entrega completo.')
  }
  return normalized
}

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 200) || undefined : undefined
}

async function verifyFirebaseUser(request: Request, env: Env) {
  const idToken = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
  if (!idToken) throw new HttpError(401, 'Faça login para iniciar o pagamento.')

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_WEB_API_KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  const result = await response.json() as { users?: Array<{ localId?: string; email?: string; displayName?: string }> }
  const account = result.users?.[0]
  if (!response.ok || !account?.localId || !account.email) throw new HttpError(401, 'Sua sessão expirou. Entre novamente.')

  return { uid: account.localId, email: account.email, name: account.displayName || 'Cliente Alvorecer' }
}

async function loadUserProfile(
  userId: string,
  env: Env,
  accessToken: string,
): Promise<Record<string, unknown> | undefined> {
  const profileDocument = await tryReadFirestoreDocument('users', userId, env, accessToken)
  if (!profileDocument?.fields) return undefined
  return fromFirestoreFields(profileDocument.fields) as Record<string, unknown>
}

function buildOrderCustomer(
  user: { email: string; name: string },
  profile?: Record<string, unknown>,
) {
  const profileName = typeof profile?.name === 'string' ? profile.name.trim() : ''
  const phone = typeof profile?.phone === 'string' ? profile.phone.trim().slice(0, 30) : ''
  return {
    name: profileName || user.name,
    email: user.email,
    ...(phone ? { phone } : {}),
  }
}

function buildAsaasCustomerData(
  user: { email: string; name: string },
  profile?: Record<string, unknown>,
): AsaasCustomerData | undefined {
  const cpfCnpj = typeof profile?.cpf === 'string' ? profile.cpf.replace(/\D/g, '') : ''
  if (!isValidCpf(cpfCnpj)) return undefined

  const profileName = typeof profile?.name === 'string' ? profile.name.trim() : ''
  const phone = typeof profile?.phone === 'string' ? profile.phone.replace(/\D/g, '') : ''
  return {
    name: profileName || user.name,
    email: user.email,
    cpfCnpj,
    ...(phone.length >= 10 && phone.length <= 11 ? { phone } : {}),
  }
}

function isValidCpf(value: string) {
  if (!/^\d{11}$/.test(value) || /^(\d)\1{10}$/.test(value)) return false

  const digits = [...value].map(Number)
  const calculateDigit = (length: number) => {
    const sum = digits.slice(0, length).reduce((total, digit, index) => total + digit * (length + 1 - index), 0)
    const remainder = (sum * 10) % 11
    return remainder === 10 ? 0 : remainder
  }
  return calculateDigit(9) === digits[9] && calculateDigit(10) === digits[10]
}

async function loadProducts(items: CheckoutItemRequest[], env: Env, accessToken: string) {
  return Promise.all(items.map(async ({ productId, quantity }) => {
    const resolvedProduct = await resolveCatalogProduct(productId, env, accessToken)
    const document = resolvedProduct.document
    const data = fromFirestoreFields(document.fields as Record<string, unknown>) as Record<string, unknown>
    const price = Number(data.price)
    const stock = data.stock === undefined ? undefined : Number(data.stock)
    const title = typeof data.title === 'string' ? data.title : ''
    if (
      !title
      || !Number.isFinite(price)
      || price <= 0
      || data.active === false
      || data.ativo === false
      || (stock !== undefined && (!Number.isFinite(stock) || stock < quantity))
    ) {
      throw new HttpError(400, 'Um item do carrinho não está disponível.')
    }

    return {
      quantity,
      product: {
        id: resolvedProduct.id,
        title,
        price: roundMoney(price),
        image: typeof data.image === 'string' ? data.image : '',
        category: typeof data.category === 'string' ? data.category : 'Loja',
        description: typeof data.description === 'string' ? data.description : undefined,
        shippingRequired: data.shippingRequired !== false,
        shipping: normalizeShippingPackage(data.shipping),
      },
    }
  }))
}

function normalizeShippingPackage(value: unknown) {
  const shipping = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  return {
    weightKg: Number(shipping.weightKg) || 0,
    widthCm: Number(shipping.widthCm) || 0,
    heightCm: Number(shipping.heightCm) || 0,
    lengthCm: Number(shipping.lengthCm) || 0,
  }
}

function assertPhysicalShippingIsQuoted(
  products: Array<{ product: { shippingRequired?: boolean } }>,
) {
  if (products.some(({ product }) => product.shippingRequired !== false)) {
    throw new HttpError(409, 'O frete ainda precisa ser calculado antes do pagamento.')
  }
}

async function resolveCatalogProduct(productId: string, env: Env, accessToken: string) {
  const currentDocument = await tryReadFirestoreDocument('products', productId, env, accessToken)
  if (currentDocument) return { id: productId, document: currentDocument }

  const legacyDocument = await findProductByLegacyId(productId, env, accessToken)
  if (legacyDocument) return legacyDocument

  throw new HttpError(400, 'Um produto do carrinho não está mais disponível. Remova-o e adicione novamente.')
}

async function findProductByLegacyId(productId: string, env: Env, accessToken: string) {
  if (!/^\d{1,12}$/.test(productId)) return undefined

  const response = await fetch(`${firestoreDatabaseUrl(env)}/documents:runQuery`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'products' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'id' },
            op: 'EQUAL',
            value: { integerValue: productId },
          },
        },
        limit: 2,
      },
    }),
  })
  if (!response.ok) throw new Error('Não foi possível consultar o catálogo legado.')

  const results = await response.json() as Array<{
    document?: { name?: string; fields?: Record<string, unknown> }
  }>
  const documents = results.flatMap((result) => result.document ? [result.document] : [])
  if (documents.length !== 1) return undefined

  const document = documents[0]
  const canonicalId = document.name?.split('/').pop()
  if (!canonicalId || !document.fields) return undefined
  return { id: canonicalId, document }
}

async function requestAsaasCheckout(
  data: {
    orderId: string
    products: Array<{ quantity: number; product: { id: string; title: string; price: number; description?: string } }>
    customerData?: AsaasCustomerData
    billingType: AsaasBillingType
  },
  env: Env,
) {
  const callbackBase = `${env.APP_ORIGIN.replace(/\/$/, '')}/checkout/status`
  const response = await fetch(`${env.ASAAS_API_BASE_URL.replace(/\/$/, '')}/checkouts`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'User-Agent': 'AlvorecerMentorias/0.1 (Cloudflare Workers)',
      access_token: env.ASAAS_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      billingTypes: [data.billingType],
      chargeTypes: ['DETACHED'],
      minutesToExpire: 60,
      externalReference: data.orderId,
      callback: {
        successUrl: `${callbackBase}?result=success`,
        cancelUrl: `${callbackBase}?result=cancelled`,
        expiredUrl: `${callbackBase}?result=expired`,
      },
      items: data.products.map(({ product, quantity }) => ({
        externalReference: product.id,
        name: product.title,
        description: product.description,
        quantity,
        value: product.price,
      })),
      ...(data.customerData ? { customerData: data.customerData } : {}),
    }),
  })

  const result = await response.json() as { id?: string; link?: string; status?: string; errors?: Array<{ description?: string }> }
  if (!response.ok || !result.id || !result.link) {
    console.error('Asaas checkout error', response.status, result.errors?.[0]?.description)
    throw new HttpError(502, result.errors?.[0]?.description || 'A Asaas não conseguiu criar o checkout.')
  }

  return { id: result.id, link: result.link, status: result.status || 'ACTIVE' }
}

async function cancelAsaasCheckout(checkoutId: string, env: Env) {
  try {
    const response = await fetch(`${env.ASAAS_API_BASE_URL.replace(/\/$/, '')}/checkouts/${encodeURIComponent(checkoutId)}/cancel`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'User-Agent': 'AlvorecerMentorias/0.1 (Cloudflare Workers)',
        access_token: env.ASAAS_ACCESS_TOKEN,
      },
      body: '{}',
    })
    if (!response.ok) console.error('Failed to cancel orphan Asaas checkout', checkoutId, response.status)
  } catch {
    console.error('Failed to reach Asaas while cancelling orphan checkout', checkoutId)
  }
}

async function markCheckoutFailure(orderId: string, env: Env, accessToken: string) {
  try {
    await updateFirestoreDocument('orders', orderId, {
      status: 'cancelled',
      paymentStatus: 'checkout_failed',
      updatedAt: new Date().toISOString(),
    }, env, accessToken)
  } catch {
    console.error('Failed to mark checkout failure on order', orderId)
  }
}

async function getGoogleAccessToken(env: Env) {
  if (googleTokenCache && googleTokenCache.expiresAt > Date.now() + 60_000) return googleTokenCache.token

  const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON) as {
    client_email: string
    private_key: string
    token_uri?: string
  }
  const issuedAt = Math.floor(Date.now() / 1000)
  const tokenUri = serviceAccount.token_uri || 'https://oauth2.googleapis.com/token'
  const unsignedJwt = `${base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64Url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: tokenUri,
    iat: issuedAt,
    exp: issuedAt + 3600,
  }))}`
  const key = await crypto.subtle.importKey('pkcs8', pemToArrayBuffer(serviceAccount.private_key), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsignedJwt))
  const assertion = `${unsignedJwt}.${base64Url(signature)}`
  const form = new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion })
  const response = await fetch(tokenUri, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
  })
  const result = await response.json() as { access_token?: string; expires_in?: number }
  if (!response.ok || !result.access_token) throw new Error('Não foi possível autorizar o acesso ao Firestore.')

  googleTokenCache = { token: result.access_token, expiresAt: Date.now() + (result.expires_in || 3600) * 1000 }
  return googleTokenCache.token
}

async function readFirestoreDocument(collection: string, documentId: string, env: Env, accessToken: string) {
  const response = await fetch(firestoreDocumentUrl(collection, documentId, env), { headers: { Authorization: `Bearer ${accessToken}` } })
  if (response.status === 404) throw new HttpError(404, 'Documento não encontrado.')
  if (!response.ok) throw new Error('Não foi possível consultar o catálogo.')
  return response.json() as Promise<{ fields?: Record<string, unknown> }>
}

async function tryReadFirestoreDocument(collection: string, documentId: string, env: Env, accessToken: string) {
  const response = await fetch(firestoreDocumentUrl(collection, documentId, env), { headers: { Authorization: `Bearer ${accessToken}` } })
  if (response.status === 404) return undefined
  if (!response.ok) throw new Error('Não foi possível consultar o Firestore.')
  return response.json() as Promise<{ fields?: Record<string, unknown> }>
}

async function createFirestoreDocument(
  collection: string,
  documentId: string,
  data: Record<string, unknown>,
  env: Env,
  accessToken: string,
  ignoreAlreadyExists = false,
) {
  const url = new URL(`${firestoreCollectionUrl(collection, env)}?documentId=${encodeURIComponent(documentId)}`)
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  })
  if (ignoreAlreadyExists && response.status === 409) return false
  if (!response.ok) throw new Error('Não foi possível registrar o pedido.')
  return true
}

async function updateFirestoreDocument(collection: string, documentId: string, data: Record<string, unknown>, env: Env, accessToken: string) {
  const url = new URL(firestoreDocumentUrl(collection, documentId, env))
  Object.keys(data).forEach((field) => url.searchParams.append('updateMask.fieldPaths', field))
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: toFirestoreFields(data) }),
  })
  if (!response.ok) throw new Error('Não foi possível atualizar o pedido.')
}

function firestoreCollectionUrl(collection: string, env: Env) {
  return `${firestoreDatabaseUrl(env)}/documents/${collection}`
}

function firestoreDatabaseUrl(env: Env) {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(env.FIREBASE_PROJECT_ID)}/databases/(default)`
}

function firestoreDocumentUrl(collection: string, documentId: string, env: Env) {
  return `${firestoreCollectionUrl(collection, env)}/${encodeURIComponent(documentId)}`
}

function extractOrderId(payload: Record<string, unknown>) {
  const checkout = payload.checkout as Record<string, unknown> | undefined
  const payment = payload.payment as Record<string, unknown> | undefined
  const candidates = [payload.externalReference, checkout?.externalReference, payment?.externalReference]
  return candidates.find((value): value is string => typeof value === 'string' && value.startsWith('order_'))
}

async function resolveOrderId(payload: Record<string, unknown>, env: Env, accessToken: string) {
  const externalReference = extractOrderId(payload)
  if (externalReference) return externalReference

  const checkout = payload.checkout as Record<string, unknown> | undefined
  const checkoutId = typeof checkout?.id === 'string' ? checkout.id : undefined
  if (!checkoutId) return undefined

  const mapping = await tryReadFirestoreDocument('checkoutOrders', checkoutId, env, accessToken)
  if (!mapping) return undefined
  const data = fromFirestoreFields(mapping.fields || {}) as Record<string, unknown>
  return typeof data.orderId === 'string' && data.orderId.startsWith('order_') ? data.orderId : undefined
}

function paymentTransitionFromAsaasEvent(event: string): PaymentTransition | undefined {
  if (event === 'CHECKOUT_PAID' || event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
    return { orderStatus: 'paid', checkoutStatus: 'PAID' }
  }
  if (event === 'CHECKOUT_CANCELED' || event === 'PAYMENT_DELETED') {
    return { orderStatus: 'cancelled', checkoutStatus: 'CANCELED' }
  }
  if (event === 'CHECKOUT_EXPIRED' || event === 'PAYMENT_OVERDUE') {
    return { orderStatus: 'cancelled', checkoutStatus: 'EXPIRED' }
  }
  return undefined
}

function resolveOrderStatusAfterPaymentEvent(currentStatus: unknown, transition: PaymentTransition) {
  const operationalStatuses = ['paid', 'processing', 'shipping', 'delivered']
  return typeof currentStatus === 'string' && operationalStatuses.includes(currentStatus)
    ? currentStatus
    : transition.orderStatus
}

function toFirestoreFields(data: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined).map(([key, value]) => [key, toFirestoreValue(value)]))
}

function toFirestoreValue(value: unknown): Record<string, unknown> {
  if (value === null) return { nullValue: null }
  if (typeof value === 'string') return { stringValue: value }
  if (typeof value === 'number') return { doubleValue: value }
  if (typeof value === 'boolean') return { booleanValue: value }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } }
  if (typeof value === 'object') return { mapValue: { fields: toFirestoreFields(value as Record<string, unknown>) } }
  throw new Error('Tipo de dado não suportado.')
}

function fromFirestoreFields(fields: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, fromFirestoreValue(value as Record<string, unknown>)]))
}

function fromFirestoreValue(value: Record<string, unknown>): unknown {
  if ('stringValue' in value) return value.stringValue
  if ('doubleValue' in value) return Number(value.doubleValue)
  if ('integerValue' in value) return Number(value.integerValue)
  if ('booleanValue' in value) return value.booleanValue
  if ('nullValue' in value) return null
  if ('timestampValue' in value) return value.timestampValue
  if ('arrayValue' in value) {
    const arrayValue = value.arrayValue as { values?: Record<string, unknown>[] }
    return (arrayValue.values || []).map(fromFirestoreValue)
  }
  if ('mapValue' in value) {
    const mapValue = value.mapValue as { fields?: Record<string, unknown> }
    return fromFirestoreFields(mapValue.fields || {})
  }
  return undefined
}

function base64Url(value: string | ArrayBuffer) {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : new Uint8Array(value)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function pemToArrayBuffer(pem: string) {
  const binary = atob(pem.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '').replace(/\s/g, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function ensureConfigured(env: Env, keys: Array<keyof Env>) {
  if (keys.some((key) => !env[key])) throw new HttpError(500, 'O serviço de pagamento ainda não foi configurado.')
}

function safeTokenEquals(received: string | null, expected: string) {
  if (!received || received.length !== expected.length) return false
  let difference = 0
  for (let index = 0; index < expected.length; index += 1) {
    difference |= received.charCodeAt(index) ^ expected.charCodeAt(index)
  }
  return difference === 0
}

function assertAllowedOrigin(request: Request, env: Env) {
  if (request.headers.get('Origin') !== env.APP_ORIGIN) throw new HttpError(403, 'Origem não autorizada.')
}

function corsHeaders(request: Request, env: Env) {
  return request.headers.get('Origin') === env.APP_ORIGIN
    ? { 'Access-Control-Allow-Origin': env.APP_ORIGIN, Vary: 'Origin' }
    : {}
}

function corsResponse(request: Request, env: Env) {
  if (request.headers.get('Origin') !== env.APP_ORIGIN) return new Response(null, { status: 403 })
  return new Response(null, {
    status: 204,
    headers: {
      ...corsHeaders(request, env),
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
    },
  })
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } })
}

export const testables = {
  assertPhysicalShippingIsQuoted,
  buildAsaasCustomerData,
  buildOrderCustomer,
  extractOrderId,
  loadProducts,
  normalizeAddress,
  normalizeBillingType,
  normalizeItems,
  paymentTransitionFromAsaasEvent,
  resolveOrderStatusAfterPaymentEvent,
  requestAsaasCheckout,
  safeTokenEquals,
}
