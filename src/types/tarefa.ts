export type TarefaStatus = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada'
export type TarefaPrioridade = 'baixa' | 'media' | 'alta' | 'urgente'
export type TarefaCategoria = 'cliente' | 'campanha' | 'relatorio' | 'reuniao' | 'outro'

export interface Tarefa {
  id: number
  titulo: string
  descricao?: string
  status: TarefaStatus
  prioridade: TarefaPrioridade
  categoria: TarefaCategoria
  clienteId?: number
  clienteNome?: string
  dataCriacao: string
  dataVencimento?: string
  dataConclusao?: string
  responsavelId?: number
  responsavelNome?: string
  tags?: string[]
  anexos?: Array<{
    id: number
    nome: string
    url: string
    tipo: string
  }>
  comentarios?: Array<{
    id: number
    texto: string
    autorId: number
    autorNome: string
    data: string
  }>
}

export interface CriarTarefaData {
  titulo: string
  descricao?: string
  prioridade: TarefaPrioridade
  categoria: TarefaCategoria
  clienteId?: number
  dataVencimento?: string
  responsavelId?: number
  tags?: string[]
}

export interface AtualizarTarefaData {
  titulo?: string
  descricao?: string
  status?: TarefaStatus
  prioridade?: TarefaPrioridade
  categoria?: TarefaCategoria
  clienteId?: number
  dataVencimento?: string
  responsavelId?: number
  tags?: string[]
}

export interface FiltrosTarefa {
  status?: TarefaStatus[]
  prioridade?: TarefaPrioridade[]
  categoria?: TarefaCategoria[]
  clienteId?: number
  responsavelId?: number
  dataInicio?: string
  dataFim?: string
  busca?: string
}

export interface EstatisticasTarefa {
  total: number
  pendentes: number
  emAndamento: number
  concluidas: number
  canceladas: number
  vencidas: number
  porPrioridade: {
    baixa: number
    media: number
    alta: number
    urgente: number
  }
  porCategoria: {
    cliente: number
    campanha: number
    relatorio: number
    reuniao: number
    outro: number
  }
}
