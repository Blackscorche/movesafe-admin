import { BookOpen } from 'lucide-react'
import Badge from '../components/ui/Badge'

const MOCK = [
  { id: 'TX-001', type: 'EMISSION', account: 'USER_WALLET:abc-123', direction: 'CREDIT', amount: 10, currency: 'GC', status: 'CONFIRMED', ts: '2026-05-10T09:01:00Z' },
  { id: 'TX-001', type: 'EMISSION', account: 'EMISSION_SOURCE', direction: 'DEBIT', amount: 10, currency: 'GC', status: 'CONFIRMED', ts: '2026-05-10T09:01:00Z' },
  { id: 'TX-002', type: 'REDEMPTION_RESERVE', account: 'USER_WALLET:abc-123', direction: 'DEBIT', amount: 300, currency: 'GC', status: 'CONFIRMED', ts: '2026-05-10T09:05:00Z' },
  { id: 'TX-002', type: 'REDEMPTION_RESERVE', account: 'USER_RESERVED:abc-123', direction: 'CREDIT', amount: 300, currency: 'GC', status: 'CONFIRMED', ts: '2026-05-10T09:05:00Z' },
  { id: 'TX-003', type: 'REDEMPTION_CONFIRM', account: 'USER_RESERVED:abc-123', direction: 'DEBIT', amount: 300, currency: 'GC', status: 'CONFIRMED', ts: '2026-05-10T09:05:32Z' },
  { id: 'TX-003', type: 'REDEMPTION_CONFIRM', account: 'PLATFORM_CLEARING', direction: 'CREDIT', amount: 300, currency: 'GC', status: 'CONFIRMED', ts: '2026-05-10T09:05:32Z' },
  { id: 'TX-004', type: 'MERCHANT_FEE', account: 'MERCHANT_WALLET:m-001', direction: 'DEBIT', amount: 90, currency: 'USD', status: 'CONFIRMED', ts: '2026-05-10T09:05:33Z' },
  { id: 'TX-004', type: 'MERCHANT_FEE', account: 'FEE_REVENUE', direction: 'CREDIT', amount: 90, currency: 'USD', status: 'CONFIRMED', ts: '2026-05-10T09:05:33Z' },
  { id: 'TX-005', type: 'EXPIRY_BURN', account: 'USER_WALLET:def-456', direction: 'DEBIT', amount: 50, currency: 'GC', status: 'CONFIRMED', ts: '2026-05-10T00:01:00Z' },
  { id: 'TX-005', type: 'EXPIRY_BURN', account: 'BURN_SINK', direction: 'CREDIT', amount: 50, currency: 'GC', status: 'CONFIRMED', ts: '2026-05-10T00:01:00Z' },
]

export default function Ledger() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: '#0f172a' }}>Ledger Inmutable</h1>
          <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
            Append-only ledger entries — no edits or deletes allowed
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
            style={{ background: 'rgba(228,91,37,0.12)', color: '#E45B25', border: '1px solid rgba(228,91,37,0.2)' }}
          >
            <BookOpen size={12} /> Mock data — read endpoint pending
          </div>
          <span
            className="px-2 py-1 text-xs rounded font-medium"
            style={{ background: 'rgba(0,200,150,0.12)', color: '#00C896' }}
          >
            ✓ Immutability Trigger Active
          </span>
        </div>
      </div>

      <div className="rounded-xl overflow-x-auto" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {['TX ID', 'Type', 'Account', 'Direction', 'Amount', 'Currency', 'Status', 'Timestamp'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK.map((e, i) => (
              <tr
                key={i}
                style={{ borderBottom: '1px solid #e2e8f0', background: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}
              >
                <td className="px-4 py-2.5 font-mono" style={{ color: '#E45B25', fontFamily: 'monospace' }}>{e.id}</td>
                <td className="px-4 py-2.5 font-medium" style={{ color: '#374151' }}>{e.type}</td>
                <td className="px-4 py-2.5 font-mono text-xs" style={{ color: '#94a3b8', maxWidth: 180 }}>
                  <span className="truncate block">{e.account}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className="font-semibold"
                    style={{ color: e.direction === 'CREDIT' ? '#00C896' : '#FF3B30' }}
                  >
                    {e.direction}
                  </span>
                </td>
                <td className="px-4 py-2.5 font-mono font-medium" style={{ color: '#f1f5f9' }}>
                  {e.direction === 'CREDIT' ? '+' : '-'}{e.amount}
                </td>
                <td className="px-4 py-2.5" style={{ color: '#64748b' }}>{e.currency}</td>
                <td className="px-4 py-2.5"><Badge value={e.status.toLowerCase()} /></td>
                <td className="px-4 py-2.5" style={{ color: '#94a3b8' }}>
                  {new Date(e.ts).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl p-4 text-xs" style={{ background: 'rgba(0,200,150,0.05)', border: '1px solid rgba(0,200,150,0.2)' }}>
        <p className="font-semibold mb-1" style={{ color: '#00C896' }}>🔒 Integrity Guarantee</p>
        <p style={{ color: '#64748b' }}>
          All entries are protected by a PostgreSQL trigger (<code className="px-1 rounded" style={{ background: '#f1f5f9', color: '#64748b' }}>trg_ledger_immutable</code>) that rejects any UPDATE or DELETE operation. Every transaction satisfies SUM(debits) = SUM(credits).
        </p>
      </div>
    </div>
  )
}
