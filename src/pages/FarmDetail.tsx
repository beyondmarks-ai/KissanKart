import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartPanel } from '@/components/CartPanel';
import { ProductCard } from '@/components/ProductCard';
import { getFarmById, getProductsByFarmId } from '@/data/mockFarms';
import { ArrowLeft, Star, Clock, MapPin, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function FarmDetail() {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const farm = getFarmById(farmId || '');
  const products = getProductsByFarmId(farmId || '');

  if (!farm) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-[108px] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Farm not found</h1>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <CartPanel />

      <main className="flex-1 pt-[108px]">
        {/* Hero Section */}
        <section className="relative">
          {/* Back Button - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm sm:hidden"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Farm Image */}
          <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden bg-muted">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}
            <img
              src={farm.image_url}
              alt={farm.name}
              className={cn(
                'h-full w-full object-cover',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          {/* Farm Info */}
          <div className="container mx-auto px-4">
            <div className="relative -mt-16 sm:-mt-20 rounded-xl border border-border bg-card p-4 sm:p-6 shadow-lg">
              {/* Back Button - Desktop */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-12 left-0 hidden sm:flex text-muted-foreground hover:text-foreground"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-3xl font-bold text-foreground">
                      {farm.name}
                    </h1>
                    {farm.is_featured && (
                      <span className="inline-block rounded-full bg-kisan-orange px-2 py-0.5 text-xs font-semibold text-white">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                    {farm.description}
                  </p>

                  {/* Stats Row */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 sm:gap-6 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 rounded bg-primary px-2 py-1">
                        <span className="font-bold text-primary-foreground">{farm.rating}</span>
                        <Star className="h-3.5 w-3.5 fill-primary-foreground text-primary-foreground" />
                      </div>
                      <span className="text-muted-foreground">({farm.review_count} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {farm.delivery_time}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {farm.location}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {farm.specialty.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <Button variant="outline" size="icon" className="self-start shrink-0">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-6 text-lg sm:text-2xl font-bold text-foreground">
              Products from {farm.name}
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {products.length} products available
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-lg text-muted-foreground">
                  No products available from this farm yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
