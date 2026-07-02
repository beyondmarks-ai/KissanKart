// Example: How to add your own custom banner images

// Option 1: Using local images (Recommended for production)
// 1. Place your images in the public folder:
//    - public/banners/banner1.jpg
//    - public/banners/banner2.jpg

// 2. Update the bannerSlides array in BannerSlider.tsx:
const bannerSlides: BannerSlide[] = [
    {
        id: 1,
        image: '/banners/banner1.jpg',  // Local path
        title: 'Farm Fresh Vegetables',
        subtitle: 'Organic produce delivered to your doorstep',
        ctaText: 'Shop Now',
        ctaLink: '#products',
    },
    {
        id: 2,
        image: '/banners/banner2.jpg',  // Local path
        title: 'Seasonal Fruits',
        subtitle: 'Handpicked fresh fruits from local farms',
        ctaText: 'Explore',
        ctaLink: '#products',
    },
];

// Option 2: Using external URLs (Current implementation)
const bannerSlides: BannerSlide[] = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=600&fit=crop&q=80',
        title: 'Farm Fresh Vegetables',
        subtitle: 'Organic produce delivered to your doorstep',
        ctaText: 'Shop Now',
        ctaLink: '#products',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1920&h=600&fit=crop&q=80',
        title: 'Seasonal Fruits',
        subtitle: 'Handpicked fresh fruits from local farms',
        ctaText: 'Explore',
        ctaLink: '#products',
    },
];

// Option 3: Add more slides (3, 4, 5+ slides)
const bannerSlides: BannerSlide[] = [
    {
        id: 1,
        image: '/banners/vegetables.jpg',
        title: 'Farm Fresh Vegetables',
        subtitle: 'Organic produce delivered to your doorstep',
        ctaText: 'Shop Now',
        ctaLink: '/shop?category=vegetables',
    },
    {
        id: 2,
        image: '/banners/fruits.jpg',
        title: 'Seasonal Fruits',
        subtitle: 'Handpicked fresh fruits from local farms',
        ctaText: 'Explore',
        ctaLink: '/shop?category=fruits',
    },
    {
        id: 3,
        image: '/banners/delivery.jpg',
        title: 'Fast Delivery',
        subtitle: 'Get your order within 24 hours',
        ctaText: 'Learn More',
        ctaLink: '/delivery',
    },
    // Add as many as you want!
];

// Recommended Image Specifications:
// - Dimensions: 1920x600px (or similar 3.2:1 ratio)
// - Format: JPG or WebP for best performance
// - File size: < 500KB (optimized for web)
// - Content: Ensure important elements are centered (safe zone)
// - Text overlay: Keep left or right side clear for text

// Tips for best results:
// 1. Use high-quality, professional images
// 2. Ensure good contrast for text readability
// 3. Keep file sizes optimized for fast loading
// 4. Test on mobile devices to ensure text is readable
// 5. Use consistent image styles across all slides
