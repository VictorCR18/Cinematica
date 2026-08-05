import { Film } from 'lucide-react';

export const Footer = () => (
  <footer className="border-t border-border mt-20">
    <div className="film-sprockets" />
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
      <div className="flex items-center gap-2">
        <Film size={18} className="text-accent" />
        <span className="font-display text-paper">Cinemática</span>
      </div>
      <p>Registre, avalie e resenhe os filmes que você assiste.</p>
      <p className="font-mono text-xs">Dados de filmes via TMDB</p>
    </div>
  </footer>
);
