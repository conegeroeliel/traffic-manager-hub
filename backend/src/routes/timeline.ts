import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '@/middleware/auth-middleware';
import { errors } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';

const router = Router();

// Validation schemas
const timelineEventSchema = z.object({
  clienteId: z.string().min(1, 'ID do cliente é obrigatório'),
  tipo: z.enum([
    'reuniao', 'analise_kpi', 'otimizacao', 'criativo', 'marco', 
    'problema', 'feedback', 'sistema', 'meta_batida', 'alerta', 'comunicacao'
  ]),
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  data: z.string().datetime().or(z.date()),
  autor: z.string().min(1, 'Autor é obrigatório'),
  importancia: z.enum(['baixo', 'medio', 'alto', 'critico', 'celebrativo']),
  dadosAdicionais: z.record(z.any()).optional(),
});

const updateTimelineEventSchema = timelineEventSchema.partial();

// Mock database
const mockTimelineEvents: Array<{
  id: string;
  clienteId: string;
  tipo: string;
  titulo: string;
  descricao: string;
  data: Date;
  autor: string;
  importancia: string;
  dadosAdicionais?: any;
  userId: string;
  criadoEm: Date;
  atualizadoEm: Date;
}> = [
  {
    id: 'timeline_1',
    clienteId: 'cliente_1',
    tipo: 'reuniao',
    titulo: 'Reunião de Alinhamento Inicial',
    descricao: 'Primeira reunião com o cliente para entender objetivos e expectativas do projeto.',
    data: new Date('2024-01-15T10:00:00'),
    autor: 'João Silva',
    importancia: 'alto',
    userId: 'user_1',
    criadoEm: new Date('2024-01-15T10:00:00'),
    atualizadoEm: new Date('2024-01-15T10:00:00')
  },
  {
    id: 'timeline_2',
    clienteId: 'cliente_1',
    tipo: 'analise_kpi',
    titulo: 'Análise de Performance - Semana 1',
    descricao: 'Análise dos primeiros resultados das campanhas. CTR: 2.5%, CPC: R$ 1.20',
    data: new Date('2024-01-22T14:30:00'),
    autor: 'Maria Santos',
    importancia: 'medio',
    userId: 'user_1',
    criadoEm: new Date('2024-01-22T14:30:00'),
    atualizadoEm: new Date('2024-01-22T14:30:00')
  },
  {
    id: 'timeline_3',
    clienteId: 'cliente_1',
    tipo: 'otimizacao',
    titulo: 'Otimização de Campanha Facebook',
    descricao: 'Pausa de 2 criativos com baixo CTR. Ajuste de público-alvo para melhorar performance.',
    data: new Date('2024-01-25T09:15:00'),
    autor: 'Carlos Oliveira',
    importancia: 'medio',
    userId: 'user_1',
    criadoEm: new Date('2024-01-25T09:15:00'),
    atualizadoEm: new Date('2024-01-25T09:15:00')
  },
  {
    id: 'timeline_4',
    clienteId: 'cliente_1',
    tipo: 'meta_batida',
    titulo: 'Meta de ROAS 10x Alcançada!',
    descricao: 'Parabéns! Batemos a meta de ROAS 10x. Resultado: 12.5x ROAS no período.',
    data: new Date('2024-02-01T16:00:00'),
    autor: 'Sistema',
    importancia: 'celebrativo',
    userId: 'user_1',
    criadoEm: new Date('2024-02-01T16:00:00'),
    atualizadoEm: new Date('2024-02-01T16:00:00')
  },
  {
    id: 'timeline_5',
    clienteId: 'cliente_1',
    tipo: 'alerta',
    titulo: 'Verba de Campanha Baixa',
    descricao: 'Atenção: Verba da campanha principal está com apenas 15% restante.',
    data: new Date('2024-02-05T11:30:00'),
    autor: 'Sistema',
    importancia: 'critico',
    userId: 'user_1',
    criadoEm: new Date('2024-02-05T11:30:00'),
    atualizadoEm: new Date('2024-02-05T11:30:00')
  },
  {
    id: 'timeline_6',
    clienteId: 'cliente_1',
    tipo: 'criativo',
    titulo: 'Novo Criativo Aprovado',
    descricao: 'Novo criativo foi aprovado pelo cliente e ativado na campanha.',
    data: new Date('2024-02-08T13:45:00'),
    autor: 'Ana Costa',
    importancia: 'medio',
    userId: 'user_1',
    criadoEm: new Date('2024-02-08T13:45:00'),
    atualizadoEm: new Date('2024-02-08T13:45:00')
  }
];

/**
 * @route GET /api/timeline/cliente/:clienteId
 * @desc Get timeline events for a specific client
 * @access Private
 */
