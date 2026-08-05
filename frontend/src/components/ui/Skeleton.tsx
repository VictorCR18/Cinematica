import clsx from 'clsx';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={clsx('animate-pulse rounded-md bg-panel-hover', className)} />
);

export const PosterSkeletonGrid = ({ count = 12 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="aspect-[2/3] w-full" />
    ))}
  </div>
);
