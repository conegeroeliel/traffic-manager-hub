import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '@/middleware/auth-middleware';
import { errors } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';

const router = Router();

// Validation schemas
const reuniaoSchema = z.object({
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

const updateReuniaoSchema = reuniaoSchema.partial();

// Mock database
const mockReunioes: Array<{
  id: string;
  titulo: string;
  descricao?: string;
  clienteId?: string;
  userId: string;
  dataHora: Date;
  duracao: number;
  tipo: 'presencial' | 'online' | 'telefone';
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada';
  linkReuniao?: string;
  observacoes?: string;
  participantes: string[];
  criadoEm: Date;
  atualizadoEm: Date;
  realizadaEm?: Date;
}> = [];

/**
 * @route GET /api/reunioes
 * @desc Get all meetings for authenticated user
 * @access Private
 */
router.get('/', async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  // Query parameters for filtering
  const { status, tipo, clienteId, data_inicio, data_fim } = req.query;

  let userReunioes = mockReunioes.filter(reuniao => reuniao.userId === userId);

  // Apply filters
  if (status) {
    userReunioes = userReunioes.filter(r => r.status === status);
  }
  if (tipo) {
    userReunioes = userReunioes.filter(r => r.tipo === tipo);
  }
  if (clienteId) {
    userReunioes = userReunioes.filter(r => r.clienteId === clienteId);
  }
  if (data_inicio) {
    const startDate = new Date(data_inicio as string);
    userReunioes = userReunioes.filter(r => r.dataHora >= startDate);
  }
  if (data_fim) {
    const endDate = new Date(data_fim as string);
    userReunioes = userReunioes.filter(r => r.dataHora <= endDate);
  }

  // Sort by date (upcoming first)
  userReunioes.sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime());

  logger.info('Meetings fetched', {
    userId,
    total: userReunioes.length,
    filters: { status, tipo, clienteId, data_inicio, data_fim }
  });

  res.json({
    success: true,
    message: 'Reuniões encontradas',
    data: {
      reunioes: userReunioes,
      total: userReunioes.length,
      resumo: {
        agendada: userReunioes.filter(r => r.status === 'agendada').length,
        confirmada: userReunioes.filter(r => r.status === 'confirmada').length,
        realizada: userReunioes.filter(r => r.status === 'realizada').length,
        cancelada: userReunioes.filter(r => r.status === 'cancelada').length,
        proximas24h: userReunioes.filter(r => {
          const agora = new Date();
          const em24h = new Date(agora.getTime() + 24 * 60 * 60 * 1000);
          return r.dataHora >= agora && r.dataHora <= em24h && ['agendada', 'confirmada'].includes(r.status);
        }).length,
      },
    },
  });
});

/**
 * @route GET /api/reunioes/:id
 * @desc Get specific meeting
 * @access Private
 */
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const reuniao = mockReunioes.find(r => r.id === id && r.userId === userId);

  if (!reuniao) {
    throw errors.notFound('Reunião não encontrada');
  }

  res.json({
    success: true,
    message: 'Reunião encontrada',
    data: { reuniao },
  });
});

/**
 * @route POST /api/reunioes
 * @desc Create new meeting
 * @access Private
 */
router.post('/', async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const validatedData = reuniaoSchema.parse(req.body);

  // Validate that meeting is not in the past
  const dataReuniao = new Date(validatedData.dataHora);
  const agora = new Date();
  
  if (dataReuniao <= agora) {
    throw errors.badRequest('Data da reunião deve ser no futuro');
  }

  // Check for conflicts (same user, overlapping time)
  const conflicts = mockReunioes.filter(r => {
    if (r.userId !== userId || ['cancelada', 'realizada'].includes(r.status)) {
      return false;
    }
    
    const existingStart = r.dataHora;
    const existingEnd = new Date(existingStart.getTime() + r.duracao * 60 * 1000);
    const newStart = dataReuniao;
    const newEnd = new Date(newStart.getTime() + validatedData.duracao * 60 * 1000);
    
    return (newStart < existingEnd && newEnd > existingStart);
  });

  if (conflicts.length > 0) {
    throw errors.conflict('Já existe uma reunião agendada neste horário');
  }

  const novaReuniao = {
    id: `reuniao_${Date.now()}`,
    ...validatedData,
    userId,
    dataHora: dataReuniao,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  };

  mockReunioes.push(novaReuniao);

  logger.info('Meeting created', {
    reuniaoId: novaReuniao.id,
    userId,
    titulo: novaReuniao.titulo,
    dataHora: dataReuniao,
    tipo: validatedData.tipo
  });

  res.status(201).json({
    success: true,
    message: 'Reunião agendada com sucesso',
    data: { reuniao: novaReuniao },
  });
});

