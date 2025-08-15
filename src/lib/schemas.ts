import { z } from 'zod'

export const calculadoraSimplificadaSchema = z.object({
  investimento: z.number().min(0.01, 'Investimento deve ser maior que zero'),
  custoPorLead: z.number().min(0.01, 'Custo por Lead deve ser maior que zero'),
  taxaConversao: z.number().min(0.01, 'Taxa de Conversão deve ser maior que zero').max(100, 'Taxa de Conversão não pode ser maior que 100%'),
  ticketMedio: z.number().min(0.01, 'Ticket Médio deve ser maior que zero'),
})

export const calculadoraCompletaSchema = calculadoraSimplificadaSchema.extend({
  margemLucro: z.number().min(0.01, 'Margem de Lucro deve ser maior que zero').max(100, 'Margem de Lucro não pode ser maior que 100%'),
  repeticaoCompras: z.number().min(0.01, 'Repetição de Compras deve ser maior que zero'),
})

export type CalculadoraSimplificadaForm = z.infer<typeof calculadoraSimplificadaSchema>
export type CalculadoraCompletaForm = z.infer<typeof calculadoraCompletaSchema> 