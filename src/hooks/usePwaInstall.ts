import { useCallback, useEffect, useState } from 'react'

const DISMISSAL_KEY = 'pwa-install-dismissed'
const DISMISSAL_DURATION = 7 * 24 * 60 * 60 * 1000

export function isStandalonePwa(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

export function isAndroid(): boolean {
  return /android/i.test(window.navigator.userAgent)
}

export function usePwaInstall(options: { respectDismissal?: boolean } = {}) {
  const { respectDismissal = true } = options
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(isStandalonePwa)

  useEffect(() => {
    if (isStandalonePwa()) return

    if (respectDismissal) {
      const dismissed = localStorage.getItem(DISMISSAL_KEY)
      if (dismissed && Date.now() - Number(dismissed) < DISMISSAL_DURATION) return
    }

    const handler = (event: BeforeInstallPromptEvent) => {
      event.preventDefault()
      setDeferredPrompt(event)
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [respectDismissal])

  const install = useCallback(async () => {
    if (!deferredPrompt) return false

    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice

    if (choice.outcome === 'accepted') {
      setIsInstalled(true)
      setCanInstall(false)
    } else {
      localStorage.setItem(DISMISSAL_KEY, String(Date.now()))
    }

    setDeferredPrompt(null)
    return choice.outcome === 'accepted'
  }, [deferredPrompt])

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSAL_KEY, String(Date.now()))
    setCanInstall(false)
  }, [])

  return {
    canInstall,
    isInstalled,
    isIos: isIos(),
    isAndroid: isAndroid(),
    install,
    dismiss,
  }
}
