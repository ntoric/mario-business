export interface User {
  id: string
  username: string
  name: string
  email?: string
  role: string
  storeId?: string
  storeName?: string
  stores?: Store[]
  isActive: boolean
}

export interface Store {
  id: string
  name: string
  branch?: string
  location?: string
  gstin?: string
  fssaiNo?: string
  phone?: string
  logoUrl?: string
  isActive: boolean
  remoteBillingEnabled: boolean
}

export interface Category {
  id: string
  storeId: string
  name: string
  description?: string
  isActive: boolean
}

export interface Item {
  id: string
  storeId: string
  categoryId: string
  categoryName?: string
  name: string
  description?: string
  price: number
  hsnCode?: string
  taxPercent?: number
  isActive: boolean
}

export interface OrderItem {
  itemId: string
  item: Item
  quantity: number
  unitPrice?: number
  taxPercent?: number
  notes?: string
}

export interface Order {
  id: string
  storeId: string
  tableId: string
  tableNumber: number
  items: OrderItem[]
  status: string
  totalAmount: number
  taxAmount: number
  discountAmount: number
  paymentMethod?: string
  paymentStatus?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  orderType: string
}

export interface BillItem {
  itemId: string
  itemName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Bill {
  id: string
  storeId: string
  orderId: string
  tableNumber: number
  invoiceNo?: string
  items: BillItem[]
  subtotal: number
  taxTotal: number
  discount: number
  total: number
  paymentMethod?: string
  customerName?: string
  isPrinted: boolean
  generatedAt: string
  generatedBy: string
}

export interface SystemStats {
  users: number
  stores: number
  categories: number
  items: number
  orders: number
  tables: number
  bills: number
}

export interface SalesData {
  date: string
  amount: number
  orderCount: number
}

export interface ItemSales {
  itemId: string
  itemName: string
  categoryName: string
  quantity: number
  revenue: number
}

export interface CategorySales {
  categoryId: string
  categoryName: string
  quantity: number
  revenue: number
}

export interface StoreSummary {
  storeId: string
  storeName: string
  totalRevenue: number
  totalOrders: number
  completedOrders: number
  activeOrders: number
}

export type PeriodFilter = 'today' | 'week' | 'month' | 'all'
