import { api } from '../api-client';
import type { User, UserProfile } from '../../types';

export const getProfile = (username: string) =>
  api.get<UserProfile>(`/users/${username}`).then((r) => r.data);

export const updateMe = (input: { name?: string; bio?: string; avatarUrl?: string }) =>
  api.patch<User>('/users/me', input).then((r) => r.data);

export const changeMyPassword = (input: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => api.patch('/users/me/password', input).then((r) => r.data);

export const followUser = (username: string) => api.post(`/users/${username}/follow`).then((r) => r.data);
export const unfollowUser = (username: string) => api.delete(`/users/${username}/follow`).then((r) => r.data);
export const listFollowers = (username: string) => api.get<User[]>(`/users/${username}/followers`).then((r) => r.data);
export const listFollowing = (username: string) => api.get<User[]>(`/users/${username}/following`).then((r) => r.data);
