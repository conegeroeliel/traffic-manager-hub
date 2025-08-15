'use client'

import { TimelineEvent, TimelineEventImportance, timelineEventConfig } from '@/lib/types/timeline'
import { Cliente } from '@/lib/types/cliente'
import { Card, CardContent } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { Edit, Trash2, Calendar, User, ChevronRight, UserPlus, TrendingUp, Award, AlertTriangle, CheckCircle, Star, Trophy, Rocket, Zap, BarChart3, Target, TrendingDown, Users, DollarSign, Gift, Crown, Medal, Flame, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ConfirmModal } from './confirm-modal'

interface TimelineHorizontalProps {
  eventos: TimelineEvent[]
  cliente?: Cliente
  onEdit?: (evento: TimelineEvent) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

// Categorias visuais com cores e ícones únicos
const eventCategories = {
  metas: {
    color: 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-600 shadow-yellow-400',
    iconName: 'Trophy',
    label: '🏆 Metas e Recordes',
    impact: 'Conquista Histórica'
  },
  estrategico: {
    color: 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-700 shadow-blue-500',
    iconName: 'Rocket',
    label: '🚀 Ação Estratégica',
    impact: 'Movimento Estratégico'
  },
  otimizacao: {
    color: 'bg-gradient-to-br from-green-500 to-green-600 border-green-700 shadow-green-500',
    iconName: 'Zap',
    label: '⚡ Otimização',
    impact: 'Melhoria Significativa'
  },
  relatorio: {
    color: 'bg-gradient-to-br from-purple-500 to-purple-600 border-purple-700 shadow-purple-500',
    iconName: 'BarChart3',
    label: '📊 Relatório',
    impact: 'Análise Detalhada'
  },
  relacionamento: {
    color: 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-700 shadow-orange-500',
    iconName: 'Users',
    label: '🤝 Relacionamento',
    impact: 'Fortalecimento'
  },
  cadastro: {
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600 border-indigo-700 shadow-indigo-500',
    iconName: 'UserPlus',
    label: '👤 Cadastro',
    impact: 'Início da Jornada'
  }
}

// Mapeamento de tipos para categorias
const getEventCategory = (tipo: string, importancia: TimelineEventImportance) => {
  if (tipo === 'reuniao' && importancia === 'critico') return 'estrategico'
  if (tipo === 'reuniao' && importancia === 'celebrativo') return 'metas'
  if (tipo === 'reuniao' && importancia === 'alto') return 'otimizacao'
  if (tipo === 'reuniao' && importancia === 'medio') return 'relacionamento'
  if (tipo === 'reuniao' && importancia === 'baixo') return 'relacionamento'
  
  // Fallback baseado na importância
  if (importancia === 'critico') return 'estrategico'
  if (importancia === 'celebrativo') return 'metas'
  return 'relacionamento'
}

// Tamanho baseado na importância e tipo
const getEventSize = (tipo: string, importancia: TimelineEventImportance): number => {
  const baseSize = 40
  
  // Eventos "uau" - maiores
  if (importancia === 'critico' || importancia === 'celebrativo') {
    return baseSize + 20 // 60px
  }
  
  // Eventos importantes
  if (importancia === 'alto') {
    return baseSize + 10 // 50px
  }
  
  // Eventos de rotina - menores
  if (importancia === 'baixo') {
    return baseSize - 10 // 30px
  }
  
  return baseSize // 40px padrão
}

// Posição alternada para dinamismo
const getEventPosition = (index: number): 'top' | 'bottom' => {
  return index % 2 === 0 ? 'top' : 'bottom'
}

// Função para renderizar ícones baseado no nome
const renderIcon = (iconName: string, className: string = "w-6 h-6 text-white") => {
  const icons: { [key: string]: any } = {
    Trophy,
    Rocket,
    Zap,
    BarChart3,
    Users,
    UserPlus,
    Flame,
    Sparkles,
    Crown,
    Medal,
    Star,
    CheckCircle,
    TrendingUp
  }
  
  const IconComponent = icons[iconName]
  return IconComponent ? <IconComponent className={className} /> : <Star className={className} />
}

// Frases de impacto emocional
const getImpactPhrase = (tipo: string, importancia: TimelineEventImportance): string => {
  const phrases = {
    metas: [
      "🚀 Meta superada em 150%!",
      "🏆 Novo recorde estabelecido!",
      "💎 Conquista histórica alcançada!",
      "⭐ Resultado excepcional!"
    ],
    estrategico: [
      "🎯 Estratégia revolucionária implementada!",
      "⚡ Movimento que mudou o jogo!",
      "🔥 Ação que transformou resultados!",
      "💪 Decisão estratégica de alto impacto!"
    ],
    otimizacao: [
      "📈 Performance otimizada significativamente!",
      "⚡ Eficiência maximizada!",
      "🎯 Processo aprimorado com sucesso!",
      "💎 Melhoria que fez a diferença!"
    ],
    relatorio: [
      "📊 Análise profunda realizada!",
      "🔍 Insights valiosos descobertos!",
      "📈 Dados que orientam decisões!",
      "💡 Relatório estratégico entregue!"
    ],
    relacionamento: [
      "🤝 Relacionamento fortalecido!",
      "💎 Parceria estratégica estabelecida!",
      "🎯 Alinhamento perfeito alcançado!",
      "⭐ Confiança consolidada!"
    ]
  }
  
  const category = getEventCategory(tipo, importancia)
  const categoryPhrases = phrases[category as keyof typeof phrases] || phrases.relacionamento
  return categoryPhrases[Math.floor(Math.random() * categoryPhrases.length)]
}

// Dados de impacto quantitativo (mock - em produção viria do backend)
const getQuantitativeImpact = (evento: TimelineEvent): string => {
  const impacts = {
    metas: "+25% em conversões, ROI 8x, CPC -12%",
    estrategico: "3x mais vendas, +150% leads, ROI 12x",
    otimizacao: "Eficiência +40%, Custo -18%, Performance +60%",
    relatorio: "15 insights valiosos, 8 oportunidades identificadas",
    relacionamento: "Satisfação 95%, Retenção +30%, NPS +25"
  }
  
  const category = getEventCategory(evento.tipo, evento.importancia)
  return impacts[category as keyof typeof impacts] || "Impacto significativo registrado"
}

export function TimelineHorizontal({ 
  eventos, 
  cliente,
  onEdit, 
  onDelete, 
  showActions = true 
}: TimelineHorizontalProps) {
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [animatedEvents, setAnimatedEvents] = useState<Set<string>>(new Set())
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null)

