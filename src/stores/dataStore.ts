import { create } from 'zustand'
import { api } from '../lib/api'
import { getPeriodStartDate } from '../lib/constants'
import {
  Category, Item, Order, Bill, SystemStats,
  ItemSales, CategorySales, StoreSummary, PeriodFilter,
} from '../types'
import { useAuthStore } from './authStore'

interface DataState {
  categories: Category[]
  items: Item[]
  orders: Order[]
  bills: Bill[]
  stats: SystemStats | null
  periodFilter: PeriodFilter
  isLoading: boolean
  error: string | null

  setPeriodFilter: (filter: PeriodFilter) => void
  loadStoreData: (storeId: string) => Promise<void>
  loadOrders: (storeId: string) => Promise<void>
  loadAllStoresSummary: () => Promise<StoreSummary[]>

  // computed
  getFilteredOrders: () => Order[]
  getCompletedOrders: () => Order[]
  getActiveOrders: () => Order[]
  getCancelledOrders: () => Order[]
  getParcelOrders: () => Order[]
  getTotalRevenue: () => number
  getTotalTax: () => number
  getTotalDiscount: () => number
  getAvgOrderValue: () => number
  getTodayRevenue: () => number
  getTodayOrderCount: () => number
  getPaymentMethodBreakdown: () => Map<string, number>
  getSalesByItem: () => ItemSales[]
  getSalesByCategory: () => CategorySales[]
  getDailySales: () => { date: string; amount: number; orderCount: number }[]
  getLast30DaysSales: () => { date: string; amount: number; orderCount: number }[]
}

