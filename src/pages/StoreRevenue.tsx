import { useState, useEffect } from 'react'
import { Search, Store as StoreIcon, TrendingUp, ShoppingBag, Clock } from 'lucide-react'
import { useDataStore } from '../stores/dataStore'
import { GlassCard, StaggeredAnimation, ShimmerBox, AnimatedProgress } from '../components/Animations'
import { BottomNav } from '../components/BottomNav'
import { formatCurrency } from '../lib/constants'
import { StoreSummary } from '../types'

export function StoreRevenue({
  currentIndex,
  onTabChange,
}: {
  currentIndex: number
  onTabChange: (i: number) => void
}) {
  const { loadAllStoresSummary } = useDataStore()
  const [summaries, setSummaries] = useState<StoreSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    loadAllStoresSummary().then((s) => {
      setSummaries(s)
      setLoading(false)
    })
  }, [])

  const filtered = summaries.filter((s) =>
    s.storeName.toLowerCase().includes(search.toLowerCase()),
  )

  const totalRevenue = summaries.reduce((sum, s) => sum + s.totalRevenue, 0)
  const totalOrders = summaries.reduce((sum, s) => sum + s.totalOrders, 0)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="gradient-primary pt-header pb-6 px-4 xs:px-5 lg:px-8 rounded-b-[28px]">
        <h1 className="text-white text-lg xs:text-xl font-extrabold">Store Revenue</h1>
        <p className="text-white/60 text-sm mt-0.5">Performance across all stores</p>

        <div className="mt-4 grid grid-cols-2 gap-2.5 xs:gap-3">
          <div className="bg-white/10 rounded-2xl p-3 xs:p-3.5 backdrop-blur-sm min-w-0">
            <TrendingUp size={18} className="text-white/70" />
            <p className="text-white text-base xs:text-lg font-extrabold mt-1.5 truncate">{formatCurrency(totalRevenue)}</p>
            <p className="text-white/50 text-[11px]">Total Revenue</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 xs:p-3.5 backdrop-blur-sm min-w-0">
            <ShoppingBag size={18} className="text-white/70" />
            <p className="text-white text-base xs:text-lg font-extrabold mt-1.5">{totalOrders}</p>
            <p className="text-white/50 text-[11px]">Total Orders</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 xs:px-5 lg:px-8 mt-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray400" />
          <input
            type="search"
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>
      </div>

      {/* Store List */}
      <div className="px-4 xs:px-5 lg:px-8 mt-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <ShimmerBox key={i} className="h-24" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <StoreIcon size={48} className="text-gray300" />
            <p className="text-sm text-gray400 mt-4">No stores found</p>
          </div>
        ) : (
          <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
            {filtered.map((store, i) => (
              <StaggeredAnimation key={store.storeId} index={i}>
                <GlassCard className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-primary-extraLight flex items-center justify-center shrink-0">
                        <StoreIcon size={20} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-dark truncate">{store.storeName}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[11px] text-gray500">
                            <ShoppingBag size={11} />
                            {store.completedOrders}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-gray500">
                            <Clock size={11} />
                            {store.activeOrders} active
                          </span>
                        </div>
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

      <BottomNav currentIndex={currentIndex} onTabChange={onTabChange} />
    </div>
  )
}
