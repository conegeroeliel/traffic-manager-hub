// Tipos para os dados de entrada
export interface DadosSimplificados {
  investimento: number
  custoPorLead: number
  taxaConversao: number
  ticketMedio: number
}

export interface DadosCompletos extends DadosSimplificados {
  margemLucro: number
  repeticaoCompras: number
}

// Tipos para os resultados
export interface ResultadoSimplificado {
  investimento: number
  leadsGerados: number
  vendasPrevistas: number
  faturamentoPrevisto: number
  roi: number
}

export interface ResultadoCompleto {
  cenario: 'pessimista' | 'realista' | 'otimista'
  leads: number
  vendas: number
  faturamento: number
  cac: number
  ltv: number
  lucroLiquido: number
  roi: number
}

// Função para calcular versão simplificada
export function calcularSimplificada(dados: DadosSimplificados): ResultadoSimplificado {
  const { investimento, custoPorLead, taxaConversao, ticketMedio } = dados
  
  const leadsGerados = investimento / custoPorLead
  const vendasPrevistas = leadsGerados * (taxaConversao / 100)
  const faturamentoPrevisto = vendasPrevistas * ticketMedio
  const roi = ((faturamentoPrevisto - investimento) / investimento) * 100

  return {
    investimento,
    leadsGerados: Math.round(leadsGerados * 100) / 100,
    vendasPrevistas: Math.round(vendasPrevistas * 100) / 100,
    faturamentoPrevisto: Math.round(faturamentoPrevisto * 100) / 100,
    roi: Math.round(roi * 100) / 100
  }
}

// Função para calcular versão completa com 3 cenários
export function calcularCompleta(dados: DadosCompletos): ResultadoCompleto[] {
  const { 
    investimento, 
    custoPorLead, 
    taxaConversao, 
    ticketMedio, 
    margemLucro, 
    repeticaoCompras 
  } = dados

  const cenarios = [
    { nome: 'pessimista', multiplicador: 0.7 },
    { nome: 'realista', multiplicador: 1.0 },
    { nome: 'otimista', multiplicador: 1.3 }
  ] as const

  return cenarios.map(({ nome, multiplicador }) => {
    // Ajusta os valores baseado no cenário
    const custoPorLeadAjustado = custoPorLead * (1 / multiplicador)
    const taxaConversaoAjustada = taxaConversao * multiplicador
    const ticketMedioAjustado = ticketMedio * multiplicador

    // Calcula métricas
    const leads = investimento / custoPorLeadAjustado
    const vendas = leads * (taxaConversaoAjustada / 100)
    const faturamento = vendas * ticketMedioAjustado
    const cac = investimento / leads
    const ltv = ticketMedioAjustado * repeticaoCompras
    const lucroLiquido = faturamento * (margemLucro / 100) - investimento
    const roi = (lucroLiquido / investimento) * 100

    return {
      cenario: nome,
      leads: Math.round(leads * 100) / 100,
      vendas: Math.round(vendas * 100) / 100,
      faturamento: Math.round(faturamento * 100) / 100,
      cac: Math.round(cac * 100) / 100,
      ltv: Math.round(ltv * 100) / 100,
      lucroLiquido: Math.round(lucroLiquido * 100) / 100,
      roi: Math.round(roi * 100) / 100
    }
  })
}

// Função para validar dados de entrada
export function validarDadosSimplificados(dados: Partial<DadosSimplificados>): string[] {
  const erros: string[] = []
  
  if (!dados.investimento || dados.investimento <= 0) {
    erros.push('Investimento deve ser maior que zero')
  }
  
  if (!dados.custoPorLead || dados.custoPorLead <= 0) {
    erros.push('Custo por Lead deve ser maior que zero')
  }
  
  if (!dados.taxaConversao || dados.taxaConversao <= 0 || dados.taxaConversao > 100) {
    erros.push('Taxa de Conversão deve estar entre 0 e 100%')
  }
  
  if (!dados.ticketMedio || dados.ticketMedio <= 0) {
    erros.push('Ticket Médio deve ser maior que zero')
  }
  
  return erros
}

export function validarDadosCompletos(dados: Partial<DadosCompletos>): string[] {
  const erros = validarDadosSimplificados(dados)
  
  if (!dados.margemLucro || dados.margemLucro <= 0 || dados.margemLucro > 100) {
    erros.push('Margem de Lucro deve estar entre 0 e 100%')
  }
  
  if (!dados.repeticaoCompras || dados.repeticaoCompras <= 0) {
    erros.push('Repetição de Compras deve ser maior que zero')
  }
  
  return erros
} 