export const useDataStore = create<DataState>((set, get) => ({
  categories: [],
  items: [],
  orders: [],
  bills: [],
  stats: null,
  periodFilter: 'all',
  isLoading: false,
  error: null,

  setPeriodFilter: (filter) => set({ periodFilter: filter }),

  loadStoreData: async (storeId) => {
    set({ isLoading: true, error: null })
    try {
      const [categories, items, orders, bills] = await Promise.all([
        api.getCategories(storeId),
        api.getItems(storeId),
        api.getOrders(storeId),
        api.getBills(storeId),
      ])
      set({ categories, items, orders, bills, isLoading: false })
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false })
    }
  },

  loadOrders: async (storeId) => {
    try {
      const orders = await api.getOrders(storeId)
      set({ orders })
    } catch (e) {
      set({ error: (e as Error).message })
    }
  },

  loadAllStoresSummary: async () => {
    const auth = useAuthStore.getState()
    const stores = auth.user?.stores ?? []
    const summaries: StoreSummary[] = []

    for (const store of stores) {
      try {
        await api.switchStore(store.id)
        const orders = await api.getOrders(store.id)
        const revenue = orders
          .filter((o) => o.status === 'completed')
          .reduce((sum, o) => sum + o.totalAmount, 0)
        summaries.push({
          storeId: store.id,
          storeName: store.branch ? `${store.name} - ${store.branch}` : store.name,
          totalRevenue: revenue,
          totalOrders: orders.length,
          completedOrders: orders.filter((o) => o.status === 'completed').length,
          activeOrders: orders.filter((o) => o.status === 'active').length,
        })
      } catch {
        summaries.push({
          storeId: store.id,
          storeName: store.branch ? `${store.name} - ${store.branch}` : store.name,
          totalRevenue: 0,
          totalOrders: 0,
          completedOrders: 0,
          activeOrders: 0,
        })
      }
    }

    if (auth.currentStore) {
      await api.switchStore(auth.currentStore.id)
    }
    return summaries
  },

  getFilteredOrders: () => {
    const { orders, periodFilter } = get()
    const start = getPeriodStartDate(periodFilter)
    if (!start) return orders
    return orders.filter((o) => new Date(o.createdAt) > new Date(start.getTime() - 1000))
  },

  getCompletedOrders: () => get().getFilteredOrders().filter((o) => o.status === 'completed'),
  getActiveOrders: () => get().getFilteredOrders().filter((o) => o.status === 'active'),
  getCancelledOrders: () => get().getFilteredOrders().filter((o) => o.status === 'cancelled'),
  getParcelOrders: () => get().getFilteredOrders().filter((o) => o.orderType === 'parcel'),

  getTotalRevenue: () => get().getCompletedOrders().reduce((sum, o) => sum + o.totalAmount, 0),
  getTotalTax: () => get().getCompletedOrders().reduce((sum, o) => sum + o.taxAmount, 0),
  getTotalDiscount: () => get().getCompletedOrders().reduce((sum, o) => sum + o.discountAmount, 0),

  getAvgOrderValue: () => {
    const completed = get().getCompletedOrders()
    return completed.length > 0 ? get().getTotalRevenue() / completed.length : 0
  },

  getTodayRevenue: () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return get().orders
      .filter((o) => o.status === 'completed')
      .filter((o) => new Date(o.createdAt) > new Date(today.getTime() - 1000))
      .reduce((sum, o) => sum + o.totalAmount, 0)
  },

  getTodayOrderCount: () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return get().orders
      .filter((o) => o.status === 'completed')
      .filter((o) => new Date(o.createdAt) > new Date(today.getTime() - 1000))
      .length
  },

  getPaymentMethodBreakdown: () => {
    const map = new Map<string, number>()
    for (const order of get().getCompletedOrders()) {
      const method = order.paymentMethod ?? 'Unknown'
      map.set(method, (map.get(method) ?? 0) + order.totalAmount)
    }
    return map
  },

  getSalesByItem: () => {
    const map = new Map<string, ItemSales>()
    for (const order of get().getCompletedOrders()) {
      for (const oi of order.items) {
        const key = oi.itemId
        const revenue = (oi.unitPrice ?? oi.item.price) * oi.quantity
        const catName = oi.item.categoryName ?? 'Uncategorized'
        const existing = map.get(key)
        if (existing) {
          map.set(key, {
            ...existing,
            quantity: existing.quantity + oi.quantity,
            revenue: existing.revenue + revenue,
          })
        } else {
          map.set(key, {
            itemId: oi.itemId,
            itemName: oi.item.name,
            categoryName: catName,
            quantity: oi.quantity,
            revenue,
          })
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue)
  },

  getSalesByCategory: () => {
    const map = new Map<string, CategorySales>()
    for (const order of get().getCompletedOrders()) {
      for (const oi of order.items) {
        const catName = oi.item.categoryName ?? 'Uncategorized'
        const catId = oi.item.categoryId
        const key = catId || catName
        const revenue = (oi.unitPrice ?? oi.item.price) * oi.quantity
        const existing = map.get(key)
        if (existing) {
          map.set(key, {
            ...existing,
            quantity: existing.quantity + oi.quantity,
            revenue: existing.revenue + revenue,
          })
        } else {
          map.set(key, {
            categoryId: catId,
            categoryName: catName,
            quantity: oi.quantity,
            revenue,
          })
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue)
  },

  getDailySales: () => {
    const map = new Map<string, { date: string; amount: number; orderCount: number }>()
    for (const order of get().getCompletedOrders()) {
      const d = new Date(order.createdAt)
      const dateKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
      const existing = map.get(dateKey)
      if (existing) {
        map.set(dateKey, {
          date: existing.date,
          amount: existing.amount + order.totalAmount,
          orderCount: existing.orderCount + 1,
        })
      } else {
        map.set(dateKey, {
          date: new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString(),
          amount: order.totalAmount,
          orderCount: 1,
        })
      }
    }
    return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  },

  getLast30DaysSales: () => {
    const allSales = get().getDailySales()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)
    return allSales.filter((s) => new Date(s.date) > new Date(thirtyDaysAgo.getTime() - 1000))
  },
}))
