import { useEffect, useState } from 'react'
import { DollarSign, AlertTriangle, CheckCircle } from 'lucide-react'
import { api } from '../lib/api'
import type { BcvRate } from '../types'
import Badge from '../components/ui/Badge'

export default function BcvRates() {
  const [current, setCurrent] = useState<BcvRate | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ rate_bs_per_usd: '', source: 'MANUAL' })
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const fetchCurrent = () => {
    setLoading(true)
    api.get<BcvRate>('/admin/bcv-rates/current')
      .then(setCurrent)
      .catch(() => setCurrent(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCurrent() }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.rate_bs_per_usd) return
    setSaving(true)
    setMsg(null)
    try {
      await api.post('/admin/bcv-rates', {
        rate_bs_per_usd: parseFloat(form.rate_bs_per_usd),
        source: form.source,
      })
      setMsg({ type: 'ok', text: 'Rate recorded successfully.' })
      setForm({ rate_bs_per_usd: '', source: 'MANUAL' })
      fetchCurrent()
    } catch (err: unknown) {
      setMsg({ type: 'err', text: err instanceof Error ? err.message : 'Failed to save rate' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold" style={{ color: '#0f172a' }}>BCV Exchange Rates</h1>
        <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
          Record and manage the official Bs/USD exchange rate
        </p>
      </div>

      {/* Current rate */}
      <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#94a3b8' }}>
          Current Rate
        </p>
        {loading ? (
          <div className="h-10 w-48 rounded animate-pulse" style={{ background: '#e2e8f0' }} />
        ) : current ? (
          <div className="space-y-3">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold" style={{ color: '#0f172a' }}>
                Bs {Number(current.rate_bs_per_usd).toFixed(2)}
              </span>
              <span className="text-base mb-1" style={{ color: '#94a3b8' }}>/ USD</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge value={current.is_stale ? 'stale' : 'confirmed'} />
              <span className="text-xs" style={{ color: '#94a3b8' }}>
                Date: {current.date}
              </span>
              <span className="text-xs" style={{ color: '#94a3b8' }}>
                Source: {current.source}
              </span>
            </div>
            {current.is_stale && (
              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <AlertTriangle size={14} style={{ color: '#F59E0B' }} />
                <span className="text-xs" style={{ color: '#F59E0B' }}>
                  Using fallback rate — today's BCV rate not yet recorded.
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#94a3b8' }}>No rate recorded yet.</p>
        )}
      </div>

      {/* Record new rate */}
      <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#94a3b8' }}>
          Record Today's Rate
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748b' }}>
              Rate (Bs per USD)
            </label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
              <input
                type="number"
                step="0.0001"
                min="0"
                value={form.rate_bs_per_usd}
                onChange={(e) => setForm((f) => ({ ...f, rate_bs_per_usd: e.target.value }))}
                placeholder="e.g. 36.8500"
                required
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg outline-none"
                style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0f172a' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#64748b' }}>
              Source
            </label>
            <select
              value={form.source}
              onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm rounded-lg outline-none"
              style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0f172a' }}
            >
              <option value="MANUAL">MANUAL</option>
              <option value="BCV">BCV</option>
              <option value="FALLBACK">FALLBACK</option>
            </select>
          </div>

          {msg && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg text-xs"
              style={
                msg.type === 'ok'
                  ? { background: 'rgba(0,200,150,0.1)', color: '#00C896', border: '1px solid rgba(0,200,150,0.2)' }
                  : { background: 'rgba(255,59,48,0.1)', color: '#FF3B30', border: '1px solid rgba(255,59,48,0.2)' }
              }
            >
              {msg.type === 'ok' ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}
              {msg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60"
            style={{ background: '#E45B25' }}
          >
            {saving ? 'Saving...' : 'Record Rate'}
          </button>
        </form>
      </div>
    </div>
  )
}
