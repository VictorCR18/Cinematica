import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getNowPlaying, getPopular, getTopRated, getUpcoming } from '../lib/api/movies';
import { MovieGrid } from '../components/movie/MovieGrid';
import { PosterSkeletonGrid } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

const CATEGORY_MAP = {
  populares: { label: 'Populares', fetcher: getPopular },
  'em-cartaz': { label: 'Em cartaz', fetcher: getNowPlaying },
  'mais-avaliados': { label: 'Mais bem avaliados', fetcher: getTopRated },
  'em-breve': { label: 'Em breve', fetcher: getUpcoming },
} as const;

type CategoryKey = keyof typeof CATEGORY_MAP;

export const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [page, setPage] = useState(1);
  const config = CATEGORY_MAP[category as CategoryKey] ?? CATEGORY_MAP.populares;

  const { data, isLoading } = useQuery({
    queryKey: ['movies', category, page],
    queryFn: () => config.fetcher(page),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-paper mb-8">{config.label}</h1>
      {isLoading || !data ? <PosterSkeletonGrid count={18} /> : <MovieGrid movies={data.results} />}
      {data && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <span className="font-mono text-sm text-muted">
            {page} / {Math.min(data.total_pages, 500)}
          </span>
          <Button variant="secondary" size="sm" disabled={page >= data.total_pages} onClick={() => setPage((p) => p + 1)}>
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
};
