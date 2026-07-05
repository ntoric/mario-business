import { useState } from 'react'
import { Store as StoreIcon, CheckCircle, X } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useDataStore } from '../stores/dataStore'
import { Store } from '../types'

export function StorePickerButton({ onStoreChanged }: { onStoreChanged?: () => void }) {
  const { user, currentStore, switchStore } = useAuthStore()
  const { loadStoreData } = useDataStore()
  const [open, setOpen] = useState(false)
  const stores = user?.stores ?? []

  if (stores.length === 0) return null

  const handleSelect = async (store: Store) => {
    setOpen(false)
    await switchStore(store)
    if (currentStore) {
      await loadStoreData(store.id)
    }
    onStoreChanged?.()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-10 h-10 bg-white rounded-xl card-shadow flex items-center justify-center"
      >
        <StoreIcon size={20} className="text-primary" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl w-full max-w-md pb-6 safe-bottom animate-fade-slide max-h-[85dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray300 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 pb-4">
              <h3 className="text-lg font-extrabold text-dark">Select Store</h3>
              <button onClick={() => setOpen(false)} className="touch-target p-1 -mr-1">
                <X size={20} className="text-gray400" />
              </button>
            </div>
            <div className="px-2">
              {stores.map((store) => {
                const isCurrent = currentStore?.id === store.id
                return (
                  <button
                    key={store.id}
                    onClick={() => !isCurrent && handleSelect(store)}
                    disabled={isCurrent}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                      isCurrent ? 'bg-primary-extraLight' : 'hover:bg-gray100'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        isCurrent ? 'gradient-primary' : 'bg-gray100'
                      }`}
                    >
                      {isCurrent ? (
                        <CheckCircle size={22} className="text-white" />
                      ) : (
                        <StoreIcon size={22} className="text-gray400" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-[15px] text-dark">
                        {store.branch ? `${store.name} - ${store.branch}` : store.name}
                      </p>
                      <p
                        className={`text-xs font-semibold ${
                          store.isActive ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {store.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="px-2.5 py-1 bg-primary-extraLight rounded-xl text-[11px] font-bold text-primary">
                        Current
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
