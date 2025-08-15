'use client'

import { TimelineEvent, TimelineEventImportance, timelineEventConfig } from '@/lib/types/timeline'
import { Card, CardContent } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { Edit, Trash2, Calendar, User } from 'lucide-react'
import { useState } from 'react'
import { ConfirmModal } from './confirm-modal'

interface TimelineVisualProps {
  eventos: TimelineEvent[]
  onEdit?: (evento: TimelineEvent) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

// Configuração de altura baseada na importância
const getHeightByImportance = (importancia: TimelineEventImportance): number => {
  switch (importancia) {
    case 'baixo': return 60
    case 'medio': return 80
    case 'alto': return 100
    case 'critico': return 120
    case 'celebrativo': return 90
    default: return 80
  }
}

// Configuração de cor baseada na importância
const getColorByImportance = (importancia: TimelineEventImportance): string => {
  switch (importancia) {
    case 'baixo': return 'bg-blue-200 border-blue-300'
    case 'medio': return 'bg-blue-300 border-blue-400'
    case 'alto': return 'bg-blue-500 border-blue-600'
    case 'critico': return 'bg-red-500 border-red-600'
    case 'celebrativo': return 'bg-green-500 border-green-600'
    default: return 'bg-blue-300 border-blue-400'
  }
}

// Configuração de cor do texto baseada na importância
const getTextColorByImportance = (importancia: TimelineEventImportance): string => {
  switch (importancia) {
    case 'baixo': return 'text-blue-800'
    case 'medio': return 'text-blue-900'
    case 'alto': return 'text-white'
    case 'critico': return 'text-white'
    case 'celebrativo': return 'text-white'
    default: return 'text-blue-900'
  }
}

export function TimelineVisual({ 
  eventos, 
  onEdit, 
  onDelete, 
  showActions = true 
}: TimelineVisualProps) {
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)

  const handleDeleteClick = (id: string) => {
    setDeletingEventId(id)
  }

  const handleDeleteConfirm = async (id: string) => {
    if (onDelete) {
      await onDelete(id)
    }
    setDeletingEventId(null)
  }

  if (eventos.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-lg font-medium">Nenhum evento encontrado</p>
            <p className="text-sm">
              Comece adicionando o primeiro evento da timeline
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative">
             {/* Linha temporal base */}
       <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-300">
         {/* Seta no final */}
         <div className="absolute -bottom-2 -right-1 w-0 h-0 border-l-4 border-l-gray-300 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
       </div>

             {/* Container dos eventos */}
       <div className="space-y-6">
        {eventos.map((evento, index) => {
          const height = getHeightByImportance(evento.importancia)
          const colorClass = getColorByImportance(evento.importancia)
          const textColorClass = getTextColorByImportance(evento.importancia)
          const config = timelineEventConfig[evento.tipo]

          return (
                         <div key={evento.id} className="relative flex items-start">
               {/* Ponto de ancoragem na linha temporal */}
               <div className="absolute left-6 top-6 w-4 h-4 bg-white border-2 border-gray-300 rounded-full z-10"></div>
               
               {/* Linha pontilhada vertical */}
               <div 
                 className="absolute left-7 top-10 w-0.5 timeline-dashed-line"
                 style={{ height: `${Math.min(height * 0.5, 40)}px` }}
               ></div>

               {/* Marcador em forma de pino/gotícula */}
               <div 
                 className={`absolute left-4 top-10 ${colorClass} border-2 z-20 timeline-marker`}
                 style={{ 
                   height: `${Math.min(height * 0.3, 24)}px`,
                   width: `${Math.min(height * 0.3, 24)}px`,
                   marginTop: `-${Math.min(height * 0.15, 12)}px`
                 }}
               ></div>

                             {/* Conteúdo do evento */}
               <div 
                 className="ml-16 bg-white border border-gray-200 rounded-lg shadow-sm p-4 min-w-0 flex-1 timeline-event-card timeline-event-enter"
                 style={{ marginTop: `${Math.min(height * 0.2, 16)}px` }}
               >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Cabeçalho do evento */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{config?.icon}</span>
                      <h3 className={`font-semibold ${textColorClass} text-lg`}>
                        {evento.titulo}
                      </h3>
                      <Badge 
                        variant={evento.importancia === 'critico' ? 'destructive' : 'default'}
                        className="ml-auto"
                      >
                        {evento.importancia}
                      </Badge>
                    </div>

                    {/* Descrição */}
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {evento.descricao}
                    </p>

                    {/* Metadados */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {evento.data.toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {evento.autor}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {config?.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Ações */}
                  {showActions && (
                    <div className="flex items-center gap-1">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(evento)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(evento.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de confirmação para deletar */}
      <ConfirmModal
        isOpen={!!deletingEventId}
        onClose={() => setDeletingEventId(null)}
        onConfirm={() => deletingEventId && handleDeleteConfirm(deletingEventId)}
        title="Excluir Evento"
        message="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  )
}
