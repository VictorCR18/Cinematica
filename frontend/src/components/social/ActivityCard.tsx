import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, BookOpen, Bookmark, ListPlus, UserPlus, PenLine } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { tmdbImage } from '../../lib/tmdb-image';
import type { ActivityItem } from '../../types';

const ICONS = {
  RATING: Star,
  REVIEW: PenLine,
  DIARY: BookOpen,
  WATCHLIST_ADD: Bookmark,
  LIST_CREATED: ListPlus,
  FOLLOW: UserPlus,
};

const describe = (activity: ActivityItem) => {
  switch (activity.type) {
    case 'RATING':
      return 'avaliou';
    case 'REVIEW':
      return 'resenhou';
    case 'DIARY':
      return 'registrou no diário';
    case 'WATCHLIST_ADD':
      return 'adicionou à watchlist';
    case 'LIST_CREATED':
      return 'criou uma lista';
    case 'FOLLOW':
      return 'passou a seguir alguém';
    default:
      return 'fez algo';
  }
};

export const ActivityCard = ({ activity }: { activity: ActivityItem }) => {
  const Icon = ICONS[activity.type];
  const poster = tmdbImage(activity.movie?.posterPath, 'w200');

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-3 rounded-card border border-border bg-panel p-3"
    >
      <Link to={`/perfil/${activity.user.username}`}>
        <Avatar name={activity.user.name} src={activity.user.avatarUrl} size={36} />
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-paper-dim truncate">
          <Link to={`/perfil/${activity.user.username}`} className="font-medium text-paper hover:text-accent">
            {activity.user.name}
          </Link>{' '}
          {describe(activity)}
          {activity.movie && (
            <>
              {' '}
              <Link to={`/filme/${activity.movie.tmdbId}`} className="text-paper hover:text-accent">
                {activity.movie.title}
              </Link>
            </>
          )}
        </p>
        <p className="text-xs text-muted font-mono mt-0.5">
          {new Date(activity.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      <Icon size={16} className="text-muted shrink-0" />
      {poster && <img src={poster} alt="" className="h-14 w-10 shrink-0 rounded object-cover" />}
    </motion.div>
  );
};
