'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useEffect, useState } from 'react'

ChartJS.register(ArcElement, Tooltip, Legend)

const chartTextColor = '#e2e8f0'
const tooltipBg = 'rgba(15,23,42,0.85)'
const tooltipBorder = 'rgba(226,232,240,0.35)'

const colors = [
  '#3b82f6', // blue - Material
  '#8b5cf6', // purple - Personal
  '#ec4899', // pink - Marketing
  '#f97316', // orange - Miete
  '#06b6d4', // cyan - Nebenkosten
  '#f59e0b', // amber - Transport
  '#10b981', // emerald - Software
  '#6366f1', // indigo - Bürobedarf
  '#6b7280'  // gray - Sonstiges
]

export default function ExpensesDistributionChart({ refreshKey }: { refreshKey?: number } = {}) {
  const [categories, setCategories] = useState<string[]>([])
  const [totals, setTotals] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const cacheBuster = new Date().getTime()
        const res = await fetch(`/api/expenses-distribution?t=${cacheBuster}`, { cache: 'no-store' })
        if (!mounted) return
        if (res.ok) {
          const json = await res.json()
          const cats: string[] = json.categories || []
          const tots: number[] = (json.totals || []).map((n: any) => Number(n || 0))
          setCategories(cats)
          setTotals(tots)
        } else {
          console.error('Failed to load /api/expenses-distribution', res.status)
        }
      } catch (e) {
        console.error('Exception loading expenses distribution:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [refreshKey])

  const data = {
    labels: categories.length ? categories : ['Keine Daten'],
    datasets: [
      {
        label: 'Ausgaben nach Kategorie',
        data: totals.length ? totals : [0],
        backgroundColor: colors.slice(0, Math.max(categories.length, 1)),
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: { size: 12 },
          padding: 10,
          boxWidth: 12,
          color: chartTextColor
        }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        bodyColor: chartTextColor,
        titleColor: chartTextColor,
        callbacks: {
          label: function (context: any) {
            const value = Number(context.parsed).toFixed(2)
            const total = totals.reduce((a, b) => a + b, 0)
            const percent = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0'
            return `€ ${value} (${percent}%)`
          }
        }
      }
    }
  }

  return (
    <div className="bg-transparent p-0">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-white/70">Ausgabenverteilung</div>
        {loading && <div className="text-xs text-white/60">Lädt…</div>}
      </div>
      {totals.length > 0 ? (
        <Pie options={options} data={data} />
      ) : (
        <div className="text-center py-8 text-white/70">Noch keine Ausgaben erfasst</div>
      )}
    </div>
  )
}
