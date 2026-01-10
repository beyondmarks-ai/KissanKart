import { Package, TrendingUp, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { StatsCards } from './StatsCards';

interface OverviewContentProps {
  products: Product[];
  onAddProduct: () => void;
  onNavigate: (tab: string) => void;
}

export function OverviewContent({ products, onAddProduct, onNavigate }: OverviewContentProps) {
  const activeProducts = products.filter(p => p.is_available).length;
  const recentProducts = products.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsCards totalProducts={products.length} activeProducts={activeProducts} />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card 
          className="group cursor-pointer border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          onClick={onAddProduct}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Package className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Add New Product</h3>
              <p className="text-sm text-muted-foreground">List a new item</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </CardContent>
        </Card>

        <Card 
          className="group cursor-pointer border-border/50 bg-gradient-to-br from-kisan-orange/5 to-kisan-orange/10 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          onClick={() => onNavigate('products')}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-kisan-orange text-white shadow-lg">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Manage Products</h3>
              <p className="text-sm text-muted-foreground">{products.length} products</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-kisan-orange group-hover:translate-x-1 transition-all" />
          </CardContent>
        </Card>

        <Card 
          className="group cursor-pointer border-border/50 bg-gradient-to-br from-kisan-leaf/5 to-kisan-leaf/10 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          onClick={() => onNavigate('analytics')}
        >
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-kisan-leaf text-white shadow-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">View Analytics</h3>
              <p className="text-sm text-muted-foreground">Track performance</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-kisan-leaf group-hover:translate-x-1 transition-all" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Your latest listed items</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('products')} className="gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {recentProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">No products yet</p>
              <Button onClick={onAddProduct} size="sm">
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">₹{product.price}</p>
                    <p className="text-xs text-muted-foreground">per {product.unit}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.is_available 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {product.is_available ? 'Active' : 'Inactive'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
