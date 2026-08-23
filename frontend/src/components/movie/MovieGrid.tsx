import type { TmdbMovieSummary } from "../../types";
import { MovieCard } from "./MovieCard";

export const MovieGrid = ({ movies }: { movies: TmdbMovieSummary[] }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {movies?.map((movie, i) => (
      <MovieCard key={movie.id} movie={movie} index={i} />
    ))}
  </div>
);
