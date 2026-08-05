import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { isProduction } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound(`Rota ${req.method} ${req.originalUrl} não existe`));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Já existe um registro com esses dados', details: err.meta });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
  }

  console.error('💥 Erro não tratado:', err);

  return res.status(500).json({
    error: 'Erro interno do servidor',
    ...(isProduction ? {} : { stack: err instanceof Error ? err.stack : String(err) }),
  });
};
