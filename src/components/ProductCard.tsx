import { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, Star, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.image_url || '/placeholder.svg');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const { addToCart } = useCart();
  const { user, profile } = useAuth();

  const isFarmer = profile?.role === 'farmer';
  const isOwnProduct = isFarmer && user?.id === product.farmer_id;

  useEffect(() => {
    setImageLoaded(false);
    setImageSrc(product.image_url || '/placeholder.svg');
  }, [product.image_url]);

  useEffect(() => {
    fetchRatingSummary();
  }, [product.id]);

  const fetchRatingSummary = async () => {
    // Skip query for mock product IDs to avoid UUID validation errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(product.id)) {
      return;
    }

    const { data } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', product.id);

    if (data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setAverageRating(avg);
      setReviewCount(data.length);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, quantity);
    setQuantity(1);
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((q) => q + 1);
  };
  
  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity((q) => (q > 1 ? q - 1 : 1));
  };

  const openModal = () => setIsModalOpen(true);

  const categoryColors = {
    vegetable: 'bg-primary text-primary-foreground',
    fruit: 'bg-kisan-orange text-white',
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover">
        {/* Clickable Image Area */}
        <div 
          className="relative aspect-square cursor-pointer overflow-hidden bg-muted"
          onClick={openModal}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          <img
            src={imageSrc}
            alt={`${product.name} fresh ${product.category}`}
            loading="lazy"
            className={cn(
              'h-full w-full object-cover',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageSrc('/placeholder.svg');
              setImageLoaded(true);
            }}
          />
          <div className="absolute right-1 top-1 sm:right-3 sm:top-3">
            <span
              className={cn(
                'inline-block rounded-full px-1.5 py-0.5 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs font-semibold capitalize shadow-md',
                categoryColors[product.category]
              )}
            >
              {product.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-4">
          {/* Clickable Title */}
          <h3
            onClick={openModal}
            className="mb-0.5 sm:mb-1 cursor-pointer text-xs sm:text-lg font-semibold text-card-foreground transition-colors hover:text-primary line-clamp-1"
          >
            {product.name}
          </h3>
          <p className="mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2 text-[10px] sm:text-sm text-muted-foreground hidden sm:block">
            {product.description}
          </p>

          {/* Rating - Clickable */}
          <div
            onClick={openModal}
            className="mb-1 sm:mb-3 flex cursor-pointer items-center gap-0.5 sm:gap-1.5 transition-opacity hover:opacity-80"
          >
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'h-2.5 w-2.5 sm:h-3.5 sm:w-3.5',
                    star <= Math.round(averageRating)
                      ? 'fill-kisan-orange text-kisan-orange'
                      : 'fill-transparent text-muted-foreground/30'
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              ({reviewCount})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm sm:text-xl font-bold text-primary">
                ₹{product.price}
              </span>
              <span className="text-[10px] sm:text-sm text-muted-foreground">/{product.unit}</span>
            </div>
          </div>

          {/* Quantity & Add to Cart - Only for customers */}
          {!isFarmer && (
            <div className="mt-2 sm:mt-4 flex items-center gap-1 sm:gap-2">
              <div className="hidden sm:flex items-center rounded-lg border border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={decrementQuantity}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {/* Mobile: Compact quantity */}
              <div className="flex sm:hidden items-center rounded border border-border text-xs">
                <button
                  className="h-6 w-6 flex items-center justify-center"
                  onClick={decrementQuantity}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-4 text-center text-xs font-medium">{quantity}</span>
                <button
                  className="h-6 w-6 flex items-center justify-center"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <Button
                variant="cart"
                className="flex-1 h-6 sm:h-9 text-[10px] sm:text-sm px-1 sm:px-4"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>
          )}

          {/* Farmer view - Show ownership badge or edit option */}
          {isFarmer && (
            <div className="mt-4">
              {isOwnProduct ? (
                <div className="flex items-center gap-2">
                  <span className="flex-1 rounded-lg bg-primary/10 px-3 py-2 text-center text-sm font-medium text-primary">
                    Your Product
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal();
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <span className="block rounded-lg bg-muted px-3 py-2 text-center text-sm text-muted-foreground">
                  Listed by another farmer
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
