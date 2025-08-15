'use client'

import { TimelineStats } from '@/lib/types/timeline'
import { Card, CardContent } from './card'
import { Badge } from './badge'
import { TrendingUp, TrendingDown, Target, Award, AlertTriangle, CheckCircle, Star, Users, Calendar, Zap } from 'lucide-react'

interface TimelineStatsPremiumProps {
  stats: TimelineStats
  cliente?: any
}

export function TimelineStatsPremium({ stats, cliente }: TimelineStatsPremiumProps) {
  if (!stats) return null

  const getGrowthIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Target className="w-4 h-4 text-blue-600" />
  }

  const getGrowthColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600'
    if (current < previous) return 'text-red-600'
    return 'text-blue-600'
  }

  const getGrowthText = (current: number, previous: number) => {
    if (previous === 0) return 'Novo'
    const percentage = ((current - previous) / previous) * 100
    if (percentage > 0) return `+${percentage.toFixed(1)}%`
    if (percentage < 0) return `${percentage.toFixed(1)}%`
    return '0%'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total de Eventos */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-600 mb-1">Total de Eventos</p>
              <p className="text-3xl font-bold text-blue-900 mb-2">{stats.totalEventos}</p>
              <div className="flex items-center gap-2">
                {getGrowthIcon(stats.totalEventos, stats.totalEventos - 2)}
                <span className={`text-sm font-medium ${getGrowthColor(stats.totalEventos, stats.totalEventos - 2)}`}>
                  {getGrowthText(stats.totalEventos, stats.totalEventos - 2)} vs mês anterior
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Últimos 30 dias */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-green-600 mb-1">Últimos 30 dias</p>
              <p className="text-3xl font-bold text-green-900 mb-2">{stats.eventosUltimos30Dias}</p>
              <div className="flex items-center gap-2">
                {getGrowthIcon(stats.eventosUltimos30Dias, Math.floor(stats.eventosUltimos30Dias * 0.8))}
                <span className={`text-sm font-medium ${getGrowthColor(stats.eventosUltimos30Dias, Math.floor(stats.eventosUltimos30Dias * 0.8))}`}>
                  {getGrowthText(stats.eventosUltimos30Dias, Math.floor(stats.eventosUltimos30Dias * 0.8))} vs período anterior
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marcos Alcançados */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-600 mb-1">Marcos Alcançados</p>
              <p className="text-3xl font-bold text-yellow-900 mb-2">{stats.marcosAlcancados}</p>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">
                  {stats.marcosAlcancados > 0 ? 'Excelente progresso!' : 'Em busca do primeiro marco'}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eventos Críticos */}
      <Card className="bg-gradient-to-br from-red-50 to-pink-100 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-red-600 mb-1">Eventos Críticos</p>
              <p className="text-3xl font-bold text-red-900 mb-2">
                {stats.eventosPorImportancia?.critico || 0}
              </p>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  {stats.eventosPorImportancia?.critico > 0 ? 'Atenção necessária' : 'Tudo sob controle'}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de insights premium
export function TimelineInsights({ stats }: { stats: TimelineStats }) {
  const insights = []

  // Insight sobre crescimento
  if (stats.eventosUltimos30Dias > stats.totalEventos * 0.3) {
    insights.push({
      type: 'success',
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Crescimento Acelerado',
      description: 'Atividade intensa nos últimos 30 dias indica forte engajamento'
    })
  }

  // Insight sobre marcos
  if (stats.marcosAlcancados > 0) {
    insights.push({
      type: 'celebration',
      icon: <Award className="w-5 h-5" />,
      title: 'Marcos Conquistados',
      description: `${stats.marcosAlcancados} marco(s) alcançado(s) - Parabéns!`
    })
  }

  // Insight sobre eventos críticos
  if (stats.eventosPorImportancia?.critico > 0) {
    insights.push({
      type: 'warning',
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Atenção Necessária',
      description: `${stats.eventosPorImportancia.critico} evento(s) crítico(s) requerem atenção`
    })
  }

  // Insight sobre distribuição
  const totalEventos = stats.totalEventos
  const eventosAltos = stats.eventosPorImportancia?.alto || 0
  if (eventosAltos > totalEventos * 0.4) {
    insights.push({
      type: 'info',
      icon: <Star className="w-5 h-5" />,
      title: 'Foco em Resultados',
      description: 'Alta concentração de eventos importantes demonstra priorização'
    })
  }

  if (insights.length === 0) {
    insights.push({
      type: 'info',
      icon: <CheckCircle className="w-5 h-5" />,
      title: 'Timeline Ativa',
      description: 'Sua timeline está pronta para registrar a jornada do cliente'
    })
  }

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-white border-0 shadow-xl mb-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Insights Inteligentes</h3>
            <p className="text-sm text-gray-600">Análise automática da sua timeline</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:shadow-md ${
                insight.type === 'success' ? 'bg-green-50 border-green-400' :
                insight.type === 'celebration' ? 'bg-yellow-50 border-yellow-400' :
                insight.type === 'warning' ? 'bg-red-50 border-red-400' :
                'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  insight.type === 'success' ? 'bg-green-100 text-green-600' :
                  insight.type === 'celebration' ? 'bg-yellow-100 text-yellow-600' :
                  insight.type === 'warning' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
