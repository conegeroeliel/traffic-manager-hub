import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '@/middleware/auth-middleware';
import { authMiddleware } from '@/middleware/auth-middleware';
import { errors } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';
import { PlanManager } from '@/lib/plan-limits';
import { User, PaymentInfo } from '@/types/user';

const router = Router();

// Mock database (em produção, usar banco real)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@trafficmanager.com',
    nome: 'Administrador',
    plano: 'premium',
    statusPagamento: 'ativo',
    dataCadastro: new Date('2024-01-01'),
    ultimoLogin: new Date(),
    limiteClientes: -1,
    limiteDiagnosticos: -1,
    limiteTarefas: -1,
    limiteReunioes: -1,
    totalClientes: 0,
    totalDiagnosticos: 0,
    totalTarefas: 0,
    totalReunioes: 0,
  },
  {
    id: '2',
    email: 'teste@trafficmanager.com',
    nome: 'Usuário Teste',
    plano: 'free',
    statusPagamento: 'ativo',
    dataCadastro: new Date('2024-01-15'),
    ultimoLogin: new Date(),
    limiteClientes: 3,
    limiteDiagnosticos: 1,
    limiteTarefas: 10,
    limiteReunioes: 5,
    totalClientes: 2,
    totalDiagnosticos: 1,
    totalTarefas: 5,
    totalReunioes: 2,
  }
];

const mockPayments: PaymentInfo[] = [];

// Middleware para verificar se é admin
const requireAdmin = async (req: AuthenticatedRequest, res: any, next: any) => {
  try {
    if (!req.user) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    // Verificar se é admin (email específico ou campo admin)
    if (req.user.email !== 'admin@trafficmanager.com') {
      throw errors.forbidden('Acesso restrito a administradores');
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Validation schemas
const updateUserSchema = z.object({
  plano: z.enum(['free', 'trial', 'premium']).optional(),
  statusPagamento: z.enum(['ativo', 'pendente', 'cancelado', 'expirado']).optional(),
  dataExpiracaoTrial: z.string().optional(),
  dataExpiracaoPremium: z.string().optional(),
});

/**
 * @route GET /api/admin/users
 * @desc Get all users (admin only)
 * @access Private/Admin
 */
router.get('/users', authMiddleware, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const users = mockUsers.map(user => ({
      ...user,
      dataCadastro: user.dataCadastro.toISOString(),
      ultimoLogin: user.ultimoLogin.toISOString(),
      dataExpiracaoTrial: user.dataExpiracaoTrial?.toISOString(),
      dataExpiracaoPremium: user.dataExpiracaoPremium?.toISOString(),
    }));

    res.json({
      success: true,
      data: {
        users,
        total: users.length,
        stats: {
          total: users.length,
          free: users.filter(u => u.plano === 'free').length,
          trial: users.filter(u => u.plano === 'trial').length,
          premium: users.filter(u => u.plano === 'premium').length,
          ativo: users.filter(u => u.statusPagamento === 'ativo').length,
          pendente: users.filter(u => u.statusPagamento === 'pendente').length,
          cancelado: users.filter(u => u.statusPagamento === 'cancelado').length,
          expirado: users.filter(u => u.statusPagamento === 'expirado').length,
        }
      }
    });
  } catch (error) {
    throw error;
  }
});

/**
 * @route GET /api/admin/users/:id
 * @desc Get specific user details (admin only)
 * @access Private/Admin
 */
router.get('/users/:id', authMiddleware, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const user = mockUsers.find(u => u.id === id);

    if (!user) {
      throw errors.notFound('Usuário não encontrado');
    }

    // Buscar pagamentos do usuário
    const userPayments = mockPayments.filter(p => p.userId === id);

    res.json({
      success: true,
      data: {
        user: {
          ...user,
          dataCadastro: user.dataCadastro.toISOString(),
          ultimoLogin: user.ultimoLogin.toISOString(),
          dataExpiracaoTrial: user.dataExpiracaoTrial?.toISOString(),
          dataExpiracaoPremium: user.dataExpiracaoPremium?.toISOString(),
        },
        payments: userPayments,
        limits: PlanManager.getCurrentLimits(user),
        usage: PlanManager.getCurrentUsage(user),
        percentage: PlanManager.getUsagePercentage(user)
      }
    });
  } catch (error) {
    throw error;
  }
});

/**
 * @route PUT /api/admin/users/:id
 * @desc Update user plan/status (admin only)
 * @access Private/Admin
 */
