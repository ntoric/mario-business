import { InstallPrompt } from './InstallPrompt'
import { OfflineBanner } from './OfflineBanner'
import { UpdatePrompt } from './UpdatePrompt'

export function PwaShell() {
  return (
    <>
      <OfflineBanner />
      <UpdatePrompt />
      <InstallPrompt />
    </>
  )
}
