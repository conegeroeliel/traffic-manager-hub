'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Calendar,
  Users,
  FileText,
  Settings,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Tag,
  Calendar as CalendarIcon
} from 'lucide-react'
import { Tarefa, TarefaStatus, TarefaPrioridade, TarefaCategoria } from '@/types/tarefa'

interface TarefasListProps {
  tarefas: Tarefa[]
  onEdit: (tarefa: Tarefa) => void
  onDelete: (id: number) => void
  onView: (tarefa: Tarefa) => void
  onStatusChange: (id: number, status: TarefaStatus) => void
}

const statusConfig = {
  pendente: { 
    icon: Clock, 
    color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
    label: 'Pendente'
  },
  em_andamento: { 
    icon: TrendingUp, 
    color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    label: 'Em Andamento'
  },
  concluida: { 
    icon: CheckCircle, 
    color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    label: 'Concluída'
  },
  cancelada: { 
    icon: XCircle, 
    color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
    label: 'Cancelada'
  }
}

const prioridadeConfig = {
  baixa: { color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30', label: 'Baixa' },
  media: { color: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30', label: 'Média' },
  alta: { color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30', label: 'Alta' },
  urgente: { color: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30', label: 'Urgente' }
}

const categoriaConfig = {
  cliente: { icon: Users, color: 'text-blue-600' },
  campanha: { icon: TrendingUp, color: 'text-green-600' },
  relatorio: { icon: FileText, color: 'text-purple-600' },
  reuniao: { icon: Calendar, color: 'text-orange-600' },
  outro: { icon: Settings, color: 'text-gray-600' }
}

export function TarefasList({ tarefas, onEdit, onDelete, onView, onStatusChange }: TarefasListProps) {
  const [expandedTarefa, setExpandedTarefa] = useState<number | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isVencida = (dataVencimento?: string) => {
    if (!dataVencimento) return false
    return new Date(dataVencimento) < new Date()
  }

  const getStatusIcon = (status: TarefaStatus) => {
    const Icon = statusConfig[status].icon
    return <Icon className="h-4 w-4" />
  }

  const getCategoriaIcon = (categoria: TarefaCategoria) => {
    const Icon = categoriaConfig[categoria].icon
    return <Icon className="h-4 w-4" />
  }

  const handleStatusChange = (id: number, currentStatus: TarefaStatus) => {
    const statusOrder: TarefaStatus[] = ['pendente', 'em_andamento', 'concluida', 'cancelada']
    const currentIndex = statusOrder.indexOf(currentStatus)
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
    onStatusChange(id, nextStatus)
  }

  if (tarefas.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {tarefas.length === 0 ? 'Crie sua primeira tarefa para começar!' : 'Tente ajustar os filtros.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tarefas.map((tarefa, index) => (
          <motion.div
            key={tarefa.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-2 rounded-lg ${statusConfig[tarefa.status].color}`}>
                      {getStatusIcon(tarefa.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {tarefa.titulo}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${prioridadeConfig[tarefa.prioridade].color}`}>
                          {prioridadeConfig[tarefa.prioridade].label}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                          {getCategoriaIcon(tarefa.categoria)}
                          <span className="text-xs capitalize">{tarefa.categoria}</span>
                        </div>
                        {tarefa.clienteNome && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            • {tarefa.clienteNome}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {tarefa.descricao && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {tarefa.descricao}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Criada: {formatDate(tarefa.dataCriacao)}</span>
                      </div>
                      {tarefa.dataVencimento && (
                        <div className={`flex items-center space-x-1 ${isVencida(tarefa.dataVencimento) ? 'text-red-500' : ''}`}>
                          <Clock className="h-4 w-4" />
                          <span>Vence: {formatDate(tarefa.dataVencimento)}</span>
                          {isVencida(tarefa.dataVencimento) && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {tarefa.tags && tarefa.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <div className="flex space-x-1">
                            {tarefa.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                              >
                                {tag}
                              </span>
                            ))}
                            {tarefa.tags.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                +{tarefa.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-1">
                        <motion.button
                          onClick={() => handleStatusChange(tarefa.id, tarefa.status)}
                          className={`p-2 rounded-lg transition-colors ${statusConfig[tarefa.status].color}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={`Mudar status: ${statusConfig[tarefa.status].label}`}
                        >
                          {getStatusIcon(tarefa.status)}
                        </motion.button>

                        <div className="relative">
                          <motion.button
                            onClick={() => setExpandedTarefa(expandedTarefa === tarefa.id ? null : tarefa.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </motion.button>

                          <AnimatePresence>
                            {expandedTarefa === tarefa.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      onView(tarefa)
                                      setExpandedTarefa(null)
                                    }}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span>Visualizar</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      onEdit(tarefa)
                                      setExpandedTarefa(null)
                                    }}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span>Editar</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      onDelete(tarefa.id)
                                      setExpandedTarefa(null)
                                    }}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Excluir</span>
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
