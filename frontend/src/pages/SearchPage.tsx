import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon } from 'lucide-react';
import { searchMovies } from '../lib/api/movies';
import { MovieGrid } from '../components/movie/MovieGrid';
import { PosterSkeletonGrid } from '../components/ui/Skeleton';

export const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get('q')?.trim() ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['movies', 'search', query],
    queryFn: () => searchMovies(query, 1),
    enabled: query.length > 0,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-2 text-muted">
        <SearchIcon size={18} />
        <h1 className="font-display text-2xl font-semibold text-paper">
          {query ? (
            <>
              Resultados para <span className="text-accent">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            'Digite algo para buscar'
          )}
        </h1>
      </div>

      {isLoading && <PosterSkeletonGrid count={12} />}
      {!isLoading && data && data.results.length === 0 && (
        <p className="text-muted">Nenhum filme encontrado. Tente outro termo.</p>
      )}
      {data && data.results.length > 0 && <MovieGrid movies={data.results} />}
    </div>
  );
};
