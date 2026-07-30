import { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { Store, Users, TrendingUp, Activity, CheckCircle, Zap } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import { api } from '../lib/api'
import type { BcvRate, AdminStats } from '../types'

const EMISSION_DATA = [
  { day: 'Mon', gc: 4200 }, { day: 'Tue', gc: 5800 }, { day: 'Wed', gc: 5100 },
  { day: 'Thu', gc: 7200 }, { day: 'Fri', gc: 6400 }, { day: 'Sat', gc: 8100 },
  { day: 'Sun', gc: 7600 },
]

const FUNNEL_DATA = [
  { name: 'Registered', value: 3420, color: '#E45B25' },
  { name: 'Goals Met', value: 1890, color: '#00C896' },
  { name: 'Redeemed', value: 842, color: '#00D4AA' },
]

const MOCK_LEDGER = [
  { id: 'TX-001', type: 'EMISSION', user: 'Carlos M.', amount: '+10 GC', status: 'CONFIRMED', time: '2 min ago' },
  { id: 'TX-002', type: 'REDEMPTION_CONFIRM', user: 'Bodega El Pana', amount: '-300 GC', status: 'CONFIRMED', time: '5 min ago' },
  { id: 'TX-003', type: 'STREAK_BONUS', user: 'Ana R.', amount: '+50 GC', status: 'CONFIRMED', time: '8 min ago' },
  { id: 'TX-004', type: 'EXPIRY_BURN', user: 'System', amount: '-120 GC', status: 'CONFIRMED', time: '12 min ago' },
  { id: 'TX-005', type: 'MERCHANT_FEE', user: 'Farmacia Salud', amount: '+$0.90', status: 'CONFIRMED', time: '18 min ago' },
]

export default function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [bcvRate, setBcvRate] = useState<BcvRate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      api.get<AdminStats>('/admin/stats').then(setStats),
      api.get<BcvRate>('/admin/bcv-rates/current').then(setBcvRate),
    ]).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: '#0f172a' }}>
          Central Control
        </h1>
        <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
          Real-time overview of the MoveSave ecosystem
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active Merchants"
          value={loading ? '—' : stats?.approved_merchants ?? 0}
          icon={Store}
          iconColor="#E45B25"
          trend={18}
          sub="vs last month"
          loading={loading}
        />
        <StatCard
          label="GC in Circulation"
          value="428,900"
          icon={Zap}
          iconColor="#00C896"
          trend={5}
          sub="GC total supply"
        />
        <StatCard
          label="Redemptions Today"
          value="142"
          icon={CheckCircle}
          iconColor="#00D4AA"
          trend={12}
          sub="canjes hoy"
        />
        <StatCard
          label="BCV Rate"
          value={bcvRate ? `Bs ${Number(bcvRate.rate_bs_per_usd).toFixed(2)}` : '—'}
          icon={TrendingUp}
          iconColor={bcvRate?.is_stale ? '#F59E0B' : '#7C5CBF'}
          sub={bcvRate?.is_stale ? 'Using fallback rate' : `Source: ${bcvRate?.source ?? '...'}`}
          loading={loading}
        />
        <StatCard label="Pending KYC" value={loading ? '—' : stats?.pending_merchants ?? 0} icon={CheckCircle} iconColor="#F59E0B" loading={loading} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Emission chart */}
        <div
          className="col-span-2 rounded-xl p-5"
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>
                GC Emission — Last 7 Days
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
                Daily GreenCoin emission from step sync
              </p>
            </div>
            <Activity size={16} style={{ color: '#64748b' }} />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={EMISSION_DATA}>
              <defs>
                <linearGradient id="gcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E45B25" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E45B25" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#64748b' }}
                itemStyle={{ color: '#E45B25' }}
              />
              <Area type="monotone" dataKey="gc" stroke="#E45B25" strokeWidth={2} fill="url(#gcGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* O2O Funnel */}
        <div
          className="rounded-xl p-5"
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: '#0f172a' }}>
            O2O Conversion Funnel
          </p>
          <p className="text-xs mb-4" style={{ color: '#94a3b8' }}>
            Registered → Goals → Redeemed
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={FUNNEL_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                {FUNNEL_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: '#0f172a' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {FUNNEL_DATA.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span style={{ color: '#64748b' }}>{d.name}</span>
                </div>
                <span className="font-medium" style={{ color: '#0f172a' }}>
                  {d.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Ledger Feed */}
      <div
        className="rounded-xl p-5"
        style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>
            Ledger Feed — Live
          </p>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,200,150,0.12)', color: '#00C896' }}>
            Append-Only
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['TX ID', 'Type', 'Entity', 'Amount', 'Status', 'Time'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_LEDGER.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="px-3 py-2.5 font-mono" style={{ color: '#64748b' }}>{tx.id}</td>
                  <td className="px-3 py-2.5">
                    <span className="font-medium" style={{ color: '#E45B25' }}>{tx.type}</span>
                  </td>
                  <td className="px-3 py-2.5" style={{ color: '#374151' }}>{tx.user}</td>
                  <td className="px-3 py-2.5 font-mono font-medium" style={{ color: tx.amount.startsWith('+') ? '#00C896' : '#FF3B30' }}>
                    {tx.amount}
                  </td>
                  <td className="px-3 py-2.5"><Badge value={tx.status.toLowerCase()} /></td>
                  <td className="px-3 py-2.5" style={{ color: '#94a3b8' }}>{tx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extra KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value={loading ? '—' : stats?.total_users ?? 0} icon={Users} iconColor="#7C5CBF" loading={loading} sub="registered accounts" />
        <StatCard label="Net Fee Revenue" value="$34,120" icon={TrendingUp} iconColor="#00C896" trend={5} sub="this month" />
        <StatCard label="Infrastructure" value="99.98%" icon={Activity} iconColor="#00D4AA" sub="uptime" />
      </div>
    </div>
  )
}
