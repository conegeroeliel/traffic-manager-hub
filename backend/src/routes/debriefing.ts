import express from 'express';
import { generateNicheDiagnosis } from '@/lib/gpt/generate-diagnosis';
import { logger } from '@/utils/logger';
import { errors } from '@/middleware/error-handler';

const router = express.Router();

// POST /api/debriefing/teste-ia
router.post('/teste-ia', async (req, res) => {
  try {
    const { respostas } = req.body;

    if (!respostas) {
      return res.status(400).json({
        success: false,
        error: 'Dados de teste são obrigatórios'
      });
    }

    logger.info('Iniciando teste da IA com dados:', {
      empresa: respostas.nomeEmpresa,
      segmento: respostas.segmento
    });

    // Gerar diagnóstico usando a IA
    const diagnostico = await generateNicheDiagnosis(respostas);

    logger.info('Diagnóstico gerado com sucesso');

    return res.json({
      success: true,
      resposta: diagnostico,
      empresa: respostas.nomeEmpresa,
      segmento: respostas.segmento,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Erro no teste da IA:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// GET /api/debriefing
router.get('/', async (req, res) => {
  try {
    // Listar debriefings (implementar quando tiver banco de dados)
    res.json({
      success: true,
      data: [],
      message: 'Lista de debriefings (funcionalidade em desenvolvimento)'
    });
  } catch (error) {
    logger.error('Erro ao listar debriefings:', error);
    res.status(500).json(errors.internal());
  }
});

// POST /api/debriefing
router.post('/', async (req, res) => {
  try {
    const { respostas } = req.body;

    if (!respostas) {
      return res.status(400).json({
        success: false,
        error: 'Dados do debriefing são obrigatórios'
      });
    }

    // Gerar diagnóstico
    const diagnostico = await generateNicheDiagnosis(respostas);

    // Salvar no banco (implementar quando tiver banco de dados)
    const debriefing = {
      id: Date.now().toString(),
      respostas,
      diagnostico,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: debriefing,
      message: 'Debriefing criado com sucesso'
    });

  } catch (error) {
    logger.error('Erro ao criar debriefing:', error);
    res.status(500).json(errors.internal());
  }
});

export default router;
