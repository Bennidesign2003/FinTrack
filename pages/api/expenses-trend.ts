import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db'
import { expenses } from '@/db/schema'
import { sql } from 'drizzle-orm'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // get grouped sums per month from expenses
    const rows: any = await db
      .select({ month: sql`strftime('%Y-%m', ${expenses.createdAt})`, total: sql`COALESCE(SUM(${expenses.amount}),0)` })
      .from(expenses)
      .groupBy(sql`strftime('%Y-%m', ${expenses.createdAt})`)
      .all()

    // build last 12 months array (including current)
    const months: string[] = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const ym = d.toISOString().slice(0, 7) // YYYY-MM
      months.push(ym)
    }

    const map: Record<string, number> = {}
    rows.forEach((r: any) => {
      if (r && r.month) map[r.month] = Number(r.total ?? 0)
    })

    const totals = months.map(m => map[m] ?? 0)

    return res.status(200).json({ months, totals })
  } catch (error) {
    console.error('Error fetching expenses series:', error)
    return res.status(500).json({ error: 'Fehler beim Abrufen der Ausgabedaten', details: String(error) })
  }
}
