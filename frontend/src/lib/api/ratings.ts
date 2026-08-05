import { api } from '../api-client';
import type { Rating } from '../../types';

export const rateMovie = (tmdbId: number, score: number) =>
  api.put<Rating>(`/movies/${tmdbId}/rating`, { score }).then((r) => r.data);

export const removeRating = (tmdbId: number) =>
  api.delete(`/movies/${tmdbId}/rating`).then((r) => r.data);

export const getMyRating = (tmdbId: number) =>
  api.get<Rating | null>(`/movies/${tmdbId}/rating/me`).then((r) => r.data);
