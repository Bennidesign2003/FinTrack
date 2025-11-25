type QuickActionsProps = {
  onNewInvoice?: () => void
  onNewCustomer?: () => void
  onNewExpense?: () => void
}

export default function QuickActions({ onNewInvoice, onNewCustomer, onNewExpense }: QuickActionsProps) {
  const actions = [
    { id: 1, title: 'Neue Rechnung', icon: '+', handler: onNewInvoice },
    { id: 2, title: 'Neuer Kunde', icon: '👤', handler: onNewCustomer },
    { id: 3, title: 'Neue Ausgabe', icon: '💸', handler: onNewExpense },
    { id: 4, title: 'Backup erstellen', icon: '🗂️', handler: undefined }
  ]

  return (
    <div className="bg-transparent p-0">
      <h3 className="text-lg font-medium mb-3 text-white">Schnellaktionen</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(a => (
          <button
            key={a.id}
            onClick={() => a.handler && a.handler()}
            disabled={!a.handler}
            className="flex flex-col items-start gap-2 p-3 border border-white/15 rounded-lg text-left bg-white/5 text-white/80 hover:bg-white/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={a.title}
          >
            <div className="text-2xl">{a.icon}</div>
            <div className="text-sm">{a.title}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
