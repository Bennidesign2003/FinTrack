import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import StatusBadge from '../components/StatusBadge'
import CategoryBadge from '../components/CategoryBadge'

type Invoice = {
  id: number
  title: string
  customer: string
  amount: number
  taxRate: number
  taxAmount: number
  totalAmount: number
  status: string
  dueDate?: string
  description?: string
  createdAt: string
}

type Expense = {
  id: number
  category: string
  amount: number
  date: string
  description?: string
  createdAt: string
}

const formatCurrency = (value: number) =>
  value.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR'
  })

const normalizeInvoice = (invoice: Invoice) => {
  if (invoice.status === 'paid') return { ...invoice, status: 'paid' }
  if (!invoice.dueDate) return { ...invoice, status: 'open' }
  const due = new Date(invoice.dueDate)
  due.setHours(23, 59, 59, 999)
  const now = new Date()
  if (due.getTime() < now.getTime()) {
    return { ...invoice, status: 'overdue' }
  }
  return { ...invoice, status: 'open' }
}


export default function ReportsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [invoiceRes, expenseRes] = await Promise.all([
          fetch('/api/invoices', { cache: 'no-store' }),
          fetch('/api/expenses', { cache: 'no-store' })
        ])

        if (invoiceRes.ok) {
          const data: Invoice[] = await invoiceRes.json()
          setInvoices(data.map(normalizeInvoice))
        }
        if (expenseRes.ok) {
          const data: Expense[] = await expenseRes.json()
          setExpenses(data)
        }
      } catch (error) {
        console.error('Error loading reports data:', error)
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [])

  const invoiceSummary = useMemo(() => {
    const summary = {
      open: { count: 0, amount: 0 },
      paid: { count: 0, amount: 0 },
      overdue: { count: 0, amount: 0 }
    }

    invoices.forEach(invoice => {
      const key = (invoice.status || 'open') as keyof typeof summary
      if (!summary[key]) return
      summary[key].count += 1
      summary[key].amount += invoice.totalAmount
    })

    return summary
  }, [invoices])

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, { amount: number; count: number }>()
    expenses.forEach(expense => {
      const entry = map.get(expense.category) ?? { amount: 0, count: 0 }
      entry.amount += expense.amount
      entry.count += 1
      map.set(expense.category, entry)
    })
    return Array.from(map.entries()).sort((a, b) => b[1].amount - a[1].amount)
  }, [expenses])

  const recentInvoices = useMemo(() => invoices.slice(0, 4), [invoices])
  const recentExpenses = useMemo(() => expenses.slice(0, 4), [expenses])

  if (loading) {
    return (
      <div
        className="flex min-h-screen"
        style={{
          background: 'radial-gradient(circle at top, rgba(255,255,255,0.4), rgba(209,213,219,0.5) 45%, transparent 60%), linear-gradient(120deg, #0f172a, #1d4ed8)'
        }}
      >
        <Sidebar />
        <div className="flex-1 p-8">
          <Header />
          <div className="mt-6 rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-8 text-center text-white/80">
            Berichte werden geladen...
          </div>
        </div>
      </div>
    )
  }

  const totalInvoices = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: 'radial-gradient(circle at top, rgba(255,255,255,0.4), rgba(209,213,219,0.5) 45%, transparent 60%), linear-gradient(120deg, #0f172a, #1d4ed8)'
      }}
    >
      <Sidebar />

      <div className="flex-1 p-8 space-y-6">
        <Header />

        <div className="text-white">
          <h1 className="text-3xl font-bold">Berichte</h1>
          <p className="text-sm text-white/80">Übersicht über Rechnungen und Zahlungen</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Gesamtrechnungen', value: totalInvoices, meta: `${invoices.length} Rechnungen` },
            { label: 'Alle Zahlungen', value: totalExpenses, meta: `${expenses.length} Ausgaben` },
            { label: 'Deckung', value: totalInvoices - totalExpenses, meta: 'Differenz Einnahmen minus Ausgaben' }
          ].map(card => (
            <div
              key={card.label}
              className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.45)] backdrop-blur-2xl px-5 py-6"
            >
              <p className="text-xs uppercase tracking-wider text-white/60">{card.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{formatCurrency(card.value)}</p>
              <p className="text-xs text-white/60 mt-1">{card.meta}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <section className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Rechnungsstatus</h2>
              <span className="text-xs uppercase tracking-wider text-white/60">Totals</span>
            </div>
            <div className="grid gap-3">
              {(['open', 'paid', 'overdue'] as Array<keyof typeof invoiceSummary>).map(status => (
                <div
                  key={status}
                  className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold capitalize text-white">{status}</p>
                    <StatusBadge status={status} />
                  </div>
                  <div className="text-right text-white">
                    <p className="text-base font-semibold">{formatCurrency(invoiceSummary[status].amount)}</p>
                    <p className="text-xs text-white/60">{invoiceSummary[status].count} Rechnungen</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Top-Kategorien</h2>
              <span className="text-xs uppercase tracking-wider text-white/60">Ausgaben</span>
            </div>
            {expenseByCategory.length === 0 ? (
              <p className="text-sm text-white/80">Noch keine Ausgaben vorhanden.</p>
            ) : (
              <ul className="space-y-3">
                {expenseByCategory.map(([category, data]) => (
                  <li key={category} className="flex items-center justify-between">
                    <CategoryBadge category={category} />
                    <div className="text-right text-white">
                      <p className="text-base font-semibold">{formatCurrency(data.amount)}</p>
                      <p className="text-xs text-white/60">{data.count} Zahlungen</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Letzte Rechnungen</h2>
            </div>
            {recentInvoices.length === 0 ? (
              <p className="text-sm text-white/80">Keine Rechnungen vorhanden.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {recentInvoices.map(invoice => (
                  <li key={invoice.id} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{invoice.title}</p>
                      <p className="text-sm text-white/70">{invoice.customer}</p>
                      <p className="text-xs text-white/40">{invoice.description || 'Keine Beschreibung'}</p>
                    </div>
                    <div className="text-right text-white">
                      <p className="text-base font-bold">{formatCurrency(invoice.totalAmount)}</p>
                      <StatusBadge status={invoice.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Letzte Zahlungen</h2>
            </div>
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-white/80">Keine Ausgaben vorhanden.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {recentExpenses.map(expense => (
                  <li key={expense.id} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{expense.category}</p>
                      <p className="text-sm text-white/70">{expense.description || 'Keine Beschreibung'}</p>
                      <p className="text-xs text-white/40">{expense.date ? new Date(expense.date).toLocaleDateString('de-DE') : '–'}</p>
                    </div>
                    <div className="text-right text-white">
                      <p className="text-base font-bold">{formatCurrency(expense.amount)}</p>
                      <CategoryBadge category={expense.category} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
