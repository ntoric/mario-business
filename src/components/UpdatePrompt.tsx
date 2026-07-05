import { RefreshCw, X } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegistered(registration) {
      if (registration) {
        setInterval(() => registration.update(), 60 * 60 * 1000)
      }
    },
  })

  if (!needRefresh) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-[60] animate-fade-slide lg:left-72 lg:right-auto lg:max-w-sm">
      <div className="bg-white rounded-2xl elevated-shadow p-4 flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-extraLight flex items-center justify-center">
          <RefreshCw size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-dark">Update available</p>
          <p className="text-xs text-gray500">A new version of Mario Business is ready</p>
        </div>
        <button
          onClick={() => updateServiceWorker(true)}
          className="flex-shrink-0 bg-primary text-white text-xs font-bold rounded-xl px-3 py-2 active:scale-90 transition-transform"
        >
          Reload
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="flex-shrink-0 text-gray400 p-1 active:scale-90 transition-transform"
          aria-label="Dismiss update"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
