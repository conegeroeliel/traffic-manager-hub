'use client'

import { TimelinePositive } from '@/components/ui/timeline-positive'
import { useTimelinePositive } from '@/hooks/useTimelinePositive'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Rocket, TrendingUp, BarChart3, MessageSquare } from 'lucide-react'

export default function TimelinePositivePage() {
  // Usar um clientId de exemplo
  const clientId = 'cliente-teste'
  
  const {
    events,
    stats,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents
  } = useTimelinePositive(clientId)

  const handleAddEvent = async (data: any) => {
    try {
      await addEvent(data)
      console.log('Evento adicionado com sucesso!')
    } catch (error) {
      console.error('Erro ao adicionar evento:', error)
    }
  }

  const handleEditEvent = async (event: any) => {
    try {
      // Aqui você implementaria a lógica para editar o evento
      console.log('Editando evento:', event)
    } catch (error) {
      console.error('Erro ao editar evento:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header da página */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Timeline Positiva
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Visualize todas as conquistas, entregas e marcos positivos do seu cliente em uma timeline elegante e inspiradora.
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Marcos Alcançados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.milestonesReached}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lançamentos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.eventsByFamily.launch}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Otimizações</p>
                <p className="text-2xl font-bold text-gray-900">{stats.eventsByFamily.optimization}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Relatórios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.eventsByFamily.report}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reuniões</p>
                <p className="text-2xl font-bold text-gray-900">{stats.eventsByFamily.meeting}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total de Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stats.totalEvents}</p>
            <p className="text-sm text-gray-600 mt-1">
              Eventos registrados na timeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Últimos 30 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.eventsLast30Days}</p>
            <p className="text-sm text-gray-600 mt-1">
              Eventos recentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Importância</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Alta</span>
              <Badge variant="default" className="bg-red-500">
                {stats.eventsByImportance.high}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Média</span>
              <Badge variant="default" className="bg-yellow-500">
                {stats.eventsByImportance.medium}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Baixa</span>
              <Badge variant="default" className="bg-green-500">
                {stats.eventsByImportance.low}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Positiva */}
      <TimelinePositive
        clientId={clientId}
        events={events}
        loading={loading}
        error={error || undefined}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onRefresh={refreshEvents}
      />

      {/* Informações sobre a implementação */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Sobre a Timeline Positiva</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Características Implementadas</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Visual premium com design tokens</li>
                <li>• Famílias de eventos positivos (5 tipos)</li>
                <li>• Hierarquia por importância (3 níveis)</li>
                <li>• Microanimações com Framer Motion</li>
                <li>• Tooltips acessíveis com Radix UI</li>
                <li>• Filtros avançados</li>
                <li>• Responsivo mobile-first</li>
                <li>• Acessibilidade completa (ARIA)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Famílias de Eventos</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>🏆 <strong>Milestone:</strong> Metas e recordes</li>
                <li>🚀 <strong>Launch:</strong> Lançamentos estratégicos</li>
                <li>⚡ <strong>Optimization:</strong> Otimizações de performance</li>
                <li>📊 <strong>Report:</strong> Relatórios e entregas</li>
                <li>🤝 <strong>Meeting:</strong> Reuniões e contatos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




