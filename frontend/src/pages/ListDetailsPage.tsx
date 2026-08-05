import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getListById } from '../lib/api/lists';
import { tmdbImage } from '../lib/tmdb-image';
import { Avatar } from '../components/ui/Avatar';
import { Skeleton } from '../components/ui/Skeleton';

export const ListDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: list, isLoading } = useQuery({
    queryKey: ['list', id],
    queryFn: () => getListById(id as string),
    enabled: Boolean(id),
  });

  if (isLoading || !list) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <Avatar name={list.user.name} src={list.user.avatarUrl} size={32} />
        <Link to={`/perfil/${list.user.username}`} className="text-sm text-muted hover:text-paper">
          Lista de {list.user.name}
        </Link>
      </div>
      <h1 className="mt-2 font-display text-3xl font-semibold text-paper">{list.name}</h1>
      {list.description && <p className="mt-2 max-w-2xl text-sm text-paper-dim">{list.description}</p>}

      <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {list.items.map((item) => {
          const poster = tmdbImage(item.movie.posterPath, 'w342');
          return (
            <Link key={item.id} to={`/filme/${item.movie.tmdbId}`} className="group">
              <div className="aspect-[2/3] overflow-hidden rounded-card border border-border bg-panel">
                {poster && (
                  <img src={poster} alt={item.movie.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
