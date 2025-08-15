'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface Notification {
  id: number
  titulo: string
  mensagem: string
  tipo: 'info' | 'warning' | 'error' | 'success'
  lida: boolean
  data: string
}

interface NotificationsPanelProps {
  notifications: Notification[]
  onMarkAsRead: (id: number) => Promise<void>
  onClearAll: () => Promise<void>
  isOpen: boolean
  onClose: () => void
}

const tipoConfig = {
  success: { 
    icon: CheckCircle, 
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    label: 'Sucesso'
  },
  warning: { 
    icon: AlertTriangle, 
    color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
    label: 'Aviso'
  },
  error: { 
    icon: AlertTriangle, 
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    label: 'Erro'
  },
  info: { 
    icon: Info, 
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    label: 'Informação'
  }
}

export function NotificationsPanel({
  notifications,
  onMarkAsRead,
  onClearAll,
  isOpen,
  onClose
}: NotificationsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const notificacoesNaoLidas = notifications?.filter(n => !n.lida) || []
  const notificacoesVencidas = notifications?.filter(n => n.tipo === 'warning' && !n.lida) || []

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Agora mesmo'
    } else if (diffInHours < 24) {
      return `Há ${diffInHours}h`
    } else if (diffInHours < 48) {
      return 'Ontem'
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const handleNotificacaoClick = async (notificacao: Notification) => {
    if (!notificacao.lida) {
      await onMarkAsRead(notificacao.id)
    }
  }

  return (
    <>
      {/* Painel de notificações */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Notificações
              </h3>
              
              <div className="flex items-center space-x-2">
                {notificacoesNaoLidas.length > 0 && (
                  <motion.button
                    onClick={onClearAll}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Marcar todas como lidas
                  </motion.button>
                )}
                
                <motion.button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Lista de notificações */}
            <div className="max-h-96 overflow-y-auto">
              {!notifications || notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhuma notificação
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.slice(0, isExpanded ? undefined : 5).map((notificacao) => {
                    const config = tipoConfig[notificacao.tipo]
                    const Icon = config.icon
                    
                    return (
                      <motion.div
                        key={notificacao.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 cursor-pointer transition-colors ${
                          notificacao.lida 
                            ? 'bg-white dark:bg-gray-800' 
                            : 'bg-blue-50 dark:bg-blue-900/20'
                        } hover:bg-gray-50 dark:hover:bg-gray-700`}
                        onClick={() => handleNotificacaoClick(notificacao)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${config.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className={`text-sm font-medium ${
                                notificacao.lida 
                                  ? 'text-gray-700 dark:text-gray-300' 
                                  : 'text-gray-900 dark:text-white'
                              }`}>
                                {notificacao.titulo}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(notificacao.data)}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {notificacao.mensagem}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications && notifications.length > 5 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span>Mostrar menos</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span>Ver todas ({notifications?.length || 0})</span>
                    </>
                  )}
                </motion.button>
              </div>
            )}

            {/* Aviso de tarefas vencidas */}
            {notificacoesVencidas.length > 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    {notificacoesVencidas.length} tarefa{notificacoesVencidas.length > 1 ? 's' : ''} vencida{notificacoesVencidas.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para fechar */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40"
          onClick={onClose}
        />
      )}
    </>
  )
}
