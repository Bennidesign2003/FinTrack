import { useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

type AccountCategory = 'Aktiva' | 'Passiva' | 'Erträge' | 'Aufwendungen'

type Account = {
  number: string
  name: string
  category: AccountCategory
  description: string
}

const defaultAccounts: Account[] = [
  { number: '1000', name: 'Kasse', category: 'Aktiva', description: 'Freie Zahlungsmittel wie Bargeld und Bankguthaben' },
  { number: '1200', name: 'Bank', category: 'Aktiva', description: 'Bankkonten für laufende Geschäftsvorgänge' },
  { number: '1400', name: 'Forderungen aus Lieferungen und Leistungen', category: 'Aktiva', description: 'Offene Rechnungen an Kund:innen' },
  { number: '2000', name: 'Verbindlichkeiten aus L+L', category: 'Passiva', description: 'Kurzfristige Verpflichtungen gegenüber Lieferanten' },
  { number: '3000', name: 'Eigenkapital', category: 'Passiva', description: 'Einlagen und Gewinne des Unternehmens' },
  { number: '4000', name: 'Umsatzerlöse (netto)', category: 'Erträge', description: 'Regelmäßige Verkaufserlöse ohne Umsatzsteuer' },
  { number: '4400', name: 'Sonstige betriebliche Erträge', category: 'Erträge', description: 'Einmalige oder nicht operative Einnahmen' },
  { number: '5000', name: 'Wareneinsatz', category: 'Aufwendungen', description: 'Einkaufswerte verkaufter Waren' },
  { number: '6000', name: 'Mietaufwand', category: 'Aufwendungen', description: 'Büro- oder Lagerflächen' },
  { number: '7000', name: 'Personalaufwand', category: 'Aufwendungen', description: 'Löhne, Gehälter und Sozialabgaben' }
]

const categoryHighlights: Record<AccountCategory, string> = {
  Aktiva: 'Abbildungen aller Vermögenswerte',
  Passiva: 'Verpflichtungen und Eigenkapital',
  Erträge: 'Erwirtschaftete Einnahmen',
  Aufwendungen: 'Laufende Kosten'
}

export default function ChartOfAccountsPage() {
  const [search, setSearch] = useState('')
  const [accountList, setAccountList] = useState<Account[]>(defaultAccounts)
  const [newAccount, setNewAccount] = useState<Account>({
    number: '',
    name: '',
    category: 'Aktiva',
    description: ''
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categoryEntries = Object.entries(categoryHighlights) as [AccountCategory, string][]

  const filteredAccounts = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase()
    if (!lowerSearch) return accountList
    return accountList.filter(account =>
      account.number.includes(lowerSearch) ||
      account.name.toLowerCase().includes(lowerSearch) ||
      account.category.toLowerCase().includes(lowerSearch)
    )
  }, [search, accountList])

  const groupedAccounts = useMemo(() => {
    const grouped = filteredAccounts.reduce<Record<AccountCategory, Account[]>>((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = []
      acc[curr.category].push(curr)
      return acc
    }, {} as Record<AccountCategory, Account[]>)

    ;(Object.keys(categoryHighlights) as AccountCategory[]).forEach(category => {
      if (!grouped[category]) grouped[category] = []
    })

    return grouped
  }, [filteredAccounts])

  const handleAddAccount = () => {
    if (!newAccount.number.trim() || !newAccount.name.trim()) {
      alert('Kontonummer und -name sind erforderlich')
      return
    }

    const nextAccount: Account = {
      number: newAccount.number.trim(),
      name: newAccount.name.trim(),
      category: newAccount.category,
      description: newAccount.description.trim() || 'Keine Beschreibung'
    }

    setAccountList(prev => [...prev, nextAccount])
    setNewAccount({ number: '', name: '', category: 'Aktiva', description: '' })
    setIsModalOpen(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setNewAccount({ number: '', name: '', category: 'Aktiva', description: '' })
  }

  return (
    <>
      <div className="flex min-h-screen" style={{ background: 'radial-gradient(circle at top, rgba(255,255,255,0.4), rgba(209,213,219,0.5) 45%, transparent 60%), linear-gradient(120deg, #0f172a, #1d4ed8)' }}>
        <Sidebar />

        <div className="flex-1 p-8">
          <Header onNewInvoice={() => {}} />

          <div className="mt-6">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Kontenplan</h1>
              <p className="text-sm text-white/80">Überblick über die wichtigsten Konten nach Kategorien geordnet.</p>
            </div>
            <div className="flex-1 max-w-xl">
              <input
                type="search"
                placeholder="Suche nach Konten"
                value={search}
                onChange={event => setSearch(event.target.value)}
                className="w-full border border-white/60 bg-white/10 text-white placeholder-white/70 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex justify-end mb-6 space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white font-semibold text-sm rounded-md px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Konto hinzufügen
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {categoryEntries.map(([category, label]) => (
              <div
                key={category}
                className="rounded-2xl border border-white/40 bg-white/20 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.45)] backdrop-blur-2xl"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-white/70">{category}</div>
                <div className="text-xl font-semibold text-white mt-2">{label}</div>
                <div className="text-sm text-white/70 mt-1">
                  {groupedAccounts[category]?.length ?? 0} Konten angezeigt
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/30 bg-white/20 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl">
            <table className="w-full text-sm">
              <thead className="bg-white/30 backdrop-blur-lg border-b border-white/40">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-white/80 uppercase tracking-wide">Kontonummer</th>
                  <th className="px-6 py-3 text-left font-semibold text-white/80 uppercase tracking-wide">Kontoname</th>
                  <th className="px-6 py-3 text-left font-semibold text-white/80 uppercase tracking-wide">Kategorie</th>
                  <th className="px-6 py-3 text-left font-semibold text-white/80 uppercase tracking-wide">Beschreibung</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-white/60">
                        Keine Konten gefunden.
                      </td>
                    </tr>
                ) : (
                  filteredAccounts.map((account, index) => (
                    <tr
                      key={`${account.number}-${index}`}
                      className={`transition-colors ${index % 2 === 0 ? 'bg-white/30' : 'bg-white/20'}`}
                    >
                      <td className="px-6 py-4 font-medium text-white">{account.number}</td>
                      <td className="px-6 py-4 text-white/90">{account.name}</td>
                      <td className="px-6 py-4 text-white/80">{account.category}</td>
                      <td className="px-6 py-4 text-white/70">{account.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseModal} />
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/30 bg-white/20 p-6 shadow-[0_40px_100px_rgba(15,23,42,0.6)] backdrop-blur-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Konto hinzufügen</h2>
              <button onClick={handleCloseModal} className="text-white/70 hover:text-white text-sm">
                Schließen
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-white/80">Kontonummer</label>
                <input
                  type="text"
                  value={newAccount.number}
                  onChange={event => setNewAccount(prev => ({ ...prev, number: event.target.value }))}
                  className="border border-white/40 bg-white/10 text-white placeholder-white/70 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-white/80">Kontoname</label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={event => setNewAccount(prev => ({ ...prev, name: event.target.value }))}
                  className="border border-white/40 bg-white/10 text-white placeholder-white/70 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-white/80">Kategorie</label>
                <select
                  value={newAccount.category}
                  onChange={event => setNewAccount(prev => ({ ...prev, category: event.target.value as AccountCategory }))}
                  className="border border-white/40 bg-white/10 text-white placeholder-white/70 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {categoryEntries.map(([category]) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-white/80">Beschreibung</label>
                <input
                  type="text"
                  value={newAccount.description}
                  onChange={event => setNewAccount(prev => ({ ...prev, description: event.target.value }))}
                  className="border border-white/40 bg-white/10 text-white placeholder-white/70 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-md bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleAddAccount}
                className="px-4 py-2 rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Konto hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
