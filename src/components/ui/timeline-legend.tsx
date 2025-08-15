'use client'

import { TimelineEventImportance } from '@/lib/types/timeline'
import { Badge } from './badge'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Info } from 'lucide-react'

interface TimelineLegendProps {
  className?: string
}

// Configuração de altura baseada na importância (mesma do TimelineVisual)
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

// Configuração de cor baseada na importância (mesma do TimelineVisual)
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

const importanceLabels = {
  baixo: 'Baixo',
  medio: 'Médio',
  alto: 'Alto',
  critico: 'Crítico',
  celebrativo: 'Celebrativo'
}

export function TimelineLegend({ className = '' }: TimelineLegendProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Info className="w-4 h-4" />
          Legenda da Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-600 mb-2">Altura dos marcadores indica importância:</p>
            <div className="space-y-2">
              {(['baixo', 'medio', 'alto', 'critico', 'celebrativo'] as TimelineEventImportance[]).map((importancia) => {
                const height = getHeightByImportance(importancia)
                const colorClass = getColorByImportance(importancia)
                
                return (
                  <div key={importancia} className="flex items-center gap-3">
                                         {/* Marcador de exemplo */}
                     <div 
                       className={`w-4 h-4 ${colorClass} border-2 timeline-marker`}
                       style={{ 
                         height: `${Math.min(height * 0.3, 24)}px`,
                         width: `${Math.min(height * 0.3, 24)}px`
                       }}
                     ></div>
                    
                    {/* Label */}
                    <span className="text-xs font-medium text-gray-700">
                      {importanceLabels[importancia]}
                    </span>
                    
                    {/* Badge */}
                    <Badge 
                      variant={importancia === 'critico' ? 'destructive' : 'default'}
                      className="text-xs"
                    >
                      {importancia}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <p className="text-xs text-gray-600 mb-2">Cores dos marcadores:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded-full"></div>
                <span>Eventos normais</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 border border-red-600 rounded-full"></div>
                <span>Eventos críticos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 border border-green-600 rounded-full"></div>
                <span>Eventos celebrativos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 border border-blue-600 rounded-full"></div>
                <span>Eventos importantes</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
