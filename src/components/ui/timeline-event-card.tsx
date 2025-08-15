'use client'

import { TimelineEvent, timelineEventConfig } from '@/lib/types/timeline'
import { Card, CardContent, CardHeader } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { Calendar, User, Edit, Trash2, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface TimelineEventCardProps {
  evento: TimelineEvent
  onEdit?: (evento: TimelineEvent) => void
  onDelete?: (id: string) => void
  onView?: (evento: TimelineEvent) => void
  showActions?: boolean
}

const getImportanceColor = (importancia: TimelineEvent['importancia']) => {
  switch (importancia) {
    case 'baixo':
      return 'bg-gray-100 text-gray-700'
    case 'medio':
      return 'bg-blue-100 text-blue-700'
    case 'alto':
      return 'bg-orange-100 text-orange-700'
    case 'critico':
      return 'bg-red-100 text-red-700'
    case 'celebrativo':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getImportanceLabel = (importancia: TimelineEvent['importancia']) => {
  switch (importancia) {
    case 'baixo':
      return 'Baixo'
    case 'medio':
      return 'Médio'
    case 'alto':
      return 'Alto'
    case 'critico':
      return 'Crítico'
    case 'celebrativo':
      return 'Celebrativo'
    default:
      return 'Baixo'
  }
}

export function TimelineEventCard({ 
  evento, 
  onEdit, 
  onDelete, 
  onView, 
  showActions = true 
}: TimelineEventCardProps) {
  const config = timelineEventConfig[evento.tipo]
  const isCelebrativo = evento.importancia === 'celebrativo'
  const isCritico = evento.importancia === 'critico'

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-md ${
      isCelebrativo ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50' :
      isCritico ? 'border-red-300 bg-gradient-to-r from-red-50 to-pink-50' :
      'border-gray-200'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${isCelebrativo ? 'animate-pulse' : ''}`}>
              {config.icon}
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold text-lg ${
                isCelebrativo ? 'text-yellow-800' :
                isCritico ? 'text-red-800' :
                'text-gray-900'
              }`}>
                {evento.titulo}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(evento.data, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {evento.autor}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getImportanceColor(evento.importancia)}>
              {getImportanceLabel(evento.importancia)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {config.label}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-700 leading-relaxed mb-4">
          {evento.descricao}
        </p>

        {showActions && (onEdit || onDelete || onView) && (
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(evento)}
                className="text-blue-600 hover:text-blue-700"
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(evento)}
                className="text-green-600 hover:text-green-700"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(evento.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
