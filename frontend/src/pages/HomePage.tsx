import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { getNowPlaying, getPopular, getTopRated, getUpcoming } from '../lib/api/movies';
import { Carousel } from '../components/movie/Carousel';
import { tmdbImage } from '../lib/tmdb-image';
import { Skeleton } from '../components/ui/Skeleton';

export const HomePage = () => {
  const popular = useQuery({ queryKey: ['movies', 'popular'], queryFn: () => getPopular(1) });
  const nowPlaying = useQuery({ queryKey: ['movies', 'now-playing'], queryFn: () => getNowPlaying(1) });
  const topRated = useQuery({ queryKey: ['movies', 'top-rated'], queryFn: () => getTopRated(1) });
  const upcoming = useQuery({ queryKey: ['movies', 'upcoming'], queryFn: () => getUpcoming(1) });

  const hero = popular.data?.results[0];
  const backdrop = tmdbImage(hero?.backdrop_path, 'original');

  return (
    <div>
      <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden border-b border-border">
        {backdrop ? (
          <motion.img
            key={backdrop}
            src={backdrop}
            alt=""
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/20 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-14 sm:px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-xs uppercase tracking-[0.2em] text-accent"
          >
            Seu diário de filmes
          </motion.p>
          {hero && (
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-3 max-w-2xl font-display text-4xl font-semibold text-balance text-paper sm:text-6xl"
            >
              {hero.title}
            </motion.h1>
          )}
          {hero && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 max-w-xl text-sm text-paper-dim line-clamp-3 sm:text-base"
            >
              {hero.overview}
            </motion.p>
          )}
          {hero && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6">
              <Link
                to={`/filme/${hero.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper hover:bg-accent-hover transition-colors"
              >
                Ver detalhes
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <div className="film-sprockets" />

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-14 sm:px-6">
        {nowPlaying.data && <Carousel title="Em cartaz" subtitle="Nos cinemas agora" movies={nowPlaying.data.results} seeAllHref="/filmes/em-cartaz" />}
        {popular.data && <Carousel title="Populares" subtitle="O que todo mundo está assistindo" movies={popular.data.results} seeAllHref="/filmes/populares" />}
        {topRated.data && <Carousel title="Mais bem avaliados" subtitle="Consagrados pela crítica" movies={topRated.data.results} seeAllHref="/filmes/mais-avaliados" />}
        {upcoming.data && <Carousel title="Em breve" subtitle="Próximos lançamentos" movies={upcoming.data.results} seeAllHref="/filmes/em-breve" />}
      </div>
    </div>
  );
};
