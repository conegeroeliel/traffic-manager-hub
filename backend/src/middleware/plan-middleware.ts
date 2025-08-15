import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth-middleware';
import { PlanManager } from '@/lib/plan-limits';
import { errors } from './error-handler';
import { logger } from '@/utils/logger';

/**
 * Middleware para verificar se o usuário pode criar clientes
 */
export const canCreateCliente = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const check = PlanManager.canCreateCliente(req.user);
    
    if (!check.allowed) {
      logger.warn('User tried to create cliente but hit limit', {
        userId: req.user.id,
        email: req.user.email,
        plano: req.user.plano,
        totalClientes: req.user.totalClientes
      });
      
      throw errors.forbidden(check.message || 'Limite de clientes atingido');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar se o usuário pode criar diagnósticos
 */
export const canCreateDiagnostico = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const check = PlanManager.canCreateDiagnostico(req.user);
    
    if (!check.allowed) {
      logger.warn('User tried to create diagnostico but hit limit', {
        userId: req.user.id,
        email: req.user.email,
        plano: req.user.plano,
        totalDiagnosticos: req.user.totalDiagnosticos
      });
      
      throw errors.forbidden(check.message || 'Limite de diagnósticos atingido');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar se o usuário pode criar tarefas
 */
export const canCreateTarefa = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const check = PlanManager.canCreateTarefa(req.user);
    
    if (!check.allowed) {
      logger.warn('User tried to create tarefa but hit limit', {
        userId: req.user.id,
        email: req.user.email,
        plano: req.user.plano,
        totalTarefas: req.user.totalTarefas
      });
      
      throw errors.forbidden(check.message || 'Limite de tarefas atingido');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar se o usuário pode criar reuniões
 */
export const canCreateReuniao = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    const check = PlanManager.canCreateReuniao(req.user);
    
    if (!check.allowed) {
      logger.warn('User tried to create reuniao but hit limit', {
        userId: req.user.id,
        email: req.user.email,
        plano: req.user.plano,
        totalReunioes: req.user.totalReunioes
      });
      
      throw errors.forbidden(check.message || 'Limite de reuniões atingido');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar se o usuário tem acesso premium
 */
export const requirePremium = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    if (!PlanManager.hasPremiumAccess(req.user)) {
      logger.warn('User tried to access premium feature', {
        userId: req.user.id,
        email: req.user.email,
        plano: req.user.plano,
        statusPagamento: req.user.statusPagamento
      });
      
      throw errors.forbidden('Acesso restrito ao plano Premium');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar se o trial não expirou
 */
export const checkTrialStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw errors.unauthorized('Usuário não autenticado');
    }

    // Se o usuário está no trial e expirou
    if (PlanManager.isTrialExpired(req.user)) {
      logger.warn('User trial expired', {
        userId: req.user.id,
        email: req.user.email,
        dataExpiracaoTrial: req.user.dataExpiracaoTrial
      });
      
      throw errors.forbidden('Seu período trial expirou. Faça upgrade para continuar.');
    }

    // Se o usuário é premium e expirou
    if (PlanManager.isPremiumExpired(req.user)) {
      logger.warn('User premium expired', {
        userId: req.user.id,
        email: req.user.email,
        dataExpiracaoPremium: req.user.dataExpiracaoPremium
      });
      
      throw errors.forbidden('Seu plano premium expirou. Renove para continuar.');
    }

    next();
  } catch (error) {
    next(error);
  }
};


