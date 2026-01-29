'use client'

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export type ExpenseData = {
  id?: number
  category: string
  amount: string
  date: string
  description: string
}

const defaultCategories = [
  'Material',
  'Personal',
  'Marketing',
  'Miete',
  'Nebenkosten',
  'Transport',
  'Software',
  'Bürobedarf',
  'Sonstiges'
]

const createDefaultFormData = (): ExpenseData => ({
  category: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  description: ''
})

type ExpenseModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ExpenseData) => void
  initialData?: ExpenseData | null
}

export default function ExpenseModal({ isOpen, onClose, onSave, initialData }: ExpenseModalProps) {
  const [formData, setFormData] = useState<ExpenseData>(createDefaultFormData())

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData ? { ...initialData } : createDefaultFormData())
    }
  }, [isOpen, initialData])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (formData.category && formData.amount) {
      onSave(formData)
      setFormData(createDefaultFormData())
      onClose()
    }
  }

  if (!isOpen) return null

  const isEditing = Boolean(formData.id)
  const total = Number(formData.amount || '0')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-3xl border border-white/30 bg-white/10 p-6 shadow-[0_40px_100px_rgba(15,23,42,0.7)] backdrop-blur-[30px] text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{isEditing ? 'Ausgabe bearbeiten' : 'Neue Ausgabe'}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-white/60">Kategorie</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" className="text-black">
                -- Wählen --
              </option>
              {defaultCategories.map(cat => (
                <option key={cat} value={cat} className="text-black">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-white/60">Betrag (€)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              className="w-full rounded-2xl border border-white/30 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-white/60">Datum</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/30 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-white/60">Beschreibung</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Details der Ausgabe..."
              rows={3}
              className="w-full rounded-2xl border border-white/30 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/5 px-4 py-3">
            <div className="flex justify-between text-sm font-semibold text-white">
              <span>Gesamtbetrag:</span>
              <span>€ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white/80 hover:text-white"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-3 text-sm font-medium text-white shadow-[0_20px_60px_rgba(15,23,42,0.45)]"
            >
              {isEditing ? 'Speichern' : 'Ausgabe erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
