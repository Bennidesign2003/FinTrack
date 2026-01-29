import { useEffect, useState, type DragEvent } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import DashboardCards from '../components/DashboardCards'
import LineChart from '../components/LineChart'
import ExpensesChart from '../components/ExpensesChart'
import ExpensesDistributionChart from '../components/ExpensesDistributionChart'
import TransactionList from '../components/TransactionList'
import QuickActions from '../components/QuickActions'
import PieChart from '../components/PieChart'
import InvoiceModal from '../components/InvoiceModal'
import CustomerModal from '../components/CustomerModal'
import ExpenseModal from '../components/ExpenseModal'
import Draggable from '../components/Draggable'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const defaultOrder = ['chart', 'expenses-chart', 'invoices', 'expenses-dist', 'quick']
  // initialize with server-safe default; read saved order on client after mount to avoid hydration mismatch
  const [order, setOrder] = useState<string[]>(defaultOrder)
  const glassPanel = 'rounded-3xl border border-white/20 bg-white/5 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl'
  const heroCardClass = 'rounded-3xl border border-white/30 bg-white/10 shadow-[0_25px_60px_rgba(15,23,42,0.45)] backdrop-blur-2xl px-5 py-6'

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dashboardOrder')
      if (raw) setOrder(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('dashboardOrder', JSON.stringify(order))
    } catch (e) {
      // ignore
    }
  }, [order])

  // move source before target (insert semantics) to avoid grid reflow issues
  const moveOrder = (sourceId: string, targetId: string, insertAfter = false) => {
    setOrder(prev => {
      const srcIdx = prev.indexOf(sourceId)
      const tgtIdx = prev.indexOf(targetId)
      if (srcIdx === -1 || tgtIdx === -1 || srcIdx === tgtIdx) return prev
      // Remove source item
      const next = prev.filter((_, i) => i !== srcIdx)
      // Insert relative to target placement
      const newTgtIdx = next.indexOf(targetId)
      if (newTgtIdx === -1) return prev
      const insertIdx = insertAfter ? newTgtIdx + 1 : newTgtIdx
      next.splice(insertIdx, 0, sourceId)
      return next
    })
  }

  // drag state for visual placeholder behavior
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [hoverTarget, setHoverTarget] = useState<string | null>(null)
  const [hoverPlacement, setHoverPlacement] = useState<'before' | 'after'>('before')

  const handleDragStart = (id: string) => {
    setDraggingId(id)
    setHoverTarget(null)
    setHoverPlacement('before')
  }

  const determinePlacement = (e: DragEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const horizontal = rect.width >= rect.height
    const length = horizontal ? rect.width : rect.height
    const offset = horizontal ? e.clientX - rect.left : e.clientY - rect.top
    const edgePadding = Math.max(1, length * 0.25)
    const movement = horizontal ? e.movementX : e.movementY
    const draggingForward = movement > 0
    const draggingBackward = movement < 0

    if (offset <= edgePadding) {
      return draggingForward ? 'after' : 'before'
    }
    if (offset >= length - edgePadding) {
      return draggingBackward ? 'before' : 'after'
    }
    return offset > length / 2 ? 'after' : 'before'
  }

  const handleDragEnter = (id: string, e: DragEvent<HTMLDivElement>) => {
    if (id !== draggingId) {
      setHoverTarget(id)
      setHoverPlacement(determinePlacement(e))
    }
  }

  const handleDragOverItem = (id: string, e: DragEvent<HTMLDivElement>) => {
    if (id !== draggingId) {
      setHoverTarget(id)
      setHoverPlacement(determinePlacement(e))
    }
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setHoverTarget(null)
    setHoverPlacement('before')
  }

  const handleDrop = (sourceId: string, targetId: string, placement?: 'before' | 'after') => {
    const resolvedPlacement = placement ?? hoverPlacement
    // perform move (insert) on drop
    moveOrder(sourceId, targetId, resolvedPlacement === 'after')
    // reset drag state
    setDraggingId(null)
    setHoverTarget(null)
    setHoverPlacement('before')
  }

  const getSpanSize = (key: string) => (['chart', 'expenses-chart', 'invoices'].includes(key) ? 2 : 1)

  const renderWidget = (key: string) => {
    const spanSize = getSpanSize(key)
    const showDropZone = !!draggingId && draggingId !== key

    const renderContent = () => {
      if (key === 'chart') return <LineChart refreshKey={refreshKey} />
      if (key === 'expenses-chart') return <ExpensesChart refreshKey={refreshKey} />
      if (key === 'invoices') return <TransactionList refreshTrigger={refreshKey} />
      if (key === 'pie') return <PieChart />
      if (key === 'expenses-dist') return <ExpensesDistributionChart refreshKey={refreshKey} />
      if (key === 'quick') return (
        <QuickActions
          onNewInvoice={() => setIsModalOpen(true)}
          onNewCustomer={() => setIsCustomerModalOpen(true)}
          onNewExpense={() => setIsExpenseModalOpen(true)}
        />
      )
      return null
    }

    const content = renderContent()
    if (!content) return null

    return (
      <div key={key} style={{ gridColumn: `span ${spanSize}`, position: 'relative', overflow: 'visible' }}>
        <Draggable
          id={key}
          onDropItem={handleDrop}
          onDragStartItem={handleDragStart}
          onDragEnterItem={handleDragEnter}
          onDragOverItem={handleDragOverItem}
          onDragEndItem={handleDragEnd}
          className={key === 'chart' || key === 'expenses-chart' || key === 'invoices' ? 'cursor-move' : 'cursor-move'}
          style={{ width: '100%' }}
        >
          <div className="rounded-3xl border border-white/20 bg-white/5 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-2xl p-6">
            {content}
          </div>
        </Draggable>
        {showDropZone && (
          <div
            className={`transition-colors duration-150 ${hoverTarget === key && hoverPlacement === 'after' ? 'border-blue-400 bg-blue-50' : 'border-transparent'}`}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -20,
              height: 32,
              borderRadius: 8,
              borderWidth: 1,
              borderStyle: 'dashed',
              zIndex: 20,
              pointerEvents: 'auto'
            }}
            onDragOver={e => {
              e.preventDefault()
              e.stopPropagation()
              setHoverTarget(key)
              setHoverPlacement('after')
            }}
            onDrop={e => {
              e.preventDefault()
              e.stopPropagation()
              if (draggingId && draggingId !== key) {
                handleDrop(draggingId, key, 'after')
              }
            }}
          >
            {hoverTarget === key && hoverPlacement === 'after' && (
              <div
                className={`${glassPanel} h-full flex items-center justify-center text-xs text-white/70 font-semibold border-dashed border-white/30`}
              >
                Hier platzieren
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const handleSaveInvoice = async (data: any) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Rechnung für ${data.customer} erstellt: €${data.amount}`)
        console.log('Rechnung gespeichert:', result)
        setRefreshKey(prev => prev + 1)
        setIsModalOpen(false)
      } else {
        alert('Fehler beim Speichern der Rechnung')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Fehler beim Speichern der Rechnung')
    }
  }

  const handleSaveCustomer = async (data: any) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Kunde "${data.name}" erstellt`)
        console.log('Kunde gespeichert:', result)
        setIsCustomerModalOpen(false)
      } else {
        const err = await response.json()
        alert(err.error || 'Fehler beim Speichern des Kunden')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Fehler beim Speichern des Kunden')
    }
  }

  const handleSaveExpense = async (data: any) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Ausgabe "${data.category}" erstellt: €${data.amount}`)
        console.log('Ausgabe gespeichert:', result)
        setRefreshKey(prev => prev + 1)
        setIsExpenseModalOpen(false)
      } else {
        alert('Fehler beim Speichern der Ausgabe')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Fehler beim Speichern der Ausgabe')
    }
  }

  return (
    <div
      className="flex min-h-screen"
      style={{
        background:
          'radial-gradient(circle at top, rgba(255,255,255,0.4), rgba(209,213,219,0.5) 45%, transparent 60%), linear-gradient(120deg, #0f172a, #1d4ed8)'
      }}
    >
      <Sidebar />

      <div className="flex-1 p-8 space-y-6">
        <Header onNewInvoice={() => setIsModalOpen(true)} />

        <div className="grid gap-4 md:grid-cols-3">
          {(() => {
            const activeModals = [isModalOpen, isCustomerModalOpen, isExpenseModalOpen].filter(Boolean).length
            const heroCards = [
              { label: 'Widgets', value: `${order.length}`, meta: 'Individuell anordnen' },
              { label: 'Refresh-Zyklen', value: `${refreshKey}`, meta: 'Datenaktualisierungen' },
              { label: 'Modale offen', value: `${activeModals}`, meta: 'Schnellaktionen' }
            ]

            return heroCards.map(card => (
              <div key={card.label} className={heroCardClass}>
                <p className="text-xs uppercase tracking-wider text-white/60">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                <p className="text-xs text-white/60 mt-1">{card.meta}</p>
              </div>
            ))
          })()}
        </div>

        <div className={`${glassPanel} p-6`}>
          <DashboardCards refreshTrigger={refreshKey} />
        </div>

        <div
          className={`${glassPanel} p-6`}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gridAutoRows: 'auto',
            gridAutoFlow: 'dense',
            gap: '1.5rem'
          }}
        >
          {(() => {
            // During drag, show placeholder at target position
            if (draggingId && hoverTarget && draggingId !== hoverTarget) {
              const srcIdx = order.indexOf(draggingId)
              const tgtIdx = order.indexOf(hoverTarget)
              if (srcIdx !== -1 && tgtIdx !== -1) {
                // Create visual order: remove source, insert placeholder at target (before/after depending on hoverPlacement)
                const vis = [...order]
                vis.splice(srcIdx, 1) // remove source
                const newTgtIdx = vis.indexOf(hoverTarget)
                if (newTgtIdx !== -1) {
                  const insertPos = hoverPlacement === 'after' ? newTgtIdx + 1 : newTgtIdx
                  vis.splice(insertPos, 0, 'PLACEHOLDER')

                  return vis.map((k) => {
                    if (k === 'PLACEHOLDER') {
                      const spanSize = ['chart', 'expenses-chart', 'invoices'].includes(hoverTarget) ? 2 : 1
                      return (
                        <div
                          key="placeholder"
                          style={{ gridColumn: `span ${spanSize}` }}
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => {
                            e.preventDefault()
                            if (draggingId && hoverTarget) {
                              handleDrop(draggingId, hoverTarget, hoverPlacement)
                            }
                          }}
                        >
                          <div
                            className={`${glassPanel} h-40 flex items-center justify-center text-gray-200 text-xs font-semibold border-dashed border-white/40`}
                          >
                            Hier platzieren
                          </div>
                        </div>
                      )
                    }
                    return renderWidget(k)
                  })
                }
              }
            }

            // Default: show normal order
            return order.map(k => renderWidget(k))
          })()}
        </div>
      </div>

      <InvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveInvoice} />
      <CustomerModal isOpen={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} onSave={handleSaveCustomer} />
      <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} onSave={handleSaveExpense} />
    </div>
  )
}
