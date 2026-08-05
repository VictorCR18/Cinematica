import type { PropsWithChildren } from 'react';
import { motion } from 'motion/react';

/** Envelope de transição de página: leve fade + subida, aplicado a cada rota. */
export const PageTransition = ({ children }: PropsWithChildren) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);
