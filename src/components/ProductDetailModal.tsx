import * as React from 'react';
import { Plus, Minus, ShoppingCart, Truck, Shield, Leaf } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

import { ReviewsSection } from '@/features/reviews/ReviewsSection';
import { RatingStars } from '@/features/reviews/RatingStars';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [quantity, setQuantity] = React.useState(1);
  const { addToCart } = useCart();

  // Stats are computed by the ReviewsSection and pushed up for the header display
  const [averageRating, setAverageRating] = React.useState(0);
  const [reviewCount, setReviewCount] = React.useState(0);

  const [imageSrc, setImageSrc] = React.useState(product.image_url || '/placeholder.svg');

  React.useEffect(() => {
    setImageSrc(product.image_url || '/placeholder.svg');
  }, [product.image_url]);

  React.useEffect(() => {
    if (!isOpen) return;
    setQuantity(1);
    setAverageRating(0);
    setReviewCount(0);
  }, [isOpen, product.id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const handleStatsChange = (stats: { average: number; count: number }) => {
    setAverageRating(stats.average);
    setReviewCount(stats.count);
  };

  const categoryColors = {
    vegetable: 'bg-primary/10 text-primary border-primary/20',
    fruit: 'bg-kisan-orange/10 text-kisan-orange border-kisan-orange/20',
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-3xl overflow-hidden rounded-2xl p-0">
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Product Image */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
            <img
              src={imageSrc}
              alt={`${product.name} - ${product.category} from KissanKart`}
              loading="lazy"
              className="h-full w-full object-cover"
              onError={() => setImageSrc('/placeholder.svg')}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <Badge
                variant="outline"
                className={`mb-2 border capitalize ${categoryColors[product.category]}`}
              >
                {product.category}
              </Badge>
              <h2 className="text-3xl font-bold text-white">{product.name}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Price and Rating Row */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                  <span className="text-lg text-muted-foreground">/{product.unit}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <RatingStars value={averageRating} size="md" showValue />
                  <span className="text-sm text-muted-foreground">
                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-border bg-muted/30">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-r-none"
                    onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 rounded-l-none"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="cart" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-foreground">About this product</h3>
              <p className="leading-relaxed text-muted-foreground">{product.description}</p>
            </div>

            {/* Features */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center rounded-xl border border-border bg-muted/20 p-4 text-center">
                <Leaf className="mb-2 h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-foreground">Fresh & Organic</span>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-border bg-muted/20 p-4 text-center">
                <Truck className="mb-2 h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-foreground">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-border bg-muted/20 p-4 text-center">
                <Shield className="mb-2 h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-foreground">Quality Assured</span>
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewsSection
              productId={product.id}
              productName={product.name}
              onStatsChange={handleStatsChange}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
