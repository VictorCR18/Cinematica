import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) return null;
  if (!isAuthenticated) return <Navigate to="/entrar" state={{ from: location }} replace />;

  return <>{children}</>;
};
