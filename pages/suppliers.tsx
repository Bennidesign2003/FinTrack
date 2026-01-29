import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import SupplierModal from '../components/SupplierModal'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

type Supplier = {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  country?: string
  taxId?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const loadSuppliers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/suppliers', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setSuppliers(data)
      }
    } catch (error) {
      console.error('Error loading suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSuppliers()
  }, [refreshKey])

  const summary = useMemo(() => {
    const totalSuppliers = suppliers.length
    const withContact = suppliers.filter(s => s.email || s.phone).length
    const withTaxId = suppliers.filter(s => s.taxId).length
    return { totalSuppliers, withContact, withTaxId }
  }, [suppliers])

  const handleSaveSupplier = async (data: any) => {
    try {
      const isEditing = Boolean(editingSupplier)
      const method = isEditing ? 'PUT' : 'POST'
      const body = isEditing ? { ...data, id: editingSupplier?.id } : data

      const response = await fetch('/api/suppliers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        const action = isEditing ? 'aktualisiert' : 'erstellt'
        alert(`Lieferant "${data.name}" ${action}`)
        setRefreshKey(prev => prev + 1)
        closeModal()
      } else {
        const err = await response.json()
        alert(err.error || 'Fehler beim Speichern des Lieferanten')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Fehler beim Speichern des Lieferanten')
    }
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Lieferant wirklich löschen?')) return

    try {
      const response = await fetch(`/api/suppliers?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Lieferant gelöscht')
        setRefreshKey(prev => prev + 1)
      } else {
        alert('Fehler beim Löschen des Lieferanten')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Fehler beim Löschen des Lieferanten')
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingSupplier(null)
  }

  const heroCards = [
    { label: 'Lieferanten gesamt', value: summary.totalSuppliers, meta: 'Einträge insgesamt' },
    { label: 'Mit Kontakt', value: summary.withContact, meta: 'Email oder Telefon' },
    { label: 'Mit Steuernummer', value: summary.withTaxId, meta: 'Steuerdaten vorhanden' }
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
          <h1 className="text-3xl font-bold">Lieferanten</h1>
          <p className="text-sm text-white/80">Verwalte alle Lieferanten an einem Ort mit verstärkter Übersicht</p>
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
            <p className="text-sm font-semibold uppercase tracking-wider text-white/70">Lieferantenliste</p>
            <p className="text-xs text-white/60">{suppliers.length} Einträge geladen</p>
          </div>
          <button
            onClick={() => {
              setEditingSupplier(null)
              setIsModalOpen(true)
            }}
            className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(15,23,42,0.5)]"
          >
            + Neuer Lieferant
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-10 text-center text-white/80">
            Lädt...
          </div>
        ) : suppliers.length === 0 ? (
          <div className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-10 text-center text-white/80 space-y-4">
            <p>Noch keine Lieferanten erfasst.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(15,23,42,0.45)]"
            >
              Ersten Lieferanten hinzufügen
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
                {suppliers.map((supplier, idx) => (
                  <tr
                    key={supplier.id}
                    className={`transition-colors ${idx % 2 === 0 ? 'bg-white/10' : 'bg-white/5'}`}
                  >
                    <td className="px-6 py-4 text-white font-semibold">{supplier.name}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{supplier.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{supplier.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{supplier.city || '-'}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{supplier.country || '-'}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{supplier.taxId || '-'}</td>
                    <td className="px-6 py-4 text-sm space-x-3 text-white/80">
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="inline-flex items-center gap-1 hover:text-white"
                        title="Bearbeiten"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="inline-flex items-center gap-1 text-rose-300 hover:text-rose-100"
                        title="Löschen"
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

      <SupplierModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveSupplier}
        initialData={editingSupplier}
      />
    </div>
  )
}