router.get('/cliente/:clienteId', async (req: AuthenticatedRequest, res) => {
  const { clienteId } = req.params;
  const userId = req.user?.id;
  const { tipo, importancia, dataInicio, dataFim, autor } = req.query;
  
  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  // Filter events by user and client
  let userEvents = mockTimelineEvents.filter(event => 
    event.userId === userId && event.clienteId === clienteId
  );

  // Apply filters
  if (tipo) {
    userEvents = userEvents.filter(event => event.tipo === tipo);
  }

  if (importancia) {
    userEvents = userEvents.filter(event => event.importancia === importancia);
  }

  if (dataInicio) {
    const dataInicioDate = new Date(dataInicio as string);
    userEvents = userEvents.filter(event => event.data >= dataInicioDate);
  }

  if (dataFim) {
    const dataFimDate = new Date(dataFim as string);
    userEvents = userEvents.filter(event => event.data <= dataFimDate);
  }

  if (autor) {
    userEvents = userEvents.filter(event => 
      event.autor.toLowerCase().includes((autor as string).toLowerCase())
    );
  }

  // Sort by date (newest first)
  userEvents.sort((a, b) => b.data.getTime() - a.data.getTime());

  logger.info('Timeline events fetched', {
    userId,
    clienteId,
    count: userEvents.length,
    filters: { tipo, importancia, dataInicio, dataFim, autor }
  });

  res.json({
    success: true,
    message: 'Eventos da timeline encontrados',
    data: {
      eventos: userEvents,
      total: userEvents.length,
    },
  });
});

/**
 * @route GET /api/timeline/evento/:id
 * @desc Get specific timeline event
 * @access Private
 */
router.get('/evento/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const evento = mockTimelineEvents.find(e => e.id === id && e.userId === userId);

  if (!evento) {
    throw errors.notFound('Evento não encontrado');
  }

  res.json({
    success: true,
    message: 'Evento encontrado',
    data: { evento },
  });
});

/**
 * @route POST /api/timeline/evento
 * @desc Create new timeline event
 * @access Private
 */
router.post('/evento', async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const validatedData = timelineEventSchema.parse(req.body);

  const novoEvento = {
    id: `timeline_${Date.now()}`,
    ...validatedData,
    data: new Date(validatedData.data),
    userId,
    criadoEm: new Date(),
    atualizadoEm: new Date(),
  };

  mockTimelineEvents.push(novoEvento);

  logger.info('Timeline event created', {
    eventoId: novoEvento.id,
    userId,
    clienteId: novoEvento.clienteId,
    tipo: novoEvento.tipo
  });

  res.status(201).json({
    success: true,
    message: 'Evento criado com sucesso',
    data: { evento: novoEvento },
  });
});

/**
 * @route PUT /api/timeline/evento/:id
 * @desc Update timeline event
 * @access Private
 */
router.put('/evento/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const validatedData = updateTimelineEventSchema.parse(req.body);

  const eventoIndex = mockTimelineEvents.findIndex(e => e.id === id && e.userId === userId);

  if (eventoIndex === -1) {
    throw errors.notFound('Evento não encontrado');
  }

  // Update event
  const updatedEvento = {
    ...mockTimelineEvents[eventoIndex],
    ...validatedData,
    ...(validatedData.data && { data: new Date(validatedData.data) }),
    atualizadoEm: new Date(),
  };

  mockTimelineEvents[eventoIndex] = updatedEvento;

  logger.info('Timeline event updated', {
    eventoId: id,
    userId
  });

  res.json({
    success: true,
    message: 'Evento atualizado com sucesso',
    data: { evento: updatedEvento },
  });
});

/**
 * @route DELETE /api/timeline/evento/:id
 * @desc Delete timeline event
 * @access Private
 */
router.delete('/evento/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const eventoIndex = mockTimelineEvents.findIndex(e => e.id === id && e.userId === userId);

  if (eventoIndex === -1) {
    throw errors.notFound('Evento não encontrado');
  }

  // Remove event
  mockTimelineEvents.splice(eventoIndex, 1);

  logger.info('Timeline event deleted', {
    eventoId: id,
    userId
  });

  res.json({
    success: true,
    message: 'Evento removido com sucesso',
  });
});

/**
 * @route GET /api/timeline/stats/:clienteId
 * @desc Get timeline statistics for a client
 * @access Private
 */
router.get('/stats/:clienteId', async (req: AuthenticatedRequest, res) => {
  const { clienteId } = req.params;
  const userId = req.user?.id;
  
  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const userEvents = mockTimelineEvents.filter(event => 
    event.userId === userId && event.clienteId === clienteId
  );

  const agora = new Date();
  const trintaDiasAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Calculate statistics
  const eventosPorTipo = userEvents.reduce((acc, evento) => {
    acc[evento.tipo] = (acc[evento.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eventosPorImportancia = userEvents.reduce((acc, evento) => {
    acc[evento.importancia] = (acc[evento.importancia] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eventosUltimos30Dias = userEvents.filter(e => e.data >= trintaDiasAtras).length;
  const marcosAlcancados = userEvents.filter(e => e.tipo === 'meta_batida' || e.tipo === 'marco').length;

  const stats = {
    totalEventos: userEvents.length,
    eventosPorTipo,
    eventosPorImportancia,
    eventosUltimos30Dias,
    marcosAlcancados
  };

  logger.info('Timeline stats fetched', {
    userId,
    clienteId,
    stats
  });

  res.json({
    success: true,
    message: 'Estatísticas da timeline encontradas',
    data: { stats },
  });
});

export default router;
