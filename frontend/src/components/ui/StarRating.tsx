import { useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import clsx from 'clsx';

interface StarRatingProps {
  value: number | null;
  onChange?: (score: number) => void;
  size?: number;
  readOnly?: boolean;
}

/**
 * Avaliação por estrelas com passos de meia-estrela, no espírito do Letterboxd.
 * Em modo interativo, a metade clicada (esquerda/direita de cada ícone) define 0.5 ou 1 ponto.
 */
export const StarRating = ({ value, onChange, size = 22, readOnly = false }: StarRatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value ?? 0;

  const handlePick = (starIndex: number, half: boolean) => {
    if (readOnly || !onChange) return;
    onChange(starIndex + (half ? 0.5 : 1));
  };

  return (
    <div
      className="inline-flex items-center gap-0.5"
      onMouseLeave={() => setHovered(null)}
      role={readOnly ? undefined : 'radiogroup'}
      aria-label="Avaliação em estrelas"
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const fillRatio = Math.min(1, Math.max(0, display - i));
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-muted-soft" strokeWidth={1.5} />
            <motion.div
              className="absolute inset-0 overflow-hidden"
              animate={{ width: `${fillRatio * 100}%` }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              style={{ width: `${fillRatio * 100}%` }}
            >
              <Star size={size} className="text-gold" fill="currentColor" strokeWidth={1.5} />
            </motion.div>
            {!readOnly && (
              <div className="absolute inset-0 flex">
                <button
                  type="button"
                  aria-label={`${i + 0.5} estrelas`}
                  className="h-full w-1/2 cursor-pointer"
                  onMouseEnter={() => setHovered(i + 0.5)}
                  onClick={() => handlePick(i, true)}
                />
                <button
                  type="button"
                  aria-label={`${i + 1} estrelas`}
                  className="h-full w-1/2 cursor-pointer"
                  onMouseEnter={() => setHovered(i + 1)}
                  onClick={() => handlePick(i, false)}
                />
              </div>
            )}
          </div>
        );
      })}
      {value !== null && (
        <span className={clsx('ml-1.5 font-mono text-xs text-muted')}>{value.toFixed(1)}</span>
      )}
    </div>
  );
};
