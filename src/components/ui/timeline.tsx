'use client'

import { useState } from 'react'
import { TimelineEvent, TimelineEventFormData } from '@/lib/types/timeline'
import { useTimeline } from '@/hooks/useTimeline'
import { TimelineEventCard } from './timeline-event-card'
import { TimelineVisual } from './timeline-visual'
import { TimelineHorizontal } from './timeline-horizontal'
import { TimelineLegend } from './timeline-legend'
import { TimelineFilters } from './timeline-filters'
import { TimelineEventModal } from './timeline-event-modal'
import { TimelineStatsPremium } from './timeline-stats-premium'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Plus, Clock, TrendingUp, Trophy, AlertTriangle, List, BarChart3, ArrowRight } from 'lucide-react'
import { ConfirmModal } from './confirm-modal'

interface TimelineProps {
  clienteId: string | undefined
  cliente?: any // Dados do cliente para o evento de cadastro
  showStats?: boolean
  showActions?: boolean
  maxEvents?: number
  visualMode?: boolean
}

export function Timeline({ 
  clienteId, 
  cliente,
  showStats = true, 
  showActions = true,
  maxEvents,
  visualMode = true
}: TimelineProps) {
  if (!clienteId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Cliente não selecionado</p>
            <p className="text-sm">
              Selecione um cliente para visualizar sua timeline
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  const {
    eventos,
    stats,
    loading,
    error,
    filters,
    setFilters,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents,
    refreshStats
  } = useTimeline(clienteId)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'horizontal' | 'vertical' | 'list'>(visualMode ? 'horizontal' : 'list')

  const handleAddEvent = async (data: TimelineEventFormData) => {
    await addEvent(data)
  }

  const handleUpdateEvent = async (data: TimelineEventFormData) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, data)
      setEditingEvent(null)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    await deleteEvent(id)
    setDeletingEventId(null)
  }

  const handleEditEvent = (evento: TimelineEvent) => {
    setEditingEvent(evento)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setDeletingEventId(id)
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  const displayedEvents = maxEvents ? eventos.slice(0, maxEvents) : eventos

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>Erro ao carregar timeline: {error}</p>
            <Button 
              variant="outline" 
              onClick={refreshEvents}
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
             {/* Estatísticas Premium */}
       {showStats && stats && (
         <TimelineStatsPremium stats={stats} cliente={cliente} />
       )}

      {/* Cabeçalho com ações */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Linha do Tempo</h2>
          <p className="text-gray-600">
            Histórico completo de eventos e interações
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Toggle de visualização */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'horizontal' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('horizontal')}
              className="h-8 px-3"
            >
              <ArrowRight className="w-4 h-4 mr-1" />
              Horizontal
            </Button>
            <Button
              variant={viewMode === 'vertical' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('vertical')}
              className="h-8 px-3"
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              Vertical
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="w-4 h-4 mr-1" />
              Lista
            </Button>
          </div>
          
          {showActions && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <TimelineFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        onRefresh={refreshEvents}
        loading={loading}
      />

      {/* Legenda (apenas no modo vertical) */}
      {viewMode === 'vertical' && (
        <TimelineLegend className="mb-4" />
      )}

      {/* Lista de eventos */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Carregando eventos...</p>
          </div>
        ) : displayedEvents.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Nenhum evento encontrado</p>
                <p className="text-sm">
                  {Object.values(filters).some(v => v !== undefined && v !== '') 
                    ? 'Tente ajustar os filtros aplicados'
                    : 'Comece adicionando o primeiro evento da timeline'
                  }
                </p>
                {showActions && !Object.values(filters).some(v => v !== undefined && v !== '') && (
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Evento
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'horizontal' ? (
          <>
                         <TimelineHorizontal
               eventos={displayedEvents}
               cliente={cliente}
               onEdit={showActions ? handleEditEvent : undefined}
               onDelete={showActions ? handleDeleteClick : undefined}
               showActions={showActions}
             />
            
            {maxEvents && eventos.length > maxEvents && (
              <div className="text-center py-4">
                <Badge variant="outline" className="text-sm">
                  Mostrando {maxEvents} de {eventos.length} eventos
                </Badge>
              </div>
            )}
          </>
        ) : viewMode === 'vertical' ? (
          <>
            <TimelineVisual
              eventos={displayedEvents}
              onEdit={showActions ? handleEditEvent : undefined}
              onDelete={showActions ? handleDeleteClick : undefined}
              showActions={showActions}
            />
            
            {maxEvents && eventos.length > maxEvents && (
              <div className="text-center py-4">
                <Badge variant="outline" className="text-sm">
                  Mostrando {maxEvents} de {eventos.length} eventos
                </Badge>
              </div>
            )}
          </>
        ) : (
          <>
            {displayedEvents.map((evento) => (
              <TimelineEventCard
                key={evento.id}
                evento={evento}
                onEdit={showActions ? handleEditEvent : undefined}
                onDelete={showActions ? handleDeleteClick : undefined}
                showActions={showActions}
              />
            ))}
            
            {maxEvents && eventos.length > maxEvents && (
              <div className="text-center py-4">
                <Badge variant="outline" className="text-sm">
                  Mostrando {maxEvents} de {eventos.length} eventos
                </Badge>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal para adicionar/editar evento */}
      <TimelineEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingEvent(null)
        }}
        onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
        evento={editingEvent}
        clienteId={clienteId}
        loading={loading}
      />

      {/* Modal de confirmação para deletar */}
      <ConfirmModal
        isOpen={!!deletingEventId}
        onClose={() => setDeletingEventId(null)}
        onConfirm={() => deletingEventId && handleDeleteEvent(deletingEventId)}
        title="Excluir Evento"
        message="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}
