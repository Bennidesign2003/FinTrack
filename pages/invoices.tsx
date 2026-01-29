import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import InvoiceModal, { type InvoiceData } from '../components/InvoiceModal'
import StatusBadge from '../components/StatusBadge'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

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

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const normalizeStatus = (invoice: Invoice) => {
    if (invoice.status === 'paid') return invoice
    if (!invoice.dueDate) return { ...invoice, status: 'open' }
    const due = new Date(invoice.dueDate)
    due.setHours(23, 59, 59, 999)
    const now = new Date()
    if (due.getTime() < now.getTime()) {
      return { ...invoice, status: 'overdue' }
    }
    return { ...invoice, status: 'open' }
  }

  const loadInvoices = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/invoices', { cache: 'no-store' })
      if (res.ok) {
        const data: Invoice[] = await res.json()
        const normalized = data.map(normalizeStatus)
        setInvoices(normalized)
      }
    } catch (error) {
      console.error('Error loading invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvoices()
  }, [refreshKey])

  const summary = useMemo(() => {
    const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0)
    const openCount = invoices.filter(invoice => invoice.status === 'open').length
    const overdueCount = invoices.filter(invoice => invoice.status === 'overdue').length
    return { totalAmount, openCount, overdueCount }
  }, [invoices])

  const handleSaveInvoice = async (data: InvoiceData) => {
    try {
      const method = editingInvoice ? 'PUT' : 'POST'
      const payload = editingInvoice ? { ...data, id: editingInvoice.id } : data
      const response = await fetch('/api/invoices', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert(editingInvoice ? 'Rechnung aktualisiert' : `Rechnung "${data.title}" erstellt`)
        setIsModalOpen(false)
        setEditingInvoice(null)
        setRefreshKey(prev => prev + 1)
      } else {
        const err = await response.json()
        alert(err.error || 'Fehler beim Speichern der Rechnung')
      }
    } catch (error) {
      console.error('Error saving invoice:', error)
      alert('Fehler beim Speichern der Rechnung')
    }
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Rechnung wirklich löschen?')) return
    try {
      const res = await fetch(`/api/invoices?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Rechnung gelöscht')
        setRefreshKey(prev => prev + 1)
      } else {
        alert('Fehler beim Löschen der Rechnung')
      }
    } catch (error) {
      console.error('Error deleting invoice:', error)
      alert('Fehler beim Löschen der Rechnung')
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingInvoice(null)
  }

  const modalData: InvoiceData | null = editingInvoice
    ? {
        id: editingInvoice.id,
        title: editingInvoice.title,
        customer: editingInvoice.customer,
        amount: editingInvoice.amount.toString(),
        taxRate: editingInvoice.taxRate.toString(),
        dueDate: editingInvoice.dueDate ?? '',
        description: editingInvoice.description ?? '',
        status: editingInvoice.status as InvoiceData['status'],
      }
    : null

  const formatCurrency = (value: number) =>
    value.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR'
    })

  const heroCards = [
    { label: 'Gesamtbetrag', value: summary.totalAmount, meta: `${invoices.length} Rechnungen`, variant: 'currency' },
    { label: 'Offen', value: summary.openCount, meta: 'Offene Rechnungen', variant: 'count' },
    { label: 'Überfällig', value: summary.overdueCount, meta: 'Überfällige Rechnungen', variant: 'count' }
  ]

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: 'radial-gradient(circle at top, rgba(255,255,255,0.4), rgba(209,213,219,0.5) 45%, transparent 60%), linear-gradient(120deg, #0f172a, #1d4ed8)'
      }}
    >
      <Sidebar />

      <div className="flex-1 p-8 space-y-6">
        <Header onNewInvoice={() => setIsModalOpen(true)} />

        <div className="text-white">
          <h1 className="text-3xl font-bold">Rechnungen</h1>
          <p className="text-sm text-white/80">Verwalte alle Rechnungen mit Status-Tracking und Details</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {heroCards.map(card => (
            <div
              key={card.label}
              className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_25px_60px_rgba(15,23,42,0.45)] backdrop-blur-2xl px-5 py-6"
            >
              <p className="text-xs uppercase tracking-wider text-white/60">{card.label}</p>
              <p className="text-3xl font-bold text-white mt-2">
                {card.variant === 'currency' ? formatCurrency(card.value) : card.value}
              </p>
              <p className="text-xs text-white/60 mt-1">{card.meta}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Zeige Rechnungen</p>
            <p className="text-xs text-white/60">{invoices.length} Einträge geladen</p>
          </div>
          <button
            onClick={() => {
              setEditingInvoice(null)
              setIsModalOpen(true)
            }}
            className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(15,23,42,0.5)]"
          >
            + Neue Rechnung
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-10 text-center text-white/80">
            Lädt...
          </div>
        ) : invoices.length === 0 ? (
          <div className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-10 text-center text-white/80 space-y-4">
            <p>Noch keine Rechnungen vorhanden.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(15,23,42,0.45)]"
            >
              Erste Rechnung erstellen
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/20 bg-white/5 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">TITEL</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">KUNDE</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-white/70">BETRAG</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">STATUS</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">FÄLLIG AM</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">AKTIONEN</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, idx) => (
                  <tr
                    key={invoice.id}
                    className={`transition-colors ${idx % 2 === 0 ? 'bg-white/10' : 'bg-white/5'}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      <div>{invoice.title}</div>
                      <div className="text-xs uppercase tracking-wide text-white/40 mt-1">Info</div>
                      <p className="text-xs text-white/60">{invoice.description || 'Keine Beschreibung'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/80">{invoice.customer}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-white">€ {invoice.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('de-DE') : '–'}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-3 text-white/80">
                      <button
                        onClick={() => handleEdit(invoice)}
                        className="inline-flex items-center gap-1 hover:text-white"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(invoice.id)}
                        className="inline-flex items-center gap-1 text-rose-300 hover:text-rose-100"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Löschen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InvoiceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveInvoice}
        initialData={modalData}
      />
    </div>
  )
}
