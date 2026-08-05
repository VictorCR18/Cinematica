import type { Request, Response } from 'express';
import { env, isProduction } from '../../config/env.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as authService from './auth.service.js';

const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

const setAuthCookie = (res: Response, token: string) => {
  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await authService.register(req.body);
  setAuthCookie(res, token);
  res.status(201).json({ user, token });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await authService.login(req.body);
  setAuthCookie(res, token);
  res.json({ user, token });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(env.COOKIE_NAME);
  res.status(204).send();
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.json(null);
    return;
  }

  const user = await authService.getMe(req.user!.id);
  res.json(user);
});
