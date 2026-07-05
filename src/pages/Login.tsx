import { useState, type FormEvent } from 'react'
import { User as UserIcon, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useDataStore } from '../stores/dataStore'

export function Login() {
  const { login, isLoading, error } = useAuthStore()
  const { loadStoreData } = useDataStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [obscurePassword, setObscurePassword] = useState(true)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username || !password) return
    const success = await login(username.trim(), password)
    if (success) {
      const auth = useAuthStore.getState()
      if (auth.currentStore) {
        await loadStoreData(auth.currentStore.id)
      }
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center safe-top px-4">
      <div className="w-full max-w-md px-6">
        <div className="mt-12 flex flex-col items-center">
          <div className="w-18 h-18 rounded-2xl overflow-hidden flex items-center justify-center">
            <img src="/splash.png" alt="Mario Business" className="w-full h-full object-cover" />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-dark tracking-tight">
            Welcome Back
          </h1>
          <p className="mt-1.5 text-sm text-gray500">
            Sign in to your business dashboard
          </p>
        </div>

        {error && (
          <div className="mt-7 p-3.5 bg-danger/8 rounded-xl border border-danger/20 flex items-center gap-2.5">
            <AlertCircle size={20} className="text-danger shrink-0" />
            <p className="text-danger text-[13px] font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3.5">
          <div className="relative">
            <UserIcon
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray500"
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          <div className="relative">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray500"
            />
            <input
              type={obscurePassword ? 'password' : 'text'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-12 pr-12"
            />
            <button
              type="button"
              onClick={() => setObscurePassword(!obscurePassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray500"
            >
              {obscurePassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary mt-4 h-14 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="h-12" />
      </div>
    </div>
  )
}
