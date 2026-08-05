import { api } from '../api-client';
import type { User } from '../../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const registerRequest = (input: { name: string; username: string; email: string; password: string }) =>
  api.post<AuthResponse>('/auth/register', input).then((r) => r.data);

export const loginRequest = (input: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', input).then((r) => r.data);

export const logoutRequest = () => api.post('/auth/logout').then((r) => r.data);

export const meRequest = () => api.get<User | null>('/auth/me').then((r) => r.data);
