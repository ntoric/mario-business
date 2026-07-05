import { Download, X } from 'lucide-react'
import { usePwaInstall } from '../hooks/usePwaInstall'

export function InstallPrompt() {
  const { canInstall, isInstalled, install, dismiss } = usePwaInstall()

  if (!canInstall || isInstalled) return null

  return (
    <div className="fixed left-4 right-4 z-50 animate-fade-slide lg:bottom-4 lg:left-72 lg:right-auto lg:max-w-sm" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 5.5rem)' }}>
      <div className="bg-white rounded-2xl elevated-shadow p-4 flex items-center gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray100 flex items-center justify-center">
          <img src="/icon-192.png" alt="Mario Business" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-dark">Install Mario Business</p>
          <p className="text-xs text-gray500">Add to your home screen for quick access</p>
        </div>
        <button
          onClick={install}
          className="flex-shrink-0 bg-primary text-white rounded-xl p-2.5 active:scale-90 transition-transform"
          aria-label="Install"
        >
          <Download size={20} />
        </button>
        <button
          onClick={dismiss}
          className="flex-shrink-0 text-gray400 p-1 active:scale-90 transition-transform"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
