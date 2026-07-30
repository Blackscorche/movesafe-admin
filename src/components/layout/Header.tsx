import { Search, Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import type { AdminRole } from '../../types'

const ROLE_LABELS: Record<AdminRole, string> = {
  master: 'CEO Master',
  analyst: 'Analyst',
  support: 'Support',
}

const ROLE_COLORS: Record<AdminRole, string> = {
  master: '#E45B25',
  analyst: '#00D4AA',
  support: '#7C5CBF',
}

export default function Header() {
  const { role, name, logout } = useAdmin()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header
      className="flex items-center gap-4 px-6"
      style={{
        height: 64,
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        flexShrink: 0,
      }}
    >
      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search merchants, users, tx..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none transition-colors"
          style={{
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            color: '#0f172a',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#E45B25')}
          onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Sync indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: '#00C896' }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ background: '#00C896' }}
            />
          </span>
          <span className="text-xs" style={{ color: '#00C896' }}>
            Sync Active
          </span>
        </div>

        {/* Role badge */}
        <span
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{ background: ROLE_COLORS[role] }}
        >
          {ROLE_LABELS[role]}
        </span>

        {/* Bell */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell size={18} style={{ color: '#64748b' }} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#E45B25' }}
          />
        </button>

        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full text-xs font-bold text-white flex-shrink-0"
          style={{ width: 34, height: 34, background: '#E45B25' }}
        >
          {name.slice(0, 1).toUpperCase()}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          title="Logout"
          style={{ color: '#94a3b8' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
