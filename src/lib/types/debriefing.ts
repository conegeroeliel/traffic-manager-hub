export interface PerguntaResposta {
  pergunta: string;
  resposta: any;
  categoria: string;
  obrigatoria: boolean;
}

export interface RespostasDebriefing {
  // DADOS DA EMPRESA
  nomeEmpresa?: string;
  cnpj?: string;
  site?: string;
  redesSociais?: string[];
  anoFundacao?: number;
  numeroFuncionarios?: number;
  faturamentoAnual?: number;
  
  // Contexto do Negócio
  segmento?: string;
  subSegmento?: string;
  localizacao?: string;
  regioesAtendidas?: string[];
  ticketMedio?: number;
  ticketMinimo?: number;
  ticketMaximo?: number;
  produtoServico?: string;
  modeloVenda?: 'venda_direta' | 'agendamento' | 'recorrencia' | 'outro';
  faseNegocio?: 'comecando' | 'crescendo' | 'escalando' | 'reestruturando';
  cicloVenda?: number; // em dias
  
  // Público-Alvo e Jornada
  clienteIdeal?: string;
  publicoAlvoDetalhado?: string;
  momentoJornada?: 'descoberta' | 'consideracao' | 'decisao';
  objecoes?: string;
  objecoesPrincipais?: string[];
  conteudoPreVenda?: string;
  gatilhosEmocionais?: string[];
  
  // Diferenciais e Posicionamento
  problemaResolvido?: string;
  diferencial?: string;
  diferencialUnico?: string;
  posicionamento?: 'especialista' | 'proxima' | 'premium' | 'acessivel' | 'tecnica';
  concorrenteAdmira?: string;
  concorrentesPrincipais?: string[];
  vantagemCompetitiva?: string;
  
  // Experiência com Tráfego Pago
  jaInvestiu?: boolean;
  canaisTestados?: string[];
  resultadosAnteriores?: string;
  investimentoMensal?: number;
  leadsGerados?: number;
  conversaoAtual?: number;
  cplAtual?: number;
  equipeVendas?: string;
  numeroVendedores?: number;
  
  // OBJETIVOS E METAS
  objetivoPrincipal?: string;
  metaVendas?: number;
  prazoMeta?: number; // em meses
  budgetDisponivel?: number;
  kpisPrincipais?: string[];
  
  // INFORMAÇÕES ADICIONAIS
  sazonalidade?: string;
  regulamentacoes?: string;
  tendenciasMercado?: string;
  desafiosAtuais?: string[];
  oportunidades?: string[];
}

export interface DiagnosticoIA {
  // ANÁLISE EXECUTIVA
  analiseGeral: string;
  resumoEstrategico: string;
  
  // PESQUISA DE MERCADO
  pesquisaMercado: string;
  tamanhoMercado: string;
  crescimentoMercado: string;
  tendenciasSetor: string;
  regulamentacoes: string;
  sazonalidade: string;
  
  // ANÁLISE COMPETITIVA
  analiseConcorrencia: string;
  concorrentesPrincipais: string;
  posicionamentoConcorrencia: string;
  gapsMercado: string;
  vantagemCompetitiva: string;
  
  // PÚBLICO-ALVO
  perfilPublico: string;
  personasDetalhadas: string;
  comportamentoOnline: string;
  jornadaCompra: string;
  gatilhosEmocionais: string;
  
  // ESTRATÉGIA DE CANAIS
  canaisSugeridos: string;
  estrategiaCanais: string;
  priorizacaoCanais: string;
  budgetRecomendado: string;
  canaisEmergentes: string;
  
  // EXPECTATIVAS E MÉTRICAS
  expectativas: string;
  projecoesVendas: string;
  metricasSucesso: string;
  benchmarksSetor: string;
  roiEsperado: string;
  
  // RISCOS E OPORTUNIDADES
  riscos: string;
  riscosEspecificos: string;
  estrategiasMitigacao: string;
  oportunidades: string;
  fatoresMacroeconomicos: string;
  
  // ESTRATÉGIA DE COPY
  dicasCopy: string;
  estrategiaCopy: string;
  sequenciasMensagens: string;
  argumentosVenda: string;
  gatilhosPsicologicos: string;
  
  // PLANO DE AÇÃO
  planoAcao: string;
  cronogramaImplementacao: string;
  prioridades: string;
  recursosNecessarios: string;
  metricasAcompanhamento: string;
  
  // ANÁLISE FINANCEIRA
  analiseFinanceira: string;
  projecaoInvestimento: string;
  breakEven: string;
  cenariosProjecao: string;
  
  // RECOMENDAÇÕES ESPECÍFICAS
  recomendacoesEspecificas: string;
  acoesImediatas: string;
  acoesMedioPrazo: string;
  acoesLongoPrazo: string;
}

export interface Debriefing {
  id: string;
  userId: number;
  clienteId: string;
  respostas: RespostasDebriefing;
  perguntasRespostas: PerguntaResposta[]; // Nova propriedade
  diagnostico: DiagnosticoIA;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NovoDebriefing {
  clienteId: string;
  respostas: RespostasDebriefing;
  perguntasRespostas: PerguntaResposta[];
  observacoes?: string;
}

export interface AtualizarDebriefing {
  respostas?: RespostasDebriefing;
  observacoes?: string;
} 