/**
 * @route PUT /api/reunioes/:id
 * @desc Update meeting
 * @access Private
 */
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const validatedData = updateReuniaoSchema.parse(req.body);

  const reuniaoIndex = mockReunioes.findIndex(r => r.id === id && r.userId === userId);

  if (reuniaoIndex === -1) {
    throw errors.notFound('Reunião não encontrada');
  }

  const reuniaoAtual = mockReunioes[reuniaoIndex];

  // Validate new date if provided
  if (validatedData.dataHora) {
    const novaData = new Date(validatedData.dataHora);
    const agora = new Date();
    
    if (novaData <= agora) {
      throw errors.badRequest('Data da reunião deve ser no futuro');
    }
  }

  // Update meeting
  const reuniaoAtualizada = {
    ...reuniaoAtual,
    ...validatedData,
    dataHora: validatedData.dataHora ? new Date(validatedData.dataHora) : reuniaoAtual.dataHora,
    atualizadoEm: new Date(),
    realizadaEm: validatedData.status === 'realizada' && reuniaoAtual.status !== 'realizada' 
      ? new Date() 
      : reuniaoAtual.realizadaEm,
  };

  mockReunioes[reuniaoIndex] = reuniaoAtualizada;

  logger.info('Meeting updated', {
    reuniaoId: id,
    userId,
    changedFields: Object.keys(validatedData)
  });

  res.json({
    success: true,
    message: 'Reunião atualizada com sucesso',
    data: { reuniao: reuniaoAtualizada },
  });
});

/**
 * @route DELETE /api/reunioes/:id
 * @desc Delete meeting
 * @access Private
 */
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const reuniaoIndex = mockReunioes.findIndex(r => r.id === id && r.userId === userId);

  if (reuniaoIndex === -1) {
    throw errors.notFound('Reunião não encontrada');
  }

  mockReunioes.splice(reuniaoIndex, 1);

  logger.info('Meeting deleted', {
    reuniaoId: id,
    userId
  });

  res.json({
    success: true,
    message: 'Reunião removida com sucesso',
  });
});

/**
 * @route PATCH /api/reunioes/:id/status
 * @desc Update meeting status quickly
 * @access Private
 */
router.patch('/:id/status', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const { status } = req.body;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  if (!['agendada', 'confirmada', 'realizada', 'cancelada'].includes(status)) {
    throw errors.badRequest('Status inválido');
  }

  const reuniaoIndex = mockReunioes.findIndex(r => r.id === id && r.userId === userId);

  if (reuniaoIndex === -1) {
    throw errors.notFound('Reunião não encontrada');
  }

  const reuniaoAtual = mockReunioes[reuniaoIndex];

  mockReunioes[reuniaoIndex] = {
    ...reuniaoAtual,
    status,
    atualizadoEm: new Date(),
    realizadaEm: status === 'realizada' && reuniaoAtual.status !== 'realizada' 
      ? new Date() 
      : reuniaoAtual.realizadaEm,
  };

  logger.info('Meeting status updated', {
    reuniaoId: id,
    userId,
    oldStatus: reuniaoAtual.status,
    newStatus: status
  });

  res.json({
    success: true,
    message: 'Status da reunião atualizado',
    data: { reuniao: mockReunioes[reuniaoIndex] },
  });
});

/**
 * @route GET /api/reunioes/calendario/:ano/:mes
 * @desc Get calendar view of meetings
 * @access Private
 */
router.get('/calendario/:ano/:mes', async (req: AuthenticatedRequest, res) => {
  const { ano, mes } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const anoNum = parseInt(ano);
  const mesNum = parseInt(mes);

  if (isNaN(anoNum) || isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
    throw errors.badRequest('Ano e mês devem ser números válidos');
  }

  // Filter meetings for the specific month
  const inicioMes = new Date(anoNum, mesNum - 1, 1);
  const fimMes = new Date(anoNum, mesNum, 0, 23, 59, 59);

  const reunioesMes = mockReunioes.filter(r => 
    r.userId === userId && 
    r.dataHora >= inicioMes && 
    r.dataHora <= fimMes
  );

  // Group by day
  const calendario: { [dia: string]: typeof reunioesMes } = {};
  
  reunioesMes.forEach(reuniao => {
    const dia = reuniao.dataHora.getDate().toString().padStart(2, '0');
    if (!calendario[dia]) {
      calendario[dia] = [];
    }
    calendario[dia].push(reuniao);
  });

  res.json({
    success: true,
    message: 'Calendário de reuniões',
    data: {
      ano: anoNum,
      mes: mesNum,
      calendario,
      total: reunioesMes.length,
    },
  });
});

export default router;