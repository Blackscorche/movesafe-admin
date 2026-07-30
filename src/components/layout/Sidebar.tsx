import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Store,
  Users,
  BookOpen,
  CheckSquare,
  DollarSign,
  Server,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import type { AdminRole } from '../../types'

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  roles: AdminRole[]
}

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['master'] },
  { to: '/merchants', label: 'Merchants', icon: Store, roles: ['master', 'analyst'] },
  { to: '/users', label: 'Users', icon: Users, roles: ['master', 'analyst'] },
  { to: '/ledger', label: 'Ledger', icon: BookOpen, roles: ['master'] },
  { to: '/approvals', label: 'Approvals', icon: CheckSquare, roles: ['master', 'analyst'] },
  { to: '/bcv', label: 'BCV Rates', icon: DollarSign, roles: ['master', 'analyst'] },
  { to: '/health', label: 'System Health', icon: Server, roles: ['master'] },
  { to: '/tickets', label: 'Support', icon: MessageSquare, roles: ['master', 'analyst', 'support'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['master'] },
]

interface Props {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: Props) {
  const { role } = useAdmin()
  const visible = NAV.filter((n) => n.roles.includes(role))

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300"
      style={{
        width: collapsed ? 64 : 220,
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4"
        style={{ borderBottom: '1px solid #e2e8f0', height: 64 }}
      >
        <img
          src="/logo.png"
          alt="MoveSave"
          className="flex-shrink-0 object-contain"
          style={{ width: collapsed ? 36 : 40, height: collapsed ? 36 : 40 }}
        />
        {!collapsed && (
          <span className="font-bold text-sm tracking-tight" style={{ color: '#0f172a' }}>
            MoveSave
            <span style={{ color: '#E45B25' }}> Admin</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {visible.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all ${isActive
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-700'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: 'rgba(228,91,37,0.18)', color: '#E45B25' }
                : {}
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={18}
                  style={{ color: isActive ? '#E45B25' : undefined, flexShrink: 0 }}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center py-3 text-slate-400 hover:text-slate-600 transition-colors"
        style={{ borderTop: '1px solid #e2e8f0' }}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  )
}
