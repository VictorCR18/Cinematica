import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/Button';
import { logMovie } from '../../lib/api/diary';
import { getApiErrorMessage } from '../../lib/api-client';

interface LogFilmModalProps {
  tmdbId: number;
  movieTitle: string;
  open: boolean;
  onClose: () => void;
  onLogged?: () => void;
}

/** Modal para registrar no diário: nota, data assistida, rewatch e resenha opcional. */
export const LogFilmModal = ({ tmdbId, movieTitle, open, onClose, onLogged }: LogFilmModalProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [watchedAt, setWatchedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [rewatch, setRewatch] = useState(false);
  const [content, setContent] = useState('');
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await logMovie({
        tmdbId,
        watchedAt: new Date(watchedAt).toISOString(),
        rewatch,
        rating: rating ?? undefined,
        reviewContent: content.trim() || undefined,
        containsSpoilers,
      });
      onLogged?.();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível registrar no diário'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/80 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-2xl border border-border-strong bg-panel p-6 sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Registrar no diário</p>
                <h3 className="font-display text-lg font-semibold text-paper mt-0.5">{movieTitle}</h3>
              </div>
              <button onClick={onClose} className="text-muted hover:text-paper">
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs text-muted">Sua nota</label>
                <div className="mt-1.5">
                  <StarRating value={rating} onChange={setRating} size={26} />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs text-muted" htmlFor="watchedAt">
                    Assistido em
                  </label>
                  <input
                    id="watchedAt"
                    type="date"
                    value={watchedAt}
                    onChange={(e) => setWatchedAt(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    className="mt-1.5 w-full rounded-lg border border-border-strong bg-ink px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-paper-dim pt-5">
                  <input type="checkbox" checked={rewatch} onChange={(e) => setRewatch(e.target.checked)} className="accent-accent" />
                  Rewatch
                </label>
              </div>

              <div>
                <label className="text-xs text-muted" htmlFor="review">
                  Resenha (opcional)
                </label>
                <textarea
                  id="review"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  placeholder="O que você achou?"
                  className="mt-1.5 w-full resize-none rounded-lg border border-border-strong bg-ink px-3 py-2 text-sm outline-none focus:border-accent placeholder:text-muted"
                />
              </div>

              {content.trim() && (
                <label className="flex items-center gap-2 text-sm text-paper-dim">
                  <input
                    type="checkbox"
                    checked={containsSpoilers}
                    onChange={(e) => setContainsSpoilers(e.target.checked)}
                    className="accent-accent"
                  />
                  Contém spoilers
                </label>
              )}

              {error && <p className="text-sm text-accent">{error}</p>}

              <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar no diário'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
