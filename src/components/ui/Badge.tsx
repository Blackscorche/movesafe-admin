type Variant = 'confirmed' | 'pending' | 'cancelled' | 'conflicted' | 'active' | 'inactive' | 'approved' | 'rejected' | 'stale' | 'master' | 'analyst' | 'support' | string

const styles: Record<string, { bg: string; color: string }> = {
  confirmed:  { bg: 'rgba(0,200,150,0.15)',   color: '#00C896' },
  approved:   { bg: 'rgba(0,200,150,0.15)',   color: '#00C896' },
  active:     { bg: 'rgba(0,200,150,0.15)',   color: '#00C896' },
  settled:    { bg: 'rgba(0,200,150,0.15)',   color: '#00C896' },
  pending:    { bg: 'rgba(245,158,11,0.15)',  color: '#F59E0B' },
  reserved:   { bg: 'rgba(245,158,11,0.15)',  color: '#F59E0B' },
  stale:      { bg: 'rgba(245,158,11,0.15)',  color: '#F59E0B' },
  in_progress:{ bg: 'rgba(0,212,170,0.15)',   color: '#00D4AA' },
  cancelled:  { bg: 'rgba(255,59,48,0.15)',   color: '#FF3B30' },
  rejected:   { bg: 'rgba(255,59,48,0.15)',   color: '#FF3B30' },
  inactive:   { bg: 'rgba(255,59,48,0.15)',   color: '#FF3B30' },
  conflicted: { bg: 'rgba(255,59,48,0.15)',   color: '#FF3B30' },
  master:     { bg: 'rgba(228,91,37,0.15)',   color: '#E45B25' },
  analyst:    { bg: 'rgba(0,212,170,0.15)',   color: '#00D4AA' },
  support:    { bg: 'rgba(124,92,191,0.15)',  color: '#7C5CBF' },
  open:       { bg: 'rgba(228,91,37,0.15)',   color: '#E45B25' },
  resolved:   { bg: 'rgba(0,200,150,0.15)',   color: '#00C896' },
  high:       { bg: 'rgba(255,59,48,0.15)',   color: '#FF3B30' },
  medium:     { bg: 'rgba(245,158,11,0.15)',  color: '#F59E0B' },
  low:        { bg: 'rgba(0,200,150,0.15)',   color: '#00C896' },
}

const fallback = { bg: '#1e293b', color: '#94a3b8' }

export default function Badge({ value }: { value: Variant }) {
  const s = styles[value?.toLowerCase()] ?? fallback
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize"
      style={{ background: s.bg, color: s.color }}
    >
      {value?.replace(/_/g, ' ')}
    </span>
  )
}
