'use client'

import { Timeline } from './timeline'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Clock, Plus } from 'lucide-react'
import { Button } from './button'
import { useState } from 'react'
import { TimelineEventModal } from './timeline-event-modal'
import { TimelineEventFormData } from '@/lib/types/timeline'
import { useTimeline } from '@/hooks/useTimeline'

interface TimelineWidgetProps {
  clienteId: string
  maxEvents?: number
  showAddButton?: boolean
}

export function TimelineWidget({ 
  clienteId, 
  maxEvents = 5, 
  showAddButton = true 
}: TimelineWidgetProps) {
  const { addEvent } = useTimeline(clienteId)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddEvent = async (data: TimelineEventFormData) => {
    await addEvent(data)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-600" />
          Linha do Tempo
        </CardTitle>
        {showAddButton && (
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Evento
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Timeline
          clienteId={clienteId}
          showStats={false}
          showActions={false}
          maxEvents={maxEvents}
        />
      </CardContent>

      {/* Modal para adicionar evento */}
      <TimelineEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEvent}
        clienteId={clienteId}
      />
    </Card>
  )
}
