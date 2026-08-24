import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star } from 'lucide-react';
import { listReviewsByUsername } from '../lib/api/users';
import { ReviewCard } from '../components/social/ReviewCard';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export const UserReviewsPage = () => {
  const { username = '' } = useParams<{ username: string }>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', 'user', username, page],
    queryFn: () => listReviewsByUsername(username, page),
    enabled: Boolean(username),
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex items-center gap-3">
        <Link
          to={`/perfil/${username}`}
          className="text-muted transition-colors hover:text-paper"
          aria-label="Voltar ao perfil"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-semibold text-paper">Resenhas</h1>
          <p className="text-sm text-muted">Textos publicados por @{username}</p>
        </div>
      </header>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full" />
          ))}
        </div>
      )}

      {!isLoading && data && data.data.length === 0 && (
        <p className="text-sm text-muted">Este usuário ainda não publicou resenhas.</p>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="space-y-4">
            {data.data.map((review) => (
              <div key={review.id}>
                {review.movie && (
                  <Link
                    to={`/filme/${review.movie.tmdbId}`}
                    className="mb-2 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                  >
                    <Star size={13} className="text-gold" fill="currentColor" />
                    {review.movie.title}
                    {review.rating !== null && <span className="font-mono text-gold">• {review.rating.toFixed(1)}</span>}
                  </Link>
                )}
                <ReviewCard review={review} />
              </div>
            ))}
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
