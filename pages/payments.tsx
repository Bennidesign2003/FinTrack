import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ExpenseModal, { type ExpenseData } from '../components/ExpenseModal'
import CategoryBadge from '../components/CategoryBadge'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

type Expense = {
  id: number
  category: string
  amount: number
  date: string
  description?: string
  createdAt: string
}

export default function PaymentsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadExpenses()
  }, [refreshKey])

  const loadExpenses = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/expenses', { cache: 'no-store' })
      if (res.ok) {
        const data: Expense[] = await res.json()
        setExpenses(data)
      }
    } catch (error) {
      console.error('Error loading expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveExpense = async (data: ExpenseData) => {
    try {
      const method = editingExpense ? 'PUT' : 'POST'
      const payload = editingExpense ? { ...data, id: editingExpense.id } : data
      const response = await fetch('/api/expenses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        alert(editingExpense ? 'Ausgabe aktualisiert' : `Ausgabe "${data.category}" erstellt`)
        setIsModalOpen(false)
        setEditingExpense(null)
        setRefreshKey(prev => prev + 1)
      } else {
        const err = await response.json()
        alert(err.error || 'Fehler beim Speichern der Ausgabe')
      }
    } catch (error) {
      console.error('Error saving expense:', error)
      alert('Fehler beim Speichern der Ausgabe')
    }
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Ausgabe wirklich löschen?')) return
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Ausgabe gelöscht')
        setRefreshKey(prev => prev + 1)
      } else {
        alert('Fehler beim Löschen der Ausgabe')
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Fehler beim Löschen der Ausgabe')
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingExpense(null)
  }

  const modalData: ExpenseData | null = editingExpense
    ? {
        id: editingExpense.id,
        category: editingExpense.category,
        amount: editingExpense.amount.toString(),
        date: editingExpense.date || new Date().toISOString().split('T')[0],
        description: editingExpense.description || ''
      }
    : null

  const formatCurrency = (value: number) =>
    value.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR'
    })

  const heroStats = [
    { label: 'Gesamtausgaben', value: expenses.reduce((sum, exp) => sum + exp.amount, 0), meta: `${expenses.length} Zahlungen` }
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
          <h1 className="text-3xl font-bold">Zahlungen</h1>
          <p className="text-sm text-white/80">Verwalte alle Ausgaben inklusive Kategorien und Beträge</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="grid gap-4 md:grid-cols-3 flex-1">
            {heroStats.map(stat => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_25px_70px_rgba(15,23,42,0.5)] backdrop-blur-2xl px-5 py-6"
              >
                <p className="text-xs uppercase tracking-wider text-white/60">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{formatCurrency(stat.value)}</p>
                <p className="text-xs text-white/60 mt-1">{stat.meta}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setEditingExpense(null)
              setIsModalOpen(true)
            }}
            className="ml-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(15,23,42,0.5)]"
          >
            + Neue Ausgabe
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-10 text-center text-white/80">
            Lädt...
          </div>
        ) : expenses.length === 0 ? (
          <div className="rounded-3xl border border-white/30 bg-white/10 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-10 text-center text-white/80 space-y-4">
            <p>Noch keine Zahlungen erfasst.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow-[0_15px_40px_rgba(15,23,42,0.45)]"
            >
              Erste Ausgabe erstellen
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/20 bg-white/5 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">KATEGORIE</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-white/70">BETRAG</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">DATUM</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">BESCHREIBUNG</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white/70">AKTIONEN</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, idx) => (
                  <tr
                    key={expense.id}
                    className={`transition-colors ${idx % 2 === 0 ? 'bg-white/10' : 'bg-white/5'}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      <CategoryBadge category={expense.category} />
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-white">€ {expense.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-white/70">
                      {expense.date ? new Date(expense.date).toLocaleDateString('de-DE') : '–'}
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {expense.description || 'Keine Beschreibung'}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-3 text-white/80">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="inline-flex items-center gap-1 text-white/80 hover:text-white"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
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

      <ExpenseModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveExpense} initialData={modalData} />
    </div>
  )
}
