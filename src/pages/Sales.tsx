import { useState } from 'react'
import {
  BarChart3, TrendingUp, Package, Tag, DollarSign,
  ShoppingBag, CreditCard,
} from 'lucide-react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip, CartesianGrid,
} from 'recharts'
import { useDataStore } from '../stores/dataStore'
import { useAuthStore } from '../stores/authStore'
import { PeriodFilterBar } from '../components/PeriodFilter'
import { StorePickerButton } from '../components/StorePicker'
import { GlassCard, StaggeredAnimation, ShimmerBox } from '../components/Animations'
import { formatCurrency, formatShortDate } from '../lib/constants'

const PIE_COLORS = ['#7B6EF6', '#00CEC9', '#00B894', '#FDCB6E', '#E84393', '#0984E3', '#E17055', '#6A5AE0']

type Tab = 'overall' | 'items' | 'categories'

export function Sales() {
  const { currentStore } = useAuthStore()
  const {
    isLoading, getTotalRevenue, getAvgOrderValue,
    getCompletedOrders, getSalesByItem, getSalesByCategory,
    getPaymentMethodBreakdown, getDailySales,
  } = useDataStore()

  const [tab, setTab] = useState<Tab>('overall')

  const totalRevenue = getTotalRevenue()
  const avgOrder = getAvgOrderValue()
  const completedOrders = getCompletedOrders()
  const itemSales = getSalesByItem()
  const categorySales = getSalesByCategory()
  const paymentBreakdown = getPaymentMethodBreakdown()
  const dailySales = getDailySales()

  const paymentData = Array.from(paymentBreakdown.entries()).map(([name, value]) => ({ name, value }))
  const topItems = itemSales.slice(0, 10)
  const topCategories = categorySales.slice(0, 10)

  const tabs: { key: Tab; label: string; icon: typeof BarChart3 }[] = [
    { key: 'overall', label: 'Overall', icon: BarChart3 },
    { key: 'items', label: 'By Item', icon: Package },
    { key: 'categories', label: 'By Category', icon: Tag },
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white mobile-header pb-3 px-4 xs:px-5 lg:px-8 sticky top-0 z-30 border-b border-gray100">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg xs:text-xl font-extrabold text-dark">Sales Analytics</h1>
            <p className="text-xs text-gray500 mt-0.5 truncate">
              {currentStore?.branch ? `${currentStore.name} - ${currentStore.branch}` : currentStore?.name}
            </p>
          </div>
          <StorePickerButton />
        </div>
        <div className="mt-3 -mx-1">
          <PeriodFilterBar />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 xs:px-5 lg:px-8 pt-4">
        <div className="flex gap-1.5 xs:gap-2 bg-gray100 rounded-2xl p-1 w-full">
          {tabs.map((t) => {
            const Icon = t.icon
            const isSelected = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1 xs:gap-1.5 py-2.5 rounded-xl text-xs xs:text-sm font-bold transition-all touch-target min-w-0 ${
                  isSelected ? 'bg-white text-primary shadow-sm' : 'text-gray500'
                }`}
              >
                <Icon size={15} className="shrink-0 xs:w-4 xs:h-4" />
                <span className="truncate">{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 xs:px-5 lg:px-8 mt-4">
        {isLoading ? (
          <div className="space-y-3">
            <ShimmerBox className="h-28" />
            <ShimmerBox className="h-64" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <StaggeredAnimation index={0}>
                <GlassCard className="p-3.5 flex xs:flex-col items-center xs:items-start gap-3 xs:gap-0">
                  <DollarSign size={18} className="text-success shrink-0" />
                  <div className="min-w-0 flex-1 xs:flex-none">
                    <p className="text-base font-extrabold text-dark truncate">{formatCurrency(totalRevenue)}</p>
                    <p className="text-[11px] text-gray500">Revenue</p>
                  </div>
                </GlassCard>
              </StaggeredAnimation>
              <StaggeredAnimation index={1}>
                <GlassCard className="p-3.5 flex xs:flex-col items-center xs:items-start gap-3 xs:gap-0">
                  <ShoppingBag size={18} className="text-info shrink-0" />
                  <div className="min-w-0 flex-1 xs:flex-none">
                    <p className="text-base font-extrabold text-dark">{completedOrders.length}</p>
                    <p className="text-[11px] text-gray500">Orders</p>
                  </div>
                </GlassCard>
              </StaggeredAnimation>
              <StaggeredAnimation index={2}>
                <GlassCard className="p-3.5 flex xs:flex-col items-center xs:items-start gap-3 xs:gap-0">
                  <TrendingUp size={18} className="text-primary shrink-0" />
                  <div className="min-w-0 flex-1 xs:flex-none">
                    <p className="text-base font-extrabold text-dark truncate">{formatCurrency(avgOrder)}</p>
                    <p className="text-[11px] text-gray500">Avg Order</p>
                  </div>
                </GlassCard>
              </StaggeredAnimation>
            </div>

            {tab === 'overall' && (
              <div className="mt-4 space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                {/* Daily Sales Chart */}
                <StaggeredAnimation index={3}>
                  <GlassCard className="p-4">
                    <h3 className="font-bold text-sm text-dark mb-4">Daily Sales Trend</h3>
                    {dailySales.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={dailySales.slice(-14)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF6" vertical={false} />
                          <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fontSize: 10, fill: '#8E92A6' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#8E92A6' }} />
                          <Tooltip
                            formatter={(v: number) => formatCurrency(v)}
                            labelFormatter={(l) => formatShortDate(l as string)}
                          />
                          <Bar dataKey="amount" fill="#7B6EF6" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-sm text-gray400 text-center py-12">No sales data</p>
                    )}
                  </GlassCard>
                </StaggeredAnimation>

                {/* Payment Methods */}
                <StaggeredAnimation index={4}>
                  <GlassCard className="p-4">
                    <h3 className="font-bold text-sm text-dark mb-4">Payment Methods</h3>
                    {paymentData.length > 0 ? (
                      <div className="flex flex-col xs:flex-row items-center gap-4">
                        <div className="w-full xs:w-1/2 max-w-[200px] xs:max-w-none mx-auto xs:mx-0">
                          <ResponsiveContainer width="100%" height={160}>
                          <PieChart>
                            <Pie
                              data={paymentData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={70}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {paymentData.map((_, i) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(v: number) => formatCurrency(v)} />
                          </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex-1 w-full space-y-2">
                          {paymentData.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                              />
                              <span className="text-xs text-gray700 font-medium flex-1 truncate">{p.name}</span>
                              <span className="text-xs font-bold text-dark shrink-0">{formatCurrency(p.value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray400 text-center py-8">No payment data</p>
                    )}
                  </GlassCard>
                </StaggeredAnimation>
              </div>
            )}

            {tab === 'items' && (
              <div className="mt-4">
                <StaggeredAnimation index={3}>
                  <GlassCard className="p-4">
                    <h3 className="font-bold text-sm text-dark mb-4">Top Items by Revenue</h3>
                    {topItems.length > 0 ? (
                      <ResponsiveContainer width="100%" height={Math.max(200, topItems.length * 36)}>
                        <BarChart data={topItems} layout="vertical" margin={{ left: 10, right: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF6" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 10, fill: '#8E92A6' }} />
                          <YAxis
                            type="category"
                            dataKey="itemName"
                            tick={{ fontSize: 10, fill: '#4A4E63' }}
                            width={90}
                          />
                          <Tooltip formatter={(v: number) => formatCurrency(v)} />
                          <Bar dataKey="revenue" fill="#7B6EF6" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-sm text-gray400 text-center py-12">No item sales data</p>
                    )}
                  </GlassCard>
                </StaggeredAnimation>

                {/* Item list */}
                <div className="mt-3 space-y-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0">
                  {itemSales.slice(0, 20).map((item, i) => (
                    <StaggeredAnimation key={item.itemId} index={i + 4}>
                      <GlassCard className="p-3.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-primary-extraLight flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">{i + 1}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-dark truncate">{item.itemName}</p>
                            <p className="text-[11px] text-gray500 truncate">{item.categoryName} · {item.quantity} sold</p>
                          </div>
                        </div>
                        <p className="text-sm font-extrabold text-success shrink-0">{formatCurrency(item.revenue)}</p>
                      </GlassCard>
                    </StaggeredAnimation>
                  ))}
                </div>
              </div>
            )}

            {tab === 'categories' && (
              <div className="mt-4">
                <StaggeredAnimation index={3}>
                  <GlassCard className="p-4">
                    <h3 className="font-bold text-sm text-dark mb-4">Sales by Category</h3>
                    {topCategories.length > 0 ? (
                      <ResponsiveContainer width="100%" height={Math.max(200, topCategories.length * 36)}>
                        <BarChart data={topCategories} layout="vertical" margin={{ left: 10, right: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF6" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 10, fill: '#8E92A6' }} />
                          <YAxis
                            type="category"
                            dataKey="categoryName"
                            tick={{ fontSize: 10, fill: '#4A4E63' }}
                            width={90}
                          />
                          <Tooltip formatter={(v: number) => formatCurrency(v)} />
                          <Bar dataKey="revenue" fill="#00CEC9" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-sm text-gray400 text-center py-12">No category sales data</p>
                    )}
                  </GlassCard>
                </StaggeredAnimation>

                <div className="mt-3 space-y-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0">
                  {categorySales.map((cat, i) => (
                    <StaggeredAnimation key={cat.categoryId || cat.categoryName} index={i + 4}>
                      <GlassCard className="p-3.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                            <Tag size={16} className="text-accent" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-dark truncate">{cat.categoryName}</p>
                            <p className="text-[11px] text-gray500">{cat.quantity} items sold</p>
                          </div>
                        </div>
                        <p className="text-sm font-extrabold text-success shrink-0">{formatCurrency(cat.revenue)}</p>
                      </GlassCard>
                    </StaggeredAnimation>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
