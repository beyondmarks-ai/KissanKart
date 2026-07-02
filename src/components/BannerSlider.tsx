import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BannerSlide {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    ctaText?: string;
    ctaLink?: string;
}

const bannerSlides: BannerSlide[] = [
    {
        id: 1,
        image: '/banners/banner1.png',
        title: 'Harvest Season Sale',
        subtitle: 'Flat 20% OFF on orders above ₹499 - Use Code: FRESH20',
        ctaText: 'Order Now',
        ctaLink: '#products',
    },
    {
        id: 2,
        image: '/banners/banner2.png',
        title: 'KissanKart Fresh Collection',
        subtitle: 'Morning Harvest • Farm-to-Table Feast • Community Market',
        ctaText: 'Explore Now',
        ctaLink: '#products',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&h=600&fit=crop&q=80',
        title: 'Weekend Special',
        subtitle: 'Up to 30% OFF on Fresh Produce - Limited Time Offer',
        ctaText: 'Shop Deals',
        ctaLink: '#products',
    },
];

export function BannerSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-advance slides every 5 seconds
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 10 seconds of manual interaction
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToPrevious = () => {
        const newIndex = currentSlide === 0 ? bannerSlides.length - 1 : currentSlide - 1;
        goToSlide(newIndex);
    };

    const goToNext = () => {
        const newIndex = (currentSlide + 1) % bannerSlides.length;
        goToSlide(newIndex);
    };

    // Smooth scroll to products section
    const handleCTAClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // Try to find products section by ID first
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Fallback: try to find by class
            const productGrid = document.querySelector('.grid.grid-cols-3');
            if (productGrid) {
                productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Last fallback: scroll down
                window.scrollTo({ top: 600, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="relative w-full overflow-hidden bg-gradient-to-br from-kisan-leaf/5 to-primary/5">
            {/* Slider Container - Improved mobile aspect ratio */}
            <div className="relative aspect-[4/3] xs:aspect-[3/2] sm:aspect-[16/7] md:aspect-[21/7] lg:aspect-[21/6] w-full min-h-[280px] sm:min-h-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="absolute inset-0"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={bannerSlides[currentSlide].image}
                                alt={bannerSlides[currentSlide].title}
                                className="h-full w-full object-cover"
                                loading="eager"
                            />
                            {/* Gradient Overlay - Stronger on mobile for better text visibility */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 sm:from-black/70 sm:via-black/40 sm:to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 sm:from-black/50" />
                        </div>

                        {/* Content - Better mobile spacing */}
                        <div className="container relative mx-auto flex h-full items-center px-3 py-4 sm:px-6 sm:py-0 lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="w-full max-w-xl lg:max-w-2xl"
                            >
                                {/* Discount Badge for promotional slides */}
                                {(currentSlide === 0 || currentSlide === 2) && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 shadow-lg sm:mb-4 sm:gap-2 sm:px-5 sm:py-2.5"
                                    >
                                        <span className="text-[10px] font-bold text-white sm:text-xs md:text-sm">
                                            🎉 {currentSlide === 0 ? 'SPECIAL OFFER' : 'LIMITED TIME'}
                                        </span>
                                    </motion.div>
                                )}

                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="mb-1.5 text-xl font-bold leading-tight text-white sm:mb-3 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl drop-shadow-lg"
                                >
                                    {bannerSlides[currentSlide].title}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                    className="mb-3 text-xs leading-snug text-white/95 sm:mb-6 sm:text-base md:text-lg lg:text-xl xl:text-2xl drop-shadow-md font-medium"
                                >
                                    {bannerSlides[currentSlide].subtitle}
                                </motion.p>
                                {bannerSlides[currentSlide].ctaText && (
                                    <motion.a
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.6 }}
                                        href={bannerSlides[currentSlide].ctaLink}
                                        onClick={handleCTAClick}
                                        className="inline-flex items-center rounded-md bg-kisan-leaf px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-kisan-leaf/30 transition-all duration-300 hover:bg-kisan-leaf/90 hover:shadow-kisan-leaf/40 active:scale-95 sm:rounded-lg sm:px-6 sm:py-3 sm:text-sm md:px-8 md:py-3.5 md:text-base hover:scale-105 cursor-pointer"
                                    >
                                        {bannerSlides[currentSlide].ctaText}
                                    </motion.a>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows - Better mobile visibility */}
            <button
                onClick={goToPrevious}
                className="absolute left-1.5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/25 p-1.5 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/35 active:scale-95 sm:left-3 sm:p-2 md:left-4 md:p-3 hover:scale-110"
                aria-label="Previous slide"
            >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-1.5 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/25 p-1.5 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/35 active:scale-95 sm:right-3 sm:p-2 md:right-4 md:p-3 hover:scale-110"
                aria-label="Next slide"
            >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>

            {/* Dot Indicators - Better mobile visibility */}
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-3 sm:gap-2 md:bottom-4 md:gap-3">
                {bannerSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-300 sm:h-2 md:h-2.5 ${index === currentSlide
                            ? 'w-6 bg-white sm:w-8 md:w-10'
                            : 'w-1.5 bg-white/50 hover:bg-white/70 sm:w-2 md:w-2.5'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <motion.div
                    key={currentSlide}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="h-full bg-kisan-leaf"
                />
            </div>
        </div>
    );
}
