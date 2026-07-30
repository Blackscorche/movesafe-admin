import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import { useAdmin } from '../context/AdminContext'
import type { AdminRole } from '../types'

export default function Login() {
  const { login } = useAdmin()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await api.login(email, password)
      const shortRole = (res.role ?? '').replace('admin_', '') as AdminRole
      login(res.access_token, shortRole, res.name)
      navigate('/', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#f8fafc' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo + heading */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <img src="/logo.png" alt="MoveSave" style={{ width: 72, height: 72 }} className="object-contain" />
          <div className="text-center">
            <h1 className="text-2xl font-bold" style={{ color: '#0f172a' }}>
              MoveSave <span style={{ color: '#E45B25' }}>Admin</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>Sign in to the control panel</p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 space-y-5"
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748b' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="admin@movesave.app"
                className="w-full px-3 py-2.5 text-sm rounded-lg outline-none transition-colors"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
                onFocus={(e) => (e.target.style.borderColor = '#E45B25')}
                onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748b' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-3 pr-10 py-2.5 text-sm rounded-lg outline-none transition-colors"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
                  onFocus={(e) => (e.target.style.borderColor = '#E45B25')}
                  onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#94a3b8' }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg px-3 py-2.5 text-xs" style={{ background: 'rgba(255,59,48,0.08)', color: '#FF3B30', border: '1px solid rgba(255,59,48,0.2)' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: '#E45B25' }}
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#94a3b8' }}>
          MoveSave Admin Panel · Restricted Access
        </p>
      </div>
    </div>
  )
}
