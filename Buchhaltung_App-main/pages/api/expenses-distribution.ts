import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db'
import { expenses } from '@/db/schema'
import { sql } from 'drizzle-orm'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // get grouped sums per category from expenses, filtering out zero/null amounts
    const rows: any = await db
      .select({ category: expenses.category, total: sql`COALESCE(SUM(${expenses.amount}),0)` })
      .from(expenses)
      .groupBy(expenses.category)
      .having(sql`SUM(${expenses.amount}) > 0`)
      .orderBy(sql`SUM(${expenses.amount}) DESC`)
      .all()

    const categories = rows.map((r: any) => r.category || 'Sonstiges')
    const totals = rows.map((r: any) => Number(r.total ?? 0))

    return res.status(200).json({ categories, totals })
  } catch (error) {
    console.error('Error fetching expenses distribution:', error)
    return res.status(500).json({ error: 'Fehler beim Abrufen der Ausgabenverteilung', details: String(error) })
  }
}
