import {
  User, Store, Category, Item, Order, Bill, SystemStats,
} from '../types'
import { DEFAULT_API_URL } from './constants'

class ApiService {
  private baseUrl: string = DEFAULT_API_URL
  private token: string | null = null

  constructor() {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) this.token = savedToken
    const savedUrl = localStorage.getItem('api_url')
    if (savedUrl) this.baseUrl = savedUrl
  }

  get apiUrl() {
    return this.baseUrl
  }

  private get headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' }
    if (this.token) h['Authorization'] = `Bearer ${this.token}`
    return h
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  getToken() {
    return this.token
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status >= 200 && response.status < 300) {
      const text = await response.text()
      if (!text) return null as T
      return JSON.parse(text) as T
    } else if (response.status === 401) {
      this.clearToken()
      throw new Error('Session expired. Please login again.')
    } else {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || 'Request failed')
    }
  }

  async login(username: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await this.handleResponse<{ token: string; user: User }>(res)
    if (data.token) {
      this.setToken(data.token)
    }
    return data
  }

  async getMe(): Promise<User> {
    const res = await fetch(`${this.baseUrl}/auth/me`, { headers: this.headers })
    return this.handleResponse<User>(res)
  }

  async getStores(): Promise<Store[]> {
    const res = await fetch(`${this.baseUrl}/stores`, { headers: this.headers })
    return this.handleResponse<Store[]>(res)
  }

  async switchStore(storeId: string): Promise<Store> {
    const res = await fetch(`${this.baseUrl}/stores/switch`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ storeId }),
    })
    const data = await this.handleResponse<{ store: Store }>(res)
    return data.store
  }

  async getCategories(storeId: string): Promise<Category[]> {
    const res = await fetch(`${this.baseUrl}/categories?storeId=${storeId}`, { headers: this.headers })
    return this.handleResponse<Category[]>(res)
  }

  async getItems(storeId: string): Promise<Item[]> {
    const res = await fetch(`${this.baseUrl}/items?storeId=${storeId}`, { headers: this.headers })
    return this.handleResponse<Item[]>(res)
  }

  async getOrders(storeId: string): Promise<Order[]> {
    const res = await fetch(`${this.baseUrl}/orders?storeId=${storeId}`, { headers: this.headers })
    return this.handleResponse<Order[]>(res)
  }

  async getBills(storeId: string): Promise<Bill[]> {
    const res = await fetch(`${this.baseUrl}/bills?storeId=${storeId}`, { headers: this.headers })
    return this.handleResponse<Bill[]>(res)
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/users/change-password`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    await this.handleResponse(res)
  }

  async getSystemStats(): Promise<SystemStats> {
    const res = await fetch(`${this.baseUrl}/system/stats`, { headers: this.headers })
    return this.handleResponse<SystemStats>(res)
  }

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { headers: this.headers })
      return res.status === 200
    } catch {
      return false
    }
  }
}

export const api = new ApiService()
