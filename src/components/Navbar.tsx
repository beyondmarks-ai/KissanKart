import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, Phone, Truck, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import kissanKartLogo from '@/assets/kissankart-logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { totalItems, setIsOpen } = useCart();
  const { user, profile, signOut } = useAuth();
  const { t, language, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleCartClick = () => {
    setIsOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(getLocalizedPath('/'));
  };

  const navLinks = [
    { href: getLocalizedPath('/'), label: t('nav.home') },
    { href: getLocalizedPath('/shop'), label: t('nav.shop') },
  ];

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    // Check if we're on the exact path or the language root
    if (path === getLocalizedPath('/')) {
      return currentPath === `/${language}` || currentPath === `/${language}/`;
    }
    return currentPath === path;
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 w-full transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="hidden items-center gap-6 sm:flex">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>{t('topbar.freeDelivery')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm mx-auto sm:mx-0">
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                <span>+91 98765 43210</span>
              </div>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">{t('hero.organic')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-md">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex h-16 sm:h-24 items-center justify-between">
            {/* Logo */}
            <Link to={profile?.role === 'farmer' ? getLocalizedPath('/dashboard') : getLocalizedPath('/')} className="flex items-center gap-1.5 sm:gap-3 group flex-shrink-0">
              <motion.img
                src={kissanKartLogo}
                alt="KissanKart Logo"
                className="h-10 w-10 sm:h-16 sm:w-16 object-contain flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              <div className="flex flex-col">
                <span className="text-sm sm:text-3xl font-extrabold tracking-tight text-foreground leading-none">
                  Kissan<span className="text-primary">Kart</span>
                </span>
                <span className="hidden sm:block text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                  {t('hero.badge')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-2 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-5 py-2.5 text-base font-semibold transition-all duration-200 rounded-lg ${isActive(link.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/5'
                    }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-5 py-2.5 text-base font-semibold text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200">
                    {t('category.all').split(' ')[0]}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-52 p-2">
                  <DropdownMenuItem asChild>
                    <Link to={getLocalizedPath('/shop?category=vegetable')} className="cursor-pointer text-base py-2.5">
                      🥬 {t('category.vegetables')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={getLocalizedPath('/shop?category=fruit')} className="cursor-pointer text-base py-2.5">
                      🍎 {t('category.fruits')}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-2 lg:flex">
              {user ? (
                <>
                  {profile?.role === 'farmer' && (
                    <Button variant="outline" size="sm" asChild className="border-primary/20 hover:border-primary hover:bg-primary/5">
                      <Link to={getLocalizedPath('/dashboard')}>{t('nav.dashboard')}</Link>
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/5">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{profile?.full_name?.split(' ')[0] || 'Account'}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-semibold">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                          {profile?.role}
                        </p>
                      </div>
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive mt-1">
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('nav.signOut')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button size="sm" asChild className="shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-shadow">
                  <Link to={getLocalizedPath('/auth')}>{t('nav.signIn')}</Link>
                </Button>
              )}

              <LanguageSelector />
              <ThemeToggle />

              <div className="w-px h-8 bg-border mx-1" />

              <Button
                variant="ghost"
                size="sm"
                className="relative gap-2 hover:bg-primary/5"
                onClick={handleCartClick}
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-kisan-orange text-[10px] font-bold text-white shadow-sm">
                      {totalItems}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium">{t('cart.title').split(' ')[0]}</span>
              </Button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1 lg:hidden">
              <LanguageSelector />
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={handleCartClick}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-kisan-orange text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover:bg-primary/5"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="border-t border-border bg-background lg:hidden overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <motion.div
                className="container mx-auto px-4 py-4"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link
                        to={link.href}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                            ? 'text-primary bg-primary/5'
                            : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
                          }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  <div className="px-4 py-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">{t('category.all').split(' ')[0]}</p>
                    <div className="flex gap-2">
                      <Link
                        to={getLocalizedPath('/shop?category=vegetable')}
                        className="flex-1 px-3 py-2 rounded-lg bg-primary/5 text-sm text-center hover:bg-primary/10 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🥬 {t('category.vegetables')}
                      </Link>
                      <Link
                        to={getLocalizedPath('/shop?category=fruit')}
                        className="flex-1 px-3 py-2 rounded-lg bg-kisan-orange/10 text-sm text-center hover:bg-kisan-orange/20 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        🍎 {t('category.fruits')}
                      </Link>
                    </div>
                  </div>

                  <div className="h-px bg-border my-2" />

                  {user ? (
                    <>
                      <div className="px-4 py-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                            <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
                          </div>
                        </div>
                      </div>
                      {profile?.role === 'farmer' && (
                        <Link
                          to={getLocalizedPath('/dashboard')}
                          className="px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {t('nav.dashboard')}
                        </Link>
                      )}
                      <button
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4" />
                        {t('nav.signOut')}
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 px-4 py-2">
                      <Button asChild className="w-full">
                        <Link to={getLocalizedPath('/auth')} onClick={() => setIsMobileMenuOpen(false)}>
                          {t('nav.signIn')}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
