import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { routeHref } from '../../hooks/useHashRoute';
import type { Route } from '../../hooks/useHashRoute';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-neon-cyan text-navy-900 hover:bg-cyan-300 shadow-glow-cyan',
  secondary:
    'border border-neon-violet/60 bg-neon-violet/10 text-violet-100 hover:bg-neon-violet/25',
  ghost: 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10',
  danger: 'border border-red-400/50 bg-red-500/10 text-red-200 hover:bg-red-500/20',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = 'primary',
  loading = false,
  icon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], className)}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
}

interface LinkButtonProps {
  route: Route;
  variant?: ButtonVariant;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A link that looks like a button and navigates between pages. */
export function LinkButton({ route, variant = 'primary', icon, className, children }: LinkButtonProps) {
  return (
    <a href={routeHref(route)} className={cn(base, variants[variant], className)}>
      {icon}
      {children}
    </a>
  );
}
