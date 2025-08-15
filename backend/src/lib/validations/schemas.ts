import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  empresa: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

// Client schemas
export const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  empresa: z.string().optional(),
  segmento: z.string().min(2, 'Segmento é obrigatório'),
  observacoes: z.string().optional(),
});

export const updateClienteSchema = clienteSchema.partial();

// Diagnosis schemas
export const diagnosticoSchema = z.object({
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  
  // Negócio
  tipoNegocio: z.string().min(2, 'Tipo de negócio é obrigatório'),
  tempoMercado: z.string().min(1, 'Tempo no mercado é obrigatório'),
  faturamentoMensal: z.string().min(1, 'Faturamento mensal é obrigatório'),
  
  // Público
  publicoAlvo: z.string().min(10, 'Descrição do público alvo deve ter pelo menos 10 caracteres'),
  problemaPrincipal: z.string().min(10, 'Problema principal deve ter pelo menos 10 caracteres'),
  
  // Oferta
  produto: z.string().min(10, 'Descrição do produto/serviço é obrigatória'),
  precoMedio: z.string().min(1, 'Preço médio é obrigatório'),
  diferenciais: z.string().min(10, 'Diferenciais devem ter pelo menos 10 caracteres'),
  
  // Experiência Digital
  presencaDigital: z.array(z.string()).min(1, 'Pelo menos uma presença digital é obrigatória'),
  investimentoMarketing: z.string().min(1, 'Investimento em marketing é obrigatório'),
  principalCanal: z.string().min(1, 'Principal canal é obrigatório'),
  
  // Concorrência
  principais3Concorrentes: z.string().min(10, 'Descrição dos concorrentes é obrigatória'),
  diferencialConcorrencia: z.string().min(10, 'Diferencial da concorrência é obrigatório'),
  
  // Desafios
  maioresDificuldades: z.string().min(10, 'Maiores dificuldades devem ter pelo menos 10 caracteres'),
  resultadosEsperados: z.string().min(10, 'Resultados esperados devem ter pelo menos 10 caracteres'),
});

// Calculator schemas
export const calculadoraSchema = z.object({
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  
  // Dados básicos
  investimentoMensal: z.number().min(100, 'Investimento deve ser pelo menos R$ 100'),
  ticketMedio: z.number().min(1, 'Ticket médio deve ser maior que R$ 1'),
  taxaConversao: z.number().min(0.1).max(100, 'Taxa de conversão deve estar entre 0.1% e 100%'),
  
  // Dados avançados (opcionais)
  custoPorClique: z.number().optional(),
  taxaRejeicao: z.number().min(0).max(100).optional(),
  tempoRetorno: z.number().min(1).max(365).optional(), // dias
  
  // Cenários
  cenario: z.enum(['conservador', 'realista', 'otimista']).default('realista'),
});

// Task schemas
export const tarefaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  clienteId: z.string().optional(),
  prioridade: z.enum(['baixa', 'media', 'alta']).default('media'),
  status: z.enum(['pendente', 'em_andamento', 'concluida', 'cancelada']).default('pendente'),
  dataVencimento: z.string().datetime().optional(),
  tags: z.array(z.string()).default([]),
});

export const updateTarefaSchema = tarefaSchema.partial();

// Meeting schemas
export const reuniaoSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  clienteId: z.string().optional(),
  dataHora: z.string().datetime('Data e hora inválidas'),
  duracao: z.number().min(15).max(480).default(60), // minutes, max 8 hours
  tipo: z.enum(['presencial', 'online', 'telefone']).default('online'),
  status: z.enum(['agendada', 'confirmada', 'realizada', 'cancelada']).default('agendada'),
  linkReuniao: z.string().url().optional(),
  observacoes: z.string().optional(),
  participantes: z.array(z.string().email()).default([]),
});

export const updateReuniaoSchema = reuniaoSchema.partial();

// Query schemas
export const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const dateRangeSchema = z.object({
  data_inicio: z.string().datetime().optional(),
  data_fim: z.string().datetime().optional(),
});

// Export types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ClienteInput = z.infer<typeof clienteSchema>;
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>;
export type DiagnosticoInput = z.infer<typeof diagnosticoSchema>;
export type CalculadoraInput = z.infer<typeof calculadoraSchema>;
export type TarefaInput = z.infer<typeof tarefaSchema>;
export type UpdateTarefaInput = z.infer<typeof updateTarefaSchema>;
export type ReuniaoInput = z.infer<typeof reuniaoSchema>;
export type UpdateReuniaoInput = z.infer<typeof updateReuniaoSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type DateRangeQuery = z.infer<typeof dateRangeSchema>;