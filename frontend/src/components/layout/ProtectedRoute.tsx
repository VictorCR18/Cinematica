import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-4xl items-center justify-center gap-2 px-4 text-sm text-muted sm:px-6">
        <LoaderCircle size={16} className="animate-spin" />
        Conectando com o servidor...
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/entrar" state={{ from: location }} replace />;

  return <>{children}</>;
};
