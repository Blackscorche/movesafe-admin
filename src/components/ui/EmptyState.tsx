import type { ElementType } from 'react'

interface Props {
  icon?: ElementType
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      {Icon && (
        <div
          className="flex items-center justify-center rounded-2xl"
          style={{ width: 64, height: 64, background: 'rgba(228,91,37,0.12)' }}
        >
          <Icon size={28} style={{ color: '#E45B25' }} />
        </div>
      )}
      <div>
        <p className="text-base font-semibold" style={{ color: '#0f172a' }}>
          {title}
        </p>
        {description && (
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: '#E45B25' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
