 'use client'

import { useEffect, useState } from 'react'

function StatCard({ title, value, diff, color = 'green' }: { title: string; value: string; diff?: string | null; color?: string }) {
  const diffColor = color === 'green' ? 'text-emerald-300' : 'text-rose-300'
  return (
    <div className="p-4 rounded-2xl">
      <div className="text-xs uppercase tracking-wider text-white/60">{title}</div>
      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-white">{value}</div>
        {diff && <div className={`text-sm ${diffColor}`}>{diff}</div>}
      </div>
    </div>
  )
}

export default function DashboardCards({ refreshTrigger }: { refreshTrigger?: number }) {
  const [stats, setStats] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' })
        if (!mounted) return
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        } else {
          const text = await res.text()
          console.error('Fehler beim Laden von /api/stats:', res.status, text)
          setStats({ error: true })
        }
      } catch (e) {
        console.error('Exception beim Laden von /api/stats:', e)
        setStats({ error: true })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [refreshTrigger])

  const format = (v: number) => `€ ${Number(v ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const formatPct = (p: number | null | undefined) => (p === null || p === undefined ? null : `${p > 0 ? '+' : ''}${p.toFixed(1)}% vs. Vormonat`)

  // while loading or error, show placeholders but avoid rendering the '–' forever
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Gesamtumsatz" value={loading ? 'Lädt…' : '–'} diff={null} />
        <StatCard title="Offene Rechnungen" value={loading ? 'Lädt…' : '–'} diff={null} />
        <StatCard title="Ausgaben" value={loading ? 'Lädt…' : '–'} diff={null} color="red" />
        <StatCard title="Gewinn" value={loading ? 'Lädt…' : '–'} diff={null} />
      </div>
    )
  }

  // if API returned an error object, show zeros (better than '–') so values update visibly
  if (stats.error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Gesamtumsatz" value={format(0)} diff={null} color="green" />
        <StatCard title="Offene Rechnungen" value={format(0)} diff={`0 Rechnungen`} color="green" />
        <StatCard title="Ausgaben" value={format(0)} diff={null} color="red" />
        <StatCard title="Gewinn" value={format(0)} diff={null} color="green" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Gesamtumsatz" value={format(stats.totalRevenue ?? 0)} diff={formatPct(stats.revenuePct)} color="green" />
      <StatCard title="Offene Rechnungen" value={format(stats.openSum ?? 0)} diff={`${Number(stats.openCount ?? 0)} Rechnungen`} color="green" />
      <StatCard title="Ausgaben" value={format(stats.totalExpenses ?? 0)} diff={formatPct(stats.expPct)} color="red" />
      <StatCard title="Gewinn" value={format(stats.profit ?? 0)} diff={formatPct(stats.profitPct)} color="green" />
    </div>
  )
}
