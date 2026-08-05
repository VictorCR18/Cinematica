import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as moviesService from './movies.service.js';

export const listPopular = asyncHandler(async (req: Request, res: Response) => {
  const { page } = req.query as unknown as { page: number };
  res.json(await moviesService.getPopular(page));
});

export const listNowPlaying = asyncHandler(async (req: Request, res: Response) => {
  const { page } = req.query as unknown as { page: number };
  res.json(await moviesService.getNowPlaying(page));
});

export const listTopRated = asyncHandler(async (req: Request, res: Response) => {
  const { page } = req.query as unknown as { page: number };
  res.json(await moviesService.getTopRated(page));
});

export const listUpcoming = asyncHandler(async (req: Request, res: Response) => {
  const { page } = req.query as unknown as { page: number };
  res.json(await moviesService.getUpcoming(page));
});

export const search = asyncHandler(async (req: Request, res: Response) => {
  const { query, page } = req.query as unknown as { query: string; page: number };
  res.json(await moviesService.searchMovies(query, page));
});

export const listGenres = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await moviesService.getGenres());
});

export const getDetails = asyncHandler(async (req: Request, res: Response) => {
  const { tmdbId } = req.params as unknown as { tmdbId: number };
  res.json(await moviesService.getMovieDetails(tmdbId));
});
