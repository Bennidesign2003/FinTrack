import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import CustomerModal from '../components/CustomerModal'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

type Customer = {
  id: number
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  country: string | null
  taxId: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/customers', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setCustomers(data)
      }
    } catch (e) {
      console.error('Error loading customers:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [refreshKey])

  const summary = useMemo(() => {
    const totalCustomers = customers.length
    const withEmail = customers.filter(customer => customer.email).length
    const withTaxId = customers.filter(customer => customer.taxId).length
    return { totalCustomers, withEmail, withTaxId }
  }, [customers])

  const handleSaveCustomer = async (data: any) => {
    try {
      const url = editingCustomer ? '/api/customers' : '/api/customers'
      const method = editingCustomer ? 'PUT' : 'POST'
      const payload = editingCustomer ? { ...data, id: editingCustomer.id } : data

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert(editingCustomer ? 'Kunde aktualisiert' : `Kunde "${data.name}" erstellt`)
        setIsModalOpen(false)
        setEditingCustomer(null)
        setRefreshKey(prev => prev + 1)
      } else {
        const err = await response.json()
        alert(err.error || 'Fehler beim Speichern des Kunden')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Fehler beim Speichern des Kunden')
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Kunden wirklich löschen?')) {
      try {
        const res = await fetch(`/api/customers?id=${id}`, { method: 'DELETE' })
        if (res.ok) {
          alert('Kunde gelöscht')
          setRefreshKey(prev => prev + 1)
        } else {
          alert('Fehler beim Löschen')
        }
      } catch (e) {
        console.error('Error:', e)
        alert('Fehler beim Löschen')
      }
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCustomer(null)
  }

  const heroCards = [
    { label: 'Kunden gesamt', value: summary.totalCustomers, meta: 'Einträge insgesamt' },
    { label: 'Mit E-Mail', value: summary.withEmail, meta: 'Kontaktinformationen' },
    { label: 'Mit Steuernummer', value: summary.withTaxId, meta: 'Steuerinformationen' }
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
        <Header />

        <div className="text-white">
          <h1 className="text-3xl font-bold">Kunden</h1>
          <p className="text-sm text-white/80">Alle Kunden mit Kontakten, Steuernummern und Aktionen in einem Glas-Cockpit</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {heroCards.map(card => (
            <div
              key={card.label}
              className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_25px_60px_rgba(15,23,42,0.45)] backdrop-blur-2xl px-5 py-6"
            >
              <p className="text-xs uppercase tracking-wider text-white/60">{card.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
              <p className="text-xs text-white/60 mt-1">{card.meta}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Kundenliste</p>
            <p className="text-xs text-white/60">{customers.length} Einträge geladen</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(15,23,42,0.5)]"
          >
            + Neuer Kunde
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-10 text-center text-white/80">
            Lädt...
          </div>
        ) : customers.length === 0 ? (
          <div className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-10 text-center text-white/80 space-y-4">
            <p>Noch keine Kunden vorhanden.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(15,23,42,0.45)]"
            >
              Ersten Kunden hinzufügen
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/20 bg-white/5 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">NAME</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">EMAIL</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">TELEFON</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">STADT</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">LAND</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">STEUERNUMMER</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">AKTIONEN</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, idx) => (
                  <tr key={customer.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white/10' : 'bg-white/5'}`}>
                    <td className="px-6 py-4 text-white font-semibold">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{customer.email || '–'}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{customer.phone || '–'}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{customer.city || '–'}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{customer.country || '–'}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{customer.taxId || '–'}</td>
                    <td className="px-6 py-4 text-sm space-x-3 text-white/80">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="inline-flex items-center gap-1 hover:text-white"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
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

      <CustomerModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveCustomer} initialData={editingCustomer} />
    </div>
  )
}
