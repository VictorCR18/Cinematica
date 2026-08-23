import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Star, Clock, CalendarDays, PenLine } from 'lucide-react';
import { getMovieDetails } from '../lib/api/movies';
import { getMyRating, rateMovie } from '../lib/api/ratings';
import { listReviewsForMovie } from '../lib/api/reviews';
import { tmdbImage } from '../lib/tmdb-image';
import { useAuth } from '../hooks/useAuth';
import { StarRating } from '../components/ui/StarRating';
import { WatchlistButton } from '../components/social/WatchlistButton';
import { LogFilmModal } from '../components/social/LogFilmModal';
import { ReviewCard } from '../components/social/ReviewCard';
import { Carousel } from '../components/movie/Carousel';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

export const MovieDetailsPage = () => {
  const { tmdbId } = useParams<{ tmdbId: string }>();
  const id = Number(tmdbId);
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [logOpen, setLogOpen] = useState(false);

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieDetails(id),
    enabled: Number.isFinite(id),
  });

  const { data: myRating } = useQuery({
    queryKey: ['rating', 'me', id],
    queryFn: () => getMyRating(id),
    enabled: isAuthenticated && Number.isFinite(id),
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => listReviewsForMovie(id, 1),
    enabled: Number.isFinite(id),
  });

  const handleRate = async (score: number) => {
    await rateMovie(id, score);
    queryClient.invalidateQueries({ queryKey: ['rating', 'me', id] });
    queryClient.invalidateQueries({ queryKey: ['movie', id] });
  };

  if (isLoading || !movie) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  }

  const backdrop = tmdbImage(movie.backdrop_path, 'original');
  const poster = tmdbImage(movie.poster_path, 'w500');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const cast = movie.credits?.cast.slice(0, 10) ?? [];

  return (
    <div>
      <section className="relative border-b border-border">
        {backdrop && (
          <div className="absolute inset-0 -z-10">
            <img src={backdrop} alt="" className="h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/95 to-ink/70" />
          </div>
        )}

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-14 sm:px-6 md:grid-cols-[280px_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-48 shrink-0 overflow-hidden rounded-card border border-border-strong shadow-2xl md:mx-0 md:w-full"
          >
            {poster && <img src={poster} alt={movie.title} className="w-full" />}
          </motion.div>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl font-semibold text-balance text-paper sm:text-5xl"
            >
              {movie.title}
            </motion.h1>
            {movie.tagline && <p className="mt-2 italic text-muted">{movie.tagline}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-paper-dim">
              {year && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={15} /> {year}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={15} /> {movie.runtime} min
                </span>
              )}
              {movie.genres.map((g) => (
                <span key={g.id} className="rounded-full border border-border-strong px-2.5 py-0.5 text-xs">
                  {g.name}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-gold" fill="currentColor" />
                <span className="font-mono text-lg text-paper">{movie.stats.averageRating?.toFixed(1) ?? '—'}</span>
                <span className="text-xs text-muted">({movie.stats.ratingsCount} avaliações no Cinemática)</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div>
                <p className="mb-1.5 text-xs text-muted">{isAuthenticated ? 'Sua nota' : 'Entre para avaliar'}</p>
                <StarRating value={myRating?.score ?? null} onChange={isAuthenticated ? handleRate : undefined} readOnly={!isAuthenticated} />
              </div>
              <WatchlistButton tmdbId={id} />
              <Button variant="secondary" onClick={() => (isAuthenticated ? setLogOpen(true) : undefined)} disabled={!isAuthenticated}>
                <PenLine size={16} /> Registrar
              </Button>
            </div>

            {movie.overview && <p className="mt-6 max-w-2xl text-sm leading-relaxed text-paper-dim">{movie.overview}</p>}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-14 sm:px-6">
        {cast.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-semibold text-paper mb-4">Elenco</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-width:none [&::-webkit-scrollbar]:hidden">
              {cast.map((member) => {
                const photo = tmdbImage(member.profile_path, 'w200');
                return (
                  <div key={member.id} className="w-24 shrink-0 text-center">
                    <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-border-strong bg-panel">
                      {photo ? (
                        <img src={photo} alt={member.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted">?</div>
                      )}
                    </div>
                    <p className="mt-2 text-xs font-medium text-paper line-clamp-1">{member.name}</p>
                    <p className="text-xs text-muted line-clamp-1">{member.character}</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-display text-2xl font-semibold text-paper mb-4">
            Resenhas <span className="text-muted text-base font-normal">({movie.stats.reviewsCount})</span>
          </h2>
          {reviews && reviews.data.length > 0 ? (
            <div className="space-y-4">
              {reviews.data.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">Nenhuma resenha ainda. Seja o primeiro a escrever uma!</p>
          )}
        </section>

        {movie.similar && movie.similar.results.length > 0 && (
          <Carousel title="Filmes parecidos" movies={movie.similar.results} />
        )}
      </div>

      <LogFilmModal
        tmdbId={id}
        movieTitle={movie.title}
        open={logOpen}
        onClose={() => setLogOpen(false)}
        onLogged={() => {
          queryClient.invalidateQueries({ queryKey: ['rating', 'me', id] });
          queryClient.invalidateQueries({ queryKey: ['movie', id] });
          queryClient.invalidateQueries({ queryKey: ['reviews', id] });
        }}
      />
    </div>
  );
};
