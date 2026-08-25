import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

interface AuthHintProps {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}

export const AuthHint = ({ message, onDismiss, duration = 3200 }: AuthHintProps) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          role="status"
          className="flex items-center gap-2 rounded-full border border-border-strong bg-panel px-3.5 py-2 text-xs text-paper-dim shadow-lg"
        >
          <Lock size={13} className="shrink-0 text-accent" />
          <span>{message}</span>
          <Link to="/entrar" className="font-medium text-accent hover:text-accent-hover">
            Entrar
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};