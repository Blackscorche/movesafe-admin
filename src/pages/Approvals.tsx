import { useEffect, useState } from 'react'
import { CheckSquare, Check, X, FileText, Loader2 } from 'lucide-react'
import Badge from '../components/ui/Badge'
import { api } from '../lib/api'
import type { AdminMerchant, AdminMerchantListResponse } from '../types'

interface ApprovalItem {
  id: string
  entity_name: string
  business_type: string
  rif: string
  email: string | null
  created_at: string
  status: 'pending' | 'approved' | 'rejected'
}

function toItem(m: AdminMerchant): ApprovalItem {
  return {
    id: m.id,
    entity_name: m.business_name,
    business_type: m.business_type,
    rif: m.rif,
    email: m.email,
    created_at: m.created_at,
    status: m.verification_status.toLowerCase() as ApprovalItem['status'],
  }
}

// Define TYPE_LABELS constant
const TYPE_LABELS: Record<string, string> = {
  pending: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
}

export default function Approvals() {
  const [pending, setPending] = useState<ApprovalItem[]>([])
  const [resolved, setResolved] = useState<ApprovalItem[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    Promise.allSettled([
      api.get<AdminMerchantListResponse>('/admin/merchants?verification_status=PENDING&limit=50')
        .then((d) => setPending(d.merchants.map(toItem))),
      api.get<AdminMerchantListResponse>('/admin/merchants?verification_status=APPROVED&limit=20')
        .then((d) => setResolved(d.merchants.map(toItem))),
    ]).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const act = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    setActing(id)
    try {
      await api.patch(`/admin/merchants/${id}/status`, { verification_status: action })
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Action failed')
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0f172a' }}>Approval Queue</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            {pending.length} pending request{pending.length !== 1 ? 's' : ''} awaiting review
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 size={14} className="animate-spin" style={{ color: '#94a3b8' }} />}
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(228,91,37,0.12)', color: '#E45B25' }}>
            <CheckSquare size={11} className="inline mr-1" />{pending.length} pending
          </span>
        </div>
      </div>

      {/* Pending */}
      <div className="space-y-3">
        {pending.length === 0 ? (
          <div className="rounded-xl p-8 text-center" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <p className="text-sm" style={{ color: '#94a3b8' }}>No pending approvals 🎉</p>
          </div>
        ) : (
          pending.map((req) => (
            <div
              key={req.id}
              className="rounded-xl p-4 flex items-start gap-4"
              style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            >
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
                style={{ width: 36, height: 36, background: 'rgba(228,91,37,0.12)' }}
              >
                <FileText size={16} style={{ color: '#E45B25' }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>{req.entity_name}</p>
                  <Badge value="KYC / RIF" />
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
                  {req.business_type} · RIF: {req.rif} · {new Date(req.created_at).toLocaleString()}
                </p>
                {req.email && (
                  <p className="text-xs mt-1" style={{ color: '#64748b' }}>{req.email}</p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {acting === req.id ? (
                  <Loader2 size={16} className="animate-spin" style={{ color: '#94a3b8' }} />
                ) : (
                  <>
                    <button
                      onClick={() => act(req.id, 'APPROVED')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                      style={{ background: 'rgba(0,200,150,0.15)', color: '#00C896' }}
                    >
                      <Check size={12} /> Approve
                    </button>
                    <button
                      onClick={() => act(req.id, 'REJECTED')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
                      style={{ background: 'rgba(255,59,48,0.12)', color: '#FF3B30' }}
                    >
                      <X size={12} /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolved */}
      {resolved.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#64748b' }}>
            Recently Resolved
          </p>
          <div className="space-y-2">
            {resolved.map((req) => (
              <div
                key={req.id}
                className="rounded-lg px-4 py-3 flex items-center justify-between"
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', opacity: 0.8 }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: '#374151' }}>{req.entity_name}</p>
                  <p className="text-xs" style={{ color: '#94a3b8' }}>{TYPE_LABELS[req.type]}</p>
                </div>
                <Badge value={req.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