  const handleDeleteClick = (id: string) => {
    setDeletingEventId(id)
  }

  const handleDeleteConfirm = async (id: string) => {
    if (onDelete) {
      await onDelete(id)
    }
    setDeletingEventId(null)
  }

  // Criar evento de cadastro do cliente
  const eventoCadastro: TimelineEvent = {
    id: 'cadastro-cliente',
    titulo: 'Cliente Cadastrado',
    descricao: `Cliente ${cliente?.nome || 'Cliente'} foi cadastrado no sistema`,
    tipo: 'reuniao',
    importancia: 'medio' as TimelineEventImportance,
    data: new Date('2024-01-01T00:00:00'),
    autor: 'Sistema',
    clienteId: cliente?.id || '',
    criadoEm: new Date('2024-01-01T00:00:00'),
    atualizadoEm: new Date('2024-01-01T00:00:00')
  }

  // Combinar e ordenar eventos
  const todosEventos = [eventoCadastro, ...eventos].sort((a, b) => a.data.getTime() - b.data.getTime())

  // Contar conquistas importantes
  const conquistasImportantes = todosEventos.filter(e => 
    e.importancia === 'critico' || e.importancia === 'celebrativo'
  ).length

  // Animar eventos sequencialmente
  useEffect(() => {
    const timer = setTimeout(() => {
      const newAnimatedEvents = new Set<string>()
      todosEventos.forEach((evento, index) => {
        setTimeout(() => {
          newAnimatedEvents.add(evento.id)
          setAnimatedEvents(new Set(newAnimatedEvents))
        }, index * 150)
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  if (todosEventos.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-xl">
        <CardContent className="pt-12 pb-12">
          <div className="text-center text-gray-500">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="w-10 h-10 text-blue-600" />
            </div>
            <p className="text-xl font-semibold mb-2">Nenhum evento encontrado</p>
            <p className="text-sm">
              Comece adicionando o primeiro evento da timeline
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Banner de Conquistas */}
      <Card className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 border-0 shadow-2xl">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-white animate-pulse" />
              <Crown className="w-8 h-8 text-white animate-pulse" />
              <Medal className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-1">
                🎉 Você já conquistou {conquistasImportantes} marcos importantes!
              </h3>
              <p className="text-white/90 text-sm">
                Cada evento representa uma vitória na sua jornada de sucesso
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-white animate-pulse" />
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
              <Star className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Horizontal - Versão Impactante */}
      <Card className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-0 shadow-2xl overflow-hidden">
        <CardContent className="pt-16 pb-16">
          <div className="relative">
            {/* Grid de fundo - apenas linhas verticais */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '50px 25px',
              zIndex: 1
            }}></div>

            {/* Linha temporal horizontal principal */}
            <div className="absolute top-1/2 left-0 right-0 h-3 bg-gradient-to-r from-blue-400 via-purple-500 to-orange-500 rounded-full shadow-lg transform -translate-y-1/2 z-10">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="absolute -right-4 -top-1 w-0 h-0 border-t-6 border-t-orange-500 border-l-8 border-l-orange-500 border-b-6 border-b-transparent"></div>
             </div>

                           {/* Container dos marcadores */}
            <div className="relative flex items-center justify-between py-40 z-20">
                             {todosEventos.map((evento, index) => {
                const category = getEventCategory(evento.tipo, evento.importancia)
                const categoryConfig = eventCategories[category as keyof typeof eventCategories]
                const eventSize = getEventSize(evento.tipo, evento.importancia)
                const position = getEventPosition(index)
                 const isSelected = selectedEvent?.id === evento.id
                 const isAnimated = animatedEvents.has(evento.id)
                const isHovered = hoveredEvent?.id === evento.id

                                 return (
                   <div 
                     key={evento.id} 
                     className={`relative flex flex-col items-center transition-all duration-1000 ${
                       isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    } ${position === 'bottom' ? 'mt-20' : '-mt-20'}`}
                   >
                    {/* Data do evento */}
                    <div className="text-xs text-gray-700 text-center font-semibold bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg mb-4">
                       {evento.data.toLocaleDateString('pt-BR', {
                         day: '2-digit',
                         month: '2-digit',
                         year: 'numeric'
                       })}
                     </div>

                    {/* Marcador na linha temporal - Versão Impactante */}
                      <div 
                      className={`${categoryConfig.color} border-2 rounded-full timeline-marker timeline-horizontal cursor-pointer transition-all duration-500 hover:scale-125 hover:shadow-2xl z-20 relative group ${
                          isSelected ? 'ring-4 ring-blue-300 ring-opacity-50 scale-110' : ''
                      } ${isHovered ? 'scale-110 shadow-2xl' : ''}`}
                        style={{ 
                        width: `${eventSize}px`,
                        height: `${eventSize}px`
                        }}
                        onClick={() => setSelectedEvent(isSelected ? null : evento)}
                      onMouseEnter={() => setHoveredEvent(evento)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      >
                       {/* Efeito de brilho interno */}
                       <div className="absolute inset-1 bg-white/20 rounded-full"></div>
                       
                      {/* Ícone do evento */}
                       <div className="w-full h-full flex items-center justify-center text-xs relative z-10">
                        {renderIcon(categoryConfig.iconName)}
                             </div>

                      {/* Efeitos especiais para eventos importantes */}
                      {(evento.importancia === 'critico' || evento.importancia === 'celebrativo') && (
                        <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 animate-pulse"></div>
                      )}
                      
                             {/* Ícone de importância sobreposto */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200">
                        {evento.importancia === 'critico' && <Crown className="w-3 h-3 text-purple-600" />}
                        {evento.importancia === 'celebrativo' && <Trophy className="w-3 h-3 text-yellow-600" />}
                        {evento.importancia === 'alto' && <Star className="w-3 h-3 text-blue-600" />}
                        {evento.importancia === 'medio' && <CheckCircle className="w-3 h-3 text-green-600" />}
                        {evento.importancia === 'baixo' && <TrendingUp className="w-3 h-3 text-gray-600" />}
                             </div>
                       </div>

                    {/* Linha vertical conectando */}
                      <div 
                        className="w-1 bg-gradient-to-b from-gray-300 via-blue-400 to-gray-300 rounded-full shadow-md mt-2"
                      style={{ height: '20px' }}
                      ></div>

                    {/* Título do evento */}
                    <div className="mt-4 text-xs text-gray-700 text-center max-w-32 font-semibold leading-tight">
                      {evento.titulo}
                     </div>

                    {/* Categoria do evento */}
                    <div className="mt-2">
                                                   <Badge 
                            variant="default"
                        className="text-xs font-semibold shadow-sm bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200"
                          >
                        {categoryConfig.label}
                         </Badge>
                    </div>

                    {/* Tooltip de impacto quantitativo */}
                    {isHovered && (
                      <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg shadow-xl z-30 whitespace-nowrap">
                        <div className="font-semibold mb-1">{getImpactPhrase(evento.tipo, evento.importancia)}</div>
                        <div className="text-yellow-300">{getQuantitativeImpact(evento)}</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black/90"></div>
                       </div>
                     )}
                   </div>
                 )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do evento selecionado - Versão Impactante */}
      {selectedEvent && (
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-2xl transform transition-all duration-500 animate-in slide-in-from-bottom-4">
          <CardContent className="pt-12 pb-12">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                    {renderIcon(eventCategories[getEventCategory(selectedEvent.tipo, selectedEvent.importancia) as keyof typeof eventCategories]?.iconName || 'Star')}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl text-gray-900 mb-2">
                      {selectedEvent.titulo}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="default"
                        className="text-sm font-semibold shadow-md bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0"
                      >
                        {eventCategories[getEventCategory(selectedEvent.tipo, selectedEvent.importancia) as keyof typeof eventCategories]?.label}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {selectedEvent.importancia.charAt(0).toUpperCase() + selectedEvent.importancia.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl mb-6 border-l-4 border-yellow-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold text-orange-800">Impacto Quantitativo</span>
                  </div>
                  <p className="text-orange-700 font-medium">{getQuantitativeImpact(selectedEvent)}</p>
                </div>

                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  {selectedEvent.descricao}
                </p>

                <div className="flex items-center gap-6 text-sm text-gray-600 bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">
                      {selectedEvent.data.toLocaleDateString('pt-BR', {
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
                    <span className="font-medium">{selectedEvent.autor}</span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              {showActions && selectedEvent.id !== 'cadastro-cliente' && (
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(selectedEvent)}
                      className="h-12 w-12 p-0 bg-white/80 backdrop-blur-sm hover:bg-white shadow-md"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(selectedEvent.id)}
                      className="h-12 w-12 p-0 bg-white/80 backdrop-blur-sm hover:bg-red-50 text-red-600 hover:text-red-700 shadow-md"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo dos eventos - Versão Impactante */}
      <Card className="bg-gradient-to-br from-gray-50 to-white border-0 shadow-xl">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">Resumo das Conquistas</h3>
              <p className="text-sm text-gray-600">Visão geral da jornada de sucesso</p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <span className="font-semibold">Total: {todosEventos.length}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {Object.entries(eventCategories).map(([key, category]) => {
              const count = todosEventos.filter(e => getEventCategory(e.tipo, e.importancia) === key).length
              if (count === 0) return null

              return (
                <div key={key} className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <div 
                    className={`w-4 h-4 ${category.color} rounded-full shadow-sm`}
                  ></div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-700 block">
                      {category.label.split(' ')[0]}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

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
