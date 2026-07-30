import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  label: string
  render?: (row: T) => ReactNode
  width?: string
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  keyField?: keyof T
  emptyMessage?: string
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 rounded animate-pulse"
            style={{ background: '#e2e8f0', width: `${60 + Math.random() * 30}%` }}
          />
        </td>
      ))}
    </tr>
  )
}

export default function DataTable<T extends object>({
  columns,
  data,
  loading,
  keyField = 'id' as keyof T,
  emptyMessage = 'No data available',
}: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#94a3b8', width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm"
                style={{ color: '#94a3b8' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={String((row as Record<string, unknown>)[keyField as string] ?? idx)}
                className="transition-colors"
                style={{
                  background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#f0f9ff')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? '#ffffff' : '#f8fafc')}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3" style={{ color: '#374151' }}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
