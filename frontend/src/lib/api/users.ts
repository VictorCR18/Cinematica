import { api } from '../api-client';
import type { ConnectionUser, PaginatedResponse, Review, User, UserMovieRating, UserProfile, UserSettings } from '../../types';

export const getProfile = (username: string) =>
  api.get<UserProfile>(`/users/${username}`).then((r) => r.data);

export const updateMe = (input: { name?: string; bio?: string; avatarUrl?: string }) =>
  api.patch<User>('/users/me', input).then((r) => r.data);

export const getMySettings = () => api.get<UserSettings>('/users/me/settings').then((r) => r.data);

export const updateMySettings = (input: Partial<Omit<UserSettings, 'email'>>) =>
  api.patch<UserSettings>('/users/me/settings', input).then((r) => r.data);

export const changeMyEmail = (input: { email: string; currentPassword: string }) =>
  api.patch<{ email: string }>('/users/me/email', input).then((r) => r.data);

export const changeMyPassword = (input: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => api.patch('/users/me/password', input).then((r) => r.data);

export const followUser = (username: string) => api.post(`/users/${username}/follow`).then((r) => r.data);
export const unfollowUser = (username: string) => api.delete(`/users/${username}/follow`).then((r) => r.data);
export const listFollowers = (username: string) =>
  api.get<ConnectionUser[]>(`/users/${username}/followers`).then((r) => r.data);
export const listFollowing = (username: string) =>
  api.get<ConnectionUser[]>(`/users/${username}/following`).then((r) => r.data);

export const listRatingsByUsername = (username: string, page = 1) =>
  api.get<PaginatedResponse<UserMovieRating>>(`/users/${username}/ratings`, { params: { page } }).then((r) => r.data);

export const listReviewsByUsername = (username: string, page = 1) =>
  api.get<PaginatedResponse<Review>>(`/users/${username}/reviews`, { params: { page } }).then((r) => r.data);
