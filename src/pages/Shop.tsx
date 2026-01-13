import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartPanel } from '@/components/CartPanel';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { BannerSlider } from '@/components/BannerSlider';
import { mockProducts } from '@/data/mockProducts';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'vegetable' | 'fruit'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      // TEMPORARY: Use mock products to show discounts
      // TODO: Update database products to include original_price field
      setProducts(mockProducts);
      setLoading(false);

      /* Original database fetch - commented out temporarily
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock products if DB fails
        setProducts(mockProducts);
      } else if (data && data.length > 0) {
        setProducts(data as Product[]);
      } else {
        // Show mock products if no real products exist
        setProducts(mockProducts);
      }
      */
    }

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <CartPanel />

      {/* Banner Slider */}
      <div className="pt-[108px]">
        <BannerSlider />
      </div>

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-gradient-to-b from-primary/5 to-transparent py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Fresh Produce
              </h1>
              <p className="mb-8 text-muted-foreground">
                Browse our selection of farm-fresh vegetables and fruits, directly from local farmers.
              </p>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-12 text-base"
                />
              </div>

              {/* Category Filter */}
              <CategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section id="products" className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-lg text-muted-foreground">
                  No products found. Try a different search or category.
                </p>
              </div>
            ) : (
              <>
                <p className="mb-6 text-sm text-muted-foreground">
                  Showing {filteredProducts.length} products
                </p>
                <div className="grid grid-cols-3 gap-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
