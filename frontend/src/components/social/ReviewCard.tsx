import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import { Avatar } from '../ui/Avatar';
import { StarRating } from '../ui/StarRating';
import { useAuth } from '../../hooks/useAuth';
import { likeReview, unlikeReview } from '../../lib/api/reviews';
import type { Review } from '../../types';

export const ReviewCard = ({ review }: { review: Review }) => {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(review.likesCount);
  const [revealSpoiler, setRevealSpoiler] = useState(!review.containsSpoilers);

  const toggleLike = async () => {
    if (!isAuthenticated) return;
    if (liked) {
      setLiked(false);
      setLikesCount((c) => c - 1);
      await unlikeReview(review.id).catch(() => {
        setLiked(true);
        setLikesCount((c) => c + 1);
      });
    } else {
      setLiked(true);
      setLikesCount((c) => c + 1);
      await likeReview(review.id).catch(() => {
        setLiked(false);
        setLikesCount((c) => c - 1);
      });
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.35 }}
      className="rounded-card border border-border bg-panel p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <Link to={`/perfil/${review.user.username}`} className="flex items-center gap-2.5">
          <Avatar name={review.user.name} src={review.user.avatarUrl} size={32} />
          <div>
            <p className="text-sm font-medium text-paper">{review.user.name}</p>
            <p className="text-xs text-muted">@{review.user.username}</p>
          </div>
        </Link>
        {review.rating !== null && <StarRating value={review.rating} readOnly size={14} />}
      </div>

      <div className="mt-3 text-sm leading-relaxed text-paper-dim">
        {revealSpoiler ? (
          <p className="whitespace-pre-wrap">{review.content}</p>
        ) : (
          <button
            onClick={() => setRevealSpoiler(true)}
            className="rounded-md border border-dashed border-border-strong px-3 py-2 text-xs text-muted hover:text-paper transition-colors"
          >
            Esta resenha contém spoilers — clique para revelar
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-muted">
        <span className="font-mono">{new Date(review.createdAt).toLocaleDateString('pt-BR')}</span>
        <button
          onClick={toggleLike}
          disabled={!isAuthenticated}
          className={clsx('flex items-center gap-1 transition-colors', liked ? 'text-accent' : 'hover:text-accent')}
        >
          <motion.span whileTap={{ scale: 1.4 }} transition={{ type: 'spring', stiffness: 500 }}>
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
          </motion.span>
          {likesCount}
        </button>
      </div>
    </motion.article>
  );
};
