import { BellIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function Header({ onNewInvoice }: { onNewInvoice?: () => void }) {
  return (
    <header className="flex items-center justify-between py-4">
      <div>
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="text-sm text-gray-500">Behalte Umsatz, Zahlen und Trends in einem Liquid-Glass-Cockpit im Blick.</p>
      </div>

      <div className="flex items-center gap-3">
        {onNewInvoice && (
          <button
            onClick={onNewInvoice}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Neue Rechnung</span>
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <BellIcon className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </header>
  )
}
