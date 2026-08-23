import clsx from 'clsx';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}

export const Avatar = ({ name, src, size = 36, className }: AvatarProps) => {
  const safeName = name || '';

  const initials = safeName
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={clsx('rounded-full object-cover border border-border-strong', className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full bg-accent-soft text-accent font-display font-semibold border border-border-strong',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials || '?'}
    </div>
  );
};