router.put('/users/:id', authMiddleware, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateUserSchema.parse(req.body);

    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw errors.notFound('Usuário não encontrado');
    }

    // Atualizar usuário
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...validatedData,
      dataExpiracaoTrial: validatedData.dataExpiracaoTrial ? new Date(validatedData.dataExpiracaoTrial) : mockUsers[userIndex].dataExpiracaoTrial,
      dataExpiracaoPremium: validatedData.dataExpiracaoPremium ? new Date(validatedData.dataExpiracaoPremium) : mockUsers[userIndex].dataExpiracaoPremium,
    };

    logger.info('Admin updated user', {
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      userId: id,
      updates: validatedData
    });

    res.json({
      success: true,
      message: 'Usuário atualizado com sucesso',
      data: {
        user: {
          ...mockUsers[userIndex],
          dataCadastro: mockUsers[userIndex].dataCadastro.toISOString(),
          ultimoLogin: mockUsers[userIndex].ultimoLogin.toISOString(),
          dataExpiracaoTrial: mockUsers[userIndex].dataExpiracaoTrial?.toISOString(),
          dataExpiracaoPremium: mockUsers[userIndex].dataExpiracaoPremium?.toISOString(),
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
 * @route DELETE /api/admin/users/:id
 * @desc Delete user (admin only)
 * @access Private/Admin
 */
router.delete('/users/:id', authMiddleware, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      throw errors.notFound('Usuário não encontrado');
    }

    const deletedUser = mockUsers.splice(userIndex, 1)[0];

    logger.info('Admin deleted user', {
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      userId: id,
      userEmail: deletedUser.email
    });

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });
  } catch (error) {
    throw error;
  }
});

/**
 * @route GET /api/admin/payments
 * @desc Get all payments (admin only)
 * @access Private/Admin
 */
router.get('/payments', authMiddleware, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const payments = mockPayments.map(payment => ({
      ...payment,
      dataPagamento: payment.dataPagamento?.toISOString(),
      dataExpiracao: payment.dataExpiracao.toISOString(),
    }));

    res.json({
      success: true,
      data: {
        payments,
        total: payments.length,
        stats: {
          total: payments.length,
          pendente: payments.filter(p => p.status === 'pendente').length,
          aprovado: payments.filter(p => p.status === 'aprovado').length,
          cancelado: payments.filter(p => p.status === 'cancelado').length,
          reembolsado: payments.filter(p => p.status === 'reembolsado').length,
          pix: payments.filter(p => p.metodoPagamento === 'pix').length,
          cartao: payments.filter(p => p.metodoPagamento === 'cartao').length,
          boleto: payments.filter(p => p.metodoPagamento === 'boleto').length,
        }
      }
    });
  } catch (error) {
    throw error;
  }
});

/**
 * @route GET /api/admin/stats
 * @desc Get admin dashboard stats (admin only)
 * @access Private/Admin
 */
router.get('/stats', authMiddleware, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const users = mockUsers;
    const payments = mockPayments;

    // Estatísticas gerais
    const stats = {
      users: {
        total: users.length,
        free: users.filter(u => u.plano === 'free').length,
        trial: users.filter(u => u.plano === 'trial').length,
        premium: users.filter(u => u.plano === 'premium').length,
        ativo: users.filter(u => u.statusPagamento === 'ativo').length,
        pendente: users.filter(u => u.statusPagamento === 'pendente').length,
        cancelado: users.filter(u => u.statusPagamento === 'cancelado').length,
        expirado: users.filter(u => u.statusPagamento === 'expirado').length,
      },
      payments: {
        total: payments.length,
        pendente: payments.filter(p => p.status === 'pendente').length,
        aprovado: payments.filter(p => p.status === 'aprovado').length,
        cancelado: payments.filter(p => p.status === 'cancelado').length,
        reembolsado: payments.filter(p => p.status === 'reembolsado').length,
      },
      revenue: {
        total: payments
          .filter(p => p.status === 'aprovado')
          .reduce((sum, p) => sum + p.valor, 0),
        thisMonth: payments
          .filter(p => p.status === 'aprovado' && 
            new Date(p.dataPagamento!).getMonth() === new Date().getMonth())
          .reduce((sum, p) => sum + p.valor, 0),
      },
      usage: {
        totalClientes: users.reduce((sum, u) => sum + u.totalClientes, 0),
        totalDiagnosticos: users.reduce((sum, u) => sum + u.totalDiagnosticos, 0),
        totalTarefas: users.reduce((sum, u) => sum + u.totalTarefas, 0),
        totalReunioes: users.reduce((sum, u) => sum + u.totalReunioes, 0),
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    throw error;
  }
});

export default router;


