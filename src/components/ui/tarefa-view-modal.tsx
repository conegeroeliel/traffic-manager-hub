'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Modal } from './modal'
import { 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Calendar,
  User,
  Tag,
  MessageSquare,
  Paperclip,
  Edit,
  Trash2,
  Send
} from 'lucide-react'
import { Tarefa, TarefaStatus, TarefaPrioridade, TarefaCategoria } from '@/types/tarefa'
import { ComentarioForm } from './comentario-form'
import { ComentariosList } from './comentarios-list'

interface TarefaViewModalProps {
  tarefa: Tarefa | null
  isOpen: boolean
  onClose: () => void
  onEdit: (tarefa: Tarefa) => void
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: TarefaStatus) => void
  onAddComment?: (tarefaId: number, texto: string, anexos: File[]) => Promise<void>
  onDeleteComment?: (commentId: number) => Promise<void>
  currentUserId?: number
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

export function TarefaViewModal({ 
  tarefa, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onStatusChange,
  onAddComment,
  onDeleteComment,
  currentUserId
}: TarefaViewModalProps) {
  const [isAddingComment, setIsAddingComment] = useState(false)

  if (!tarefa) return null

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

  const handleStatusChange = () => {
    const statusOrder: TarefaStatus[] = ['pendente', 'em_andamento', 'concluida', 'cancelada']
    const currentIndex = statusOrder.indexOf(tarefa.status)
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
    onStatusChange(tarefa.id, nextStatus)
  }

  const handleAddComment = async (texto: string, anexos: File[]) => {
    if (onAddComment) {
      setIsAddingComment(true)
      try {
        await onAddComment(tarefa.id, texto, anexos)
      } catch (error) {
        console.error('Erro ao adicionar comentário:', error)
      } finally {
        setIsAddingComment(false)
      }
    }
  }

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDelete(tarefa.id)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes da Tarefa"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header com ações */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {tarefa.titulo}
            </h3>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[tarefa.status].color}`}>
                {statusConfig[tarefa.status].label}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${prioridadeConfig[tarefa.prioridade].color}`}>
                {prioridadeConfig[tarefa.prioridade].label}
              </span>
              {tarefa.categoria && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {tarefa.categoria}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handleStatusChange}
              className={`p-2 rounded-lg transition-colors ${statusConfig[tarefa.status].color}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={`Mudar status: ${statusConfig[tarefa.status].label}`}
            >
              {React.createElement(statusConfig[tarefa.status].icon, { className: 'h-5 w-5' })}
            </motion.button>
            
            <motion.button
              onClick={() => onEdit(tarefa)}
              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              onClick={handleDelete}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Descrição */}
        {tarefa.descricao && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Descrição</h4>
            <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              {tarefa.descricao}
            </p>
          </div>
        )}

        {/* Informações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Informações</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Criada em</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(tarefa.dataCriacao)}
                  </p>
                </div>
              </div>

              {tarefa.dataVencimento && (
                <div className="flex items-center space-x-3">
                  <Clock className={`h-4 w-4 ${isVencida(tarefa.dataVencimento) ? 'text-red-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Vence em</p>
                    <p className={`text-sm font-medium ${isVencida(tarefa.dataVencimento) ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {formatDate(tarefa.dataVencimento)}
                      {isVencida(tarefa.dataVencimento) && ' (Vencida)'}
                    </p>
                  </div>
                </div>
              )}

              {tarefa.dataConclusao && (
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Concluída em</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(tarefa.dataConclusao)}
                    </p>
                  </div>
                </div>
              )}

              {tarefa.clienteNome && (
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {tarefa.clienteNome}
                    </p>
                  </div>
                </div>
              )}

              {tarefa.responsavelNome && (
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Responsável</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {tarefa.responsavelNome}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {tarefa.tags && tarefa.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tarefa.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Anexos */}
        {tarefa.anexos && tarefa.anexos.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Anexos</h4>
            <div className="space-y-2">
              {tarefa.anexos.map((anexo) => (
                <div key={anexo.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Paperclip className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-white">{anexo.nome}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">({anexo.tipo})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comentários */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Comentários</h4>
          
          <ComentariosList
            comentarios={tarefa.comentarios || []}
            onDeleteComment={onDeleteComment}
            currentUserId={currentUserId}
          />

          {/* Formulário de comentário */}
          {onAddComment && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <ComentarioForm
                onSubmit={handleAddComment}
                isLoading={isAddingComment}
                placeholder="Adicionar comentário ou anexo..."
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
