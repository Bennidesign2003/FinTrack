type StatusBadgeProps = {
  status: string
}

const statusMap: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700'
}

const statusLabel: Record<string, string> = {
  open: 'Offen',
  paid: 'Bezahlt',
  overdue: 'Überfällig'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const klass = statusMap[status] || 'bg-gray-100 text-gray-700'
  return <span className={`px-2 py-1 text-xs rounded ${klass}`}>{statusLabel[status] || status}</span>
}
