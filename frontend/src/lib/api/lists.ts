import { api } from '../api-client';
import type { FilmList } from '../../types';

export const createList = (input: { name: string; description?: string; isPublic?: boolean }) =>
  api.post<FilmList>('/lists', input).then((r) => r.data);

export const listListsByUsername = (username: string) =>
  api.get<FilmList[]>(`/lists/user/${username}`).then((r) => r.data);

export const getListById = (id: string) => api.get<FilmList>(`/lists/${id}`).then((r) => r.data);

export const addListItem = (listId: string, tmdbId: number, note?: string) =>
  api.post(`/lists/${listId}/items`, { tmdbId, note }).then((r) => r.data);

export const removeListItem = (listId: string, tmdbId: number) =>
  api.delete(`/lists/${listId}/items/${tmdbId}`).then((r) => r.data);

export const deleteList = (id: string) => api.delete(`/lists/${id}`).then((r) => r.data);
