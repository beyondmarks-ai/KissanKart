import { Trash2, Edit, MoreHorizontal, Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

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
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <h2 className="font-semibold text-foreground">
          Your Products ({products.length})
        </h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/20 text-left text-sm text-muted-foreground">
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-muted/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {product.description || 'No description'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                      product.category === 'vegetable'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-kisan-orange/10 text-kisan-orange'
                    )}
                  >
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-foreground">
                    ₹{product.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/{product.unit}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                      product.is_available
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    )}
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        product.is_available ? 'bg-green-500' : 'bg-red-500'
                      )}
                    />
                    {product.is_available ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2 text-destructive focus:text-destructive"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="divide-y divide-border md:hidden">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-4">
            <img
              src={product.image_url || '/placeholder.svg'}
              alt={product.name}
              className="h-14 w-14 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{product.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                    product.category === 'vegetable'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-kisan-orange/10 text-kisan-orange'
                  )}
                >
                  {product.category}
                </span>
                <span className="text-sm font-semibold text-primary">
                  ₹{product.price}/{product.unit}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
