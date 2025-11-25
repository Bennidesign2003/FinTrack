export default function ChartPlaceholder({ title }: { title?: string }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      {title && <div className="text-sm text-gray-500 mb-3">{title}</div>}
      <div className="w-full h-40 flex items-center justify-center text-gray-300">
        <svg viewBox="0 0 200 80" className="w-full h-full">
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline fill="none" stroke="#60a5fa" strokeWidth="3" points="0,60 30,50 60,40 90,38 120,30 150,26 180,20 200,18" />
          <path d="M0,60 L30,50 L60,40 L90,38 L120,30 L150,26 L180,20 L200,18 L200,80 L0,80 Z" fill="url(#g)" />
        </svg>
      </div>
    </div>
  )
}
