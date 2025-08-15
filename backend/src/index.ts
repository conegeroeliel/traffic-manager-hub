import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

import { config } from '@/config';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/error-handler';
import { authMiddleware } from '@/middleware/auth-middleware';

// Importar rotas
import authRoutes from '@/routes/auth';
import clientesRoutes from '@/routes/clientes';
import diagnosticoRoutes from '@/routes/diagnostico-nicho';
import calculadoraRoutes from '@/routes/calculadora';
import tarefasRoutes from '@/routes/tarefas';
import reunioesRoutes from '@/routes/reunioes';
import plansRoutes from '@/routes/plans';
import adminRoutes from '@/routes/admin';
import debriefingRoutes from '@/routes/debriefing';
import timelineRoutes from '@/routes/timeline';
import uploadRoutes from '@/routes/upload';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.app.isDevelopment ? true : config.frontend.url,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Muitas requisições. Tente novamente em alguns minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Basic middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.app.environment
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clientes', authMiddleware, clientesRoutes);
app.use('/api/diagnostico-nicho', authMiddleware, diagnosticoRoutes);
app.use('/api/calculadora', authMiddleware, calculadoraRoutes);
app.use('/api/tarefas', authMiddleware, tarefasRoutes);
app.use('/api/reunioes', authMiddleware, reunioesRoutes);
app.use('/api/plans', authMiddleware, plansRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/debriefing', debriefingRoutes);
app.use('/api/timeline', authMiddleware, timelineRoutes);
app.use('/api/upload', authMiddleware, uploadRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.app.port;

app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${PORT}`);
  logger.info(`📱 Frontend URL: ${config.frontend.url}`);
  logger.info(`🌍 Ambiente: ${config.app.environment}`);
});

export default app;