import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, Pencil, X, Check } from "lucide-react";
import clsx from "clsx";
import { Avatar } from "../ui/Avatar";
import { StarRating } from "../ui/StarRating";
import { useAuth } from "../../hooks/useAuth";
import { likeReview, unlikeReview, updateReview } from "../../lib/api/reviews";
import type { Review } from "../../types";

export const ReviewCard = ({ review }: { review: Review }) => {
  const { isAuthenticated, user } = useAuth();
  const [liked, setLiked] = useState(review.isLikedByViewer ?? false);
  const [likesCount, setLikesCount] = useState(review.likesCount);
  const [revealSpoiler, setRevealSpoiler] = useState(!review.containsSpoilers);

  const isOwner = isAuthenticated && user?.id === review.user.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const [editSpoilers, setEditSpoilers] = useState(review.containsSpoilers);
  const [content, setContent] = useState(review.content);
  const [containsSpoilers, setContainsSpoilers] = useState(
    review.containsSpoilers,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const startEditing = () => {
    setEditContent(content);
    setEditSpoilers(containsSpoilers);
    setError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError(null);
  };

  const saveEdit = async () => {
    if (!editContent.trim()) {
      setError("A resenha não pode ficar vazia.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateReview(review.id, {
        content: editContent,
        containsSpoilers: editSpoilers,
      });
      setContent(editContent);
      setContainsSpoilers(editSpoilers);
      setRevealSpoiler(!editSpoilers);
      setIsEditing(false);
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35 }}
      className="rounded-card border border-border bg-panel p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          to={`/perfil/${review.user.username}`}
          className="flex items-center gap-2.5"
        >
          <Avatar
            name={review.user.name}
            src={review.user.avatarUrl}
            size={32}
          />
          <div>
            <p className="text-sm font-medium text-paper">{review.user.name}</p>
            <p className="text-xs text-muted">@{review.user.username}</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          {review.rating !== null && (
            <StarRating value={review.rating} readOnly size={14} />
          )}
          {isOwner && !isEditing && (
            <button
              onClick={startEditing}
              title="Editar resenha"
              className="text-muted hover:text-paper transition-colors"
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 text-sm leading-relaxed text-paper-dim">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-md border border-border-strong bg-ink px-3 py-2 text-sm text-paper focus:border-accent focus:outline-none"
            />
            <label className="flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={editSpoilers}
                onChange={(e) => setEditSpoilers(e.target.checked)}
              />
              Contém spoilers
            </label>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex items-center gap-2">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-ink hover:opacity-90 disabled:opacity-50"
              >
                <Check size={13} /> {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={cancelEditing}
                disabled={saving}
                className="flex items-center gap-1 rounded-md border border-border-strong px-3 py-1.5 text-xs text-muted hover:text-paper"
              >
                <X size={13} /> Cancelar
              </button>
            </div>
          </div>
        ) : revealSpoiler ? (
          <p className="whitespace-pre-wrap">{content}</p>
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
        <span className="font-mono">
          {new Date(review.createdAt).toLocaleDateString("pt-BR")}
        </span>
        <button
          onClick={toggleLike}
          disabled={!isAuthenticated}
          className={clsx(
            "flex items-center gap-1 transition-colors",
            liked ? "text-accent" : "hover:text-accent",
            isAuthenticated ? "cursor-pointer" : "cursor-not-allowed",
          )}
        >
          <motion.span
            whileTap={{ scale: 1.4 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <Heart size={14} fill={liked ? "currentColor" : "none"} />
          </motion.span>
          {likesCount}
        </button>
      </div>
    </motion.article>
  );
};
