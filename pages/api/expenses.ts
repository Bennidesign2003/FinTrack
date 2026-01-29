import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db'
import { expenses } from '@/db/schema'
import { eq } from 'drizzle-orm'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { category, amount, date, description } = req.body
      const parsedAmount = Number(amount)

      if (!category || Number.isNaN(parsedAmount)) {
        return res.status(400).json({ error: 'category und amount sind erforderlich' })
      }

      const result = await db
        .insert(expenses)
        .values({
          category,
          amount: parsedAmount,
          date: date || new Date().toISOString().split('T')[0],
          description: description || null
        })
        .run()

      // Fetch the created expense by using the last inserted rowid
      const created = await db
        .select()
        .from(expenses)
        .where(eq(expenses.id, result.lastInsertRowid as number))
        .get()

      const normalizedExpense = {
        ...created,
        amount: Number(created?.amount)
      }

      return res.status(201).json(normalizedExpense)
    } catch (error) {
      console.error('Error creating expense:', error)
      return res.status(500).json({ error: 'Fehler beim Erstellen der Ausgabe', details: String(error) })
    }
  } else if (req.method === 'GET') {
    try {
      const allExpenses = await db.select().from(expenses).all()
      const normalizedExpenses = allExpenses.map((exp: any) => ({
        ...exp,
        amount: Number(exp.amount)
      }))
      return res.status(200).json(normalizedExpenses)
    } catch (error) {
      console.error('Error fetching expenses:', error)
      return res.status(500).json({ error: 'Fehler beim Abrufen der Ausgaben', details: String(error) })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, category, amount, date, description } = req.body
      const parsedAmount = Number(amount)

      if (!id || !category || Number.isNaN(parsedAmount)) {
        return res.status(400).json({ error: 'id, category und amount sind erforderlich' })
      }

      const updated = await db
        .update(expenses)
        .set({
          category,
          amount: parsedAmount,
          date: date || new Date().toISOString().split('T')[0],
          description: description || null
        })
        .where(eq(expenses.id, Number(id)))
        .returning()

      const normalizedExpense = {
        ...updated[0],
        amount: Number(updated[0]?.amount)
      }

      return res.status(200).json(normalizedExpense)
    } catch (error) {
      console.error('Error updating expense:', error)
      return res.status(500).json({ error: 'Fehler beim Aktualisieren der Ausgabe', details: String(error) })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query
      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'Ungültige ID' })
      }

      await db.delete(expenses).where(eq(expenses.id, Number(id))).run()
      return res.status(200).json({ message: 'Ausgabe gelöscht' })
    } catch (error) {
      console.error('Error deleting expense:', error)
      return res.status(500).json({ error: 'Fehler beim Löschen der Ausgabe', details: String(error) })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
