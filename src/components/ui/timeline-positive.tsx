'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, Rocket, TrendingUp, BarChart3, MessageSquare, 
  Plus, Filter, Calendar, User, ChevronRight, ChevronDown,
  ArrowRight, BarChart3 as BarChart3Icon, List, RefreshCw,
  Download, Eye, Edit, Copy, ExternalLink, FileText
} from 'lucide-react'
import { TimelineEvent, TimelineEventFamily, TimelineEventImportance, timelineEventConfig, designTokens } from '@/lib/types/timeline'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Input } from './input'
import { Modal } from './modal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

interface TimelinePositiveProps {
  clientId: string
  events: TimelineEvent[]
  loading?: boolean
  error?: string
  onAddEvent?: (data: any) => void
  onEditEvent?: (event: TimelineEvent) => void
  onRefresh?: () => void
}

// Componente de evento individual da timeline
function TimelineEventMarker({ 
  event, 
  index, 
  onSelect, 
  selectedEvent 
}: { 
  event: TimelineEvent
  index: number
  onSelect: (event: TimelineEvent) => void
  selectedEvent: TimelineEvent | null
}) {
  const config = timelineEventConfig[event.family]
  const isSelected = selectedEvent?.id === event.id
  
  // Tamanho baseado na importância
  const getEventSize = (importance: TimelineEventImportance): number => {
    switch (importance) {
      case 'high': return designTokens.icon.lg // 28px
      case 'medium': return designTokens.icon.md // 20px
      case 'low': return designTokens.icon.sm // 16px
      default: return designTokens.icon.md
    }
  }
  
  // Sombra baseada na importância
  const getShadowClass = (importance: TimelineEventImportance): string => {
    switch (importance) {
      case 'high': return 'shadow-lg' // + halo sutil
      case 'medium': return 'shadow-md'
      case 'low': return 'shadow-sm'
      default: return 'shadow-md'
    }
  }
  
  // Posição alternada para dinamismo
  const position = index % 2 === 0 ? 'top' : 'bottom'
  const eventSize = getEventSize(event.importance)
  const shadowClass = getShadowClass(event.importance)
  
  // Renderizar ícone baseado na família
  const renderIcon = (family: TimelineEventFamily) => {
    const icons = {
      milestone: Trophy,
      launch: Rocket,
      optimization: TrendingUp,
      report: BarChart3,
      meeting: MessageSquare
    }
    const IconComponent = icons[family]
    return <IconComponent className="w-full h-full text-white" />
  }

  return (
    <motion.div
      className={`relative flex flex-col items-center transition-all duration-300 ${
        position === 'bottom' ? 'mt-20' : '-mt-20'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Data do evento */}
      <div className="text-xs text-gray-700 text-center font-medium bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm mb-2">
        {new Date(event.date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}
      </div>

      {/* Marcador na linha temporal */}
      <motion.button
        className={`${config.bgColor} border-2 ${config.borderColor} rounded-full cursor-pointer transition-all duration-300 hover:scale-110 ${shadowClass} relative group ${
          isSelected ? 'ring-4 ring-blue-300 ring-opacity-50 scale-110' : ''
        }`}
        style={{ 
          width: `${eventSize}px`,
          height: `${eventSize}px`
        }}
        onClick={() => onSelect(event)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`${event.title} — ${new Date(event.date).toLocaleDateString('pt-BR')} — ${event.impact?.metric || 'Sem métrica'} ${event.impact?.value || ''} — autor: ${event.author?.name || 'Sistema'}`}
      >
        {/* Efeito de brilho interno */}
        <div className="absolute inset-1 bg-white/20 rounded-full"></div>
        
        {/* Ícone do evento */}
        <div className="w-full h-full flex items-center justify-center relative z-10">
          {renderIcon(event.family)}
        </div>

        {/* Efeitos especiais para eventos "uau" */}
        {event.importance === 'high' && (
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 animate-pulse"></div>
        )}
      </motion.button>

      {/* Linha vertical conectando */}
      <div 
        className="w-0.5 bg-gradient-to-b from-gray-300 via-blue-400 to-gray-300 rounded-full shadow-sm mt-1"
        style={{ height: '16px' }}
      ></div>

      {/* Título do evento */}
      <div className="mt-2 text-xs text-gray-700 text-center max-w-24 font-medium leading-tight truncate">
        {event.title}
      </div>

      {/* Categoria do evento */}
      <div className="mt-1">
        <Badge 
          variant="outline"
          className="text-xs font-medium shadow-sm bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200"
        >
          {config.label.split(' ')[0]}
        </Badge>
      </div>

      {/* Tooltip de impacto */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute inset-0" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-2">
              <div className="font-semibold">{event.title}</div>
              <div className="text-sm text-gray-600">{event.description}</div>
              {event.impact && (
                <div className="text-sm">
                  <span className="font-medium">{event.impact.metric}:</span>{' '}
                  <span className="text-green-600 font-semibold">{event.impact.value}</span>
                  {event.impact.delta && (
                    <span className="text-blue-600 ml-1">({event.impact.delta})</span>
                  )}
                </div>
              )}
              <div className="text-xs text-gray-500">
                Autor: {event.author?.name || 'Sistema'}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  )
}

// Componente de detalhes do evento
function EventDetailsModal({ 
  event, 
  isOpen, 
  onClose, 
  onEdit 
}: { 
  event: TimelineEvent | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (event: TimelineEvent) => void
}) {
  if (!event) return null

  const config = timelineEventConfig[event.family]
  
  const renderIcon = (family: TimelineEventFamily) => {
    const icons = {
      milestone: Trophy,
      launch: Rocket,
      optimization: TrendingUp,
      report: BarChart3,
      meeting: MessageSquare
    }
    const IconComponent = icons[family]
    return <IconComponent className="w-6 h-6 text-white" />
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${config.bgColor} ${config.borderColor} border-2 rounded-full flex items-center justify-center shadow-lg`}>
              {renderIcon(event.family)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="default" className="text-sm">
                  {config.label}
                </Badge>
                <span className="text-sm text-gray-600 capitalize">
                  {event.importance}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Impacto */}
        {event.impact && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Impacto</span>
            </div>
            <div className="text-green-700">
              <span className="font-medium">{event.impact.metric}:</span>{' '}
              <span className="font-bold text-lg">{event.impact.value}</span>
              {event.impact.delta && (
                <span className="text-blue-600 ml-2 font-medium">({event.impact.delta})</span>
              )}
            </div>
          </div>
        )}

        {/* Descrição */}
        {event.description && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Descrição</h4>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>
        )}

        {/* Metadados */}
        <div className="flex items-center gap-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-medium">
              {new Date(event.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{event.author?.name || 'Sistema'}</span>
          </div>
        </div>

        {/* Links */}
        {event.links && event.links.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Links Relacionados</h4>
            <div className="flex flex-wrap gap-2">
              {event.links.map((link, index) => (
                <Button key={index} variant="outline" size="sm" asChild>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    {link.label}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Anexos */}
        {event.attachments && event.attachments.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Anexos</h4>
            <div className="space-y-2">
              {event.attachments.map((attachment, index) => (
                <Button key={index} variant="outline" size="sm" asChild>
                  <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-4 h-4 mr-1" />
                    {attachment.name}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-2 pt-4 border-t">
          {onEdit && (
            <Button onClick={() => onEdit(event)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Evento
            </Button>
          )}
          <Button variant="outline" asChild>
            <a href={`/relatorios/evento/${event.id}`} target="_blank" rel="noopener noreferrer">
              <Eye className="w-4 h-4 mr-2" />
              Ver no Relatório
            </a>
          </Button>
          <Button variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            Duplicar
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export function TimelinePositive({ 
  clientId, 
  events, 
  loading = false, 
  error, 
  onAddEvent, 
  onEditEvent, 
  onRefresh 
}: TimelinePositiveProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [viewMode, setViewMode] = useState<'horizontal' | 'vertical' | 'list'>('horizontal')
  const [filters, setFilters] = useState({
    family: '' as TimelineEventFamily | '',
    importance: '' as TimelineEventImportance | '',
    author: '',
    startDate: '',
    endDate: ''
  })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Filtrar eventos
  const filteredEvents = events.filter(event => {
    if (filters.family && event.family !== filters.family) return false
    if (filters.importance && event.importance !== filters.importance) return false
    if (filters.author && event.author?.name !== filters.author) return false
    if (filters.startDate && new Date(event.date) < new Date(filters.startDate)) return false
    if (filters.endDate && new Date(event.date) > new Date(filters.endDate)) return false
    return true
  })

  // Calcular estatísticas
  const stats = {
    totalEvents: events.length,
    eventsByFamily: events.reduce((acc, event) => {
      acc[event.family] = (acc[event.family] || 0) + 1
      return acc
    }, {} as Record<TimelineEventFamily, number>),
    eventsByImportance: events.reduce((acc, event) => {
      acc[event.importance] = (acc[event.importance] || 0) + 1
      return acc
    }, {} as Record<TimelineEventImportance, number>),
    eventsLast30Days: events.filter(event => {
      const eventDate = new Date(event.date)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return eventDate >= thirtyDaysAgo
    }).length,
    milestonesReached: events.filter(event => event.family === 'milestone').length
  }

  // Ordenar eventos por data
  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar timeline: {error}</p>
            <Button 
              variant="outline" 
              onClick={onRefresh}
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
      {/* Header da Timeline */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Linha do Tempo</h2>
          <p className="text-gray-600">
            Histórico de conquistas e entregas ao cliente
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* KPIs resumidos */}
          <div className="flex items-center gap-4 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {stats.eventsByFamily.launch || 0} ações
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              {stats.milestonesReached} marcos
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              {stats.eventsByFamily.optimization || 0} otimizações
            </span>
          </div>

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
              <BarChart3Icon className="w-4 h-4 mr-1" />
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
          
          {/* Ações */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <Select value={filters.family} onValueChange={(value) => setFilters(prev => ({ ...prev, family: value as TimelineEventFamily | '' }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                {Object.entries(timelineEventConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.importance} onValueChange={(value) => setFilters(prev => ({ ...prev, importance: value as TimelineEventImportance | '' }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Importância" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Autor"
              value={filters.author}
              onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
              className="w-40"
            />

            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-40"
            />

            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-40"
            />

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilters({ family: '', importance: '', author: '', startDate: '', endDate: '' })}
            >
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Canvas da Timeline */}
      <Card className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-0 shadow-xl overflow-hidden">
        <CardContent className="pt-16 pb-16">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando eventos...</p>
            </div>
          ) : sortedEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
                <Calendar className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-xl font-semibold mb-2">Nenhum evento encontrado</p>
              <p className="text-sm text-gray-600 mb-4">
                {Object.values(filters).some(v => v !== '') 
                  ? 'Tente ajustar os filtros aplicados'
                  : 'Comece adicionando o primeiro evento da timeline'
                }
              </p>
              {!Object.values(filters).some(v => v !== '') && (
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              )}
            </div>
          ) : (
            <div className="relative" ref={timelineRef}>
              {/* Grid de fundo */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(226, 232, 240, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: `${designTokens.spacing.tick}px 25px`,
                zIndex: 1
              }}></div>

              {/* Linha temporal horizontal principal */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500 rounded-full shadow-lg transform -translate-y-1/2 z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>

              {/* Container dos eventos */}
              <div className="relative flex items-center justify-between py-40 z-20">
                {sortedEvents.map((event, index) => (
                  <TimelineEventMarker
                    key={event.id}
                    event={event}
                    index={index}
                    onSelect={setSelectedEvent}
                    selectedEvent={selectedEvent}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalhes do evento */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={onEditEvent}
      />

      {/* Modal para adicionar evento (placeholder) */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} size="lg">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">Adicionar Novo Evento</h3>
          <p className="text-gray-600 mb-4">
            Formulário para adicionar novo evento será implementado aqui
          </p>
          <Button onClick={() => setIsAddModalOpen(false)}>
            Fechar
          </Button>
        </div>
      </Modal>
    </div>
  )
}




