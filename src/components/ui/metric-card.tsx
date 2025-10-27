import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  description,
  icon: Icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all duration-200 ease-in-out',
        'hover:shadow-lg hover:border-primary/50 hover:-translate-y-0.5',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          )}
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              trend.direction === 'up' && 'bg-green-500/10 text-green-600 dark:text-green-400',
              trend.direction === 'down' && 'bg-red-500/10 text-red-600 dark:text-red-400',
              trend.direction === 'neutral' && 'bg-muted text-muted-foreground'
            )}
          >
            <span>{trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}</span>
            <span>{trend.value}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-4xl font-bold font-metric text-foreground tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-lg font-medium text-muted-foreground">{unit}</span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {/* Trend Label */}
      {trend && (
        <p className="text-xs text-muted-foreground mt-2">{trend.label}</p>
      )}
    </div>
  );
}

