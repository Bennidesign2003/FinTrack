import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/db'
import { invoices, expenses } from '@/db/schema'
import { sql } from 'drizzle-orm'

function formatPercent(current: number, previous: number) {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // total revenue (all time)
    const totalRes: any = await db
      .select({ total: sql`COALESCE(SUM(${invoices.totalAmount}), 0)` })
      .from(invoices)
      .all()

    const totalRevenue = Number(totalRes[0]?.total ?? 0)

    // open invoices sum and count
    const openRes: any = await db
      .select({ sumOpen: sql`COALESCE(SUM(${invoices.totalAmount}), 0)`, countOpen: sql`COALESCE(COUNT(*),0)` })
      .from(invoices)
      .where(sql`${invoices.status} = 'open'`)
      .all()

    const openSum = Number(openRes[0]?.sumOpen ?? 0)
    const openCount = Number(openRes[0]?.countOpen ?? 0)

    // expenses total (all time)
    const expRes: any = await db.select({ totalExp: sql`COALESCE(SUM(${expenses.amount}),0)` }).from(expenses).all()
    const totalExpenses = Number(expRes[0]?.totalExp ?? 0)

    // profit = revenue - expenses
    const profit = totalRevenue - totalExpenses

    // calculate month-over-month for revenue
    const now = new Date()
    const curMonth = now.toISOString().slice(0, 7) // YYYY-MM
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevMonth = prev.toISOString().slice(0, 7)

    const revenueCurRes: any = await db
      .select({ total: sql`COALESCE(SUM(${invoices.totalAmount}),0)` })
      .from(invoices)
      .where(sql`strftime('%Y-%m', ${invoices.createdAt}) = ${curMonth}`)
      .all()

    const revenuePrevRes: any = await db
      .select({ total: sql`COALESCE(SUM(${invoices.totalAmount}),0)` })
      .from(invoices)
      .where(sql`strftime('%Y-%m', ${invoices.createdAt}) = ${prevMonth}`)
      .all()

    const revenueCur = Number(revenueCurRes[0]?.total ?? 0)
    const revenuePrev = Number(revenuePrevRes[0]?.total ?? 0)
    const revenuePct = formatPercent(revenueCur, revenuePrev)

    // expenses month-over-month (similar)
    const expCurRes: any = await db
      .select({ total: sql`COALESCE(SUM(${expenses.amount}),0)` })
      .from(expenses)
      .where(sql`strftime('%Y-%m', ${expenses.createdAt}) = ${curMonth}`)
      .all()

    const expPrevRes: any = await db
      .select({ total: sql`COALESCE(SUM(${expenses.amount}),0)` })
      .from(expenses)
      .where(sql`strftime('%Y-%m', ${expenses.createdAt}) = ${prevMonth}`)
      .all()

    const expCur = Number(expCurRes[0]?.total ?? 0)
    const expPrev = Number(expPrevRes[0]?.total ?? 0)
    const expPct = formatPercent(expCur, expPrev)

    // profit pct change compared to previous month profit
    const profitCur = revenueCur - expCur
    const profitPrev = revenuePrev - expPrev
    const profitPct = formatPercent(profitCur, profitPrev)

    return res.status(200).json({
      totalRevenue,
      revenueCur,
      revenuePrev,
      revenuePct,
      openSum,
      openCount,
      totalExpenses,
      expCur,
      expPrev,
      expPct,
      profit,
      profitCur,
      profitPrev,
      profitPct
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return res.status(500).json({ error: 'Fehler beim Abrufen der Statistiken', details: String(error) })
  }
}
