import { useEffect, useState } from 'react'
import { Store, Search, RefreshCw } from 'lucide-react'
import DataTable, { type Column } from '../components/ui/DataTable'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { api } from '../lib/api'
import type { AdminMerchant, AdminMerchantListResponse } from '../types'

export default function Merchants() {
  const [merchants, setMerchants] = useState<AdminMerchant[]>([])
  const [filtered, setFiltered] = useState<AdminMerchant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    setError(null)
    api.get<AdminMerchantListResponse>('/admin/merchants?limit=100')
      .then((d) => {
        setMerchants(d.merchants)
        setFiltered(d.merchants)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(merchants.filter((m) =>
      m.business_name.toLowerCase().includes(q) ||
      m.rif.toLowerCase().includes(q) ||
      (m.email ?? '').toLowerCase().includes(q)
    ))
  }, [search, merchants])

  const columns: Column<AdminMerchant>[] = [
    {
      key: 'business_name', label: 'Business', render: (m) => (
        <div>
          <p className="font-medium" style={{ color: '#0f172a' }}>{m.business_name}</p>
          <p className="text-xs" style={{ color: '#94a3b8' }}>{m.business_type}</p>
        </div>
      )
    },
    {
      key: 'rif', label: 'RIF', render: (m) => (
        <span className="font-mono text-xs" style={{ color: '#64748b' }}>{m.rif}</span>
      )
    },
    {
      key: 'verification_status', label: 'KYC', render: (m) => (
        <div className="flex flex-col gap-1">
          <Badge value={m.verification_status.toLowerCase()} />
          <Badge value={m.is_active ? 'active' : 'inactive'} />
        </div>
      )
    },
    {
      key: 'tier', label: 'Tier / Level', render: (m) => (
        <span className="text-xs" style={{ color: '#64748b' }}>
          {m.tier ?? '—'} {m.level != null ? `L${m.level}` : ''}
        </span>
      )
    },
    {
      key: 'stars', label: 'Stars', render: (m) => (
        <span className="text-xs font-medium" style={{ color: m.stars != null && m.stars >= 4 ? '#00C896' : '#94a3b8' }}>
          {m.stars != null ? `★ ${m.stars.toFixed(1)}` : '—'}
        </span>
      )
    },
    {
      key: 'email', label: 'Contact', render: (m) => (
        <div>
          <p className="text-xs" style={{ color: '#374151' }}>{m.email ?? '—'}</p>
          <p className="text-xs" style={{ color: '#94a3b8' }}>{m.phone ?? ''}</p>
        </div>
      )
    },
    {
      key: 'created_at', label: 'Joined', render: (m) => (
        <span className="text-xs" style={{ color: '#94a3b8' }}>
          {new Date(m.created_at).toLocaleDateString()}
        </span>
      )
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0f172a' }}>Merchants</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            {merchants.length} registered {merchants.length === 1 ? 'merchant' : 'merchants'}
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

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, RIF, email..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none"
          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0f172a' }}
        />
      </div>

      {error ? (
        <EmptyState
          icon={Store}
          title="Could not load merchants"
          description={error}
          action={{ label: 'Retry', onClick: load }}
        />
      ) : (
        <DataTable<AdminMerchant>
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="No merchants found"
        />
      )}
    </div>
  )
}
