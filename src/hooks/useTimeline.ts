import { useState, useEffect, useCallback } from 'react'
import { TimelineEvent, TimelineEventFormData, TimelineFilters, TimelineStats } from '@/lib/types/timeline'
import { timelineService } from '@/lib/services/timelineService'
import { getTimelineTestEvents } from '@/lib/data/timeline-test-data'

interface UseTimelineReturn {
  eventos: TimelineEvent[]
  stats: TimelineStats | null
  loading: boolean
  error: string | null
  filters: TimelineFilters
  setFilters: (filters: TimelineFilters) => void
  addEvent: (data: TimelineEventFormData) => Promise<void>
  updateEvent: (id: string, data: Partial<TimelineEventFormData>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  refreshEvents: () => Promise<void>
  refreshStats: () => Promise<void>
}

export const useTimeline = (clienteId: string | undefined): UseTimelineReturn => {
  const [eventos, setEventos] = useState<TimelineEvent[]>([])
  const [stats, setStats] = useState<TimelineStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TimelineFilters>({})

  // Função para carregar eventos
  const loadEvents = useCallback(async () => {
    if (!clienteId) {
      setEventos([])
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // Para demonstração, usar dados de teste
      // Em produção, usar: const eventosData = await timelineService.getByCliente(clienteId, filters)
      const eventosData = getTimelineTestEvents(clienteId)
      
      // Aplicar filtros aos dados de teste
      let eventosFiltrados = eventosData
      
      if (filters.tipo) {
        eventosFiltrados = eventosFiltrados.filter(evento => evento.tipo === filters.tipo)
      }
      
      if (filters.importancia) {
        eventosFiltrados = eventosFiltrados.filter(evento => evento.importancia === filters.importancia)
      }
      
      if (filters.autor) {
        eventosFiltrados = eventosFiltrados.filter(evento => 
          evento.autor.toLowerCase().includes(filters.autor!.toLowerCase())
        )
      }
      
      setEventos(eventosFiltrados)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos')
      console.error('Erro ao carregar eventos:', err)
    } finally {
      setLoading(false)
    }
  }, [clienteId, filters])

  // Função para carregar estatísticas
  const loadStats = useCallback(async () => {
    if (!clienteId) {
      setStats(null)
      return
    }
    
    try {
      // Para demonstração, gerar estatísticas dos dados de teste
      // Em produção, usar: const statsData = await timelineService.getStats(clienteId)
      const eventosData = getTimelineTestEvents(clienteId)
      
      const totalEventos = eventosData.length
      const agora = new Date()
      const trintaDiasAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      const eventosUltimos30Dias = eventosData.filter(evento => 
        evento.data >= trintaDiasAtras
      ).length
      
      const eventosPorImportancia = eventosData.reduce((acc, evento) => {
        acc[evento.importancia] = (acc[evento.importancia] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const marcosAlcancados = eventosData.filter(evento => 
        evento.importancia === 'celebrativo'
      ).length
      
      const statsData: TimelineStats = {
        totalEventos,
        eventosUltimos30Dias,
        marcosAlcancados,
        eventosPorImportancia
      }
      
      setStats(statsData)
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err)
    }
  }, [clienteId])

  // Carregar dados iniciais
  useEffect(() => {
    loadEvents()
    loadStats()
  }, [loadEvents, loadStats])

  // Função para adicionar evento
  const addEvent = useCallback(async (data: TimelineEventFormData) => {
    try {
      setError(null)
      const novoEvento = await timelineService.create(data)
      setEventos(prev => [novoEvento, ...prev])
      
      // Atualizar estatísticas
      await loadStats()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar evento')
      throw err
    }
  }, [loadStats])

  // Função para atualizar evento
  const updateEvent = useCallback(async (id: string, data: Partial<TimelineEventFormData>) => {
    try {
      setError(null)
      const eventoAtualizado = await timelineService.update(id, data)
      setEventos(prev => 
        prev.map(evento => 
          evento.id === id ? eventoAtualizado : evento
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar evento')
      throw err
    }
  }, [])

  // Função para deletar evento
  const deleteEvent = useCallback(async (id: string) => {
    try {
      setError(null)
      const success = await timelineService.delete(id)
      if (success) {
        setEventos(prev => prev.filter(evento => evento.id !== id))
        // Atualizar estatísticas
        await loadStats()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar evento')
      throw err
    }
  }, [loadStats])

  // Função para atualizar filtros
  const handleSetFilters = useCallback((newFilters: TimelineFilters) => {
    setFilters(newFilters)
  }, [])

  // Função para recarregar eventos
  const refreshEvents = useCallback(async () => {
    await loadEvents()
  }, [loadEvents])

  // Função para recarregar estatísticas
  const refreshStats = useCallback(async () => {
    await loadStats()
  }, [loadStats])

  return {
    eventos,
    stats,
    loading,
    error,
    filters,
    setFilters: handleSetFilters,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents,
    refreshStats
  }
}
