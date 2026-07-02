/**
 * QUICK REFERENCE: Discount Banner Slider
 * ========================================
 * 
 * Location: Shop Page (/shop)
 * Component: src/components/BannerSlider.tsx
 * Images: public/banners/
 */

// BANNER CONFIGURATION
// ====================

// Banner 1: Harvest Season Sale (20% OFF)
{
    id: 1,
        image: '/banners/banner1.png',
            title: 'Harvest Season Sale',
                subtitle: 'Flat 20% OFF on orders above ₹499 - Use Code: FRESH20',
                    ctaText: 'Order Now',
                        ctaLink: '#products',
                            badge: '🎉 SPECIAL OFFER'
}

// Banner 2: KissanKart Collection (No discount badge)
{
    id: 2,
        image: '/banners/banner2.png',
            title: 'KissanKart Fresh Collection',
                subtitle: 'Morning Harvest • Farm-to-Table Feast • Community Market',
                    ctaText: 'Explore Now',
                        ctaLink: '#products',
                            badge: null
}

// Banner 3: Weekend Special (30% OFF)
{
    id: 3,
        image: 'https://images.unsplash.com/...',
            title: 'Weekend Special',
                subtitle: 'Up to 30% OFF on Fresh Produce - Limited Time Offer',
                    ctaText: 'Shop Deals',
                        ctaLink: '#products',
                            badge: '🎉 LIMITED TIME'
}

// TIMING SETTINGS
// ===============
const AUTO_ADVANCE_DELAY = 5000; // 5 seconds
const MANUAL_PAUSE_DURATION = 10000; // 10 seconds after manual interaction

// ANIMATION SETTINGS
// ==================
const SLIDE_TRANSITION_DURATION = 700; // milliseconds
const CONTENT_STAGGER_DELAYS = {
    badge: 300,
    title: 400,
    subtitle: 500,
    cta: 600
};

// RESPONSIVE BREAKPOINTS
// ======================
const BREAKPOINTS = {
    mobile: '< 640px',    // aspect-[21/9]
    tablet: '640-1024px', // aspect-[16/6]
    desktop: '> 1024px'   // aspect-[21/6]
};

// BADGE STYLING
// =============
const BADGE_STYLES = {
    background: 'bg-gradient-to-r from-amber-500 to-orange-500',
    text: 'text-white font-bold',
    animation: 'scale-in with opacity fade',
    position: 'above title'
};

// QUICK EDITS
// ===========

// To change discount percentage:
// Edit subtitle in bannerSlides array (lines 14-38)

// To add more banners:
// Add new object to bannerSlides array

// To change which slides show badges:
// Edit condition: (currentSlide === 0 || currentSlide === 2)
// Change to: (currentSlide === 1) for only second slide
// Or: (currentSlide !== 1) for all except second slide

// To change badge colors:
// Edit: from-amber-500 to-orange-500
// Try: from-red-500 to-pink-500 (for urgent sales)
//      from-blue-500 to-purple-500 (for new arrivals)
//      from-green-500 to-emerald-500 (for eco-friendly)

// To change auto-advance speed:
// Edit line 42: }, 5000); // Change number (in milliseconds)

// KEYBOARD SHORTCUTS (for development)
// =====================================
// Left Arrow: Previous slide
// Right Arrow: Next slide
// Number Keys (1-3): Jump to specific slide

// IMAGE OPTIMIZATION COMMANDS
// ===========================
// Compress PNG: npx imagemin public/banners/*.png --out-dir=public/banners/optimized
// Convert to WebP: npx cwebp public/banners/banner1.png -o public/banners/banner1.webp

// TESTING URLS
// ============
// Local: http://localhost:8080/shop
// Production: https://yourdomain.com/shop

// ANALYTICS TRACKING (Future)
// ===========================
// Track banner clicks:
// onClick={() => trackEvent('banner_click', { banner_id: currentSlide })}

// Track banner views:
// useEffect(() => trackEvent('banner_view', { banner_id: currentSlide }), [currentSlide])
