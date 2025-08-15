export interface User {
  id: string;
  email: string;
  nome: string;
  plano: 'free' | 'trial' | 'premium';
  statusPagamento: 'ativo' | 'pendente' | 'cancelado' | 'expirado';
  dataCadastro: Date;
  ultimoLogin: Date;
  dataExpiracaoTrial?: Date;
  dataExpiracaoPremium?: Date;
  limiteClientes: number;
  limiteDiagnosticos: number;
  limiteTarefas: number;
  limiteReunioes: number;
  totalClientes: number;
  totalDiagnosticos: number;
  totalTarefas: number;
  totalReunioes: number;
  empresa?: string;
  telefone?: string;
  cpf?: string;
  endereco?: {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

export interface AuthRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
  empresa?: string;
  telefone?: string;
  cpf?: string;
}

export interface PlanLimits {
  free: {
    clientes: 3;
    diagnosticos: 1;
    tarefas: 10;
    reunioes: 5;
    diasTrial: 7;
  };
  trial: {
    clientes: 10;
    diagnosticos: 5;
    tarefas: 50;
    reunioes: 20;
    diasTrial: 14;
  };
  premium: {
    clientes: -1; // ilimitado
    diagnosticos: -1; // ilimitado
    tarefas: -1; // ilimitado
    reunioes: -1; // ilimitado
    diasTrial: 0;
  };
}

export interface PaymentInfo {
  id: string;
  userId: string;
  plano: 'trial' | 'premium';
  valor: number;
  status: 'pendente' | 'aprovado' | 'cancelado' | 'reembolsado';
  metodoPagamento: 'pix' | 'cartao' | 'boleto';
  dataPagamento?: Date;
  dataExpiracao: Date;
  gatewayPagamento?: string;
  codigoTransacao?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}
