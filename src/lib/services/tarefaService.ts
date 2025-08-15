import { config as apiConfig } from '../config'

export interface Tarefa {
  id: string
  titulo: string
  descricao?: string
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA'
  dataCriacao: string
  dataVencimento?: string
  dataConclusao?: string
  userId: string
  clienteId?: string
  cliente?: {
    id: string
    nome: string
    empresa?: string
  }
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${apiConfig.apiUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Erro na requisição')
  }

  return response.json()
}

export const tarefaService = {
  getAll: async (): Promise<Tarefa[]> => {
    const response = await apiRequest('/tarefas')
    return response.data
  },

  getById: async (id: string): Promise<Tarefa> => {
    const response = await apiRequest(`/tarefas/${id}`)
    return response.data
  },

  create: async (data: Omit<Tarefa, 'id' | 'dataCriacao' | 'userId'>): Promise<Tarefa> => {
    const response = await apiRequest('/tarefas', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  },

  update: async (id: string, data: Partial<Tarefa>): Promise<Tarefa> => {
    const response = await apiRequest(`/tarefas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest(`/tarefas/${id}`, {
      method: 'DELETE',
    })
  },

  // Funções auxiliares para filtrar tarefas
  getByStatus: async (status: Tarefa['status']): Promise<Tarefa[]> => {
    const tarefas = await tarefaService.getAll()
    return tarefas.filter(tarefa => tarefa.status === status)
  },

  getByPrioridade: async (prioridade: Tarefa['prioridade']): Promise<Tarefa[]> => {
    const tarefas = await tarefaService.getAll()
    return tarefas.filter(tarefa => tarefa.prioridade === prioridade)
  },

  getVencidas: async (): Promise<Tarefa[]> => {
    const tarefas = await tarefaService.getAll()
    const agora = new Date()
    
    return tarefas.filter(tarefa => {
      if (!tarefa.dataVencimento || tarefa.status === 'CONCLUIDA' || tarefa.status === 'CANCELADA') {
        return false
      }
      
      const dataVencimento = new Date(tarefa.dataVencimento)
      return dataVencimento < agora
    })
  },

  getProximasVencimento: async (dias: number = 7): Promise<Tarefa[]> => {
    const tarefas = await tarefaService.getAll()
    const agora = new Date()
    const limite = new Date(agora.getTime() + dias * 24 * 60 * 60 * 1000)
    
    return tarefas.filter(tarefa => {
      if (!tarefa.dataVencimento || tarefa.status === 'CONCLUIDA' || tarefa.status === 'CANCELADA') {
        return false
      }
      
      const dataVencimento = new Date(tarefa.dataVencimento)
      return dataVencimento >= agora && dataVencimento <= limite
    })
  },
}
