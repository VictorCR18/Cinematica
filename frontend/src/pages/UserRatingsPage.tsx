import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star } from 'lucide-react';
import { listRatingsByUsername } from '../lib/api/users';
import { tmdbImage } from '../lib/tmdb-image';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export const UserRatingsPage = () => {
  const { username = '' } = useParams<{ username: string }>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['ratings', username, page],
    queryFn: () => listRatingsByUsername(username, page),
    enabled: Boolean(username),
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex items-center gap-3">
        <Link
          to={`/perfil/${username}`}
          className="text-muted transition-colors hover:text-paper"
          aria-label="Voltar ao perfil"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-semibold text-paper">Avaliações</h1>
          <p className="text-sm text-muted">Filmes avaliados por @{username}</p>
        </div>
      </header>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {!isLoading && data && data.data.length === 0 && (
        <p className="text-sm text-muted">Este usuário ainda não avaliou filmes.</p>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="space-y-3">
            {data.data.map((rating) => {
              const poster = tmdbImage(rating.movie.posterPath, 'w200');
              const year = rating.movie.releaseDate ? new Date(rating.movie.releaseDate).getFullYear() : null;

              return (
                <Link
                  key={rating.id}
                  to={`/filme/${rating.movie.tmdbId}`}
                  className="group flex items-center gap-4 rounded-card border border-border bg-panel p-3 transition-colors hover:border-accent"
                >
                  <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-ink-soft">
                    {poster ? (
                      <img src={poster} alt={rating.movie.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted">sem capa</div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg text-paper group-hover:text-accent">{rating.movie.title}</p>
                    <p className="text-xs text-muted">{year ?? 'Ano desconhecido'}</p>
                  </div>

                  <div className="flex items-center gap-1 rounded-full border border-gold/40 bg-gold-soft px-3 py-1 text-gold">
                    <Star size={14} fill="currentColor" />
                    <span className="font-mono text-sm">{rating.score.toFixed(1)}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {data.meta.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Anterior
              </Button>
              <span className="font-mono text-sm text-muted">
                {page} / {data.meta.totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= data.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
