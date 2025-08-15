import { Router } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '@/middleware/auth-middleware';
import { errors } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';
import { generateNicheDiagnosis } from '@/lib/gpt/generate-diagnosis';

const router = Router();

// Validation schema for diagnosis form
const diagnosticoSchema = z.object({
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  
  // Negócio
  tipoNegocio: z.string().min(2, 'Tipo de negócio é obrigatório'),
  tempoMercado: z.string().min(1, 'Tempo no mercado é obrigatório'),
  faturamentoMensal: z.string().min(1, 'Faturamento mensal é obrigatório'),
  
  // Público
  publicoAlvo: z.string().min(10, 'Descrição do público alvo deve ter pelo menos 10 caracteres'),
  problemaPrincipal: z.string().min(10, 'Problema principal deve ter pelo menos 10 caracteres'),
  
  // Oferta
  produto: z.string().min(10, 'Descrição do produto/serviço é obrigatória'),
  precoMedio: z.string().min(1, 'Preço médio é obrigatório'),
  diferenciais: z.string().min(10, 'Diferenciais devem ter pelo menos 10 caracteres'),
  
  // Experiência Digital
  presencaDigital: z.array(z.string()).min(1, 'Pelo menos uma presença digital é obrigatória'),
  investimentoMarketing: z.string().min(1, 'Investimento em marketing é obrigatório'),
  principalCanal: z.string().min(1, 'Principal canal é obrigatório'),
  
  // Concorrência
  principais3Concorrentes: z.string().min(10, 'Descrição dos concorrentes é obrigatória'),
  diferencialConcorrencia: z.string().min(10, 'Diferencial da concorrência é obrigatório'),
  
  // Desafios
  maioresDificuldades: z.string().min(10, 'Maiores dificuldades devem ter pelo menos 10 caracteres'),
  resultadosEsperados: z.string().min(10, 'Resultados esperados devem ter pelo menos 10 caracteres'),
});

// Mock database for diagnostics
const mockDiagnosticos: Array<{
  id: string;
  clienteId: string;
  userId: string;
  formData: z.infer<typeof diagnosticoSchema>;
  diagnosis: string;
  criadoEm: Date;
  atualizadoEm: Date;
}> = [];

/**
 * @route GET /api/diagnostico-nicho
 * @desc Get all diagnostics for authenticated user
 * @access Private
 */
router.get('/', async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const userDiagnosticos = mockDiagnosticos.filter(d => d.userId === userId);

  res.json({
    success: true,
    message: 'Diagnósticos encontrados',
    data: {
      diagnosticos: userDiagnosticos,
      total: userDiagnosticos.length,
    },
  });
});

/**
 * @route GET /api/diagnostico-nicho/:id
 * @desc Get specific diagnostic
 * @access Private
 */
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const diagnostico = mockDiagnosticos.find(d => d.id === id && d.userId === userId);

  if (!diagnostico) {
    throw errors.notFound('Diagnóstico não encontrado');
  }

  res.json({
    success: true,
    message: 'Diagnóstico encontrado',
    data: { diagnostico },
  });
});

/**
 * @route POST /api/diagnostico-nicho
 * @desc Create new diagnostic analysis
 * @access Private
 */
router.post('/', async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const validatedData = diagnosticoSchema.parse(req.body);

  try {
    // Generate AI diagnosis
    const diagnosis = await generateNicheDiagnosis(validatedData);

    const novoDiagnostico = {
      id: `diagnostico_${Date.now()}`,
      clienteId: validatedData.clienteId,
      userId,
      formData: validatedData,
      diagnosis,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    mockDiagnosticos.push(novoDiagnostico);

    logger.info('Diagnostic created', {
      diagnosticoId: novoDiagnostico.id,
      userId,
      clienteId: validatedData.clienteId
    });

    res.status(201).json({
      success: true,
      message: 'Diagnóstico gerado com sucesso',
      data: { diagnostico: novoDiagnostico },
    });
  } catch (error) {
    logger.error('Error generating diagnosis', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
      clienteId: validatedData.clienteId
    });

    throw errors.internal('Erro ao gerar diagnóstico. Tente novamente.');
  }
});

/**
 * @route POST /api/diagnostico-nicho/:id/regenerate
 * @desc Regenerate diagnostic analysis
 * @access Private
 */
router.post('/:id/regenerate', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const diagnosticoIndex = mockDiagnosticos.findIndex(d => d.id === id && d.userId === userId);

  if (diagnosticoIndex === -1) {
    throw errors.notFound('Diagnóstico não encontrado');
  }

  const existingDiagnostico = mockDiagnosticos[diagnosticoIndex];

  try {
    // Regenerate AI diagnosis
    const newDiagnosis = await generateNicheDiagnosis(existingDiagnostico.formData);

    // Update diagnostic
    const updatedDiagnostico = {
      ...existingDiagnostico,
      diagnosis: newDiagnosis,
      atualizadoEm: new Date(),
    };

    mockDiagnosticos[diagnosticoIndex] = updatedDiagnostico;

    logger.info('Diagnostic regenerated', {
      diagnosticoId: id,
      userId
    });

    res.json({
      success: true,
      message: 'Diagnóstico regenerado com sucesso',
      data: { diagnostico: updatedDiagnostico },
    });
  } catch (error) {
    logger.error('Error regenerating diagnosis', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
      diagnosticoId: id
    });

    throw errors.internal('Erro ao regenerar diagnóstico. Tente novamente.');
  }
});

/**
 * @route DELETE /api/diagnostico-nicho/:id
 * @desc Delete diagnostic
 * @access Private
 */
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const diagnosticoIndex = mockDiagnosticos.findIndex(d => d.id === id && d.userId === userId);

  if (diagnosticoIndex === -1) {
    throw errors.notFound('Diagnóstico não encontrado');
  }

  mockDiagnosticos.splice(diagnosticoIndex, 1);

  logger.info('Diagnostic deleted', {
    diagnosticoId: id,
    userId
  });

  res.json({
    success: true,
    message: 'Diagnóstico removido com sucesso',
  });
});

export default router;