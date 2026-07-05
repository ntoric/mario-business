import { useEffect, useState } from 'react'
import {
  TrendingUp, ShoppingBag, Clock, DollarSign,
  Store as StoreIcon, ArrowRight, Package, Tag, Receipt,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useDataStore } from '../stores/dataStore'
import { StaggeredAnimation, GlassCard, ShimmerBox, AnimatedProgress } from '../components/Animations'
import { StorePickerButton } from '../components/StorePicker'
import { formatCurrency, APP_NAME, APP_VERSION } from '../lib/constants'
import { StoreSummary } from '../types'

export function Dashboard({ onNavigateToStores }: { onNavigateToStores?: () => void }) {
  const { user, currentStore } = useAuthStore()
  const {
    isLoading, orders, items, categories, bills,
    getTotalRevenue, getTodayRevenue, getTodayOrderCount,
    getCompletedOrders, getActiveOrders, loadAllStoresSummary,
  } = useDataStore()

  const [storeSummaries, setStoreSummaries] = useState<StoreSummary[]>([])
  const [loadingSummaries, setLoadingSummaries] = useState(false)

  useEffect(() => {
    if (user?.stores && user.stores.length > 1) {
      setLoadingSummaries(true)
      loadAllStoresSummary().then((s) => {
        setStoreSummaries(s)
        setLoadingSummaries(false)
      })
    }
  }, [user?.stores])

  const totalRevenue = getTotalRevenue()
  const todayRevenue = getTodayRevenue()
  const todayOrders = getTodayOrderCount()
  const completedOrders = getCompletedOrders()
  const activeOrders = getActiveOrders()
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'gradient-success', textColor: 'text-success' },
    { label: "Today's Revenue", value: formatCurrency(todayRevenue), icon: TrendingUp, color: 'gradient-primary', textColor: 'text-primary' },
    { label: 'Total Orders', value: completedOrders.length.toString(), icon: ShoppingBag, color: 'gradient-info', textColor: 'text-info' },
    { label: "Today's Orders", value: todayOrders.toString(), icon: Clock, color: 'gradient-warning', textColor: 'text-warningDark' },
  ]

  const quickStats = [
    { label: 'Active Orders', value: activeOrders.length, icon: Clock, color: 'text-warningDark' },
    { label: 'Avg Order Value', value: formatCurrency(avgOrderValue), icon: DollarSign, color: 'text-primary' },
    { label: 'Total Items', value: items.length, icon: Package, color: 'text-info' },
    { label: 'Categories', value: categories.length, icon: Tag, color: 'text-accent' },
    { label: 'Total Bills', value: bills.length, icon: Receipt, color: 'text-success' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-danger' },
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="gradient-primary pt-header pb-20 px-4 xs:px-5 lg:px-8 rounded-b-[32px]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Dashboard</p>
            <h1 className="text-white text-xl xs:text-2xl font-extrabold mt-1 truncate">
              Hello, {user?.name?.split(' ')[0] ?? 'User'}
            </h1>
            <p className="text-white/50 text-sm mt-0.5 truncate">
              {currentStore?.branch ? `${currentStore.name} - ${currentStore.branch}` : currentStore?.name ?? 'All Stores'}
            </p>
          </div>
          <StorePickerButton />
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="px-4 xs:px-5 lg:px-8 -mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 xs:gap-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ShimmerBox key={i} className="h-28 xs:h-32" />)
            : stats.map((stat, i) => {
                const Icon = stat.icon
                return (
                  <StaggeredAnimation key={i} index={i}>
                    <GlassCard className="p-3 xs:p-4 h-28 xs:h-32 flex flex-col justify-between min-w-0">
                      <div className={`w-9 xs:w-10 h-9 xs:h-10 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
                        <Icon size={18} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base xs:text-xl font-extrabold text-dark truncate">{stat.value}</p>
                        <p className="text-[11px] xs:text-xs text-gray500 font-medium mt-0.5 leading-tight">{stat.label}</p>
                      </div>
                    </GlassCard>
                  </StaggeredAnimation>
                )
              })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 xs:px-5 lg:px-8 mt-6">
        <h2 className="section-title mb-3">Quick Stats</h2>
        <GlassCard className="p-3 xs:p-4">
          <div className="grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-3 xs:gap-4">
            {quickStats.map((qs, i) => {
              const Icon = qs.icon
              return (
                <div key={i} className="flex flex-col items-center text-center min-w-0">
                  <Icon size={20} className={qs.color} />
                  <p className="text-sm xs:text-base font-extrabold text-dark mt-1.5 truncate w-full">{qs.value}</p>
                  <p className="text-[11px] text-gray500 font-medium mt-0.5 leading-tight">{qs.label}</p>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>

      {/* All Stores Summary */}
      {user?.stores && user.stores.length > 1 && (
        <div className="px-4 xs:px-5 lg:px-8 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title">All Stores</h2>
            {onNavigateToStores && (
              <button
                onClick={onNavigateToStores}
                className="flex items-center gap-1 text-primary text-xs font-bold"
              >
                View All <ArrowRight size={14} />
              </button>
            )}
          </div>
          {loadingSummaries ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => <ShimmerBox key={i} className="h-20" />)}
            </div>
          ) : (
            <div className="space-y-3 max-h-[280px] overflow-y-auto no-scrollbar">
              {storeSummaries.slice(0, 3).map((store, i) => (
                <StaggeredAnimation key={store.storeId} index={i}>
                  <GlassCard className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-primary-extraLight flex items-center justify-center shrink-0">
                          <StoreIcon size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-dark truncate">{store.storeName}</p>
                          <p className="text-xs text-gray500 mt-0.5">
                            {store.completedOrders} orders · {store.activeOrders} active
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-extrabold text-sm text-success">
                          {formatCurrency(store.totalRevenue)}
                        </p>
                        <p className="text-[10px] text-gray500">Revenue</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <AnimatedProgress
                        value={store.totalOrders > 0 ? store.completedOrders / store.totalOrders : 0}
                        color="#00B894"
                        height={5}
                      />
                    </div>
                  </GlassCard>
                </StaggeredAnimation>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 xs:px-5 lg:px-8 mt-8 text-center">
        <p className="text-xs text-gray400">{APP_NAME} v{APP_VERSION}</p>
      </div>
    </div>
  )
}
