'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import StatusBadge from '../components/StatusBadge'
import CategoryBadge from './CategoryBadge'

type Invoice = {
  id: number
  customer: string
  title?: string
  amount: number
  totalAmount: number
  taxRate: number
  status: string
  createdAt: string
  dueDate?: string
  description?: string
}

type Expense = {
  id: number
  category: string
  amount: number
  date: string
  description?: string
  createdAt: string
}

type Item = (Invoice | Expense) & {
  type: 'invoice' | 'expense'
}

export default function TransactionList({ refreshTrigger }: { refreshTrigger?: number }) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [invoiceRes, expenseRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/expenses')
      ])

      const invoices: Invoice[] = invoiceRes.ok ? await invoiceRes.json() : []
      const expenses: Expense[] = expenseRes.ok ? await expenseRes.json() : []

      // Convert to unified item format and merge
      const allItems: Item[] = [
        ...invoices.map((inv: Invoice) => ({ ...inv, type: 'invoice' as const })),
        ...expenses.map((exp: Expense) => ({
          ...exp,
          type: 'expense' as const,
          createdAt: exp.createdAt || exp.date
        }))
      ]

      // Sort by date descending (newest first)
      allItems.sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)
        return dateB.getTime() - dateA.getTime()
      })

      setItems(allItems)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [refreshTrigger])

  useEffect(() => {
    setPage(0)
  }, [items.length])

  const itemsPerPage = 10
  const totalPages = Math.max(Math.ceil(items.length / itemsPerPage), 1)
  const currentItems = items.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

  if (loading) {
    return (
      <div className="bg-transparent p-0">
        <div className="text-sm text-white/70">Daten werden geladen...</div>
      </div>
    )
  }

  return (
    <div className="bg-transparent p-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-white">Aktuelle Transaktionen</h3>
          <p className="text-sm text-white/60">Rechnungen & Ausgaben auf einen Blick</p>
        </div>
        <div className="flex gap-2">
          <Link href="/invoices" className="text-sm text-blue-300 underline">
            Rechnungen
          </Link>
          <span className="text-white/40">|</span>
          <Link href="/payments" className="text-sm text-blue-300 underline">
            Ausgaben
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-white/70">Noch keine Transaktionen erstellt.</p>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {currentItems.map(item => (
            <li key={`${item.type}-${item.id}`} className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {item.type === 'invoice' ? <DocumentTextIcon className="w-5 h-5 text-blue-400" /> : <BanknotesIcon className="w-5 h-5 text-rose-400" />}
                </div>
                <div>
                  <div className="font-medium leading-tight text-white">
                    {item.type === 'invoice' ? ((item as Invoice).title || `Rechnung ${item.id}`) : `${(item as Expense).category}`}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Info</div>
                  <div className="text-sm text-white/70">
                    {item.type === 'invoice'
                      ? (item as Invoice).description || 'Keine Beschreibung'
                      : (item as Expense).description || 'Keine Beschreibung'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-white">€ {Number(item.type === 'invoice' ? (item as Invoice).totalAmount : item.amount).toFixed(2)}</div>
                <div className="mt-1">
                  {item.type === 'invoice' ? (
                    <StatusBadge status={(item as Invoice).status} />
                  ) : (
                    <CategoryBadge category={(item as Expense).category} />
                  )}
                </div>
              </div>
            </li>
            ))}
          </ul>
          {items.length > itemsPerPage && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-sm text-white/70">
              <span>
                Zeigt {currentItems.length} von {items.length} Einträgen
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                  className="px-3 py-1 rounded-full border border-white/30 disabled:border-white/10 disabled:text-white/30"
                >
                  Vorherige 10
                </button>
                <span>
                  Seite {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1 rounded-full border border-white/30 disabled:border-white/10 disabled:text-white/30"
                >
                  Nächste 10
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
