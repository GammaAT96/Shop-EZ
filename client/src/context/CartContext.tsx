import React from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import type { ApiCartItem, UiProduct } from '@/types'

type CartContextValue = {
  items: ApiCartItem[]
  loading: boolean
  add: (product: UiProduct, opts?: { size?: string; quantity?: number }) => Promise<void>
  remove: (id: string) => Promise<void>
  setQuantity: (id: string, quantity: number) => Promise<void>
  refresh: () => Promise<void>
}

const CartContext = React.createContext<CartContextValue | null>(null)

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const [items, setItems] = React.useState<ApiCartItem[]>([])
  const [loading, setLoading] = React.useState(false)

  const refresh = React.useCallback(async () => {
    if (!token) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      const res = await api.get<ApiCartItem[]>('/api/cart/me')
      setItems(res.data)
    } finally {
      setLoading(false)
    }
  }, [token])

  React.useEffect(() => {
    refresh().catch(() => {})
  }, [refresh])

  const add = React.useCallback(
    async (product: UiProduct, opts?: { size?: string; quantity?: number }) => {
      if (!token) throw new Error('Login required')
      const size = opts?.size ?? product.sizes?.[0] ?? 'M'
      const quantity = opts?.quantity ?? 1
      const payload = {
        title: product.name,
        description: product.description ?? '',
        mainImg: product.image,
        size,
        quantity,
        price: product.price,
        discount: product.originalPrice ? Math.max(0, product.originalPrice - product.price) : 0,
      }
      await api.post('/api/cart/add', payload)
      await refresh()
    },
    [token, refresh]
  )

  const remove = React.useCallback(
    async (id: string) => {
      if (!token) throw new Error('Login required')
      await api.delete(`/api/cart/${id}`)
      setItems((prev) => prev.filter((x) => x.id !== id))
    },
    [token]
  )

  const setQuantity = React.useCallback(
    async (id: string, quantity: number) => {
      if (!token) throw new Error('Login required')
      const res = await api.patch<ApiCartItem>(`/api/cart/${id}`, { quantity })
      setItems((prev) => prev.map((x) => (x.id === id ? res.data : x)))
    },
    [token]
  )

  const value: CartContextValue = { items, loading, add, remove, setQuantity, refresh }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

