import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useEffect, useState } from 'react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

function monthLabelFromYYYYMM(ym: string) {
  try {
    const [y, m] = ym.split('-').map(Number)
    const d = new Date(y, m - 1, 1)
    return new Intl.DateTimeFormat('de-DE', { month: 'short' }).format(d)
  } catch {
    return ym
  }
}

export default function LineChart({ refreshKey }: { refreshKey?: number } = {}) {
  const [labels, setLabels] = useState<string[]>([])
  const [values, setValues] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const chartTextColor = '#e2e8f0'
  const chartGridColor = 'rgba(226,232,240,0.15)'
  const tooltipBg = 'rgba(15,23,42,0.85)'
  const tooltipBorder = 'rgba(226,232,240,0.35)'

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/invoices', { cache: 'no-store' })
        if (!mounted) return
        if (res.ok) {
          const invoices = await res.json()
          // filter open invoices and sum totalAmount by createdAt year-month (YYYY-MM)
          const totalsByMonth: Record<string, number> = {}
          console.debug('LineChart: received invoices count', (invoices || []).length)
          if ((invoices || []).length > 0) console.debug('LineChart: first invoice sample', invoices[0])
          for (const inv of (invoices || [])) {
            if (!inv) continue
            const status = (inv.status || inv.state || '').toString().toLowerCase()
            if (status !== 'open') continue
            const dateStr = inv.createdAt || inv.created_at || inv.dueDate || inv.due_date || null
            if (!dateStr) continue
            // Parse ISO date strings: "2025-11-24 14:53:39" → YYYY-MM
            const dateMatch = String(dateStr).match(/(\d{4})-(\d{2})-(\d{2})/)
            if (!dateMatch) continue
            const [, y, m] = dateMatch
            const ym = `${y}-${m}`
            const rawAmt = inv.totalAmount ?? inv.total_amount ?? inv.total ?? inv.amount ?? 0
            // robust parse (handle strings, commas, NaN)
            const parsed = Number(String(rawAmt).replace(',', '.'))
            const amt = Number.isFinite(parsed) ? parsed : 0
            console.debug('LineChart: processing invoice', { id: inv.id, ym, rawAmt, parsed, amt })
            totalsByMonth[ym] = (totalsByMonth[ym] || 0) + amt
          }
          console.debug('totalsByMonth', totalsByMonth)
          // build last 12 months array (including current) to ensure consistent x-axis
          const months: string[] = []
          const now = new Date()
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
            // Format as YYYY-MM to match the regex parse from invoice dates
            const y = d.getFullYear()
            const m = String(d.getMonth() + 1).padStart(2, '0')
            const ym = `${y}-${m}`
            months.push(ym)
          }

          const totals = months.map((m) => {
            const v = Number(totalsByMonth[m] ?? 0)
            const result = Number.isFinite(v) ? Math.max(0, v) : 0
            console.debug(`LineChart: month ${m} -> totalsByMonth[${m}]=${totalsByMonth[m]} -> result=${result}`)
            return result
          })
          // helpful debug: months (YYYY-MM) and totals (numbers)
          console.debug('LineChart: months/totals', months, totals)
          console.debug('LineChart: final values array:', totals)
          setLabels(months.map(monthLabelFromYYYYMM))
          setValues(totals)
        } else {
          console.error('Failed to load /api/invoices', res.status)
        }
      } catch (e) {
        console.error('Exception loading invoices:', e)
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
    labels: labels.length ? labels : ['–'],
    datasets: [
      {
        label: 'Offene Rechnungen (Gesamt €)',
        data: values.length ? values : [0],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.15)',
        fill: true,
        tension: 0.3
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        bodyColor: chartTextColor,
        titleColor: chartTextColor,
        callbacks: {
          label: function (context: any) {
            try {
              const value = Number(context.parsed.y)
              return `€ ${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            } catch {
              return context.parsed.y
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: chartGridColor },
        ticks: { color: chartTextColor }
      },
      y: {
        min: 0,
        grid: { color: chartGridColor },
        ticks: {
          color: chartTextColor,
          stepSize: 1,
          callback: function (value: any) {
            try {
              return `€ ${Number(value).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            } catch {
              return value
            }
          }
        }
      }
    }
  }

  return (
    <div className="bg-transparent p-0">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70 mb-3">Offene Rechnung Entwicklung</div>
        {loading && <div className="text-xs text-white/60">Lädt…</div>}
      </div>
      <Line options={options} data={data} />
    </div>
  )
}
