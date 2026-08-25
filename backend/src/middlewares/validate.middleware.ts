import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../utils/AppError.js';

interface Schemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const replaceObjectValues = (target: unknown, source: unknown) => {
  if (!target || typeof target !== 'object' || !source || typeof source !== 'object') return false;

  for (const key of Object.keys(target)) {
    delete (target as Record<string, unknown>)[key];
  }

  for (const [key, value] of Object.entries(source)) {
    if (DANGEROUS_KEYS.has(key)) continue;
    (target as Record<string, unknown>)[key] = value;
  }

  return true;
};

/** Valida body/query/params com Zod e substitui pelos dados já parseados/coeridos. */
export const validate =
  (schemas: Schemas) => (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) return next(AppError.badRequest('Dados inválidos', result.error.flatten()));
      if (!replaceObjectValues(req.body, result.data)) {
        req.body = result.data;
      }
    }
    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) return next(AppError.badRequest('Parâmetros de busca inválidos', result.error.flatten()));
      replaceObjectValues(req.query, result.data);
    }
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) return next(AppError.badRequest('Parâmetros de rota inválidos', result.error.flatten()));
      replaceObjectValues(req.params, result.data);
    }
    next();
  };