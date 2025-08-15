import { useState, useEffect } from 'react'
import { TimelineEvent, TimelineEventFormData, TimelineFilters, TimelineStats } from '@/lib/types/timeline'
import { getTimelineTestEvents } from '@/lib/data/timeline-test-data'

interface UseTimelinePositiveReturn {
  events: TimelineEvent[]
  stats: TimelineStats
  loading: boolean
  error: string | null
  filters: TimelineFilters
  setFilters: (filters: TimelineFilters) => void
  addEvent: (data: TimelineEventFormData) => Promise<void>
  updateEvent: (id: string, data: TimelineEventFormData) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  refreshEvents: () => Promise<void>
  refreshStats: () => Promise<void>
}

export function useTimelinePositive(clientId: string): UseTimelinePositiveReturn {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [stats, setStats] = useState<TimelineStats>({
    totalEvents: 0,
    eventsByFamily: {
      milestone: 0,
      launch: 0,
      optimization: 0,
      report: 0,
      meeting: 0
    },
    eventsByImportance: {
      low: 0,
      medium: 0,
      high: 0
    },
    eventsLast30Days: 0,
    milestonesReached: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TimelineFilters>({})

  // Carregar eventos
  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Usar dados de teste por enquanto
      const testEvents = getTimelineTestEvents(clientId)
      setEvents(testEvents)
      
      // Calcular estatísticas
      calculateStats(testEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }

  // Calcular estatísticas
  const calculateStats = (eventsList: TimelineEvent[]) => {
    const newStats: TimelineStats = {
      totalEvents: eventsList.length,
      eventsByFamily: {
        milestone: 0,
        launch: 0,
        optimization: 0,
        report: 0,
        meeting: 0
      },
      eventsByImportance: {
        low: 0,
        medium: 0,
        high: 0
      },
      eventsLast30Days: 0,
      milestonesReached: 0
    }

    eventsList.forEach(event => {
      // Contar por família
      newStats.eventsByFamily[event.family]++
      
      // Contar por importância
      newStats.eventsByImportance[event.importance]++
      
      // Contar eventos dos últimos 30 dias
      const eventDate = new Date(event.date)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      if (eventDate >= thirtyDaysAgo) {
        newStats.eventsLast30Days++
      }
      
      // Contar marcos
      if (event.family === 'milestone') {
        newStats.milestonesReached++
      }
    })

    setStats(newStats)
  }

  // Adicionar evento
  const addEvent = async (data: TimelineEventFormData) => {
    try {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newEvent: TimelineEvent = {
        id: `event-${Date.now()}`,
        clientId: data.clientId,
        date: data.date,
        family: data.family,
        importance: data.importance,
        title: data.title,
        description: data.description,
        author: data.author,
        impact: data.impact,
        links: data.links,
        attachments: data.attachments,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const updatedEvents = [...events, newEvent]
      setEvents(updatedEvents)
      calculateStats(updatedEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar evento')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Atualizar evento
  const updateEvent = async (id: string, data: TimelineEventFormData) => {
    try {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const updatedEvents = events.map(event => 
        event.id === id 
          ? { 
              ...event, 
              ...data,
              updatedAt: new Date().toISOString()
            }
          : event
      )
      
      setEvents(updatedEvents)
      calculateStats(updatedEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar evento')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Deletar evento
  const deleteEvent = async (id: string) => {
    try {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const updatedEvents = events.filter(event => event.id !== id)
      setEvents(updatedEvents)
      calculateStats(updatedEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar evento')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Atualizar eventos
  const refreshEvents = async () => {
    await loadEvents()
  }

  // Atualizar estatísticas
  const refreshStats = async () => {
    calculateStats(events)
  }

  // Carregar eventos na montagem do componente
  useEffect(() => {
    if (clientId) {
      loadEvents()
    }
  }, [clientId])

  return {
    events,
    stats,
    loading,
    error,
    filters,
    setFilters,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents,
    refreshStats
  }
}




