import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as watchlistService from './watchlist.service.js';

export const listMine = asyncHandler(async (req: Request, res: Response) => {
  res.json(await watchlistService.listMyWatchlist(req.user!.id));
});

export const listByUsername = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params as unknown as { username: string };
  const items = await watchlistService.listWatchlistByUsername(username);
  if (!items) {
    res.status(404).json({ message: 'Usuário não encontrado' });
    return;
  }
  res.json(items);
});

export const add = asyncHandler(async (req: Request, res: Response) => {
  const { tmdbId } = req.params as unknown as { tmdbId: number };
  res.status(201).json(await watchlistService.addToWatchlist(req.user!.id, tmdbId));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { tmdbId } = req.params as unknown as { tmdbId: number };
  res.json(await watchlistService.removeFromWatchlist(req.user!.id, tmdbId));
});