import { Package, TrendingUp, Eye, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  totalProducts: number;
  activeProducts: number;
}

export function StatsCards({ totalProducts, activeProducts }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Listings',
      value: activeProducts,
      icon: TrendingUp,
      color: 'text-kisan-orange',
      bgColor: 'bg-kisan-orange/10',
    },
    {
      title: 'Total Views',
      value: '—',
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Avg Rating',
      value: '—',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {stat.value}
              </p>
            </div>
            <div className={cn('rounded-lg p-3', stat.bgColor)}>
              <stat.icon className={cn('h-6 w-6', stat.color)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
