import { useState, type FormEvent } from 'react'
import {
  Lock, Store as StoreIcon, Info, LogOut,
  ChevronRight, CheckCircle, AlertCircle, Mail, Download, Smartphone,
} from 'lucide-react'
import { usePwaInstall } from '../hooks/usePwaInstall'
import { useAuthStore } from '../stores/authStore'
import { useDataStore } from '../stores/dataStore'
import { GlassCard, StaggeredAnimation } from '../components/Animations'
import { APP_NAME, APP_VERSION } from '../lib/constants'
import { Store } from '../types'

export function Settings() {
  const { user, currentStore, logout, changePassword, isLoading, error, clearError } = useAuthStore()
  const { loadStoreData } = useDataStore()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const { canInstall, isInstalled, isIos, install } = usePwaInstall({ respectDismissal: false })

  const stores = user?.stores ?? []

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return
    setSuccess(false)
    clearError()
    const ok = await changePassword(currentPassword, newPassword)
    if (ok) {
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  const handleStoreSwitch = async (store: Store) => {
    const { switchStore } = useAuthStore.getState()
    await switchStore(store)
    await loadStoreData(store.id)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white pt-header pb-3 px-4 xs:px-5 lg:px-8 sticky top-0 z-30 border-b border-gray100">
        <h1 className="text-lg xs:text-xl font-extrabold text-dark">Settings</h1>
      </div>

      <div className="px-4 xs:px-5 lg:px-8 mt-4 space-y-4 max-w-2xl">
        {/* Profile Card */}
        <StaggeredAnimation index={0}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
                <span className="text-white text-2xl font-extrabold">
                  {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-extrabold text-dark truncate">{user?.name ?? 'User'}</h2>
                <p className="text-sm text-gray500">@{user?.username}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2.5 py-0.5 bg-primary-extraLight rounded-lg text-[11px] font-bold text-primary capitalize">
                    {user?.role}
                  </span>
                  {user?.isActive && (
                    <span className="px-2.5 py-0.5 bg-success/10 rounded-lg text-[11px] font-bold text-success">
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>
            {user?.email && (
              <div className="mt-4 pt-4 border-t border-gray100 flex items-center gap-2">
                <Mail size={16} className="text-gray400" />
                <span className="text-sm text-gray600">{user.email}</span>
              </div>
            )}
          </GlassCard>
        </StaggeredAnimation>

        {/* Current Store */}
        {currentStore && (
          <StaggeredAnimation index={1}>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-extraLight flex items-center justify-center">
                  <StoreIcon size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray500 font-semibold">Current Store</p>
                  <p className="text-sm font-bold text-dark mt-0.5">
                    {currentStore.branch ? `${currentStore.name} - ${currentStore.branch}` : currentStore.name}
                  </p>
                </div>
              </div>
            </GlassCard>
          </StaggeredAnimation>
        )}

        {/* Stores List */}
        {stores.length > 0 && (
          <StaggeredAnimation index={2}>
            <div>
              <h3 className="section-title mb-2.5 px-1">My Stores</h3>
              <GlassCard className="p-2">
                {stores.map((store, i) => {
                  const isCurrent = currentStore?.id === store.id
                  return (
                    <button
                      key={store.id}
                      onClick={() => !isCurrent && handleStoreSwitch(store)}
                      disabled={isCurrent}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        isCurrent ? 'bg-primary-extraLight' : 'hover:bg-gray100'
                      } ${i > 0 ? 'mt-1' : ''}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isCurrent ? 'gradient-primary' : 'bg-gray100'
                      }`}>
                        <StoreIcon size={16} className={isCurrent ? 'text-white' : 'text-gray400'} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-dark">
                          {store.branch ? `${store.name} - ${store.branch}` : store.name}
                        </p>
                        <p className="text-[11px] text-gray500">
                          {store.location ?? 'No location'}
                        </p>
                      </div>
                      {isCurrent ? (
                        <CheckCircle size={18} className="text-primary" />
                      ) : (
                        <ChevronRight size={18} className="text-gray300" />
                      )}
                    </button>
                  )
                })}
              </GlassCard>
            </div>
          </StaggeredAnimation>
        )}

        {/* Password Change */}
        <StaggeredAnimation index={3}>
          <div>
            <h3 className="section-title mb-2.5 px-1">Security</h3>
            <GlassCard className="p-4">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="w-full flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Lock size={18} className="text-warningDark" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-dark">Change Password</p>
                  <p className="text-[11px] text-gray500">Update your account password</p>
                </div>
                <ChevronRight
                  size={18}
                  className={`text-gray300 transition-transform ${showPasswordForm ? 'rotate-90' : ''}`}
                />
              </button>

              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="mt-4 pt-4 border-t border-gray100 space-y-3">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input-field"
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    required
                  />
                  {newPassword !== confirmPassword && confirmPassword.length > 0 && (
                    <p className="text-xs text-danger font-medium">Passwords do not match</p>
                  )}
                  {error && (
                    <div className="flex items-center gap-2 text-danger text-xs">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-2 text-success text-xs">
                      <CheckCircle size={14} />
                      Password changed successfully
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading || !currentPassword || !newPassword || newPassword !== confirmPassword}
                    className="btn-primary py-3 text-sm"
                  >
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              )}
            </GlassCard>
          </div>
        </StaggeredAnimation>

        {/* Install App */}
        {!isInstalled && (canInstall || isIos) && (
          <StaggeredAnimation index={4}>
            <div>
              <h3 className="section-title mb-2.5 px-1">App</h3>
              <GlassCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-extraLight flex items-center justify-center">
                    <Smartphone size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-dark">Install App</p>
                    <p className="text-[11px] text-gray500">
                      {isIos
                        ? 'Tap Share, then "Add to Home Screen"'
                        : 'Install Mario Business on your device'}
                    </p>
                  </div>
                  {canInstall && (
                    <button
                      onClick={install}
                      className="flex-shrink-0 bg-primary text-white rounded-xl p-2.5 active:scale-90 transition-transform"
                      aria-label="Install app"
                    >
                      <Download size={18} />
                    </button>
                  )}
                </div>
              </GlassCard>
            </div>
          </StaggeredAnimation>
        )}

        {/* About */}
        <StaggeredAnimation index={5}>
          <div>
            <h3 className="section-title mb-2.5 px-1">About</h3>
            <GlassCard className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Info size={18} className="text-info" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-dark">{APP_NAME}</p>
                  <p className="text-[11px] text-gray500">Version {APP_VERSION}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray100 space-y-2">
                <Row label="App Name" value={APP_NAME} />
                <Row label="Version" value={APP_VERSION} />
                <Row label="Role" value={user?.role ?? '-'} />
              </div>
            </GlassCard>
          </div>
        </StaggeredAnimation>

        {/* Logout */}
        <StaggeredAnimation index={6}>
          <button
            onClick={() => logout()}
            className="w-full bg-white rounded-2xl card-shadow p-4 flex items-center justify-center gap-2 text-danger font-bold active:scale-95 transition-transform"
          >
            <LogOut size={18} />
            Logout
          </button>
        </StaggeredAnimation>

        <div className="h-4" />
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray500">{label}</span>
      <span className="text-xs font-bold text-dark capitalize">{value}</span>
    </div>
  )
}
