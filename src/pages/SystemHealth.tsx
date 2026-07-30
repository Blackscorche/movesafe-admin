import { useEffect, useState } from 'react'
import { Server, Database, Zap, RefreshCw, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { api } from '../lib/api'
import type { BcvRate } from '../types'

interface HealthItem {
  label: string
  value: string
  status: 'ok' | 'warn' | 'error'
  icon: React.ElementType
}

export default function SystemHealth() {
  const [bcv, setBcv] = useState<BcvRate | null>(null)
  const [apiOk, setApiOk] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  const check = () => {
    setLoading(true)
    Promise.allSettled([
      api.get<BcvRate>('/admin/bcv-rates/current').then(setBcv),
      api.get('/merchants').then(() => setApiOk(true)),
    ]).finally(() => setLoading(false))
  }

  useEffect(() => { check() }, [])

  const items: HealthItem[] = [
    {
      label: 'API Server',
      value: apiOk === null ? 'Checking...' : apiOk ? 'Online' : 'Unreachable',
      status: apiOk === null ? 'warn' : apiOk ? 'ok' : 'error',
      icon: Server,
    },
    {
      label: 'Database',
      value: apiOk ? 'Connected' : 'Unknown',
      status: apiOk ? 'ok' : 'warn',
      icon: Database,
    },
    {
      label: 'BCV Rate',
      value: bcv ? `Bs ${Number(bcv.rate_bs_per_usd).toFixed(2)}` : 'No rate',
      status: !bcv ? 'error' : bcv.is_stale ? 'warn' : 'ok',
      icon: Zap,
    },
    {
      label: 'BCV Staleness',
      value: bcv ? (bcv.is_stale ? `Stale (${bcv.source})` : `Fresh (${bcv.date})`) : '—',
      status: !bcv ? 'error' : bcv.is_stale ? 'warn' : 'ok',
      icon: AlertTriangle,
    },
  ]

  const statusIcon = (s: 'ok' | 'warn' | 'error') =>
    s === 'ok' ? <CheckCircle size={16} style={{ color: '#00C896' }} />
      : s === 'warn' ? <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
        : <XCircle size={16} style={{ color: '#FF3B30' }} />

  const statusBg = (s: 'ok' | 'warn' | 'error') =>
    s === 'ok' ? 'rgba(0,200,150,0.1)' : s === 'warn' ? 'rgba(245,158,11,0.1)' : 'rgba(255,59,48,0.1)'
  const statusBorder = (s: 'ok' | 'warn' | 'error') =>
    s === 'ok' ? '1px solid rgba(0,200,150,0.2)' : s === 'warn' ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(255,59,48,0.2)'

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0f172a' }}>System Health</h1>
          <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
            Live status of API, database, and BCV oracle
          </p>
        </div>
        <button
          onClick={check}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
          style={{ background: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Recheck
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl p-4 flex items-center gap-4"
            style={{ background: statusBg(item.status), border: statusBorder(item.status) }}
          >
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ width: 40, height: 40, background: '#f1f5f9' }}
            >
              <item.icon size={18} style={{ color: '#94a3b8' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium" style={{ color: '#94a3b8' }}>{item.label}</p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: '#0f172a' }}>{item.value}</p>
            </div>
            {statusIcon(item.status)}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#94a3b8' }}>
          Status Legend
        </p>
        <div className="space-y-2">
          {[
            { s: 'ok' as const, label: 'All systems operational' },
            { s: 'warn' as const, label: 'Degraded — action may be required' },
            { s: 'error' as const, label: 'Critical — immediate attention needed' },
          ].map(({ s, label }) => (
            <div key={s} className="flex items-center gap-2 text-sm">
              {statusIcon(s)}
              <span style={{ color: '#64748b' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
