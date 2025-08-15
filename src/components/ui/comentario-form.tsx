'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, 
  Paperclip, 
  X,
  FileText,
  Image,
  File
} from 'lucide-react'

interface ComentarioFormProps {
  onSubmit: (texto: string, anexos: File[]) => Promise<void>
  isLoading?: boolean
  placeholder?: string
}

export function ComentarioForm({ 
  onSubmit, 
  isLoading = false, 
  placeholder = "Adicionar comentário..." 
}: ComentarioFormProps) {
  const [texto, setTexto] = useState('')
  const [anexos, setAnexos] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!texto.trim() && anexos.length === 0) return

    try {
      await onSubmit(texto.trim(), anexos)
      setTexto('')
      setAnexos([])
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).filter(file => {
      // Validar tamanho (máximo 10MB por arquivo)
      if (file.size > 10 * 1024 * 1024) {
        alert(`Arquivo ${file.name} é muito grande. Máximo 10MB.`)
        return false
      }
      return true
    })

    setAnexos(prev => [...prev, ...newFiles])
  }

  const handleRemoveFile = (index: number) => {
    setAnexos(prev => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type.includes('pdf')) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Área de texto */}
      <div className="relative">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
        
        {/* Botão de anexo */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Paperclip className="h-4 w-4" />
        </button>
      </div>

      {/* Área de upload de arquivos */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />
        
        <div className="text-center">
          <Paperclip className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Arraste arquivos aqui ou{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              clique para selecionar
            </button>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Máximo 10MB por arquivo
          </p>
        </div>
      </div>

      {/* Lista de arquivos selecionados */}
      {anexos.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Anexos ({anexos.length})
          </h4>
          <div className="space-y-2">
            {anexos.map((file, index) => {
              const Icon = getFileIcon(file)
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Botão de envio */}
      <div className="flex justify-end">
        <motion.button
          type="submit"
          disabled={isLoading || (!texto.trim() && anexos.length === 0)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send className="h-4 w-4" />
          <span>{isLoading ? 'Enviando...' : 'Enviar'}</span>
        </motion.button>
      </div>
    </form>
  )
}
