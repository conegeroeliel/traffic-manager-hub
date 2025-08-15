import { config as apiConfig } from '../config'

export interface PlanLimits {
  clientes: number;
  diagnosticos: number;
  tarefas: number;
  reunioes: number;
  diasTrial: number;
}

export interface PlanUsage {
  clientes: number;
  diagnosticos: number;
  tarefas: number;
  reunioes: number;
}

export interface PlanPercentage {
  clientes: number;
  diagnosticos: number;
  tarefas: number;
  reunioes: number;
}

export interface PlanInfo {
  plano: 'free' | 'trial' | 'premium';
  statusPagamento: 'ativo' | 'pendente' | 'cancelado' | 'expirado';
  limites: PlanLimits;
  uso: PlanUsage;
  porcentagem: PlanPercentage;
  dataExpiracaoTrial?: string;
  dataExpiracaoPremium?: string;
}

export interface AvailablePlan {
  id: 'free' | 'trial' | 'premium';
  nome: string;
  preco: number;
  periodo: string | null;
  recursos: string[];
  limitacoes: string[];
}

export interface UpgradeRequest {
  plano: 'trial' | 'premium';
  metodoPagamento: 'pix' | 'cartao' | 'boleto';
  valor: number;
}

export interface PaymentInfo {
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

export const planService = {
  // Obter limites e uso atual
  getLimits: async (): Promise<PlanInfo> => {
    try {
      const response = await apiRequest('/plans/limits')
      return response.data
    } catch (error) {
      console.error('Erro ao obter limites:', error)
      throw error
    }
  },

  // Obter planos disponíveis
  getAvailablePlans: async (): Promise<AvailablePlan[]> => {
    try {
      const response = await apiRequest('/plans/available')
      return response.data
    } catch (error) {
      console.error('Erro ao obter planos:', error)
      throw error
    }
  },

  // Fazer upgrade de plano
  upgrade: async (data: UpgradeRequest): Promise<any> => {
    try {
      const response = await apiRequest('/plans/upgrade', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      return response
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error)
      throw error
    }
  },

  // Obter histórico de pagamentos
  getPayments: async (): Promise<PaymentInfo[]> => {
    try {
      const response = await apiRequest('/plans/payments')
      return response.data
    } catch (error) {
      console.error('Erro ao obter pagamentos:', error)
      throw error
    }
  },

  // Cancelar assinatura
  cancel: async (): Promise<any> => {
    try {
      const response = await apiRequest('/plans/cancel', {
        method: 'POST'
      })
      return response
    } catch (error) {
      console.error('Erro ao cancelar:', error)
      throw error
    }
  }
}

