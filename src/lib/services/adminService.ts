import { config as apiConfig } from '../config'

export interface AdminUser {
  id: string;
  email: string;
  nome: string;
  plano: 'free' | 'trial' | 'premium';
  statusPagamento: 'ativo' | 'pendente' | 'cancelado' | 'expirado';
  dataCadastro: string;
  ultimoLogin: string;
  dataExpiracaoTrial?: string;
  dataExpiracaoPremium?: string;
  limiteClientes: number;
  limiteDiagnosticos: number;
  limiteTarefas: number;
  limiteReunioes: number;
  totalClientes: number;
  totalDiagnosticos: number;
  totalTarefas: number;
  totalReunioes: number;
}

export interface AdminPayment {
  id: string;
  userId: string;
  plano: 'trial' | 'premium';
  valor: number;
  status: 'pendente' | 'aprovado' | 'cancelado' | 'reembolsado';
  metodoPagamento: 'pix' | 'cartao' | 'boleto';
  dataPagamento?: string;
  dataExpiracao: string;
  gatewayPagamento?: string;
  codigoTransacao?: string;
}

export interface AdminStats {
  users: {
    total: number;
    free: number;
    trial: number;
    premium: number;
    ativo: number;
    pendente: number;
    cancelado: number;
    expirado: number;
  };
  payments: {
    total: number;
    pendente: number;
    aprovado: number;
    cancelado: number;
    reembolsado: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
  };
  usage: {
    totalClientes: number;
    totalDiagnosticos: number;
    totalTarefas: number;
    totalReunioes: number;
  };
}

export interface UpdateUserData {
  plano?: 'free' | 'trial' | 'premium';
  statusPagamento?: 'ativo' | 'pendente' | 'cancelado' | 'expirado';
  dataExpiracaoTrial?: string;
  dataExpiracaoPremium?: string;
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${apiConfig.apiUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Erro na requisição')
  }

  return response.json()
}

export const adminService = {
  // Obter todos os usuários
  getUsers: async (): Promise<{ users: AdminUser[]; total: number; stats: any }> => {
    try {
      const response = await apiRequest('/admin/users')
      return response.data
    } catch (error) {
      console.error('Erro ao obter usuários:', error)
      throw error
    }
  },

  // Obter detalhes de um usuário específico
  getUser: async (userId: string): Promise<{ user: AdminUser; payments: AdminPayment[]; limits: any; usage: any; percentage: any }> => {
    try {
      const response = await apiRequest(`/admin/users/${userId}`)
      return response.data
    } catch (error) {
      console.error('Erro ao obter usuário:', error)
      throw error
    }
  },

  // Atualizar usuário
  updateUser: async (userId: string, data: UpdateUserData): Promise<{ user: AdminUser }> => {
    try {
      const response = await apiRequest(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw error
    }
  },

  // Deletar usuário
  deleteUser: async (userId: string): Promise<void> => {
    try {
      await apiRequest(`/admin/users/${userId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      throw error
    }
  },

  // Obter todos os pagamentos
  getPayments: async (): Promise<{ payments: AdminPayment[]; total: number; stats: any }> => {
    try {
      const response = await apiRequest('/admin/payments')
      return response.data
    } catch (error) {
      console.error('Erro ao obter pagamentos:', error)
      throw error
    }
  },

  // Obter estatísticas do admin
  getStats: async (): Promise<AdminStats> => {
    try {
      const response = await apiRequest('/admin/stats')
      return response.data
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      throw error
    }
  }
}


