import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  empresa: z.string().min(2, 'Empresa deve ter pelo menos 2 caracteres'),
  setor: z.string().min(2, 'Setor deve ter pelo menos 2 caracteres'),
  status: z.enum(['ativo', 'inativo', 'prospecto']),
  observacoes: z.string().optional(),
  endereco: z.object({
    rua: z.string().min(5, 'Rua deve ter pelo menos 5 caracteres'),
    cidade: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
    estado: z.string().length(2, 'Estado deve ter 2 caracteres'),
    cep: z.string().min(8, 'CEP deve ter pelo menos 8 dígitos')
  }).optional(),
  redesSociais: z.object({
    instagram: z.string().url('URL do Instagram inválida').optional().or(z.literal('')),
    facebook: z.string().url('URL do Facebook inválida').optional().or(z.literal('')),
    linkedin: z.string().url('URL do LinkedIn inválida').optional().or(z.literal('')),
    website: z.string().url('URL do website inválida').optional().or(z.literal(''))
  }).optional()
})

export const campanhaSchema = z.object({
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  nome: z.string().min(3, 'Nome da campanha deve ter pelo menos 3 caracteres'),
  plataforma: z.enum(['facebook', 'instagram', 'google', 'tiktok', 'outros']),
  dataInicio: z.date(),
  dataFim: z.date().optional(),
  investimento: z.number().min(0.01, 'Investimento deve ser maior que zero'),
  custoPorLead: z.number().min(0.01, 'Custo por lead deve ser maior que zero'),
  taxaConversao: z.number().min(0.01, 'Taxa de conversão deve ser maior que zero').max(100, 'Taxa de conversão não pode ser maior que 100%'),
  ticketMedio: z.number().min(0.01, 'Ticket médio deve ser maior que zero'),
  leadsGerados: z.number().min(0, 'Leads gerados deve ser zero ou maior'),
  vendasRealizadas: z.number().min(0, 'Vendas realizadas deve ser zero ou maior'),
  faturamento: z.number().min(0, 'Faturamento deve ser zero ou maior'),
  roi: z.number(),
  status: z.enum(['ativa', 'pausada', 'finalizada', 'cancelada']),
  observacoes: z.string().optional()
})

export type ClienteForm = z.infer<typeof clienteSchema>
export type CampanhaForm = z.infer<typeof campanhaSchema> 