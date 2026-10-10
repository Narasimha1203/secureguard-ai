
import type { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

/** Reusable glassmorphism container for SecureGuard AI. */
export function GlassPanel({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('glass sg-glass-panel rounded-2xl p-5 sm:p-6', className)}
      {...rest}
    />
  );
}
