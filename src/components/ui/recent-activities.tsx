'use client'

import { motion } from 'framer-motion'
import { Users, BarChart3, TrendingUp, Clock } from 'lucide-react'

interface Activity {
  id: number
  tipo: 'cliente' | 'diagnostico' | 'calculadora'
  titulo: string
  data: string
  status: 'success' | 'warning' | 'error' | 'info'
}

interface RecentActivitiesProps {
  activities: Activity[]
}

const activityIcons = {
  cliente: Users,
  diagnostico: BarChart3,
  calculadora: TrendingUp
}

const activityColors = {
  cliente: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
  diagnostico: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
  calculadora: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
}

const statusColors = {
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400'
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) {
      return 'Agora'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m atrás`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours}h atrás`
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Atividades Recentes
        </h3>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma atividade recente
            </p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const Icon = activityIcons[activity.tipo]
            const colors = activityColors[activity.tipo]
            const statusColor = statusColors[activity.status]
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${colors}`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.titulo}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(activity.data)}
                  </p>
                </div>
                
                <div className={`w-2 h-2 rounded-full ${statusColor.replace('text-', 'bg-')}`} />
              </motion.div>
            )
          })
        )}
      </div>

      {activities.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            Ver todas as atividades →
          </button>
        </motion.div>
      )}
    </div>
  )
}
