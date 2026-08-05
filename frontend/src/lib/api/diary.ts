import { api } from '../api-client';
import type { DiaryEntry, PaginatedResponse } from '../../types';

export const logMovie = (input: {
  tmdbId: number;
  watchedAt: string;
  rewatch?: boolean;
  rating?: number;
  reviewContent?: string;
  containsSpoilers?: boolean;
}) => api.post<DiaryEntry>('/diary', input).then((r) => r.data);

export const listMyDiary = (page = 1) =>
  api.get<PaginatedResponse<DiaryEntry>>('/diary/me', { params: { page } }).then((r) => r.data);

export const listDiaryByUsername = (username: string, page = 1) =>
  api.get<PaginatedResponse<DiaryEntry>>(`/diary/user/${username}`, { params: { page } }).then((r) => r.data);

export const deleteDiaryEntry = (id: string) => api.delete(`/diary/${id}`).then((r) => r.data);
