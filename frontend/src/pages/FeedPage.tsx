import { useQuery } from '@tanstack/react-query';
import { getFeed } from '../lib/api/feed';
import { ActivityCard } from '../components/social/ActivityCard';
import { Skeleton } from '../components/ui/Skeleton';

export const FeedPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['feed'], queryFn: () => getFeed(1) });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-paper mb-8">Feed de atividades</h1>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <p className="text-sm text-muted">
          Nada por aqui ainda. Siga outros cinéfilos para ver o que eles estão assistindo.
        </p>
      )}

      {data && data.data.length > 0 && (
        <div className="space-y-3">
          {data.data.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};
