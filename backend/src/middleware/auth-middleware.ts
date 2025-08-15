import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '@/config';
import { errors } from '@/middleware/error-handler';
import { logger } from '@/utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    nome: string;
    plano: 'free' | 'premium';
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
  nome: string;
  plano: 'free' | 'premium';
  iat?: number;
  exp?: number;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw errors.unauthorized('Token de acesso não fornecido');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw errors.unauthorized('Token de acesso inválido');
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    if (!decoded.userId || !decoded.email) {
      throw errors.unauthorized('Token de acesso inválido');
    }

    // Add user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      nome: decoded.nome,
      plano: decoded.plano
    };

    logger.debug('User authenticated successfully', {
      userId: decoded.userId,
      email: decoded.email
    });

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Invalid JWT token', {
        error: error.message,
        ip: req.ip
      });
      throw errors.unauthorized('Token de acesso inválido');
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Expired JWT token', {
        error: error.message,
        ip: req.ip
      });
      throw errors.unauthorized('Token de acesso expirado');
    }

    throw error;
  }
};

// Middleware to check user plan
export const requirePlan = (requiredPlan: 'premium') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    if (requiredPlan === 'premium' && req.user.plano !== 'premium') {
      throw errors.forbidden(`Acesso restrito ao plano ${requiredPlan}`);
    }

    next();
  };
};

// Helper function to generate JWT token
export const generateToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  const secret = config.jwt.secret;
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

// Helper function to verify token without middleware
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};