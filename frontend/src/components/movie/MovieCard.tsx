import { Link } from "react-router-dom";
import { motion, type Variants } from "motion/react";
import { Star, Film as FilmIcon } from "lucide-react";
import { tmdbImage } from "../../lib/tmdb-image";
import type { TmdbMovieSummary } from "../../types";

interface MovieCardProps {
  movie: TmdbMovieSummary;
  index?: number;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(i, 12) * 0.04,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export const MovieCard = ({ movie, index = 0 }: MovieCardProps) => {
  const poster = tmdbImage(movie.poster_path, "w342");
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      <Link to={`/filme/${movie.id}`} className="group block">
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="relative aspect-2/3 w-full overflow-hidden rounded-card bg-panel border border-border"
        >
          {poster ? (
            <img
              src={poster}
              alt={movie.title}
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover select-none transition-transform duration-500 group-hover:scale-110 [-webkit-user-drag:none]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted p-3 text-center">
              <FilmIcon size={28} />
              <span className="text-xs">{movie.title}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/0 to-ink/0 opacity-0 transition-opacity duration-300 group-hover:opacity-90" />
          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="font-display text-sm font-semibold leading-snug text-paper line-clamp-2">
              {movie.title}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted">
              {year && <span className="font-mono">{year}</span>}
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 text-gold">
                  <Star size={12} fill="currentColor" />
                  {movie.vote_average.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
