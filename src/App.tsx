import { useEffect, useState } from 'react'
import { useAuthStore } from './stores/authStore'
import { useDataStore } from './stores/dataStore'
import { Splash } from './pages/Splash'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Sales } from './pages/Sales'
import { Reports } from './pages/Reports'
import { Orders } from './pages/Orders'
import { Settings } from './pages/Settings'
import { StoreRevenue } from './pages/StoreRevenue'
import { BottomNav } from './components/BottomNav'

type Page = 'dashboard' | 'sales' | 'reports' | 'orders' | 'settings' | 'stores'

export default function App() {
  const { isInitialized, isAuthenticated, initialize, currentStore } = useAuthStore()
  const { loadStoreData } = useDataStore()
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [splashStatus, setSplashStatus] = useState<string | undefined>(undefined)

  useEffect(() => {
    setSplashStatus('Connecting...')
    initialize().then(() => {
      setSplashStatus('Ready!')
    })
  }, [])

  useEffect(() => {
    if (isAuthenticated && currentStore) {
      loadStoreData(currentStore.id)
    }
  }, [isAuthenticated, currentStore?.id])

  if (!isInitialized) {
    return <Splash status={splashStatus} />
  }

  if (!isAuthenticated) {
    return <Login />
  }

  const navIndexMap: Record<Page, number> = {
    dashboard: 0,
    sales: 1,
    reports: 2,
    orders: 3,
    settings: 4,
    stores: 0,
  }

  const handleTabChange = (index: number) => {
    const pages: Page[] = ['dashboard', 'sales', 'reports', 'orders', 'settings']
    setCurrentPage(pages[index])
  }

  const showBottomNav = currentPage !== 'stores'

  return (
    <div className="app-layout lg:ml-64">
      <main className="app-main lg:pb-8">
        {currentPage === 'dashboard' && (
          <Dashboard onNavigateToStores={() => setCurrentPage('stores')} />
        )}
        {currentPage === 'sales' && <Sales />}
        {currentPage === 'reports' && <Reports />}
        {currentPage === 'orders' && <Orders />}
        {currentPage === 'settings' && <Settings />}
        {currentPage === 'stores' && (
          <StoreRevenue
            currentIndex={navIndexMap[currentPage]}
            onTabChange={handleTabChange}
          />
        )}
      </main>

      {showBottomNav && (
        <BottomNav
          currentIndex={navIndexMap[currentPage]}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  )
}
