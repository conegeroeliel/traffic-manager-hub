export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  empresa: string
  setor: string
  dataCadastro: Date
  status: 'ativo' | 'inativo' | 'prospecto'
  observacoes?: string
  endereco?: {
    rua: string
    cidade: string
    estado: string
    cep: string
  }
  redesSociais?: {
    instagram?: string
    facebook?: string
    linkedin?: string
    website?: string
  }
}

export interface Campanha {
  id: string
  clienteId: string
  nome: string
  plataforma: 'facebook' | 'instagram' | 'google' | 'tiktok' | 'outros'
  dataInicio: Date
  dataFim?: Date
  investimento: number
  custoPorLead: number
  taxaConversao: number
  ticketMedio: number
  leadsGerados: number
  vendasRealizadas: number
  faturamento: number
  roi: number
  status: 'ativa' | 'pausada' | 'finalizada' | 'cancelada'
  observacoes?: string
}

export interface ClienteFormData {
  nome: string
  email: string
  telefone: string
  empresa: string
  setor: string
  status: 'ativo' | 'inativo' | 'prospecto'
  observacoes?: string
  endereco?: {
    rua: string
    cidade: string
    estado: string
    cep: string
  }
  redesSociais?: {
    instagram?: string
    facebook?: string
    linkedin?: string
    website?: string
  }
}

export interface CampanhaFormData {
  clienteId: string
  nome: string
  plataforma: 'facebook' | 'instagram' | 'google' | 'tiktok' | 'outros'
  dataInicio: Date
  dataFim?: Date
  investimento: number
  custoPorLead: number
  taxaConversao: number
  ticketMedio: number
  leadsGerados: number
  vendasRealizadas: number
  faturamento: number
  roi: number
  status: 'ativa' | 'pausada' | 'finalizada' | 'cancelada'
  observacoes?: string
} 