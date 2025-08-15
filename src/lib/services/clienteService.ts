import { config as apiConfig } from '../config'

export interface Cliente {
  id: string
  nome: string
  email?: string
  telefone?: string
  empresa?: string
  endereco?: string
  observacoes?: string
  status: 'ATIVO' | 'INATIVO' | 'PROSPECTO'
  dataCadastro: string
  ultimaAtualizacao: string
  userId: string
  tarefas?: Tarefa[]
  reunioes?: Reuniao[]
  diagnosticos?: Diagnostico[]
}

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
}

export interface Reuniao {
  id: string
  titulo: string
  descricao?: string
  dataHora: string
  tipo: 'APRESENTACAO' | 'FOLLOW_UP' | 'ESTRATEGIA' | 'REVISAO'
  status: 'AGENDADA' | 'CONFIRMADA' | 'REALIZADA' | 'CANCELADA'
  observacoes?: string
  dataCriacao: string
  userId: string
  clienteId?: string
}

export interface Diagnostico {
  id: string
  titulo: string
  descricao?: string
  resultado: string
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO'
  dataCriacao: string
  dataConclusao?: string
  userId: string
  clienteId?: string
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

export const clienteService = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await apiRequest('/clientes')
    return response.data
  },

  getById: async (id: string): Promise<Cliente> => {
    const response = await apiRequest(`/clientes/${id}`)
    return response.data
  },

  create: async (data: Omit<Cliente, 'id' | 'dataCadastro' | 'ultimaAtualizacao' | 'userId'>): Promise<Cliente> => {
    const response = await apiRequest('/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.data
  },

  update: async (id: string, data: Partial<Cliente>): Promise<Cliente> => {
    const response = await apiRequest(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest(`/clientes/${id}`, {
      method: 'DELETE',
    })
  },
} 