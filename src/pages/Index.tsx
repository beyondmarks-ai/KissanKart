import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/Footer';
import { CartPanel } from '@/components/CartPanel';
import { FarmCard } from '@/components/FarmCard';
import { mockFarms } from '@/data/mockFarms';
import { ArrowRight, Loader2, Store, Package, BarChart3, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};


const Index = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { t, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [showFarmerDialog, setShowFarmerDialog] = useState(false);
  const isLoggedInCustomer = user && profile?.role === 'customer';

  // Redirect farmers to dashboard
  useEffect(() => {
    if (!authLoading && user && profile?.role === 'farmer') {
      navigate('/dashboard');
    }
  }, [user, profile, authLoading, navigate]);

  const handleFarmerCTAClick = (e: React.MouseEvent) => {
    if (isLoggedInCustomer) {
      e.preventDefault();
      setShowFarmerDialog(true);
    }
  };

  useEffect(() => {
    // Simulate loading for farms
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Separate featured and regular farms
  const featuredFarms = mockFarms.filter(farm => farm.is_featured);
  const allFarms = mockFarms;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <CartPanel />

      <main className="flex-1 pt-[108px]">
        <HeroSection />

        {/* Farm Shops Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              className="mb-12 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                Local Farms
              </span>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Explore Farm Shops
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Discover fresh produce from trusted local farmers. Each farm brings unique, quality products directly to you.
              </p>
            </motion.div>

            {/* Farms Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <motion.p
                  className="mb-6 text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {allFarms.length} farms near you
                </motion.p>
                <motion.div
                  className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={staggerContainer}
                >
                  {allFarms.map((farm, index) => (
                    <motion.div
                      key={farm.id}
                      variants={cardVariants}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    >
                      <FarmCard farm={farm} />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {!isLoggedInCustomer ? (
          <section className="bg-primary py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
                {t('cta.title')}
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80 leading-relaxed">
                {t('cta.subtitle')}
              </p>
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="bg-background text-primary hover:bg-background/90"
              >
                <Link to={getLocalizedPath('/auth')}>
                  {t('cta.startSelling')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        ) : (
          <section className="bg-primary py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
                {t('cta.title')}
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80 leading-relaxed">
                {t('cta.subtitle')}
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleFarmerCTAClick}
                className="bg-background text-primary hover:bg-background/90"
              >
                {t('cta.startSelling')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Farmer Portal Dialog */}
      <Dialog open={showFarmerDialog} onOpenChange={setShowFarmerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Switch to Farmer Portal?
            </DialogTitle>
            <DialogDescription>
              You're currently logged in as a customer. To access the farmer portal, you'll need a farmer account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <h4 className="font-medium text-foreground">What changes with a Farmer account:</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">List Your Products</p>
                  <p className="text-xs text-muted-foreground">Add and manage your farm produce for customers to purchase</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">Sales Dashboard</p>
                  <p className="text-xs text-muted-foreground">Track orders, revenue, and analytics for your farm</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">No Customer Shopping</p>
                  <p className="text-xs text-muted-foreground">Farmer accounts are for selling only, not purchasing</p>
                </div>
              </li>
            </ul>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setShowFarmerDialog(false)} className="w-full sm:w-auto">
              Stay as Customer
            </Button>
            <Button
              onClick={() => {
                setShowFarmerDialog(false);
                window.location.href = 'mailto:support@kissankart.com?subject=Request to Switch to Farmer Account';
              }}
              className="w-full sm:w-auto"
            >
              Contact Support to Switch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
