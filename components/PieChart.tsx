import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

const chartTextColor = '#e2e8f0'
const tooltipBg = 'rgba(15,23,42,0.85)'
const tooltipBorder = 'rgba(226,232,240,0.35)'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function PieChart() {
  const data = {
    labels: ['Personal', 'Miete', 'Material', 'Marketing', 'Sonstiges'],
    datasets: [
      {
        data: [41, 22, 12, 10, 15],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: chartTextColor }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        bodyColor: chartTextColor,
        titleColor: chartTextColor
      }
    }
  }


  return (
    <div className="bg-transparent p-0">
      <div className="text-sm text-white/70 mb-3">Ausgabenverteilung</div>
      <Pie data={data} options={options} />
    </div>
  )
}
