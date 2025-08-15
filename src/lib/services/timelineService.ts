import { TimelineEvent, TimelineEventFormData, TimelineFilters, TimelineStats } from '@/lib/types/timeline'
import { config as apiConfig } from '../config'

// Função para obter o token de autenticação
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

// Função para fazer requisições autenticadas
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${apiConfig.apiUrl}${endpoint}`, config)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
    throw new Error(error.error || `Erro ${response.status}`)
  }

  return response.json()
}

// Função para converter data de forma segura
const parseDate = (dateString: string | Date): Date => {
  if (dateString instanceof Date) {
    return dateString
  }
  
  if (!dateString) {
    return new Date()
  }
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return new Date()
    }
    return date
  } catch {
    return new Date()
  }
}

// Dados mockados para desenvolvimento
const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    clienteId: 'cliente_1',
    tipo: 'reuniao',
    titulo: 'Reunião de Alinhamento Inicial',
    descricao: 'Primeira reunião com o cliente para entender objetivos e expectativas do projeto.',
    data: new Date('2024-01-15T10:00:00'),
    autor: 'João Silva',
    importancia: 'alto',
    criadoEm: new Date('2024-01-15T10:00:00'),
    atualizadoEm: new Date('2024-01-15T10:00:00')
  },
  {
    id: '2',
    clienteId: 'cliente_1',
    tipo: 'analise_kpi',
    titulo: 'Análise de Performance - Semana 1',
    descricao: 'Análise dos primeiros resultados das campanhas. CTR: 2.5%, CPC: R$ 1.20',
    data: new Date('2024-01-22T14:30:00'),
    autor: 'Maria Santos',
    importancia: 'medio',
    criadoEm: new Date('2024-01-22T14:30:00'),
    atualizadoEm: new Date('2024-01-22T14:30:00')
  },
  {
    id: '3',
    clienteId: 'cliente_1',
    tipo: 'otimizacao',
    titulo: 'Otimização de Campanha Facebook',
    descricao: 'Pausa de 2 criativos com baixo CTR. Ajuste de público-alvo para melhorar performance.',
    data: new Date('2024-01-25T09:15:00'),
    autor: 'Carlos Oliveira',
    importancia: 'medio',
    criadoEm: new Date('2024-01-25T09:15:00'),
    atualizadoEm: new Date('2024-01-25T09:15:00')
  },
  {
    id: '4',
    clienteId: 'cliente_1',
    tipo: 'meta_batida',
    titulo: 'Meta de ROAS 10x Alcançada!',
    descricao: 'Parabéns! Batemos a meta de ROAS 10x. Resultado: 12.5x ROAS no período.',
    data: new Date('2024-02-01T16:00:00'),
    autor: 'Sistema',
    importancia: 'celebrativo',
    criadoEm: new Date('2024-02-01T16:00:00'),
    atualizadoEm: new Date('2024-02-01T16:00:00')
  },
  {
    id: '5',
    clienteId: 'cliente_1',
    tipo: 'alerta',
    titulo: 'Verba de Campanha Baixa',
    descricao: 'Atenção: Verba da campanha principal está com apenas 15% restante.',
    data: new Date('2024-02-05T11:30:00'),
    autor: 'Sistema',
    importancia: 'critico',
    criadoEm: new Date('2024-02-05T11:30:00'),
    atualizadoEm: new Date('2024-02-05T11:30:00')
  },
  {
    id: '6',
    clienteId: 'cliente_1',
    tipo: 'criativo',
    titulo: 'Novo Criativo Aprovado',
    descricao: 'Novo criativo foi aprovado pelo cliente e ativado na campanha.',
    data: new Date('2024-02-08T13:45:00'),
    autor: 'Ana Costa',
    importancia: 'medio',
    criadoEm: new Date('2024-02-08T13:45:00'),
    atualizadoEm: new Date('2024-02-08T13:45:00')
  }
]

export const timelineService = {
  // Buscar eventos da timeline por cliente
  getByCliente: async (clienteId: string, filters?: TimelineFilters): Promise<TimelineEvent[]> => {
    try {
      const queryParams = new URLSearchParams()
      if (filters?.tipo) queryParams.append('tipo', filters.tipo)
      if (filters?.importancia) queryParams.append('importancia', filters.importancia)
      if (filters?.dataInicio) queryParams.append('dataInicio', filters.dataInicio.toISOString())
      if (filters?.dataFim) queryParams.append('dataFim', filters.dataFim.toISOString())
      if (filters?.autor) queryParams.append('autor', filters.autor)

      const response = await apiRequest(`/timeline/cliente/${clienteId}?${queryParams.toString()}`)
      
      if (response.data?.eventos) {
        return response.data.eventos.map((evento: any) => ({
          ...evento,
          data: parseDate(evento.data),
          criadoEm: parseDate(evento.criadoEm),
          atualizadoEm: parseDate(evento.atualizadoEm)
        }))
      }
      
      return []
    } catch (error) {
      console.error('Erro ao buscar eventos da timeline:', error)
      // Retorna dados mockados quando a API não está disponível
      let eventos = mockTimelineEvents.filter(e => e.clienteId === clienteId)
      
      // Aplicar filtros nos dados mockados
      if (filters) {
        if (filters.tipo) {
          eventos = eventos.filter(e => e.tipo === filters.tipo)
        }
        if (filters.importancia) {
          eventos = eventos.filter(e => e.importancia === filters.importancia)
        }
        if (filters.dataInicio) {
          eventos = eventos.filter(e => e.data >= filters.dataInicio!)
        }
        if (filters.dataFim) {
          eventos = eventos.filter(e => e.data <= filters.dataFim!)
        }
        if (filters.autor) {
          eventos = eventos.filter(e => e.autor.toLowerCase().includes(filters.autor!.toLowerCase()))
        }
      }
      
      return eventos.sort((a, b) => b.data.getTime() - a.data.getTime())
    }
  },

  // Buscar evento específico
  getById: async (id: string): Promise<TimelineEvent | null> => {
    try {
      const response = await apiRequest(`/timeline/evento/${id}`)
      const evento = response.data?.evento
      
      if (evento) {
        return {
          ...evento,
          data: parseDate(evento.data),
          criadoEm: parseDate(evento.criadoEm),
          atualizadoEm: parseDate(evento.atualizadoEm)
        }
      }
      
      return null
    } catch (error) {
      console.error('Erro ao buscar evento:', error)
      const evento = mockTimelineEvents.find(e => e.id === id)
      return evento || null
    }
  },

  // Criar novo evento
  create: async (data: TimelineEventFormData): Promise<TimelineEvent> => {
    try {
      const response = await apiRequest('/timeline/evento', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      const evento = response.data?.evento
      return {
        ...evento,
        data: parseDate(evento.data),
        criadoEm: parseDate(evento.criadoEm),
        atualizadoEm: parseDate(evento.atualizadoEm)
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error)
      throw error
    }
  },

  // Atualizar evento
  update: async (id: string, data: Partial<TimelineEventFormData>): Promise<TimelineEvent> => {
    try {
      const response = await apiRequest(`/timeline/evento/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      
      const evento = response.data?.evento
      return {
        ...evento,
        data: parseDate(evento.data),
        criadoEm: parseDate(evento.criadoEm),
        atualizadoEm: parseDate(evento.atualizadoEm)
      }
    } catch (error) {
      console.error('Erro ao atualizar evento:', error)
      throw error
    }
  },

  // Deletar evento
  delete: async (id: string): Promise<boolean> => {
    try {
      await apiRequest(`/timeline/evento/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (error) {
      console.error('Erro ao deletar evento:', error)
      return false
    }
  },

  // Buscar estatísticas da timeline
  getStats: async (clienteId: string): Promise<TimelineStats> => {
    try {
      const response = await apiRequest(`/timeline/stats/${clienteId}`)
      return response.data?.stats
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      
      // Calcular estatísticas dos dados mockados
      const eventos = mockTimelineEvents.filter(e => e.clienteId === clienteId)
      const agora = new Date()
      const trintaDiasAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      const eventosPorTipo = eventos.reduce((acc, evento) => {
        acc[evento.tipo] = (acc[evento.tipo] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const eventosPorImportancia = eventos.reduce((acc, evento) => {
        acc[evento.importancia] = (acc[evento.importancia] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const eventosUltimos30Dias = eventos.filter(e => e.data >= trintaDiasAtras).length
      const marcosAlcancados = eventos.filter(e => e.tipo === 'meta_batida' || e.tipo === 'marco').length
      
      return {
        totalEventos: eventos.length,
        eventosPorTipo: eventosPorTipo as any,
        eventosPorImportancia: eventosPorImportancia as any,
        eventosUltimos30Dias,
        marcosAlcancados
      }
    }
  },

  // Criar evento automático do sistema
  createSystemEvent: async (
    clienteId: string, 
    tipo: TimelineEvent['tipo'], 
    titulo: string, 
    descricao: string,
    importancia: TimelineEvent['importancia'],
    dadosAdicionais?: any
  ): Promise<TimelineEvent> => {
    const systemEventData: TimelineEventFormData = {
      clienteId,
      tipo,
      titulo,
      descricao,
      data: new Date(),
      autor: 'Sistema',
      importancia,
      dadosAdicionais
    }
    
    return timelineService.create(systemEventData)
  }
}
