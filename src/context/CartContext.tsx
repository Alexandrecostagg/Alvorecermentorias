// =============================
// src/context/CartContext.tsx
// =============================
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Product } from '../types'

export type CartItem = { product: Product; qty: number }

type CartCtx = {
  items: CartItem[]
  addItem: (product: Product, qty?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, qty: number) => void
  clear: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartCtx | null>(null)
const LS_KEY = 'alvorecer.cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch { }
  }, [])

  // persist to localStorage
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(items)) } catch { }
  }, [items])

  const addItem = (product: Product, qty: number = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((it) => it.product.id === product.id)
      if (i >= 0) {
        const copy = [...prev]
        copy[i] = { ...copy[i], qty: copy[i].qty + qty }
        return copy
      }
      return [...prev, { product, qty }]
    })
  }

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((it) => it.product.id !== productId))
  }

  const updateQuantity = (productId: number, qty: number) => {
    setItems((prev) => prev.map((item) => {
      if (item.product.id === productId) {
        return { ...item, qty: Math.max(1, qty) }
      }
      return item
    }))
  }

  const clear = () => setItems([])

  const { totalItems, totalPrice } = useMemo(() => {
    const totalItems = items.reduce((acc, it) => acc + it.qty, 0)
    const totalPrice = items.reduce((acc, it) => acc + it.qty * it.product.price, 0)
    return { totalItems, totalPrice }
  }, [items])

  const value: CartCtx = { items, addItem, removeItem, updateQuantity, clear, totalItems, totalPrice }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

