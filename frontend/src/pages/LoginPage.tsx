import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Film } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { getApiErrorMessage } from '../lib/api-client';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login.mutateAsync({ email, password });
      const from = (location.state as { from?: Location })?.from;
      navigate(from ? `${from.pathname}${from.search}` : '/', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'E-mail ou senha incorretos'));
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8 flex flex-col items-center text-center">
          <Film className="text-accent" size={32} />
          <h1 className="mt-3 font-display text-3xl font-semibold text-paper">Bem-vindo de volta</h1>
          <p className="mt-1 text-sm text-muted">Entre para continuar seu diário de filmes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-border bg-panel p-6">
          <div>
            <label className="text-xs text-muted" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-muted" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          {error && <p className="text-sm text-accent">{error}</p>}
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Ainda não tem conta?{' '}
          <Link to="/registrar" className="text-accent hover:text-accent-hover">
            Criar conta
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
