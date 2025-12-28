export type Product = {
  id: string | number
  title: string
  image: string
  price: number
  ageRange?: '0-2' | '3-5' | '6-8' | '9-12' | string
  category: string
  badge?: string
  description?: string
  author?: string
  originalPrice?: number
  reviews?: number
  rating?: number
  featured?: boolean
  section?: 'store' | 'kids'
  type?: string
  stock?: number
}

export type Address = {
  id: string
  recipient?: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault?: boolean
}

export type UserProfile = {
  uid: string
  email: string
  name: string
  photoURL?: string
  phone?: string
  cpf?: string
  birthDate?: string
  addresses: Address[]
  role: 'user' | 'admin'
  createdAt: Date
}

export type OrderStatus = 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled'

export type Order = {
  id: string
  userId: string
  items: {
    product: Product
    qty: number
  }[]
  total: number
  status: OrderStatus
  paymentMethod: 'credit_card' | 'pix' | 'boleto'
  address: Address
  createdAt: string
}