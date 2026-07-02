import { ArrowRight, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { StatsCards } from './StatsCards';

interface OverviewContentProps {
  products: Product[];
  onAddProduct: () => void;
  onNavigate: (tab: string) => void;
}

export function OverviewContent({ products, onAddProduct, onNavigate }: OverviewContentProps) {
  const activeProducts = products.filter((p) => p.is_available).length;
  const recentProducts = products.slice(0, 4);

  return (
    <div className="space-y-6">
      <StatsCards totalProducts={products.length} activeProducts={activeProducts} />

      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className="group cursor-pointer border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
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
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
          </CardContent>
        </Card>

        <Card
          className="group cursor-pointer border-border/50 bg-gradient-to-br from-kisan-orange/5 to-kisan-orange/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
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
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-kisan-orange" />
          </CardContent>
        </Card>

        <Card
          className="group cursor-pointer border-border/50 bg-gradient-to-br from-kisan-leaf/5 to-kisan-leaf/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
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
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-kisan-leaf" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Shop-style preview of your latest listings</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('products')} className="gap-1">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {recentProducts.length === 0 ? (
            <div className="py-8 text-center">
              <Package className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="mb-4 text-muted-foreground">No products yet</p>
              <Button onClick={onAddProduct} size="sm">
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <div className="pointer-events-none absolute left-2 top-2 z-10">
                    <span className="rounded-full bg-background/90 px-2 py-1 text-[10px] font-semibold text-primary shadow-sm backdrop-blur">
                      {product.is_available ? 'Live' : 'Hidden'}
                    </span>
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
