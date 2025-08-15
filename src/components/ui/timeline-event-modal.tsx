'use client'

import { useState, useEffect } from 'react'
import { TimelineEvent, TimelineEventFormData, TimelineEventType, TimelineEventImportance, timelineEventConfig } from '@/lib/types/timeline'
import { Modal } from './modal'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Textarea } from './textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Calendar, Save, X } from 'lucide-react'

interface TimelineEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TimelineEventFormData) => Promise<void>
  evento?: TimelineEvent | null
  clienteId: string
  loading?: boolean
}

export function TimelineEventModal({
  isOpen,
  onClose,
  onSubmit,
  evento,
  clienteId,
  loading = false
}: TimelineEventModalProps) {
  const [formData, setFormData] = useState<TimelineEventFormData>({
    clienteId,
    tipo: 'reuniao',
    titulo: '',
    descricao: '',
    data: new Date(),
    autor: '',
    importancia: 'medio'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens/closes or evento changes
  useEffect(() => {
    if (isOpen) {
      if (evento) {
        setFormData({
          clienteId: evento.clienteId,
          tipo: evento.tipo,
          titulo: evento.titulo,
          descricao: evento.descricao,
          data: evento.data,
          autor: evento.autor,
          importancia: evento.importancia,
          dadosAdicionais: evento.dadosAdicionais
        })
      } else {
        setFormData({
          clienteId,
          tipo: 'reuniao',
          titulo: '',
          descricao: '',
          data: new Date(),
          autor: '',
          importancia: 'medio'
        })
      }
      setErrors({})
    }
  }, [isOpen, evento, clienteId])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório'
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória'
    }

    if (!formData.autor.trim()) {
      newErrors.autor = 'Autor é obrigatório'
    }

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
    }
  }

  const handleInputChange = (field: keyof TimelineEventFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={evento ? 'Editar Evento' : 'Novo Evento'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tipo">Tipo de Evento *</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => handleInputChange('tipo', value as TimelineEventType)}
            >
              <SelectTrigger className={errors.tipo ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(timelineEventConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span>{config.icon}</span>
                      <span>{config.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>}
          </div>

          <div>
            <Label htmlFor="importancia">Importância *</Label>
            <Select
              value={formData.importancia}
              onValueChange={(value) => handleInputChange('importancia', value as TimelineEventImportance)}
            >
              <SelectTrigger className={errors.importancia ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixo">Baixo</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="alto">Alto</SelectItem>
                <SelectItem value="critico">Crítico</SelectItem>
                <SelectItem value="celebrativo">Celebrativo</SelectItem>
              </SelectContent>
            </Select>
            {errors.importancia && <p className="text-red-500 text-sm mt-1">{errors.importancia}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="titulo">Título *</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => handleInputChange('titulo', e.target.value)}
            placeholder="Digite o título do evento..."
            className={errors.titulo ? 'border-red-500' : ''}
          />
          {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
        </div>

        <div>
          <Label htmlFor="descricao">Descrição *</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            placeholder="Descreva detalhadamente o evento..."
            rows={4}
            className={errors.descricao ? 'border-red-500' : ''}
          />
          {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="data">Data e Hora *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="data"
                type="datetime-local"
                value={formData.data ? new Date(formData.data.getTime() - formData.data.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : new Date()
                  handleInputChange('data', date)
                }}
                className={`pl-10 ${errors.data ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.data && <p className="text-red-500 text-sm mt-1">{errors.data}</p>}
          </div>

          <div>
            <Label htmlFor="autor">Autor *</Label>
            <Input
              id="autor"
              value={formData.autor}
              onChange={(e) => handleInputChange('autor', e.target.value)}
              placeholder="Nome do responsável..."
              className={errors.autor ? 'border-red-500' : ''}
            />
            {errors.autor && <p className="text-red-500 text-sm mt-1">{errors.autor}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : evento ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
