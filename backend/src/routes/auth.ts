import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '@/middleware/auth-middleware';
import { errors } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';
import { User, AuthRequest, RegisterRequest } from '@/types/user';
import { prisma } from '@/lib/prisma';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@trafficmanager.com',
    nome: 'Administrador',
    plano: 'premium',
    dataCadastro: new Date('2024-01-01'),
    ultimoLogin: new Date(),
  },
  {
    id: '2',
    email: 'teste@trafficmanager.com',
    nome: 'Usuário Teste',
    plano: 'free',
    dataCadastro: new Date('2024-01-15'),
    ultimoLogin: new Date(),
  }
];

// Mock passwords (in production, these would be hashed in database)
const mockPasswords: Record<string, string> = {
  'admin@trafficmanager.com': 'admin123',
  'teste@trafficmanager.com': 'teste123',
};

const JWT_SECRET = process.env.JWT_SECRET || 'traffic-manager-secret-key';

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, senha } = validatedData;

    // Find user in database
    const user = await prisma.user.findFirst({
      where: { email }
    });

    if (!user) {
      throw errors.unauthorized('Email ou senha inválidos');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      throw errors.unauthorized('Email ou senha inválidos');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { ultimoLogin: new Date() }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        plano: user.plano 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    logger.info('User logged in', {
      userId: user.id,
      email: user.email,
      plano: user.plano
    });

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          nome: user.nome,
          plano: user.plano,
          dataCadastro: user.dataCadastro,
          ultimoLogin: user.ultimoLogin,
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
 * @route POST /api/auth/register
 * @desc Register new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { nome, email, senha } = validatedData;

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      throw errors.conflict('Usuário já existe com este email');
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      nome,
      plano: 'free', // Default to free plan
      dataCadastro: new Date(),
      ultimoLogin: new Date(),
    };

    // Add to mock database
    mockUsers.push(newUser);
    mockPasswords[email] = senha; // In production, hash the password

    logger.info('User registered', {
      userId: newUser.id,
      email: newUser.email,
      plano: newUser.plano
    });

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          nome: newUser.nome,
          plano: newUser.plano,
          dataCadastro: newUser.dataCadastro,
          ultimoLogin: newUser.ultimoLogin,
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
 * @route GET /api/auth/me
 * @desc Get current user info
 * @access Private
 */
router.get('/me', async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  
  if (!userId) {
    throw errors.unauthorized('Usuário não autenticado');
  }

  const user = mockUsers.find(u => u.id === userId);
  if (!user) {
    throw errors.notFound('Usuário não encontrado');
  }

  res.json({
    success: true,
    message: 'Usuário encontrado',
    data: {
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        plano: user.plano,
        dataCadastro: user.dataCadastro,
        ultimoLogin: user.ultimoLogin,
      }
    }
  });
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user (client-side token removal)
 * @access Private
 */
router.post('/logout', async (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id;
  
  if (userId) {
    logger.info('User logged out', { userId });
  }

  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

export default router;