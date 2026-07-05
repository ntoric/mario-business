import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip, CartesianGrid, Legend,
} from 'recharts'
import { TrendingUp, FileText, DollarSign, ShoppingBag, Award, Package } from 'lucide-react'
import { useDataStore } from '../stores/dataStore'
import { useAuthStore } from '../stores/authStore'
import { PeriodFilterBar } from '../components/PeriodFilter'
import { StorePickerButton } from '../components/StorePicker'
import { GlassCard, StaggeredAnimation, ShimmerBox } from '../components/Animations'
import { formatCurrency, formatShortDate } from '../lib/constants'

export function Reports() {
  const { currentStore } = useAuthStore()
  const {
    isLoading, getTotalRevenue, getTotalDiscount,
    getCompletedOrders, getParcelOrders, getAvgOrderValue, getDailySales,
    getSalesByItem,
  } = useDataStore()

  const totalRevenue = getTotalRevenue()
  const totalDiscount = getTotalDiscount()
  const completedOrders = getCompletedOrders()
  const parcelOrders = getParcelOrders()
  const avgOrder = getAvgOrderValue()
  const dailySales = getDailySales()
  const topItems = getSalesByItem().slice(0, 5)

  const summaryStats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-success' },
    { label: 'Parcel Orders', value: parcelOrders.length.toString(), icon: Package, color: 'text-info' },
    { label: 'Total Discount', value: formatCurrency(totalDiscount), icon: DollarSign, color: 'text-danger' },
    { label: 'Avg Order Value', value: formatCurrency(avgOrder), icon: ShoppingBag, color: 'text-primary' },
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white mobile-header pb-3 px-4 xs:px-5 lg:px-8 sticky top-0 z-30 border-b border-gray100">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg xs:text-xl font-extrabold text-dark">Reports</h1>
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

      <div className="px-4 xs:px-5 lg:px-8 mt-4">
        {isLoading ? (
          <div className="space-y-3">
            <ShimmerBox className="h-24" />
            <ShimmerBox className="h-64" />
            <ShimmerBox className="h-64" />
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {summaryStats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <StaggeredAnimation key={i} index={i}>
                    <GlassCard className="p-4 flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gray100 flex items-center justify-center shrink-0">
                        <Icon size={18} className={stat.color} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-extrabold text-dark truncate">{stat.value}</p>
                        <p className="text-[11px] text-gray500">{stat.label}</p>
                      </div>
                    </GlassCard>
                  </StaggeredAnimation>
                )
              })}
            </div>

            {/* Revenue Trend */}
            <StaggeredAnimation index={4}>
              <GlassCard className="p-4 mt-4 lg:mt-4">
                <h3 className="font-bold text-sm text-dark mb-4">Revenue Trend</h3>
                {dailySales.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={dailySales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF6" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fontSize: 10, fill: '#8E92A6' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#8E92A6' }} />
                      <Tooltip
                        formatter={(v: number) => formatCurrency(v)}
                        labelFormatter={(l) => formatShortDate(l as string)}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#7B6EF6"
                        strokeWidth={3}
                        dot={{ fill: '#7B6EF6', r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-gray400 text-center py-12">No revenue data</p>
                )}
              </GlassCard>
            </StaggeredAnimation>

            {/* Orders Per Day */}
            <StaggeredAnimation index={5}>
              <GlassCard className="p-4 mt-4 lg:mt-4">
                <h3 className="font-bold text-sm text-dark mb-4">Orders Per Day</h3>
                {dailySales.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dailySales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF6" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fontSize: 10, fill: '#8E92A6' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#8E92A6' }} />
                      <Tooltip />
                      <Bar dataKey="orderCount" fill="#00CEC9" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-gray400 text-center py-12">No order data</p>
                )}
              </GlassCard>
            </StaggeredAnimation>

            {/* Top Items by Revenue */}
            <StaggeredAnimation index={6}>
              <GlassCard className="p-4 mt-4 lg:mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Award size={16} className="text-warningDark" />
                  <h3 className="font-bold text-sm text-dark">Top Items by Revenue</h3>
                </div>
                {topItems.length > 0 ? (
                  <div className="space-y-2.5">
                    {topItems.map((item, i) => (
                      <div key={item.itemId} className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          i === 0 ? 'bg-warning/20' : i === 1 ? 'bg-gray300' : i === 2 ? 'bg-warningDark/20' : 'bg-gray100'
                        }`}>
                          <span className="text-xs font-bold text-dark">{i + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-dark truncate">{item.itemName}</p>
                          <p className="text-[11px] text-gray500">{item.quantity} sold</p>
                        </div>
                        <p className="text-sm font-extrabold text-success">{formatCurrency(item.revenue)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray400 text-center py-8">No data</p>
                )}
              </GlassCard>
            </StaggeredAnimation>

            {/* Summary Report */}
            <StaggeredAnimation index={7}>
              <GlassCard className="p-4 mt-4 lg:mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={16} className="text-primary" />
                  <h3 className="font-bold text-sm text-dark">Summary Report</h3>
                </div>
                <div className="space-y-3">
                  <Row label="Total Orders" value={completedOrders.length.toString()} />
                  <Row label="Total Revenue" value={formatCurrency(totalRevenue)} />
                  <Row label="Parcel Orders" value={parcelOrders.length.toString()} />
                  <Row label="Total Discounts Given" value={formatCurrency(totalDiscount)} />
                  <Row label="Net Revenue" value={formatCurrency(totalRevenue - totalDiscount)} />
                  <Row label="Average Order Value" value={formatCurrency(avgOrder)} />
                </div>
              </GlassCard>
            </StaggeredAnimation>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-gray100 last:border-0">
      <span className="text-sm text-gray600 shrink-0">{label}</span>
      <span className="text-sm font-bold text-dark text-right truncate">{value}</span>
    </div>
  )
}
