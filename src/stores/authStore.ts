import { create } from 'zustand'
import { api } from '../lib/api'
import { User, Store } from '../types'

interface AuthState {
  user: User | null
  currentStore: Store | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  isInitialized: boolean

  initialize: () => Promise<void>
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  switchStore: (store: Store) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  clearError: () => void
  refreshUser: () => Promise<void>
}

function resolveCurrentStore(user: User): Store | null {
  const stores = user.stores
  if (!stores || stores.length === 0) return null
  if (user.storeId) {
    const found = stores.find((s) => s.id === user.storeId)
    if (found) return found
  }
  return stores[0]
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  currentStore: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isInitialized: false,

  initialize: async () => {
    const token = api.getToken()
    if (token) {
      try {
        const me = await api.getMe()
        let stores: Store[] = []
        try {
          stores = await api.getStores()
        } catch {}
        const userWithStores = { ...me, stores }
        const currentStore = resolveCurrentStore(userWithStores)
        set({ user: userWithStores, currentStore, isAuthenticated: true, isInitialized: true })
      } catch {
        api.clearToken()
        set({ isInitialized: true })
      }
    } else {
      set({ isInitialized: true })
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null })
    try {
      const result = await api.login(username, password)
      const me = await api.getMe()
      let stores: Store[] = []
      try {
        stores = await api.getStores()
      } catch {}
      const userWithStores = { ...me, stores }
      const currentStore = resolveCurrentStore(userWithStores)
      set({ user: userWithStores, currentStore, isAuthenticated: true, isLoading: false })
      return true
    } catch (e) {
      const msg = (e as Error).message.replace('Exception: ', '')
      set({ error: msg, isLoading: false })
      return false
    }
  },

  logout: async () => {
    api.clearToken()
    set({ user: null, currentStore: null, isAuthenticated: false })
  },

  switchStore: async (store) => {
    try {
      const result = await api.switchStore(store.id)
      set({ currentStore: result })
    } catch (e) {
      set({ error: (e as Error).message })
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null })
    try {
      await api.changePassword(currentPassword, newPassword)
      set({ isLoading: false })
      return true
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false })
      return false
    }
  },

  clearError: () => set({ error: null }),

  refreshUser: async () => {
    if (!get().isAuthenticated) return
    try {
      const me = await api.getMe()
      const stores = await api.getStores()
      const userWithStores = { ...me, stores }
      const currentStore = resolveCurrentStore(userWithStores)
      set({ user: userWithStores, currentStore })
    } catch {}
  },
}))
