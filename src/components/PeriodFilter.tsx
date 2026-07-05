import { PeriodFilter } from '../types'
import { PERIOD_LABELS } from '../lib/constants'
import { useDataStore } from '../stores/dataStore'

const periods: PeriodFilter[] = ['today', 'week', 'month', 'all']

export function PeriodFilterBar() {
  const { periodFilter, setPeriodFilter } = useDataStore()

  return (
    <div className="px-0 py-1.5 -mx-1 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 px-1">
        {periods.map((p) => {
          const isSelected = p === periodFilter
          return (
            <button
              key={p}
              onClick={() => setPeriodFilter(p)}
              className={`px-3.5 xs:px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 touch-target ${
                isSelected
                  ? 'bg-primary text-white shadow-[0_3px_8px_rgba(123,110,246,0.4)]'
                  : 'bg-gray100 text-primary shadow-[0_3px_8px_rgba(30,20,56,0.15)]'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          )
        })}
      </div>
    </div>
  )
}
