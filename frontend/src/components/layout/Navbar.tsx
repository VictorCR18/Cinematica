import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Film, Search, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate('/'),
    });
  };

  const navLinks = [
    { to: '/filmes/populares', label: 'Populares' },
    { to: '/filmes/em-cartaz', label: 'Em cartaz' },
    { to: '/filmes/mais-avaliados', label: 'Mais avaliados' },
    ...(isAuthenticated ? [{ to: '/feed', label: 'Feed' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Film className="text-accent" size={26} strokeWidth={2} />
          <span className="font-display text-xl font-semibold tracking-tight">Cinemática</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative px-3 py-2 text-sm text-paper-dim hover:text-paper transition-colors group"
            >
              {link.label}
              <span className="absolute left-3 right-3 -bottom-0.5 h-px scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm ml-auto items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar filmes..."
              className="w-full rounded-full border border-border-strong bg-panel py-2 pl-9 pr-3 text-sm text-paper placeholder:text-muted focus:border-accent outline-none transition-colors"
            />
          </div>
        </form>

        <div className="hidden md:flex items-center gap-3 ml-2">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link to={`/perfil/${user.username}`} className="flex items-center gap-2">
                <Avatar name={user.name} src={user.avatarUrl} size={32} />
              </Link>
              <button
                onClick={handleLogout}
                aria-label="Sair"
                className="text-muted hover:text-accent transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/entrar" className="px-3 py-2 text-sm text-paper-dim hover:text-paper">
                Entrar
              </Link>
              <Button size="sm" onClick={() => navigate('/registrar')}>
                Criar conta
              </Button>
            </div>
          )}
        </div>

        <button className="ml-auto md:hidden text-paper" onClick={() => setMobileOpen((o) => !o)} aria-label="Abrir menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden border-t border-border px-4 py-4 space-y-4"
        >
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar filmes..."
              className="w-full rounded-full border border-border-strong bg-panel py-2 pl-9 pr-3 text-sm outline-none"
            />
          </form>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="py-2 text-paper-dim" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
          {isAuthenticated && user ? (
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Link to={`/perfil/${user.username}`} className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <Avatar name={user.name} src={user.avatarUrl} size={28} />
                <span className="text-sm">{user.name}</span>
              </Link>
              <button onClick={handleLogout} className="text-muted">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pt-2 border-t border-border">
              <Link to="/entrar" className="flex-1 text-center py-2 text-sm border border-border-strong rounded-full" onClick={() => setMobileOpen(false)}>
                Entrar
              </Link>
              <Link to="/registrar" className="flex-1 text-center py-2 text-sm bg-accent rounded-full" onClick={() => setMobileOpen(false)}>
                Criar conta
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </header>
  );
};
