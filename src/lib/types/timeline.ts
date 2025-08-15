export type TimelineEventFamily = 
  | 'milestone'    // 🏆 Meta/Recorde
  | 'launch'       // 🚀 Lançamento/Ação Strat.
  | 'optimization' // ⚡ Otimização/Performance
  | 'report'       // 📊 Relatório/Entrega
  | 'meeting'      // 🤝 Reunião/Contato

export type TimelineEventImportance = 
  | 'low'    // baixa
  | 'medium' // média
  | 'high'   // alta (uau)

export interface TimelineEvent {
  id: string
  clientId: string
  date: string // ISO
  family: TimelineEventFamily
  importance: TimelineEventImportance
  title: string
  description?: string
  author?: { id: string; name: string }
  impact?: { metric: string; value: string; delta?: string } // ex: { metric: 'Conversão', value: '5.2%', delta: '+27%' }
  links?: Array<{ label: string; href: string }>
  attachments?: Array<{ name: string; url: string }>
  createdAt: string
  updatedAt: string
}

export interface TimelineEventFormData {
  clientId: string
  family: TimelineEventFamily
  importance: TimelineEventImportance
  title: string
  description?: string
  date: string
  author?: { id: string; name: string }
  impact?: { metric: string; value: string; delta?: string }
  links?: Array<{ label: string; href: string }>
  attachments?: Array<{ name: string; url: string }>
}

export interface TimelineFilters {
  family?: TimelineEventFamily
  importance?: TimelineEventImportance
  startDate?: string
  endDate?: string
  author?: string
}

export interface TimelineStats {
  totalEvents: number
  eventsByFamily: Record<TimelineEventFamily, number>
  eventsByImportance: Record<TimelineEventImportance, number>
  eventsLast30Days: number
  milestonesReached: number
}

// Configurações visuais para cada família de evento (positivos apenas)
export const timelineEventConfig = {
  milestone: {
    icon: 'Trophy',
    color: 'gold',
    label: '🏆 Meta/Recorde',
    bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    borderColor: 'border-yellow-600',
    shadowColor: 'shadow-yellow-400'
  },
  launch: {
    icon: 'Rocket',
    color: 'blue',
    label: '🚀 Lançamento/Ação Strat.',
    bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
    borderColor: 'border-blue-700',
    shadowColor: 'shadow-blue-500'
  },
  optimization: {
    icon: 'TrendingUp',
    color: 'green',
    label: '⚡ Otimização/Performance',
    bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
    borderColor: 'border-green-700',
    shadowColor: 'shadow-green-500'
  },
  report: {
    icon: 'BarChart3',
    color: 'purple',
    label: '📊 Relatório/Entrega',
    bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
    borderColor: 'border-purple-700',
    shadowColor: 'shadow-purple-500'
  },
  meeting: {
    icon: 'MessageSquare',
    color: 'gray',
    label: '🤝 Reunião/Contato',
    bgColor: 'bg-gradient-to-br from-gray-500 to-gray-600',
    borderColor: 'border-gray-700',
    shadowColor: 'shadow-gray-500'
  }
} as const

// Design tokens conforme especificado
export const designTokens = {
  colors: {
    'base-bg': '#F7F9FC',
    'card-bg': '#FFFFFF',
    'text': '#0F172A',
    'muted': '#64748B',
    'line': '#14B8A6',
    'grid': '#E2E8F0',
    'blue': '#3B82F6',
    'green': '#10B981',
    'purple': '#8B5CF6',
    'orange': '#F59E0B',
    'gold': '#F59E0B',
    'gray': '#94A3B8'
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 20 },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.04)',
    md: '0 6px 20px rgba(2,6,23,0.06)',
    lg: '0 10px 30px rgba(2,6,23,0.10)'
  },
  spacing: { gutter: 24, gap: 16, tick: 72 },
  font: { title: 'text-xl font-semibold', label: 'text-xs font-medium', muted: 'text-xs text-slate-500' },
  icon: { sm: 16, md: 20, lg: 28 }
}
