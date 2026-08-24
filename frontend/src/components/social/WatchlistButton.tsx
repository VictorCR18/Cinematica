import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Bookmark, LoaderCircle } from 'lucide-react';
import clsx from 'clsx';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addToWatchlist, listMyWatchlist, removeFromWatchlist } from '../../lib/api/watchlist';
import { useAuth } from '../../hooks/useAuth';

interface WatchlistButtonProps {
  tmdbId: number;
  initialInWatchlist?: boolean;
}

export const WatchlistButton = ({ tmdbId, initialInWatchlist = false }: WatchlistButtonProps) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist);
  const [loading, setLoading] = useState(false);

  const { data: watchlist } = useQuery({
    queryKey: ['watchlist', 'me'],
    queryFn: listMyWatchlist,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (watchlist) {
      setInWatchlist(watchlist.some((item) => item.movie.tmdbId === tmdbId));
    }
  }, [tmdbId, watchlist]);

  const toggle = async () => {
    if (!isAuthenticated || loading) return;
    setLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(tmdbId);
        setInWatchlist(false);
      } else {
        await addToWatchlist(tmdbId);
        setInWatchlist(true);
      }
      await queryClient.invalidateQueries({ queryKey: ['watchlist', 'me'] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      disabled={!isAuthenticated || loading}
      title={
        loading
          ? 'Atualizando watchlist...'
          : inWatchlist
            ? 'Remover da watchlist'
            : 'Adicionar à watchlist'
      }
      aria-busy={loading}
      className={clsx(
        'flex h-11 w-11 items-center justify-center rounded-full border transition-colors disabled:opacity-70',
        inWatchlist ? 'border-gold bg-gold-soft text-gold' : 'border-border-strong text-paper-dim hover:text-paper hover:border-paper',
      )}
    >
      {loading ? (
        <LoaderCircle size={18} className="animate-spin" />
      ) : (
        <motion.span animate={{ scale: inWatchlist ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
          <Bookmark size={18} fill={inWatchlist ? 'currentColor' : 'none'} />
        </motion.span>
      )}
    </motion.button>
  );
};
