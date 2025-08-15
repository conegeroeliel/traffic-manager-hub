import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '@/middleware/auth-middleware';
import { canCreateTarefa } from '@/middleware/plan-middleware';
import { errors } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';
import { prisma } from '@/lib/prisma';

const router = Router();

// Validation schemas
const createTarefaSchema = z.object({
  titulo: z.string().min(2, 'Título deve ter pelo menos 2 caracteres'),
  descricao: z.string().optional(),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']).default('MEDIA'),
  dataVencimento: z.string().optional(),
  clienteId: z.string().optional(),
});

const updateTarefaSchema = z.object({
  titulo: z.string().min(2, 'Título deve ter pelo menos 2 caracteres').optional(),
  descricao: z.string().optional(),
  prioridade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']).optional(),
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA']).optional(),
  dataVencimento: z.string().optional(),
  clienteId: z.string().optional(),
});

/**
 * @route GET /api/tarefas
 * @desc Get all tasks for the authenticated user
 * @access Private
 */
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const tarefas = await prisma.tarefa.findMany({
      where: {
        userId: userId,
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            empresa: true,
          },
        },
      },
      orderBy: [
        { prioridade: 'desc' },
        { dataVencimento: 'asc' },
        { dataCriacao: 'desc' },
      ],
    });

    res.json({
      success: true,
      data: tarefas,
    });
  } catch (error) {
    logger.error('Error fetching tarefas:', error);
    throw error;
  }
});

/**
 * @route GET /api/tarefas/:id
 * @desc Get specific task by ID
 * @access Private
 */
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const tarefa = await prisma.tarefa.findFirst({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            empresa: true,
            email: true,
            telefone: true,
          },
        },
      },
    });

    if (!tarefa) {
      throw errors.notFound('Tarefa não encontrada');
    }

    res.json({
      success: true,
      data: tarefa,
    });
  } catch (error) {
    logger.error('Error fetching tarefa:', error);
    throw error;
  }
});

/**
 * @route POST /api/tarefas
 * @desc Create new task
 * @access Private
 */
router.post('/', canCreateTarefa, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const validatedData = createTarefaSchema.parse(req.body);

    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    // Verificar se o cliente existe e pertence ao usuário
    if (validatedData.clienteId) {
      const cliente = await prisma.cliente.findFirst({
        where: {
          id: validatedData.clienteId,
          userId: userId,
        },
      });

      if (!cliente) {
        throw errors.badRequest('Cliente não encontrado');
      }
    }

    const tarefa = await prisma.tarefa.create({
      data: {
        ...validatedData,
        dataVencimento: validatedData.dataVencimento ? new Date(validatedData.dataVencimento) : null,
        userId: userId,
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            empresa: true,
          },
        },
      },
    });

    // Atualizar contador de tarefas do usuário
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalTarefas: {
          increment: 1,
        },
      },
    });

    logger.info('Tarefa created', {
      userId: userId,
      tarefaId: tarefa.id,
      tarefaTitulo: tarefa.titulo,
    });

    res.status(201).json({
      success: true,
      message: 'Tarefa criada com sucesso',
      data: tarefa,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw errors.badRequest('Dados inválidos');
    }
    logger.error('Error creating tarefa:', error);
    throw error;
  }
});

/**
 * @route PUT /api/tarefas/:id
 * @desc Update task
 * @access Private
 */
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const validatedData = updateTarefaSchema.parse(req.body);

    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const tarefa = await prisma.tarefa.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!tarefa) {
      throw errors.notFound('Tarefa não encontrada');
    }

    // Verificar se o cliente existe e pertence ao usuário
    if (validatedData.clienteId) {
      const cliente = await prisma.cliente.findFirst({
        where: {
          id: validatedData.clienteId,
          userId: userId,
        },
      });

      if (!cliente) {
        throw errors.badRequest('Cliente não encontrado');
      }
    }

    const updateData: any = { ...validatedData };
    
    // Se a tarefa foi marcada como concluída, definir dataConclusao
    if (validatedData.status === 'CONCLUIDA' && tarefa.status !== 'CONCLUIDA') {
      updateData.dataConclusao = new Date();
    }
    
    // Se a tarefa foi desmarcada como concluída, remover dataConclusao
    if (validatedData.status !== 'CONCLUIDA' && tarefa.status === 'CONCLUIDA') {
      updateData.dataConclusao = null;
    }

    if (validatedData.dataVencimento) {
      updateData.dataVencimento = new Date(validatedData.dataVencimento);
    }

    const updatedTarefa = await prisma.tarefa.update({
      where: {
        id: id,
      },
      data: updateData,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            empresa: true,
          },
        },
      },
    });

    logger.info('Tarefa updated', {
      userId: userId,
      tarefaId: id,
      updates: validatedData,
    });

    res.json({
      success: true,
      message: 'Tarefa atualizada com sucesso',
      data: updatedTarefa,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw errors.badRequest('Dados inválidos');
    }
    logger.error('Error updating tarefa:', error);
    throw error;
  }
});

/**
 * @route DELETE /api/tarefas/:id
 * @desc Delete task
 * @access Private
 */
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const tarefa = await prisma.tarefa.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!tarefa) {
      throw errors.notFound('Tarefa não encontrada');
    }

    await prisma.tarefa.delete({
      where: {
        id: id,
      },
    });

    // Atualizar contador de tarefas do usuário
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalTarefas: {
          decrement: 1,
        },
      },
    });

    logger.info('Tarefa deleted', {
      userId: userId,
      tarefaId: id,
      tarefaTitulo: tarefa.titulo,
    });

    res.json({
      success: true,
      message: 'Tarefa deletada com sucesso',
    });
  } catch (error) {
    logger.error('Error deleting tarefa:', error);
    throw error;
  }
});

export default router;