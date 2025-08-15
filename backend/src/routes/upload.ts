import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AuthenticatedRequest } from '@/middleware/auth-middleware';
import { errors } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';

const router = Router();

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtro para tipos de arquivo permitidos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido'));
  }
};

// Configurar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // Máximo 5 arquivos por upload
  }
});

/**
 * @route POST /api/upload
 * @desc Upload single file
 * @access Private
 */
router.post('/', upload.single('arquivo'), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    if (!req.file) {
      throw errors.badRequest('Nenhum arquivo enviado');
    }

    // Gerar URL para o arquivo
    const fileUrl = `/uploads/${req.file.filename}`;
    
    const fileInfo = {
      id: Date.now(),
      nome: req.file.originalname,
      url: fileUrl,
      tipo: req.file.mimetype,
      tamanho: req.file.size,
      uploadEm: new Date()
    };

    logger.info('File uploaded', {
      userId,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype
    });

    res.status(201).json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      data: fileInfo
    });
  } catch (error) {
    logger.error('Upload error', { error: error.message });
    throw error;
  }
});

/**
 * @route POST /api/upload/multiple
 * @desc Upload multiple files
 * @access Private
 */
router.post('/multiple', upload.array('arquivos', 5), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    if (!req.files || req.files.length === 0) {
      throw errors.badRequest('Nenhum arquivo enviado');
    }

    const files = Array.isArray(req.files) ? req.files : [req.files];
    
    const uploadedFiles = files.map((file, index) => ({
      id: Date.now() + index,
      nome: file.originalname,
      url: `/uploads/${file.filename}`,
      tipo: file.mimetype,
      tamanho: file.size,
      uploadEm: new Date()
    }));

    logger.info('Multiple files uploaded', {
      userId,
      fileCount: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0)
    });

    res.status(201).json({
      success: true,
      message: 'Arquivos enviados com sucesso',
      data: uploadedFiles
    });
  } catch (error) {
    logger.error('Multiple upload error', { error: error.message });
    throw error;
  }
});

/**
 * @route GET /api/upload/:filename
 * @desc Download file
 * @access Private
 */
router.get('/:filename', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { filename } = req.params;
    
    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      throw errors.notFound('Arquivo não encontrado');
    }

    // TODO: Implementar verificação de permissão do usuário para o arquivo
    
    res.download(filePath);
  } catch (error) {
    logger.error('Download error', { error: error.message });
    throw error;
  }
});

/**
 * @route DELETE /api/upload/:filename
 * @desc Delete file
 * @access Private
 */
router.delete('/:filename', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    const { filename } = req.params;
    
    if (!userId) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      throw errors.notFound('Arquivo não encontrado');
    }

    // TODO: Implementar verificação de permissão do usuário para o arquivo
    
    fs.unlinkSync(filePath);

    logger.info('File deleted', {
      userId,
      filename
    });

    res.json({
      success: true,
      message: 'Arquivo removido com sucesso'
    });
  } catch (error) {
    logger.error('Delete file error', { error: error.message });
    throw error;
  }
});

export default router;
