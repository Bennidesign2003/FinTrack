'use client'

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export type InvoiceData = {
  id?: number
  title: string
  customer: string
  amount: string
  taxRate: string
  dueDate: string
  description: string
  status: 'open' | 'paid' | 'overdue'
}

type Customer = {
  id: number
  name: string
}

type InvoiceModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: InvoiceData) => void
  initialData?: InvoiceData | null
}

const createDefaultFormData = (): InvoiceData => ({
  title: '',
  customer: '',
  amount: '',
  taxRate: '19',
  dueDate: '',
  description: '',
  status: 'open'
})

export default function InvoiceModal({ isOpen, onClose, onSave, initialData }: InvoiceModalProps) {
  const [formData, setFormData] = useState<InvoiceData>(createDefaultFormData())
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customersLoading, setCustomersLoading] = useState(true)
  const [customersError, setCustomersError] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (isOpen) {
      const baseData = initialData ? { ...initialData } : createDefaultFormData()
      setFormData({
        ...baseData,
        status: baseData.status === 'paid' ? 'paid' : 'open'
      })
    }
  }, [isOpen, initialData])

  useEffect(() => {
    let active = true
    const loadCustomers = async () => {
      setCustomersLoading(true)
      setCustomersError('')
      try {
        const response = await fetch('/api/customers')
        if (!response.ok) throw new Error('Kunden konnten nicht geladen werden')
        const data: Customer[] = await response.json()
        if (active) {
          setCustomers(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        if (active) {
          setCustomers([])
          setCustomersError('Kunden konnten nicht geladen werden')
        }
      } finally {
        if (active) setCustomersLoading(false)
      }
    }

    loadCustomers()

    return () => {
      active = false
    }
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (formData.customer && formData.amount) {
      const now = new Date()
      const dueDateRaw = formData.dueDate ? new Date(formData.dueDate) : null
      const dueDateEnd = dueDateRaw ? new Date(dueDateRaw) : null
      if (dueDateEnd) dueDateEnd.setHours(23, 59, 59, 999)
      const dueDateIsOverdue = dueDateEnd ? dueDateEnd.getTime() < now.getTime() : false
      const isPaid = formData.status === 'paid'
      const computedStatus: InvoiceData['status'] = isPaid ? 'paid' : dueDateIsOverdue ? 'overdue' : 'open'
      onSave({
        ...formData,
        status: computedStatus
      })
      setFormData(createDefaultFormData())
      onClose()
    }
  }

  if (!isOpen) return null

  const taxAmount = parseFloat(formData.amount || '0') * (parseFloat(formData.taxRate) / 100)
  const total = parseFloat(formData.amount || '0') + taxAmount
  const isEditing = Boolean(formData.id)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{isEditing ? 'Rechnung bearbeiten' : 'Neue Rechnung'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kunde</label>
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              disabled={customersLoading || customers.length === 0}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                {customersLoading ? 'Kunden werden geladen…' : customers.length ? 'Bitte Kunden wählen' : 'Keine Kunden vorhanden'}
              </option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.name}>
                  {customer.name}
                </option>
              ))}
            </select>
            {customersError && <p className="text-xs text-red-500 mt-1">{customersError}</p>}
            {!customersLoading && customers.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">Erstelle zuerst einen Kunden, damit du eine Rechnung zuweisen kannst.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Titel</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="z.B. Webdesign März"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Betrag (€)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Steuersatz (%)</label>
            <select
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">Keine Steuer</option>
              <option value="7">7%</option>
              <option value="19">19%</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fälligkeitsdatum</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="open">Offen</option>
              <option value="paid">Bezahlt</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Der Status wird automatisch auf „Überfällig" gesetzt, wenn das Fälligkeitsdatum überschritten ist.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Beschreibung</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Rechnungsdetails..."
              rows={3}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-md space-y-1">
            <div className="flex justify-between text-sm">
              <span>Nettobetrag:</span>
              <span>€ {parseFloat(formData.amount || '0').toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Steuern ({formData.taxRate}%):</span>
              <span>€ {taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
              <span>Gesamtbetrag:</span>
              <span>€ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Abbrechen
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
              {isEditing ? 'Speichern' : 'Rechnung erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
