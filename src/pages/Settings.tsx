import { Settings as SettingsIcon, Shield, Plus } from 'lucide-react'
import Badge from '../components/ui/Badge'

const ADMINS = [
  { id: '1', name: 'Lisseth', email: 'lisseth@movesave.app', role: 'master', last_active: 'Active now' },
  { id: '2', name: 'Marco', email: 'marco@movesave.app', role: 'analyst', last_active: '2h ago' },
  { id: '3', name: 'Soporte 1', email: 'support1@movesave.app', role: 'support', last_active: '1d ago' },
]

export default function Settings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: '#0f172a' }}>Admin Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
          Manage admin users, roles and access
        </p>
      </div>

      {/* Admin users */}
      <div className="rounded-xl" style={{ background: '#ffffff', border: '1px solid #d1d5db' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #d1d5db' }}>
          <div className="flex items-center gap-2">
            <Shield size={15} style={{ color: '#E45B25' }} />
            <span className="text-sm font-semibold" style={{ color: '#000000' }}>Admin Users</span>
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: '#E45B25' }}
          >
            <Plus size={12} /> Add Admin
          </button>
        </div>

        <div className="divide-y" style={{ borderColor: '#d1d5db' }}>
          {ADMINS.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-4">
              <div
                className="flex items-center justify-center rounded-full text-sm font-bold text-white flex-shrink-0"
                style={{ width: 38, height: 38, background: a.role === 'master' ? '#E45B25' : a.role === 'analyst' ? '#00D4AA' : '#7C5CBF' }}
              >
                {a.name.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: '#000000' }}>{a.name}</p>
                <p className="text-xs" style={{ color: '#94a3b8' }}>{a.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: '#94a3b8' }}>{a.last_active}</span>
                <Badge value={a.role} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roles description */}
      <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #d1d5db' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#94a3b8' }}>
          Role Permissions
        </p>
        <div className="space-y-3">
          {[
            { role: 'master', label: 'CEO Master', desc: 'Full access: ledger, metrics, all modules, admin management', color: '#E45B25' },
            { role: 'analyst', label: 'Analyst', desc: 'Approvals queue, conciliation, merchant & user management, support', color: '#00D4AA' },
            { role: 'support', label: 'Support', desc: 'Support tickets and FAQ management only', color: '#7C5CBF' },
          ].map(({ role, label, desc, color }) => (
            <div key={role} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
        style={{ background: 'rgba(228,91,37,0.12)', color: '#E45B25', border: '1px solid rgba(228,91,37,0.2)' }}
      >
        <SettingsIcon size={12} /> Admin management endpoints are not yet implemented in the API. This view uses mock data.
      </div>
    </div>
  )
}
