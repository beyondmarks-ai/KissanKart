import { TrendingUp, ShoppingCart, Eye, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types';

interface AnalyticsContentProps {
  products: Product[];
}

export function AnalyticsContent({ products }: AnalyticsContentProps) {
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_available).length;
  const vegetables = products.filter(p => p.category === 'vegetable').length;
  const fruits = products.filter(p => p.category === 'fruit').length;

  const stats = [
    {
      title: 'Total Views',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Eye,
      description: 'Last 30 days',
    },
    {
      title: 'Orders Received',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      description: 'Last 30 days',
    },
    {
      title: 'Revenue',
      value: '₹24,580',
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
      description: 'Last 30 days',
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: Star,
      description: 'From 89 reviews',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Performance Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Product Distribution</CardTitle>
            <CardDescription>Your products by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    Vegetables
                  </span>
                  <span className="font-medium">{vegetables}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-primary transition-all duration-500" 
                    style={{ width: totalProducts ? `${(vegetables / totalProducts) * 100}%` : '0%' }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-kisan-orange" />
                    Fruits
                  </span>
                  <span className="font-medium">{fruits}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-kisan-orange transition-all duration-500" 
                    style={{ width: totalProducts ? `${(fruits / totalProducts) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Insights</CardTitle>
            <CardDescription>Key metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Active Listings</span>
                <span className="font-semibold text-primary">{activeProducts} / {totalProducts}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Conversion Rate</span>
                <span className="font-semibold text-green-500">5.4%</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Avg. Order Value</span>
                <span className="font-semibold">₹157</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-dashed border-2 border-border bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Advanced Analytics Coming Soon</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Detailed charts, sales trends, and customer insights will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
