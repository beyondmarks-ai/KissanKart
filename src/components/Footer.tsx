import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Store, ShoppingBag, BarChart3, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function Footer() {
  const { user, profile } = useAuth();
  const { t, getLocalizedPath } = useLanguage();
  const isLoggedInCustomer = user && profile?.role === 'customer';
  const [showFarmerDialog, setShowFarmerDialog] = useState(false);

  const handleFarmerLinkClick = (e: React.MouseEvent) => {
    if (isLoggedInCustomer) {
      e.preventDefault();
      setShowFarmerDialog(true);
    }
  };

  return (
    <>
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link to={getLocalizedPath('/')} className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Leaf className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  Kissan<span className="text-primary">Kart</span>
                </span>
              </Link>
              <p className="mb-4 text-sm text-muted-foreground">
                {t('footer.tagline')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to={getLocalizedPath('/')}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link
                    to={getLocalizedPath('/shop')}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t('nav.shop')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Farmers */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">{t('footer.farmers')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to={getLocalizedPath('/auth?role=farmer')}
                    onClick={handleFarmerLinkClick}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t('footer.startSelling')}
                  </Link>
                </li>
                <li>
                  <Link
                    to={getLocalizedPath('/dashboard')}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {t('footer.farmerDashboard')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-4 font-semibold text-foreground">{t('footer.contact')}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    123 Farm Road, Agricultural District, India
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    +91 98765 43210
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    support@kissankart.com
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-6">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} KissanKart. {t('footer.rights')} Made with
              ❤️ for Indian Farmers.
            </p>
          </div>
        </div>
      </footer>

      {/* Farmer Portal Dialog */}
      <Dialog open={showFarmerDialog} onOpenChange={setShowFarmerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              {t('farmerDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {t('farmerDialog.description')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{t('farmerDialog.change1')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{t('farmerDialog.change2')}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{t('farmerDialog.change3')}</p>
                </div>
              </li>
            </ul>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setShowFarmerDialog(false)} className="w-full sm:w-auto">
              {t('farmerDialog.stay')}
            </Button>
            <Button 
              onClick={() => {
                setShowFarmerDialog(false);
                window.location.href = 'mailto:support@kissankart.com?subject=Request to Switch to Farmer Account';
              }}
              className="w-full sm:w-auto"
            >
              {t('farmerDialog.switch')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
