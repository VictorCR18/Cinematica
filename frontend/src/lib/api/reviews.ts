import { api } from '../api-client';
import type { PaginatedResponse, Review } from '../../types';

export const createReview = (
  tmdbId: number,
  input: { content: string; rating?: number; containsSpoilers?: boolean },
) => api.post<Review>(`/movies/${tmdbId}/reviews`, input).then((r) => r.data);

export const listReviewsForMovie = (tmdbId: number, page = 1) =>
  api.get<PaginatedResponse<Review>>(`/movies/${tmdbId}/reviews`, { params: { page } }).then((r) => r.data);

export const likeReview = (id: string) => api.post(`/reviews/${id}/like`).then((r) => r.data);
export const unlikeReview = (id: string) => api.delete(`/reviews/${id}/like`).then((r) => r.data);
export const deleteReview = (id: string) => api.delete(`/reviews/${id}`).then((r) => r.data);
