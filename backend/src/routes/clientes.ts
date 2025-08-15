import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '@/middleware/auth-middleware';
import { canCreateCliente } from '@/middleware/plan-middleware';
import { errors } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';
import { prisma } from '@/lib/prisma';

const router = Router();

// Validation schemas
const createClienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').optional(),
  telefone: z.string().optional(),
  empresa: z.string().optional(),
  endereco: z.string().optional(),
  observacoes: z.string().optional(),
});

const updateClienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  telefone: z.string().optional(),
  empresa: z.string().optional(),
  endereco: z.string().optional(),
  observacoes: z.string().optional(),
  status: z.enum(['ATIVO', 'INATIVO', 'PROSPECTO']).optional(),
});

/**
 * @route GET /api/clientes
 * @desc Get all clients for the authenticated user
 * @access Private
 */
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const clientes = await prisma.cliente.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        dataCadastro: 'desc',
      },
    });

    res.json({
      success: true,
      data: clientes,
    });
  } catch (error) {
    logger.error('Error fetching clientes:', error);
    throw error;
  }
});

/**
 * @route GET /api/clientes/:id
 * @desc Get specific client by ID
 * @access Private
 */
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const cliente = await prisma.cliente.findFirst({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        tarefas: true,
        reunioes: true,
        diagnosticos: true,
      },
    });

    if (!cliente) {
      throw errors.notFound('Cliente não encontrado');
    }

    res.json({
      success: true,
      data: cliente,
    });
  } catch (error) {
    logger.error('Error fetching cliente:', error);
    throw error;
  }
});

/**
 * @route POST /api/clientes
 * @desc Create new client
 * @access Private
 */
router.post('/', canCreateCliente, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const validatedData = createClienteSchema.parse(req.body);

    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const cliente = await prisma.cliente.create({
      data: {
        ...validatedData,
        userId: userId,
      },
    });

    // Atualizar contador de clientes do usuário
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalClientes: {
          increment: 1,
        },
      },
    });

    logger.info('Cliente created', {
      userId: userId,
      clienteId: cliente.id,
      clienteNome: cliente.nome,
    });

    res.status(201).json({
      success: true,
      message: 'Cliente criado com sucesso',
      data: cliente,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw errors.badRequest('Dados inválidos');
    }
    logger.error('Error creating cliente:', error);
    throw error;
  }
});

/**
 * @route PUT /api/clientes/:id
 * @desc Update client
 * @access Private
 */
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const validatedData = updateClienteSchema.parse(req.body);

    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const cliente = await prisma.cliente.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!cliente) {
      throw errors.notFound('Cliente não encontrado');
    }

    const updatedCliente = await prisma.cliente.update({
      where: {
        id: id,
      },
      data: {
        ...validatedData,
        ultimaAtualizacao: new Date(),
      },
    });

    logger.info('Cliente updated', {
      userId: userId,
      clienteId: id,
      updates: validatedData,
    });

    res.json({
      success: true,
      message: 'Cliente atualizado com sucesso',
      data: updatedCliente,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw errors.badRequest('Dados inválidos');
    }
    logger.error('Error updating cliente:', error);
    throw error;
  }
});

/**
 * @route DELETE /api/clientes/:id
 * @desc Delete client
 * @access Private
 */
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const cliente = await prisma.cliente.findFirst({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!cliente) {
      throw errors.notFound('Cliente não encontrado');
    }

    await prisma.cliente.delete({
      where: {
        id: id,
      },
    });

    // Atualizar contador de clientes do usuário
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalClientes: {
          decrement: 1,
        },
      },
    });

    logger.info('Cliente deleted', {
      userId: userId,
      clienteId: id,
      clienteNome: cliente.nome,
    });

    res.json({
      success: true,
      message: 'Cliente deletado com sucesso',
    });
  } catch (error) {
    logger.error('Error deleting cliente:', error);
    throw error;
  }
});

export default router;