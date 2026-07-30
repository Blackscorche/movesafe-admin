import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import Badge from '../components/ui/Badge'
import type { Ticket } from '../types'

const MOCK: Ticket[] = [
  { id: '1', subject: 'QR code not scanning', user_name: 'Carlos M.', user_type: 'user', status: 'open', priority: 'high', created_at: '2026-05-10T10:00:00Z', last_message: 'I tried multiple times but the QR does not scan at the merchant.' },
  { id: '2', subject: 'Recharge not credited', user_name: 'Bodega El Pana', user_type: 'merchant', status: 'in_progress', priority: 'high', created_at: '2026-05-09T14:00:00Z', last_message: 'I made a Pago Móvil 2 hours ago and my balance is still at $42.' },
  { id: '3', subject: 'Steps not syncing', user_name: 'Ana R.', user_type: 'user', status: 'open', priority: 'medium', created_at: '2026-05-10T08:30:00Z', last_message: 'App shows 0 steps despite walking 8000 today.' },
  { id: '4', subject: 'Badge not unlocked', user_name: 'Pedro J.', user_type: 'user', status: 'resolved', priority: 'low', created_at: '2026-05-08T12:00:00Z', last_message: 'I reached 7 day streak but no badge appeared.' },
]

export default function Tickets() {
  const [active, setActive] = useState<Ticket | null>(null)

  const open = MOCK.filter((t) => t.status !== 'resolved')
  const resolved = MOCK.filter((t) => t.status === 'resolved')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0f172a' }}>Support Tickets</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            {open.length} open ticket{open.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
          style={{ background: 'rgba(228,91,37,0.12)', color: '#E45B25', border: '1px solid rgba(228,91,37,0.2)' }}
        >
          <MessageSquare size={12} /> Mock data — endpoint pending
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {MOCK.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t)}
              className="w-full text-left rounded-xl p-4 transition-all"
              style={{
                background: active?.id === t.id ? 'rgba(228,91,37,0.06)' : '#ffffff',
                border: active?.id === t.id ? '1px solid rgba(228,91,37,0.3)' : '1px solid #e2e8f0',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium truncate" style={{ color: '#0f172a' }}>{t.subject}</p>
                <Badge value={t.priority} />
              </div>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
                {t.user_name} · {t.user_type}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge value={t.status} />
                <span className="text-xs" style={{ color: '#64748b' }}>
                  {new Date(t.created_at).toLocaleDateString()}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {active ? (
            <div
              className="rounded-xl p-5 h-full flex flex-col gap-4"
              style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-semibold" style={{ color: '#0f172a' }}>{active.subject}</h2>
                  <Badge value={active.status} />
                  <Badge value={active.priority} />
                </div>
                <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
                  From: {active.user_name} ({active.user_type}) · {new Date(active.created_at).toLocaleString()}
                </p>
              </div>

              <div className="rounded-lg p-3 flex-1" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                <p className="text-sm" style={{ color: '#374151' }}>{active.last_message}</p>
              </div>

              <div className="flex gap-2">
                <input
                  placeholder="Type a reply..."
                  className="flex-1 px-3 py-2 text-sm rounded-lg outline-none"
                  style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#0f172a' }}
                />
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ background: '#E45B25' }}
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div
              className="rounded-xl p-8 flex flex-col items-center justify-center gap-3 h-full"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
            >
              <MessageSquare size={32} style={{ color: '#cbd5e1' }} />
              <p className="text-sm" style={{ color: '#94a3b8' }}>Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
