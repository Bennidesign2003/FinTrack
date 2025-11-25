import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db'
import { invoices } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { customer, dueDate, description, title, status } = req.body
      const amount = Number(req.body.amount)
      const taxRate = Number(req.body.taxRate ?? 0)

      if (!customer || Number.isNaN(amount)) {
        return res.status(400).json({ error: 'customer und amount sind erforderlich' })
      }

      const taxAmount = +(amount * (taxRate / 100))
      const totalAmount = +(amount + taxAmount)

      const invoice = await db
        .insert(invoices)
        .values({
          customer,
          title: title || `Rechnung ${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7)}`,
          amount,
          taxRate,
          taxAmount,
          totalAmount,
          dueDate: dueDate || null,
          description: description || null,
          status: status === 'paid' || status === 'overdue' ? status : 'open'
        })
        .returning()

      const normalizedInvoice = {
        ...invoice[0],
        amount: Number(invoice[0]?.amount),
        taxRate: Number(invoice[0]?.taxRate),
        taxAmount: Number(invoice[0]?.taxAmount),
        totalAmount: Number(invoice[0]?.totalAmount),
        title: invoice[0]?.title || '',
        status: invoice[0]?.status || 'open'
      }

      return res.status(201).json(normalizedInvoice)
    } catch (error) {
      console.error('Error creating invoice:', error)
      return res.status(500).json({ error: 'Fehler beim Erstellen der Rechnung', details: String(error) })
    }
  } else if (req.method === 'GET') {
    try {
      const allInvoices = await db.select().from(invoices).all()
      const normalizedInvoices = allInvoices.map((inv: any) => ({
        ...inv,
        amount: Number(inv.amount),
        taxRate: Number(inv.taxRate),
        taxAmount: Number(inv.taxAmount),
        totalAmount: Number(inv.totalAmount),
        title: inv.title,
        status: inv.status || 'open'
      }))
      return res.status(200).json(normalizedInvoices)
    } catch (error) {
      console.error('Error fetching invoices:', error)
      return res.status(500).json({ error: 'Fehler beim Abrufen der Rechnungen', details: String(error) })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, customer, dueDate, description, title, status } = req.body
      const amount = Number(req.body.amount)
      const taxRate = Number(req.body.taxRate ?? 0)

      if (!id || !customer || Number.isNaN(amount)) {
        return res.status(400).json({ error: 'id, customer und amount sind erforderlich' })
      }

      const taxAmount = +(amount * (taxRate / 100))
      const totalAmount = +(amount + taxAmount)

      const updated = await db
        .update(invoices)
        .set({
          customer,
          title: title || `Rechnung ${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7)}`,
          amount,
          taxRate,
          taxAmount,
          totalAmount,
          dueDate: dueDate || null,
          description: description || null,
          updatedAt: new Date().toISOString(),
          status: status === 'paid' || status === 'overdue' ? status : 'open'
        })
        .where(eq(invoices.id, Number(id)))
        .returning()

      const normalizedInvoice = {
        ...updated[0],
        amount: Number(updated[0]?.amount),
        taxRate: Number(updated[0]?.taxRate),
        taxAmount: Number(updated[0]?.taxAmount),
        totalAmount: Number(updated[0]?.totalAmount),
        title: updated[0]?.title || '',
        status: updated[0]?.status || 'open'
      }

      return res.status(200).json(normalizedInvoice)
    } catch (error) {
      console.error('Error updating invoice:', error)
      return res.status(500).json({ error: 'Fehler beim Aktualisieren der Rechnung', details: String(error) })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'Ungültige ID' })
      }

      await db.delete(invoices).where(eq(invoices.id, Number(id))).run()
      return res.status(200).json({ message: 'Rechnung gelöscht' })
    } catch (error) {
      console.error('Error deleting invoice:', error)
      return res.status(500).json({ error: 'Fehler beim Löschen der Rechnung', details: String(error) })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
