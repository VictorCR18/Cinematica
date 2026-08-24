import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useNetworkActivity } from '../../hooks/useNetworkActivity';

export const NetworkActivityBar = () => {
  const fetchingCount = useIsFetching();
  const mutatingCount = useIsMutating();
  const httpCount = useNetworkActivity();
  const [isVisible, setIsVisible] = useState(false);

  const hasNetworkActivity = fetchingCount + mutatingCount + httpCount > 0;

  useEffect(() => {
    if (hasNetworkActivity) {
      setIsVisible(true);
      return;
    }

    const timeoutId = window.setTimeout(() => setIsVisible(false), 180);
    return () => window.clearTimeout(timeoutId);
  }, [hasNetworkActivity]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="network-activity-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-x-0 top-0 z-70 h-1"
          aria-hidden="true"
        >
          <motion.div
            className="h-full w-1/3 rounded-r-full bg-linear-to-r from-gold via-accent to-gold"
            animate={{ x: ['-35%', '260%'] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
