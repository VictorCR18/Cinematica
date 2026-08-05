import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api',
  withCredentials: true,
});

export interface ApiErrorPayload {
  error: string;
  details?: unknown;
}

export const getApiErrorMessage = (error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string => {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data?.error ?? fallback;
  }
  return fallback;
};
