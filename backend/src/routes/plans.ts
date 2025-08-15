import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '@/middleware/auth-middleware';
import { authMiddleware } from '@/middleware/auth-middleware';
import { errors } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';
import { PlanManager } from '@/lib/plan-limits';
import { User, PaymentInfo } from '@/types/user';
import { prisma } from '@/lib/prisma';

const router = Router();

// Mock database for payments (in production, use real database)
const mockPayments: PaymentInfo[] = [];

// Validation schemas
const upgradeSchema = z.object({
  plano: z.enum(['trial', 'premium']),
  metodoPagamento: z.enum(['pix', 'cartao', 'boleto']),
  valor: z.number().positive('Valor deve ser positivo'),
});

/**
 * @route GET /api/plans/limits
 * @desc Get current plan limits and usage
 * @access Private
 */
router.get('/limits', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    // Buscar usuário completo do banco de dados
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw errors.notFound('Usuário não encontrado');
    }

    const limits = PlanManager.getCurrentLimits(user);
    const usage = PlanManager.getCurrentUsage(user);
    const percentage = PlanManager.getUsagePercentage(user);

    res.json({
      success: true,
      data: {
        plano: user.plano,
        statusPagamento: user.statusPagamento,
        limites: limits,
        uso: usage,
        porcentagem: percentage,
        dataExpiracaoTrial: user.dataExpiracaoTrial,
        dataExpiracaoPremium: user.dataExpiracaoPremium,
      }
    });
  } catch (error) {
    throw error;
  }
});

/**
 * @route GET /api/plans/available
 * @desc Get available plans
 * @access Public
 */
router.get('/available', async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        nome: 'Gratuito',
        preco: 0,
        periodo: null,
        recursos: [
          'Até 3 clientes',
          '1 diagnóstico de nicho',
          '10 tarefas',
          '5 reuniões',
          'Suporte básico'
        ],
        limitacoes: [
          'Sem acesso a IA avançada',
          'Relatórios limitados',
          'Sem exportação PDF'
        ]
      },
      {
        id: 'trial',
        nome: 'Trial',
        preco: 0,
        periodo: '14 dias',
        recursos: [
          'Até 10 clientes',
          '5 diagnósticos de nicho',
          '50 tarefas',
          '20 reuniões',
          'IA básica',
          'Relatórios básicos'
        ],
        limitacoes: [
          'Período limitado',
          'Sem exportação PDF',
          'Suporte por email'
        ]
      },
      {
        id: 'premium',
        nome: 'Premium',
        preco: 97,
        periodo: 'mês',
        recursos: [
          'Clientes ilimitados',
          'Diagnósticos ilimitados',
          'Tarefas ilimitadas',
          'Reuniões ilimitadas',
          'IA avançada (GPT-4)',
          'Relatórios completos',
          'Exportação PDF',
          'Suporte prioritário',
          'Integrações avançadas'
        ],
        limitacoes: []
      }
    ];

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    throw error;
  }
});

/**
 * @route POST /api/plans/upgrade
 * @desc Upgrade user plan
 * @access Private
 */
router.post('/upgrade', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const validatedData = upgradeSchema.parse(req.body);
    const { plano, metodoPagamento, valor } = validatedData;

    // Simular processamento de pagamento
    const payment: PaymentInfo = {
      id: `payment_${Date.now()}`,
      userId: req.user.id,
      plano,
      valor,
      status: 'pendente',
      metodoPagamento,
      dataExpiracao: new Date(Date.now() + (plano === 'trial' ? 14 : 30) * 24 * 60 * 60 * 1000),
      gatewayPagamento: 'mock',
      codigoTransacao: `txn_${Date.now()}`
    };

    // Adicionar ao mock database
    mockPayments.push(payment);

    logger.info('User requested plan upgrade', {
      userId: req.user.id,
      email: req.user.email,
      planoAtual: req.user.plano,
      novoPlano: plano,
      valor,
      metodoPagamento
    });

    // Em produção, aqui você integraria com gateway de pagamento
    // Por enquanto, simulamos sucesso
    payment.status = 'aprovado';
    payment.dataPagamento = new Date();

    res.json({
      success: true,
      message: 'Upgrade solicitado com sucesso',
      data: {
        paymentId: payment.id,
        status: payment.status,
        dataExpiracao: payment.dataExpiracao,
        // Em produção, retornaria dados do gateway (PIX, boleto, etc.)
        pagamento: {
          tipo: metodoPagamento,
          codigo: metodoPagamento === 'pix' ? 'pix_code_123' : undefined,
          boleto: metodoPagamento === 'boleto' ? 'boleto_url_123' : undefined
        }
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw errors.badRequest('Dados inválidos');
    }
    throw error;
  }
});

/**
 * @route GET /api/plans/payments
 * @desc Get user payment history
 * @access Private
 */
router.get('/payments', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const userPayments = mockPayments.filter(p => p.userId === req.user!.id);

    res.json({
      success: true,
      data: userPayments
    });
  } catch (error) {
    throw error;
  }
});

/**
 * @route POST /api/plans/cancel
 * @desc Cancel subscription
 * @access Private
 */
router.post('/cancel', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    if (req.user.plano !== 'premium') {
      throw errors.badRequest('Apenas usuários premium podem cancelar');
    }

    // Em produção, aqui você cancelaria no gateway de pagamento
    logger.info('User cancelled subscription', {
      userId: req.user.id,
      email: req.user.email
    });

    res.json({
      success: true,
      message: 'Assinatura cancelada com sucesso',
      data: {
        dataCancelamento: new Date(),
        acessoAte: req.user.dataExpiracaoPremium
      }
    });
  } catch (error) {
    throw error;
  }
});

export default router;
