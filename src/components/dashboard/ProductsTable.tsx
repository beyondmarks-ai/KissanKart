import { Package, Plus, Store, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

interface ProductsTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onAddProduct: () => void;
}

export function ProductsTable({ products, onDelete, onAddProduct }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No products yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start by adding your first product to sell.
          </p>
          <Button className="mt-6 gap-2" onClick={onAddProduct}>
            <Plus className="h-4 w-4" />
            Add Your First Product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Your Shop Products</h2>
            <p className="text-sm text-muted-foreground">
              These cards match how customers see your products in the shop.
            </p>
          </div>
        </div>
        <Button className="gap-2" onClick={onAddProduct}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="group relative">
            <ProductCard product={product} />

            <div className="pointer-events-none absolute left-2 top-2 z-10 sm:left-3 sm:top-3">
              <span className="rounded-full bg-background/90 px-2 py-1 text-[10px] font-semibold text-primary shadow-sm backdrop-blur">
                {product.is_available ? 'Live' : 'Hidden'}
              </span>
            </div>

            <Button
              variant="destructive"
              size="icon"
              className="absolute bottom-2 right-2 z-10 h-8 w-8 shadow-lg sm:bottom-3 sm:right-3 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
              onClick={() => onDelete(product.id)}
              aria-label={`Delete ${product.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
