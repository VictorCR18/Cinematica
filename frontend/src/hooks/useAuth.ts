import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth-store';
import { loginRequest, logoutRequest, meRequest, registerRequest } from '../lib/api/auth';

/** Carrega a sessão atual (via cookie httpOnly) uma vez, na montagem do app. */
export const useBootstrapAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  const { data, isFetched } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: meRequest,
    retry: false,
    throwOnError: false,
  });

  useEffect(() => {
    if (isFetched) {
      setUser(data ?? null);
      setInitialized(true);
    }
  }, [data, isFetched, setUser, setInitialized]);
};

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries();
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.invalidateQueries();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
  });

  return {
    user,
    isAuthenticated: Boolean(user),
    isInitialized,
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
  };
};
