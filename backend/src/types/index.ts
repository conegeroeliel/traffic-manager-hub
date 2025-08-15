// User types
export interface User {
  id: string;
  nome: string;
  email: string;
  empresa?: string;
  plano: 'trial' | 'premium';
  criadoEm: Date;
  atualizadoEm: Date;
}

// Client types
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  segmento: string;
  observacoes?: string;
  userId: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

// Diagnosis types
export interface DiagnosisFormData {
  tipoNegocio: string;
  tempoMercado: string;
  faturamentoMensal: string;
  publicoAlvo: string;
  problemaPrincipal: string;
  produto: string;
  precoMedio: string;
  diferenciais: string;
  presencaDigital: string[];
  investimentoMarketing: string;
  principalCanal: string;
  principais3Concorrentes: string;
  diferencialConcorrencia: string;
  maioresDificuldades: string;
  resultadosEsperados: string;
}

export interface Diagnostico {
  id: string;
  clienteId: string;
  userId: string;
  formData: DiagnosisFormData;
  diagnosis: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

// Calculator types
export interface CalculatorInput {
  clienteId: string;
  investimentoMensal: number;
  ticketMedio: number;
  taxaConversao: number;
  custoPorClique?: number;
  taxaRejeicao?: number;
  tempoRetorno?: number;
  cenario: 'conservador' | 'realista' | 'otimista';
}

export interface CalculatorResults {
  visitasMensais: number;
  leadsMensais: number;
  vendasMensais: number;
  faturamentoMensal: number;
  roas: number;
  lucroLiquido: number;
  custoPorLead: number;
  custoPorVenda: number;
  projecao12Meses: {
    faturamento: number;
    lucro: number;
    investimento: number;
    roi: number;
  };
}

export interface Calculo {
  id: string;
  clienteId: string;
  userId: string;
  inputData: CalculatorInput;
  resultados: CalculatorResults;
  criadoEm: Date;
}

// Task types
export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  clienteId?: string;
  userId: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  dataVencimento?: Date;
  tags: string[];
  criadoEm: Date;
  atualizadoEm: Date;
  concluidaEm?: Date;
}

// Meeting types
export interface Reuniao {
  id: string;
  titulo: string;
  descricao?: string;
  clienteId?: string;
  userId: string;
  dataHora: Date;
  duracao: number; // in minutes
  tipo: 'presencial' | 'online' | 'telefone';
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada';
  linkReuniao?: string;
  observacoes?: string;
  participantes: string[];
  criadoEm: Date;
  atualizadoEm: Date;
  realizadaEm?: Date;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  error?: string;
  statusCode?: number;
  timestamp?: string;
}

// Error types
export interface APIError {
  message: string;
  statusCode: number;
  details?: any;
  stack?: string;
}