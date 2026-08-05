import { useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TmdbMovieSummary } from '../../types';
import { MovieCard } from './MovieCard';

interface CarouselProps {
  title: string;
  subtitle?: string;
  movies: TmdbMovieSummary[];
  seeAllHref?: string;
}

export const Carousel = ({ title, subtitle, movies, seeAllHref }: CarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * trackRef.current.clientWidth * 0.9, behavior: 'smooth' });
  };

  return (
    <section className="relative">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-paper">{title}</h2>
          {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {seeAllHref && (
            <a href={seeAllHref} className="text-sm text-accent hover:text-accent-hover font-medium">
              Ver tudo
            </a>
          )}
          <button
            onClick={() => scrollBy(-1)}
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-muted hover:text-paper hover:border-paper transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-muted hover:text-paper hover:border-paper transition-colors"
            aria-label="Próximo"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <motion.div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {movies.map((movie, i) => (
          <div key={movie.id} className="w-36 shrink-0 snap-start sm:w-44">
            <MovieCard movie={movie} index={i} />
          </div>
        ))}
      </motion.div>
    </section>
  );
};
