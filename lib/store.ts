import { create } from "zustand"
import type { Product } from "./data"

interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  toggleCart: () => void
  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  total: number
}

interface QuickViewStore {
  isOpen: boolean
  product: Product | null
  openQuickView: (product: Product) => void
  closeQuickView: () => void
}

interface WishlistStore {
  items: number[]
  toggleWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  total: 0,
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id)
      let newItems: CartItem[]

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newItems = [...state.items, { product, quantity: 1 }]
      }

      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

      return { items: newItems, total, isOpen: true }
    })
  },
  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.product.id !== productId)
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      return { items: newItems, total }
    })
  },
  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        const newItems = state.items.filter((item) => item.product.id !== productId)
        const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        return { items: newItems, total }
      }

      const newItems = state.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      return { items: newItems, total }
    })
  },
}))

export const useQuickViewStore = create<QuickViewStore>((set) => ({
  isOpen: false,
  product: null,
  openQuickView: (product) => set({ isOpen: true, product }),
  closeQuickView: () => set({ isOpen: false, product: null }),
}))

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  toggleWishlist: (productId) => {
    set((state) => ({
      items: state.items.includes(productId)
        ? state.items.filter((id) => id !== productId)
        : [...state.items, productId],
    }))
  },
  isInWishlist: (productId) => get().items.includes(productId),
}))
