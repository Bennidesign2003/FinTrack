import React from 'react'

type DraggableProps = {
  id: string
  children: React.ReactNode
  onDropItem?: (sourceId: string, targetId: string) => void
  onDragStartItem?: (id: string) => void
  onDragEnterItem?: (id: string, e: React.DragEvent<HTMLDivElement>) => void
  onDragOverItem?: (id: string, e: React.DragEvent<HTMLDivElement>) => void
  onDragEndItem?: () => void
  className?: string
  style?: React.CSSProperties
}

export default function Draggable({
  id,
  children,
  onDropItem,
  onDragStartItem,
  onDragEnterItem,
  onDragOverItem,
  onDragEndItem,
  className = '',
  style = {}
}: DraggableProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
    onDragStartItem && onDragStartItem(id)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    onDragOverItem && onDragOverItem(id, e)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onDragEnterItem && onDragEnterItem(id, e)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const sourceId = e.dataTransfer.getData('text/plain')
    const targetId = id
    console.debug(`Draggable: drop source=${sourceId} on target=${targetId}`)
    if (sourceId && sourceId !== targetId) {
      onDropItem && onDropItem(sourceId, targetId)
    }
    onDragEndItem && onDragEndItem()
  }

  const handleDragEnd = () => {
    onDragEndItem && onDragEndItem()
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`${className} cursor-move`}
      style={style}
      aria-grabbed="false"
    >
      {children}
    </div>
  )
}
