import { useEffect, useState } from 'react'
import { Users as UsersIcon, Search, RefreshCw } from 'lucide-react'
import DataTable, { type Column } from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { api } from '../lib/api'
import type { AdminUserItem, AdminUserListResponse } from '../types'

export default function Users() {
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [filtered, setFiltered] = useState<AdminUserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    setError(null)
    api.get<AdminUserListResponse>('/admin/users?limit=100')
      .then((d) => { setUsers(d.users); setFiltered(d.users) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(users.filter((u) =>
      (u.display_name ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q)
    ))
  }, [search, users])

  const columns: Column<AdminUserItem>[] = [
    {
      key: 'display_name', label: 'User',
      render: (u) => (
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full text-xs font-bold text-white flex-shrink-0"
            style={{ width: 30, height: 30, background: '#E45B25' }}
          >
            {(u.display_name ?? '?').slice(0, 1)}
          </div>
          <div>
            <p className="font-medium" style={{ color: '#0f172a' }}>{u.display_name ?? '—'}</p>
            <p className="text-xs" style={{ color: '#94a3b8' }}>{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone', render: (u) => <span style={{ color: '#374151' }}>{u.phone ?? '—'}</span> },
    { key: 'phone_verified', label: 'Phone', render: (u) => <Badge value={u.phone_verified ? 'confirmed' : 'pending'} /> },
    { key: 'role', label: 'Role', render: (u) => <Badge value={u.role} /> },
    { key: 'is_active', label: 'Status', render: (u) => <Badge value={u.is_active ? 'active' : 'inactive'} /> },
    {
      key: 'created_at', label: 'Joined',
      render: (u) => <span className="text-xs" style={{ color: '#64748b' }}>{new Date(u.created_at).toLocaleDateString()}</span>,
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0f172a' }}>Users B2C</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            Manage registered user accounts
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none"
          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0f172a' }}
        />
      </div>

      {error ? (
        <EmptyState
          icon={UsersIcon}
          title="Could not load users"
          description={error}
          action={{ label: 'Retry', onClick: load }}
        />
      ) : (
        <DataTable<AdminUserItem> columns={columns} data={filtered} loading={loading} emptyMessage="No users found" />
      )}
    </div>
  )
}
