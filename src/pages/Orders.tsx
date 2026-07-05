import { useState, useMemo, type ReactNode } from 'react'
import {
  Search, ChevronDown, Receipt, Clock, CheckCircle,
  XCircle, Package, Utensils, ShoppingBag,
} from 'lucide-react'
import { useDataStore } from '../stores/dataStore'
import { useAuthStore } from '../stores/authStore'
import { PeriodFilterBar } from '../components/PeriodFilter'
import { StorePickerButton } from '../components/StorePicker'
import { GlassCard, StaggeredAnimation, ShimmerBox } from '../components/Animations'
import { formatCurrency, formatDate } from '../lib/constants'
import { Order } from '../types'

type StatusFilter = 'all' | 'active' | 'completed' | 'cancelled'

export function Orders() {
  const { currentStore } = useAuthStore()
  const { isLoading, getFilteredOrders, periodFilter } = useDataStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredOrders = useMemo(() => {
    let orders = getFilteredOrders()
    if (statusFilter !== 'all') {
      orders = orders.filter((o) => o.status === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.tableNumber.toString().includes(q) ||
          o.orderType.toLowerCase().includes(q) ||
          o.items.some((oi) => oi.item.name.toLowerCase().includes(q)),
      )
    }
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [getFilteredOrders, periodFilter, statusFilter, search])

  const statusTabs: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-success" />
      case 'active':
        return <Clock size={16} className="text-warningDark" />
      case 'cancelled':
        return <XCircle size={16} className="text-danger" />
      default:
        return <Receipt size={16} className="text-gray400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success'
      case 'active': return 'bg-warning/10 text-warningDark'
      case 'cancelled': return 'bg-danger/10 text-danger'
      default: return 'bg-gray100 text-gray600'
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white mobile-header pb-3 px-4 xs:px-5 lg:px-8 sticky top-0 z-30 border-b border-gray100">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg xs:text-xl font-extrabold text-dark">Orders</h1>
            <p className="text-xs text-gray500 mt-0.5 truncate">
              {currentStore?.branch ? `${currentStore.name} - ${currentStore.branch}` : currentStore?.name}
            </p>
          </div>
          <StorePickerButton />
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray400" />
          <input
            type="search"
            placeholder="Search orders, items, tables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        {/* Status Tabs */}
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {statusTabs.map((t) => {
            const isSelected = statusFilter === t.key
            return (
              <button
                key={t.key}
                onClick={() => setStatusFilter(t.key)}
                className={`px-3.5 xs:px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all touch-target ${
                  isSelected ? 'bg-primary text-white' : 'bg-gray100 text-gray600'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="mt-2 -mx-1">
          <PeriodFilterBar />
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 xs:px-5 lg:px-8 mt-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <ShimmerBox key={i} className="h-24" />)}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Receipt size={48} className="text-gray300" />
            <p className="text-sm text-gray400 mt-4">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
            {filteredOrders.map((order, i) => (
              <StaggeredAnimation key={order.id} index={i}>
                <OrderCard
                  order={order}
                  isExpanded={expandedId === order.id}
                  onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  getStatusIcon={getStatusIcon}
                  getStatusColor={getStatusColor}
                />
              </StaggeredAnimation>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OrderCard({
  order, isExpanded, onToggle, getStatusIcon, getStatusColor,
}: {
  order: Order
  isExpanded: boolean
  onToggle: () => void
  getStatusIcon: (s: string) => ReactNode
  getStatusColor: (s: string) => string
}) {
  return (
    <GlassCard className="overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 text-left touch-target">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getStatusColor(order.status)}`}>
              {order.orderType === 'parcel' ? <Package size={18} /> : <Utensils size={18} />}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-dark truncate">
                {order.orderType === 'parcel' ? 'Parcel' : `Table ${order.tableNumber}`}
              </p>
              <p className="text-[11px] text-gray500 mt-0.5">{formatDate(order.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`px-2 py-1 rounded-lg text-[10px] xs:text-[11px] font-bold flex items-center gap-1 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="hidden xs:inline">{order.status}</span>
            </span>
            <ChevronDown
              size={18}
              className={`text-gray400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs text-gray500 min-w-0">
            <span className="flex items-center gap-1 shrink-0">
              <ShoppingBag size={13} />
              {order.items.length} items
            </span>
            {order.paymentMethod && (
              <span className="capitalize truncate">{order.paymentMethod}</span>
            )}
          </div>
          <p className="text-base font-extrabold text-dark shrink-0">{formatCurrency(order.totalAmount)}</p>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray100 pt-3">
          <div className="space-y-2">
            {order.items.map((oi, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-gray400 font-bold w-6 shrink-0">{oi.quantity}x</span>
                  <span className="text-dark font-medium truncate">{oi.item.name}</span>
                </div>
                <span className="text-gray600 font-semibold shrink-0">
                  {formatCurrency((oi.unitPrice ?? oi.item.price) * oi.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray100 space-y-1.5">
            <div className="flex justify-between text-xs text-gray500">
              <span>Subtotal</span>
              <span>{formatCurrency(order.totalAmount - order.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray500">
              <span>Tax</span>
              <span>{formatCurrency(order.taxAmount)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-xs text-danger">
                <span>Discount</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold text-dark pt-1">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  )
}
