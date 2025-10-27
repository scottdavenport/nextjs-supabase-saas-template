import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricBadgeProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MetricBadge({
  label,
  value,
  icon: Icon,
  variant = 'default',
  size = 'md',
  className,
}: MetricBadgeProps) {
  const variantStyles = {
    default: 'bg-muted text-foreground',
    success: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {Icon && <Icon className={cn(
        size === 'sm' && 'h-3 w-3',
        size === 'md' && 'h-3.5 w-3.5',
        size === 'lg' && 'h-4 w-4'
      )} />}
      <span className="font-metric font-semibold">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

