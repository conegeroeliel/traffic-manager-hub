import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '@/utils/logger';
import { config } from '@/config';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError | ZodError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Erro interno do servidor';
  let details: any = undefined;

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Dados inválidos';
    details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
  }
  // Handle custom application errors
  else if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Handle known operational errors
  else if ('statusCode' in error && error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Log error
  logger.error('Error handled by error middleware', {
    error: {
      message: error.message,
      stack: error.stack,
      statusCode,
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      ip: req.ip,
    },
  });

  // Prepare error response
  const errorResponse: any = {
    success: false,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  // Add details for validation errors
  if (details) {
    errorResponse.details = details;
  }

  // Add stack trace in development
  if (config.app.isDevelopment && error.stack) {
    errorResponse.stack = error.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Helper function to create custom errors
export const createError = (message: string, statusCode: number = 500) => {
  return new CustomError(message, statusCode);
};

// Common error types
export const errors = {
  badRequest: (message: string = 'Requisição inválida') => createError(message, 400),
  unauthorized: (message: string = 'Não autorizado') => createError(message, 401),
  forbidden: (message: string = 'Acesso negado') => createError(message, 403),
  notFound: (message: string = 'Recurso não encontrado') => createError(message, 404),
  conflict: (message: string = 'Conflito de dados') => createError(message, 409),
  unprocessableEntity: (message: string = 'Dados não processáveis') => createError(message, 422),
  tooManyRequests: (message: string = 'Muitas requisições') => createError(message, 429),
  internal: (message: string = 'Erro interno do servidor') => createError(message, 500),
};