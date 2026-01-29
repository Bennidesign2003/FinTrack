type CategoryBadgeProps = {
  category: string
}

const categoryColors: Record<string, string> = {
  Material: 'bg-blue-100 text-blue-700',
  Personal: 'bg-purple-100 text-purple-700',
  Marketing: 'bg-pink-100 text-pink-700',
  Miete: 'bg-orange-100 text-orange-700',
  Nebenkosten: 'bg-cyan-100 text-cyan-700',
  Transport: 'bg-amber-100 text-amber-700',
  Software: 'bg-emerald-100 text-emerald-700',
  Bürobedarf: 'bg-indigo-100 text-indigo-700',
  Sonstiges: 'bg-gray-100 text-gray-700'
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const klass = categoryColors[category] || 'bg-gray-100 text-gray-700'
  return <span className={`px-2 py-1 text-xs rounded ${klass}`}>{category}</span>
}
