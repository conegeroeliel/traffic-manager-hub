import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '@/middleware/auth-middleware';
import { errors } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';

const router = Router();

// Validation schema for calculator data
const calculadoraSchema = z.object({
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

// Mock database for calculations
const mockCalculos: Array<{
  id: string;
  clienteId: string;
  userId: string;
  inputData: z.infer<typeof calculadoraSchema>;
  resultados: {
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
  };
  criadoEm: Date;
}> = [];

/**
 * @route GET /api/calculadora
 * @desc Get all calculations for authenticated user
 * @access Private
 */
router.get('/', async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const userCalculos = mockCalculos.filter(c => c.userId === userId);

  res.json({
    success: true,
    message: 'Cálculos encontrados',
    data: {
      calculos: userCalculos,
      total: userCalculos.length,
    },
  });
});

/**
 * @route GET /api/calculadora/:id
 * @desc Get specific calculation
 * @access Private
 */
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const calculo = mockCalculos.find(c => c.id === id && c.userId === userId);

  if (!calculo) {
    throw errors.notFound('Cálculo não encontrado');
  }

  res.json({
    success: true,
    message: 'Cálculo encontrado',
    data: { calculo },
  });
});

/**
 * @route POST /api/calculadora
 * @desc Create new calculation
 * @access Private
 */
router.post('/', async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const validatedData = calculadoraSchema.parse(req.body);

  // Calculate results based on input data
  const resultados = calculateROI(validatedData);

  const novoCalculo = {
    id: `calculo_${Date.now()}`,
    clienteId: validatedData.clienteId,
    userId,
    inputData: validatedData,
    resultados,
    criadoEm: new Date(),
  };

  mockCalculos.push(novoCalculo);

  logger.info('Calculation created', {
    calculoId: novoCalculo.id,
    userId,
    clienteId: validatedData.clienteId,
    cenario: validatedData.cenario
  });

  res.status(201).json({
    success: true,
    message: 'Cálculo realizado com sucesso',
    data: { calculo: novoCalculo },
  });
});

/**
 * @route DELETE /api/calculadora/:id
 * @desc Delete calculation
 * @access Private
 */
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const calculoIndex = mockCalculos.findIndex(c => c.id === id && c.userId === userId);

  if (calculoIndex === -1) {
    throw errors.notFound('Cálculo não encontrado');
  }

  mockCalculos.splice(calculoIndex, 1);

  logger.info('Calculation deleted', {
    calculoId: id,
    userId
  });

  res.json({
    success: true,
    message: 'Cálculo removido com sucesso',
  });
});

// Helper function to calculate ROI based on scenario
function calculateROI(data: z.infer<typeof calculadoraSchema>) {
  const { investimentoMensal, ticketMedio, taxaConversao, cenario } = data;

  // Scenario multipliers
  const cenarioMultipliers = {
    conservador: { conversao: 0.8, custos: 1.2 },
    realista: { conversao: 1.0, custos: 1.0 },
    otimista: { conversao: 1.3, custos: 0.8 },
  };

  const multiplier = cenarioMultipliers[cenario];
  
  // Estimate CPC if not provided
  const custoPorClique = data.custoPorClique || estimateCPC(investimentoMensal);
  
  // Calculate base metrics
  const visitasMensais = Math.floor(investimentoMensal / custoPorClique);
  const taxaConversaoAjustada = (taxaConversao / 100) * multiplier.conversao;
  const leadsMensais = Math.floor(visitasMensais * taxaConversaoAjustada);
  
  // Assume 30% of leads convert to sales (industry average)
  const taxaFechamento = 0.3;
  const vendasMensais = Math.floor(leadsMensais * taxaFechamento);
  
  const faturamentoMensal = vendasMensais * ticketMedio;
  const custosOperacionais = investimentoMensal * multiplier.custos;
  const lucroLiquido = faturamentoMensal - custosOperacionais;
  
  const roas = faturamentoMensal / investimentoMensal;
  const custoPorLead = leadsMensais > 0 ? investimentoMensal / leadsMensais : 0;
  const custoPorVenda = vendasMensais > 0 ? investimentoMensal / vendasMensais : 0;

  // 12-month projection
  const projecao12Meses = {
    faturamento: faturamentoMensal * 12,
    lucro: lucroLiquido * 12,
    investimento: investimentoMensal * 12,
    roi: ((lucroLiquido * 12) / (investimentoMensal * 12)) * 100,
  };

  return {
    visitasMensais,
    leadsMensais,
    vendasMensais,
    faturamentoMensal: Math.round(faturamentoMensal),
    roas: Math.round(roas * 100) / 100,
    lucroLiquido: Math.round(lucroLiquido),
    custoPorLead: Math.round(custoPorLead * 100) / 100,
    custoPorVenda: Math.round(custoPorVenda * 100) / 100,
    projecao12Meses: {
      faturamento: Math.round(projecao12Meses.faturamento),
      lucro: Math.round(projecao12Meses.lucro),
      investimento: Math.round(projecao12Meses.investimento),
      roi: Math.round(projecao12Meses.roi * 100) / 100,
    },
  };
}

// Helper function to estimate CPC based on investment
function estimateCPC(investimento: number): number {
  // Base CPC on investment tier (Brazilian market averages)
  if (investimento < 1000) return 1.5;
  if (investimento < 5000) return 2.0;
  if (investimento < 10000) return 2.5;
  return 3.0;
}

export default router;