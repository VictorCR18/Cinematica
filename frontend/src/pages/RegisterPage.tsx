import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Film } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { getApiErrorMessage } from '../lib/api-client';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register.mutateAsync(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível criar sua conta'));
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8 flex flex-col items-center text-center">
          <Film className="text-accent" size={32} />
          <h1 className="mt-3 font-display text-3xl font-semibold text-paper">Crie sua conta</h1>
          <p className="mt-1 text-sm text-muted">Comece a registrar os filmes que você assiste</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-border bg-panel p-6">
          <div>
            <label className="text-xs text-muted" htmlFor="name">
              Nome
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1.5 w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-muted" htmlFor="username">
              Nome de usuário
            </label>
            <input
              id="username"
              required
              pattern="[a-z0-9_]+"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value.toLowerCase() }))}
              className="mt-1.5 w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-muted" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
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
              minLength={8}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="mt-1.5 w-full rounded-lg border border-border-strong bg-ink px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          {error && <p className="text-sm text-accent">{error}</p>}
          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Já tem conta?{' '}
          <Link to="/entrar" className="text-accent hover:text-accent-hover">
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
