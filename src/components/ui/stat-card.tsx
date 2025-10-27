import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  variant = 'default',
  className,
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-card border-border',
    success: 'bg-green-500/5 border-green-500/20 dark:bg-green-500/10',
    warning: 'bg-yellow-500/5 border-yellow-500/20 dark:bg-yellow-500/10',
    danger: 'bg-red-500/5 border-red-500/20 dark:bg-red-500/10',
  };

  const iconStyles = {
    default: 'text-primary',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-4 transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold font-metric text-foreground">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={cn('p-2 rounded-lg bg-background/50', iconStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

