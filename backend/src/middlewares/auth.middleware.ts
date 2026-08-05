import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';

const extractToken = (req: Request): string | null => {
  const fromCookie = req.cookies?.[env.COOKIE_NAME];
  if (fromCookie) return fromCookie;

  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);

  return null;
};

/** Exige um usuário autenticado válido; caso contrário retorna 401. */
export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) return next(AppError.unauthorized('Faça login para continuar'));

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch {
    next(AppError.unauthorized('Sessão inválida ou expirada'));
  }
};

/** Popula req.user quando há token válido, mas não bloqueia a requisição. */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, username: payload.username };
  } catch {
    // token inválido/expirado: segue como visitante anônimo
  }
  next();
};
