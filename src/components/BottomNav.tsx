import { LayoutDashboard, BarChart3, FileText, Receipt, Settings } from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: BarChart3, label: 'Sales' },
  { icon: FileText, label: 'Reports' },
  { icon: Receipt, label: 'Orders' },
  { icon: Settings, label: 'Settings' },
]

export function BottomNav({
  currentIndex,
  onTabChange,
  fixedMobile = false,
}: {
  currentIndex: number
  onTabChange: (index: number) => void
  fixedMobile?: boolean
}) {
  const mobileNavClass = fixedMobile
    ? 'lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray200 z-50 safe-bottom'
    : 'lg:hidden flex-shrink-0 bg-white border-t border-gray200 z-50 safe-bottom'

  return (
    <>
      {/* Mobile: bottom bar */}
      <nav className={mobileNavClass}>
        <div className="flex items-stretch w-full px-0.5 py-1">
          {navItems.map((item, index) => {
            const isSelected = currentIndex === index
            const Icon = item.icon
            return (
              <button
                key={index}
                onClick={() => onTabChange(index)}
                className={`touch-target flex flex-1 flex-col items-center justify-center gap-0.5 min-w-0 py-1 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary-extraLight text-primary'
                    : 'text-gray400'
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={isSelected ? 2.5 : 2}
                  className={isSelected ? 'text-primary' : 'text-gray400'}
                />
                <span
                  className={`text-[10px] xs:text-[11px] leading-tight ${
                    isSelected ? 'font-bold text-primary' : 'font-medium text-gray400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Tablet/Laptop: side rail */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray200 z-50 flex-col py-6">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
              <img src="/splash.png" alt="Mario Business" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-extrabold text-dark text-sm">Mario Business</p>
              <p className="text-[11px] text-gray400">Dashboard & Analytics</p>
            </div>
          </div>
        </div>
        <div className="flex-1 px-3 space-y-1">
          {navItems.map((item, index) => {
            const isSelected = currentIndex === index
            const Icon = item.icon
            return (
              <button
                key={index}
                onClick={() => onTabChange(index)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary-extraLight text-primary'
                    : 'text-gray500 hover:bg-gray100'
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={isSelected ? 2.5 : 2}
                  className={isSelected ? 'text-primary' : 'text-gray400'}
                />
                <span
                  className={`text-sm ${
                    isSelected ? 'font-bold text-primary' : 'font-medium text-gray500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
