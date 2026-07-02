import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  value: number; // can be decimal average
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

export function RatingStars({
  value,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
  className,
}: RatingStarsProps) {
  const [hover, setHover] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const display = hover ?? value;
  const filledCount = Math.round(display);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, idx) => {
          const isFilled = idx < filledCount;
          const commonIcon = (
            <Star
              className={cn(
                sizeClasses[size],
                isFilled
                  ? 'fill-kisan-orange text-kisan-orange'
                  : 'fill-transparent text-muted-foreground/30'
              )}
            />
          );

          if (!interactive) {
            return <span key={idx} aria-hidden>{commonIcon}</span>;
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onChange?.(idx + 1)}
              onMouseEnter={() => setHover(idx + 1)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                'rounded transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50'
              )}
              aria-label={`Rate ${idx + 1} out of ${max}`}
            >
              {commonIcon}
            </button>
          );
        })}
      </div>

      {showValue && value > 0 && (
        <span className="text-sm font-medium text-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
