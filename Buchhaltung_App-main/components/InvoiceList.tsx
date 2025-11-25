'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Invoice = {
  id: number
  number?: string
  customer: string
  amount: number
  totalAmount: number
  taxRate: number
  status: string
  createdAt: string
  dueDate?: string
}

function StatusBadge({ status }: { status: string }) {
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
  const klass = statusMap[status] || 'bg-gray-100 text-gray-700'
  return <span className={`px-2 py-1 text-xs rounded ${klass}`}>{statusLabel[status] || status}</span>
}

export default function InvoiceList({ refreshTrigger }: { refreshTrigger?: number }) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices')
      if (response.ok) {
        const data = await response.json()
        setInvoices(data)
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [refreshTrigger])

  if (loading) {
    return (
      <div className="bg-white p-4 rounded shadow-sm">
        <div className="text-sm text-gray-500">Rechnungen werden geladen...</div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Aktuelle Rechnungen</h3>
          <p className="text-sm text-gray-500">Letzte Rechnungen auf einen Blick</p>
        </div>
        <Link href="/invoices" className="text-sm text-blue-600 underline">
          Alle anzeigen
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">Noch keine Rechnungen erstellt.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {invoices.slice(0, 5).map(inv => (
            <li key={inv.id} className="flex items-center justify-between border-b pb-3">
              <div>
                <div className="font-medium">#{inv.id}</div>
                <div className="text-sm text-gray-500">{inv.customer}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">€ {Number(inv.totalAmount).toFixed(2)}</div>
                <div className="mt-1">
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
