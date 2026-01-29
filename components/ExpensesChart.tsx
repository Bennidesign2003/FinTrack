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

export default function ExpensesChart({ refreshKey }: { refreshKey?: number } = {}) {
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
        const res = await fetch('/api/expenses-trend', { cache: 'no-store' })
        if (!mounted) return
        if (res.ok) {
          const json = await res.json()
          const months: string[] = json.months || []
          const totals: number[] = (json.totals || []).map((n: any) => Number(n || 0))
          setLabels(months.map(monthLabelFromYYYYMM))
          setValues(totals)
        } else {
          console.error('Failed to load /api/expenses-trend', res.status)
        }
      } catch (e) {
        console.error('Exception loading expenses:', e)
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
        label: 'Ausgaben (Gesamt €)',
        data: values.length ? values : [0],
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220,38,38,0.15)',
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
        <div className="text-sm text-white/70 mb-3">Ausgabenentwicklung</div>
        {loading && <div className="text-xs text-white/60">Lädt…</div>}
      </div>
      <Line options={options} data={data} />
    </div>
  )
}
