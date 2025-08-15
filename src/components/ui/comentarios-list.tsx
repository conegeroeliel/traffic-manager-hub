'use client'

import { motion } from 'framer-motion'
import { 
  User, 
  Clock, 
  Download,
  Eye,
  FileText,
  Image,
  File,
  Trash2
} from 'lucide-react'

interface Comentario {
  id: number
  texto: string
  autorId: number
  autorNome: string
  data: string
  anexos?: Array<{
    id: number
    nome: string
    url: string
    tipo: string
    tamanho?: number
  }>
}

interface ComentariosListProps {
  comentarios: Comentario[]
  onDeleteComment?: (commentId: number) => Promise<void>
  currentUserId?: number
}

export function ComentariosList({ 
  comentarios, 
  onDeleteComment,
  currentUserId 
}: ComentariosListProps) {
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
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getFileIcon = (tipo: string) => {
    if (tipo.startsWith('image/')) return Image
    if (tipo.includes('pdf')) return FileText
    return File
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = (anexo: NonNullable<Comentario['anexos']>[0]) => {
    // Simular download - em produção, isso seria um link real
    const link = document.createElement('a')
    link.href = anexo.url
    link.download = anexo.nome
    link.click()
  }

  const handleDelete = async (commentId: number) => {
    if (onDeleteComment) {
      try {
        await onDeleteComment(commentId)
      } catch (error) {
        console.error('Erro ao deletar comentário:', error)
      }
    }
  }

  if (comentarios.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 dark:text-gray-500 mb-2">
          <User className="h-12 w-12 mx-auto" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Nenhum comentário ainda.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Seja o primeiro a comentar!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comentarios.map((comentario, index) => (
        <motion.div
          key={comentario.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
        >
          {/* Header do comentário */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {comentario.autorNome}
                </p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(comentario.data)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Botão de deletar (apenas para o autor) */}
            {currentUserId === comentario.autorId && onDeleteComment && (
              <motion.button
                onClick={() => handleDelete(comentario.id)}
                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Deletar comentário"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            )}
          </div>

          {/* Texto do comentário */}
          <div className="mb-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {comentario.texto}
            </p>
          </div>

          {/* Anexos */}
          {comentario.anexos && comentario.anexos.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Anexos ({comentario.anexos.length})
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {comentario.anexos.map((anexo) => {
                  const Icon = getFileIcon(anexo.tipo)
                  return (
                    <motion.div
                      key={anexo.id}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                            {anexo.nome}
                          </p>
                          {anexo.tamanho && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatFileSize(anexo.tamanho)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <motion.button
                          onClick={() => handleDownload(anexo)}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Download"
                        >
                          <Download className="h-3 w-3" />
                        </motion.button>
                        
                        {anexo.tipo.startsWith('image/') && (
                          <motion.button
                            onClick={() => window.open(anexo.url, '_blank')}
                            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Visualizar"
                          >
                            <Eye className="h-3 w-3" />
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
