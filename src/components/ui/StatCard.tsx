import type { ElementType } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  icon: ElementType
  iconColor?: string
  trend?: number
  sub?: string
  loading?: boolean
}

export default function StatCard({ label, value, icon: Icon, iconColor = '#E45B25', trend, sub, loading }: Props) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#94a3b8' }}>
          {label}
        </span>
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: 36, height: 36, background: `${iconColor}22` }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>

      {loading ? (
        <div className="h-8 w-3/4 rounded animate-pulse" style={{ background: '#e2e8f0' }} />
      ) : (
        <span className="text-2xl font-semibold" style={{ color: '#0f172a' }}>
          {value}
        </span>
      )}

      <div className="flex items-center gap-2">
        {trend !== undefined && (
          <span
            className="flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded"
            style={
              trend > 0
                ? { background: 'rgba(0,200,150,0.15)', color: '#00C896' }
                : trend < 0
                  ? { background: 'rgba(255,59,48,0.15)', color: '#FF3B30' }
                  : { background: '#f1f5f9', color: '#94a3b8' }
            }
          >
            {trend > 0 ? <TrendingUp size={11} /> : trend < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}
            {Math.abs(trend)}%
          </span>
        )}
        {sub && <span className="text-xs" style={{ color: '#64748b' }}>{sub}</span>}
      </div>
    </div>
  )
}
