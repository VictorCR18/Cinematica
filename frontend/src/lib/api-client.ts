import axios from 'axios';

let activeHttpRequests = 0;
const listeners = new Set<() => void>();

const emitNetworkActivity = () => {
  listeners.forEach((listener) => listener());
};

const incrementHttpActivity = () => {
  activeHttpRequests += 1;
  emitNetworkActivity();
};

const decrementHttpActivity = () => {
  activeHttpRequests = Math.max(0, activeHttpRequests - 1);
  emitNetworkActivity();
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'http://localhost:3333/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    incrementHttpActivity();
    return config;
  },
  (error) => {
    decrementHttpActivity();
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    decrementHttpActivity();
    return response;
  },
  (error) => {
    decrementHttpActivity();
    return Promise.reject(error);
  },
);

export const subscribeNetworkActivity = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getNetworkActivityCount = () => activeHttpRequests;

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
