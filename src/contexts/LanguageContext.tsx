import React, { createContext, useContext, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export type Language = 'en' | 'hi' | 'kn';

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'hi', 'kn'];
export const DEFAULT_LANGUAGE: Language = 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  getLocalizedPath: (path: string, targetLang?: Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data with Hinglish and conversational Kannada
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.dashboard': 'Dashboard',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',

    // Hero Section
    'hero.badge': 'Farm Fresh Produce',
    'hero.title': 'From Farm to Your Table',
    'hero.titleHighlight': 'Fresh & Natural',
    'hero.subtitle': 'Connect directly with local farmers for the freshest vegetables and fruits. Support sustainable farming while enjoying premium quality produce.',
    'hero.shopNow': 'Start Shopping',
    'hero.joinFarmer': 'Join as Farmer',
    'hero.trustedBy': 'Trusted by',
    'hero.customers': 'customers',
    'hero.organic': '100% Organic',
    'hero.farmFresh': 'Farm Fresh',
    'hero.localFarmers': 'Local Farmers',

    // Categories
    'category.all': 'All Products',
    'category.vegetables': 'Vegetables',
    'category.fruits': 'Fruits',

    // Shop Page
    'shop.title': 'Fresh Produce',
    'shop.subtitle': 'Browse our selection of farm-fresh vegetables and fruits, directly from local farmers.',
    'shop.search': 'Search for products...',
    'shop.showing': 'Showing',
    'shop.products': 'products',
    'shop.noProducts': 'No products found. Try a different search or category.',

    // Product Card
    'product.addToCart': 'Add to Cart',
    'product.outOfStock': 'Out of Stock',
    'product.perUnit': 'per',

    // Cart
    'cart.title': 'Your Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyMessage': 'Add some fresh produce to get started!',
    'cart.subtotal': 'Subtotal',
    'cart.checkout': 'Proceed to Checkout',
    'cart.continueShopping': 'Continue Shopping',
    'cart.remove': 'Remove',

    // Footer
    'footer.tagline': 'Connecting farmers directly with customers for fresher, healthier produce.',
    'footer.quickLinks': 'Quick Links',
    'footer.farmers': 'For Farmers',
    'footer.areYouFarmer': 'Are you a farmer?',
    'footer.startSelling': 'Start selling today',
    'footer.farmerDashboard': 'Farmer Dashboard',
    'footer.contact': 'Contact',
    'footer.email': 'Email',
    'footer.phone': 'Phone',
    'footer.rights': 'All rights reserved.',

    // CTA Section
    'cta.title': 'Are You a Farmer?',
    'cta.subtitle': 'Join our platform and sell your fresh produce directly to customers. No middlemen, better prices.',
    'cta.startSelling': 'Start Selling Today',
    'cta.learnMore': 'Learn More',

    // Auth Page
    'auth.welcome': 'Welcome to KissanKart',
    'auth.chooseRole': 'Choose how you want to use our platform',
    'auth.customer': 'Customer',
    'auth.customerDesc': 'Buy fresh produce directly from farmers',
    'auth.farmer': 'Farmer',
    'auth.farmerDesc': 'Sell your fresh produce to customers',
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.noAccount': "Don't have an account?",
    'auth.haveAccount': 'Already have an account?',
    'auth.back': 'Back',

    // Dashboard
    'dashboard.title': 'Farmer Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.overview': 'Overview',
    'dashboard.products': 'Products',
    'dashboard.analytics': 'Analytics',
    'dashboard.settings': 'Settings',
    'dashboard.addProduct': 'Add Product',
    'dashboard.totalProducts': 'Total Products',
    'dashboard.totalSales': 'Total Sales',
    'dashboard.activeListings': 'Active Listings',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shipping': 'Shipping Information',
    'checkout.name': 'Full Name',
    'checkout.address': 'Address',
    'checkout.phone': 'Phone Number',
    'checkout.payment': 'Payment Method',
    'checkout.paymentNote': 'Payment integration coming soon. This is a demo.',
    'checkout.orderSummary': 'Order Summary',
    'checkout.subtotal': 'Subtotal',
    'checkout.shippingFee': 'Shipping',
    'checkout.free': 'Free',
    'checkout.total': 'Total',
    'checkout.placeOrder': 'Place Order',
    'checkout.emptyCart': 'Your cart is empty',
    'checkout.emptyCartMessage': 'Add some products to your cart before checkout.',

    // Farmer Dialog
    'farmerDialog.title': 'Switch to Farmer Account?',
    'farmerDialog.description': 'You are currently logged in as a customer. Switching to a farmer account will change your experience:',
    'farmerDialog.change1': 'You will be able to list and sell products',
    'farmerDialog.change2': 'Access to farmer dashboard and analytics',
    'farmerDialog.change3': 'You will no longer be able to shop as a customer',
    'farmerDialog.stay': 'Stay as Customer',
    'farmerDialog.switch': 'Contact Support to Switch',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',

    // Top Bar
    'topbar.freeDelivery': 'Free delivery on orders over ₹500',
  },

  // Pure Hindi translations
  hi: {
    // Navbar
    'nav.home': 'होम',
    'nav.shop': 'शॉप',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.signIn': 'लॉगिन',
    'nav.signOut': 'लॉग आउट',

    // Hero Section
    'hero.badge': 'खेत से ताज़ा उपज',
    'hero.title': 'खेत से सीधे आपकी टेबल तक',
    'hero.titleHighlight': 'ताज़ा और नेचुरल',
    'hero.subtitle': 'ताजी सब्जियों और फलों के लिए सीधे स्थानीय किसानों से जुड़ें। अच्छी क्वालिटी का आनंद लें और सस्टेनेबल खेती का समर्थन करें।',
    'hero.shopNow': 'खरीदारी शुरू करें',
    'hero.joinFarmer': 'किसान के रूप में जुड़ें',
    'hero.trustedBy': 'भरोसा है',
    'hero.customers': 'ग्राहकों का',
    'hero.organic': '100% जैविक (Organic)',
    'hero.farmFresh': 'खेत से ताज़ा',
    'hero.localFarmers': 'स्थानीय किसान',

    // Categories
    'category.all': 'सभी उत्पाद',
    'category.vegetables': 'सब्जियां',
    'category.fruits': 'फल',

    // Shop Page
    'shop.title': 'ताज़ा उपज',
    'shop.subtitle': 'स्थानीय किसानों से सीधे खेत-ताजी सब्जियां और फल चुनें।',
    'shop.search': 'उत्पाद खोजें...',
    'shop.showing': 'दिख रहे हैं',
    'shop.products': 'उत्पाद',
    'shop.noProducts': 'कोई उत्पाद नहीं मिला। कुछ और सर्च करके देखें।',

    // Product Card
    'product.addToCart': 'कार्ट में डालें',
    'product.outOfStock': 'आउट ऑफ स्टॉक',
    'product.perUnit': 'प्रति',

    // Cart
    'cart.title': 'आपकी कार्ट',
    'cart.empty': 'आपकी कार्ट खाली है',
    'cart.emptyMessage': 'शुरू करने के लिए कुछ ताजी सब्जियां जोड़ें!',
    'cart.subtotal': 'कुल योग',
    'cart.checkout': 'ऑर्डर करें',
    'cart.continueShopping': 'और खरीदारी करें',
    'cart.remove': 'हटाएं',

    // Footer
    'footer.tagline': 'ताजी और सेहतमंद उपज के लिए किसानों को सीधे ग्राहकों से जोड़ना।',
    'footer.quickLinks': 'क्विक लिंक्स',
    'footer.farmers': 'किसानों के लिए',
    'footer.areYouFarmer': 'क्या आप किसान हैं?',
    'footer.startSelling': 'आज ही बेचना शुरू करें',
    'footer.farmerDashboard': 'किसान डैशबोर्ड',
    'footer.contact': 'संपर्क',
    'footer.email': 'ईमेल',
    'footer.phone': 'फोन',
    'footer.rights': 'सर्वाधिकार सुरक्षित।',

    // CTA Section
    'cta.title': 'क्या आप एक किसान हैं?',
    'cta.subtitle': 'KissanKart से जुड़ें और अपनी ताजी उपज सीधे ग्राहकों को बेचें। कोई बिचौलिया नहीं, सही दाम और ज्यादा लोगों तक पहुंच।',
    'cta.startSelling': 'आज ही बेचना शुरू करें',
    'cta.learnMore': 'और जानें',

    // Auth Page
    'auth.welcome': 'KissanKart में स्वागत है',
    'auth.chooseRole': 'चुनें कि आप प्लेटफॉर्म का उपयोग कैसे करना चाहते हैं',
    'auth.customer': 'ग्राहक (Customer)',
    'auth.customerDesc': 'किसानों से सीधे ताजी उपज खरीदें',
    'auth.farmer': 'किसान (Farmer)',
    'auth.farmerDesc': 'अपनी ताजी उपज ग्राहकों को बेचें',
    'auth.signIn': 'लॉगिन',
    'auth.signUp': 'साइन अप',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.fullName': 'पूरा नाम',
    'auth.noAccount': 'खाता नहीं है?',
    'auth.haveAccount': 'पहले से खाता है?',
    'auth.back': 'पीछे जाएं',

    // Dashboard
    'dashboard.title': 'किसान डैशबोर्ड',
    'dashboard.welcome': 'वापसी पर स्वागत है',
    'dashboard.overview': 'ओवरव्यू',
    'dashboard.products': 'उत्पाद',
    'dashboard.analytics': 'एनालिटिक्स',
    'dashboard.settings': 'सेटिंग्स',
    'dashboard.addProduct': 'नया उत्पाद जोड़ें',
    'dashboard.totalProducts': 'कुल उत्पाद',
    'dashboard.totalSales': 'कुल बिक्री',
    'dashboard.activeListings': 'एक्टिव लिस्टिंग',

    // Checkout
    'checkout.title': 'चेकआउट',
    'checkout.shipping': 'डिलीवरी की जानकारी',
    'checkout.name': 'पूरा नाम',
    'checkout.address': 'पता',
    'checkout.phone': 'फोन नंबर',
    'checkout.payment': 'भुगतान का तरीका',
    'checkout.paymentNote': 'पेमेंट सुविधा जल्द आ रही है। यह एक डेमो है।',
    'checkout.orderSummary': 'ऑर्डर का सारांश',
    'checkout.subtotal': 'कुल योग',
    'checkout.shippingFee': 'शिपिंग',
    'checkout.free': 'मुफ्त',
    'checkout.total': 'कुल',
    'checkout.placeOrder': 'ऑर्डर प्लेस करें',
    'checkout.emptyCart': 'आपकी कार्ट खाली है',
    'checkout.emptyCartMessage': 'चेकआउट से पहले कार्ट में कुछ उत्पाद जोड़ें।',

    // Farmer Dialog
    'farmerDialog.title': 'किसान खाते में बदलें?',
    'farmerDialog.description': 'आप अभी एक ग्राहक के रूप में लॉग इन हैं। किसान खाते में जाने से यह बदलाव होंगे:',
    'farmerDialog.change1': 'आप उत्पाद लिस्ट कर और बेच सकेंगे',
    'farmerDialog.change2': 'किसान डैशबोर्ड और एनालिटिक्स का एक्सेस मिलेगा',
    'farmerDialog.change3': 'आप ग्राहक के रूप में खरीदारी नहीं कर पाएंगे',
    'farmerDialog.stay': 'ग्राहक ही रहें',
    'farmerDialog.switch': 'बदलने के लिए सपोर्ट से संपर्क करें',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हो गया',
    'common.success': 'सफल',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.delete': 'डिलीट',
    'common.edit': 'एडिट',
    'common.view': 'देखें',

    // Top Bar
    'topbar.freeDelivery': '₹500 से ज्यादा के ऑर्डर पर मुफ्त डिलीवरी',
  },

  // Pure Kannada translations
  kn: {
    // Navbar
    'nav.home': 'ಮುಖಪುಟ',
    'nav.shop': 'ಶಾಪ್',
    'nav.about': 'ನಮ್ಮ ಬಗ್ಗೆ',
    'nav.contact': 'ಸಂಪರ್ಕಿಸಿ',
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.signIn': 'ಲಾಗಿನ್',
    'nav.signOut': 'ಲಾಗೌಟ್',

    // Hero Section
    'hero.badge': 'ತೋಟದ ತಾಜಾ ಬೆಳೆ',
    'hero.title': 'ತೋಟದಿಂದ ನೇರವಾಗಿ ನಿಮ್ಮ ಮನೆಗೆ',
    'hero.titleHighlight': 'ತಾಜಾ ಮತ್ತು ನೈಸರ್ಗಿಕ',
    'hero.subtitle': 'ತಾಜಾ ತರಕಾರಿ ಮತ್ತು ಹಣ್ಣುಗಳಿಗಾಗಿ ನೇರವಾಗಿ ಸ್ಥಳೀಯ ರೈತರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ. ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಉತ್ಪನ್ನಗಳನ್ನು ಪಡೆಯಿರಿ ಮತ್ತು ರೈತರಿಗೆ ಬೆಂಬಲ ನೀಡಿ.',
    'hero.shopNow': 'ಶಾಪಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ',
    'hero.joinFarmer': 'ರೈತರಾಗಿ ಸೇರಿಕೊಳ್ಳಿ',
    'hero.trustedBy': 'ನಂಬಿಕಾರ್ಹ',
    'hero.customers': 'ಗ್ರಾಹಕರು',
    'hero.organic': '100% ಸಾವಯವ (Organic)',
    'hero.farmFresh': 'ತೋಟದ ತಾಜಾ',
    'hero.localFarmers': 'ಸ್ಥಳೀಯ ರೈತರು',

    // Categories
    'category.all': 'ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳು',
    'category.vegetables': 'ತರಕಾರಿಗಳು',
    'category.fruits': 'ಹಣ್ಣುಗಳು',

    // Shop Page
    'shop.title': 'ತಾಜಾ ಉತ್ಪನ್ನಗಳು',
    'shop.subtitle': 'ಸ್ಥಳೀಯ ರೈತರಿಂದ ನೇರವಾಗಿ ಬಂದಿರುವ ತಾಜಾ ತರಕಾರಿಗಳು ಮತ್ತು ಹಣ್ಣುಗಳನ್ನು ನೋಡಿ.',
    'shop.search': 'ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ...',
    'shop.showing': 'ತೋರಿಸಲಾಗುತ್ತಿದೆ',
    'shop.products': 'ಉತ್ಪನ್ನಗಳು',
    'shop.noProducts': 'ಯಾವುದೇ ಉತ್ಪನ್ನಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಬೇರೆ ಹುಡುಕಾಟ ಅಥವಾ ವರ್ಗವನ್ನು ಪ್ರಯತ್ನಿಸಿ.',

    // Product Card
    'product.addToCart': 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ',
    'product.outOfStock': 'ಸ್ಟಾಕ್ ಇಲ್ಲ',
    'product.perUnit': 'ಪ್ರತಿ',

    // Cart
    'cart.title': 'ನಿಮ್ಮ ಕಾರ್ಟ್',
    'cart.empty': 'ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ',
    'cart.emptyMessage': 'ಪ್ರಾರಂಭಿಸಲು ಕೆಲವು ತಾಜಾ ತರಕಾರಿಗಳನ್ನು ಸೇರಿಸಿ!',
    'cart.subtotal': 'ಒಟ್ಟು ಮೊತ್ತ',
    'cart.checkout': 'ಆರ್ಡರ್ ಮಾಡಿ',
    'cart.continueShopping': 'ಇನ್ನಷ್ಟು ಶಾಪಿಂಗ್ ಮಾಡಿ',
    'cart.remove': 'ತೆಗೆದುಹಾಕಿ',

    // Footer
    'footer.tagline': 'ತಾಜಾ ಮತ್ತು ಆರೋಗ್ಯಕರ ಬೆಳೆಗಾಗಿ ರೈತರನ್ನು ನೇರವಾಗಿ ಗ್ರಾಹಕರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು.',
    'footer.quickLinks': 'ಕ್ವಿಕ್ ಲಿಂಕ್ಸ್',
    'footer.farmers': 'ರೈತರಿಗಾಗಿ',
    'footer.areYouFarmer': 'ನೀವು ರೈತರೇ?',
    'footer.startSelling': 'ಇಂದೇ ಮಾರಾಟ ಪ್ರಾರಂಭಿಸಿ',
    'footer.farmerDashboard': 'ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'footer.contact': 'ಸಂಪರ್ಕ',
    'footer.email': 'ಇಮೇಲ್',
    'footer.phone': 'ದೂರವಾಣಿ',
    'footer.rights': 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',

    // CTA Section
    'cta.title': 'ನೀವು ರೈತರೇ?',
    'cta.subtitle': 'KissanKart ಗೆ ಸೇರಿ ಮತ್ತು ನಿಮ್ಮ ತಾಜಾ ಬೆಳೆಯನ್ನು ನೇರವಾಗಿ ಗ್ರಾಹಕರಿಗೆ ಮಾರಾಟ ಮಾಡಿ. ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲ, ಉತ್ತಮ ಬೆಲೆ ಮತ್ತು ಹೆಚ್ಚು ಗ್ರಾಹಕರನ್ನು ತಲುಪಿ.',
    'cta.startSelling': 'ಇಂದೇ ಮಾರಾಟ ಪ್ರಾರಂಭಿಸಿ',
    'cta.learnMore': 'ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ',

    // Auth Page
    'auth.welcome': 'ಕಿಸಾನ್‌ಕಾರ್ಟ್‌ಗೆ ಸುಸ್ವಾಗತ',
    'auth.chooseRole': 'ನೀವು ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಅನ್ನು ಹೇಗೆ ಬಳಸಬೇಕೆಂದು ಆಯ್ಕೆಮಾಡಿ',
    'auth.customer': 'ಗ್ರಾಹಕ (Customer)',
    'auth.customerDesc': 'ರೈತರಿಂದ ನೇರವಾಗಿ ತಾಜಾ ಬೆಳೆಯನ್ನು ಖರೀದಿಸಿ',
    'auth.farmer': 'ರೈತ (Farmer)',
    'auth.farmerDesc': 'ನಿಮ್ಮ ತಾಜಾ ಬೆಳೆಯನ್ನು ಗ್ರಾಹಕರಿಗೆ ಮಾರಾಟ ಮಾಡಿ',
    'auth.signIn': 'ಲಾಗಿನ್',
    'auth.signUp': 'ಸೈನ್ ಅಪ್',
    'auth.email': 'ಇಮೇಲ್',
    'auth.password': 'ಪಾಸ್‌ವರ್ಡ್',
    'auth.fullName': 'ಪೂರ್ಣ ಹೆಸರು',
    'auth.noAccount': 'ಖಾತೆ ಇಲ್ಲವೇ?',
    'auth.haveAccount': 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
    'auth.back': 'ಹಿಂದಕ್ಕೆ',

    // Dashboard
    'dashboard.title': 'ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'dashboard.welcome': 'ಮತ್ತೆ ಸ್ವಾಗತ',
    'dashboard.overview': 'ಓವರ್‌ವ್ಯೂ',
    'dashboard.products': 'ಉತ್ಪನ್ನಗಳು',
    'dashboard.analytics': 'ಅನಾಲಿಟಿಕ್ಸ್',
    'dashboard.settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    'dashboard.addProduct': 'ಉತ್ಪನ್ನ ಸೇರಿಸಿ',
    'dashboard.totalProducts': 'ಒಟ್ಟು ಉತ್ಪನ್ನಗಳು',
    'dashboard.totalSales': 'ಒಟ್ಟು ಮಾರಾಟ',
    'dashboard.activeListings': 'ಸಕ್ರಿಯ ಲಿಸ್ಟಿಂಗ್‌ಗಳು',

    // Checkout
    'checkout.title': 'ಚೆಕ್‌ಔಟ್',
    'checkout.shipping': 'ಶಿಪ್ಪಿಂಗ್ ಮಾಹಿತಿ',
    'checkout.name': 'ಪೂರ್ಣ ಹೆಸರು',
    'checkout.address': 'ವಿಳಾಸ',
    'checkout.phone': 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
    'checkout.payment': 'ಪಾವತಿ ವಿಧಾನ',
    'checkout.paymentNote': 'ಪಾವತಿ ಸೌಲಭ್ಯ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ. ಇದೊಂದು ಡೆಮೋ.',
    'checkout.orderSummary': 'ಆರ್ಡರ್ ವಿವರ',
    'checkout.subtotal': 'ಒಟ್ಟು ಮೊತ್ತ',
    'checkout.shippingFee': 'ಶಿಪ್ಪಿಂಗ್',
    'checkout.free': 'ಉಚಿತ',
    'checkout.total': 'ಒಟ್ಟು',
    'checkout.placeOrder': 'ಆರ್ಡರ್ ಪ್ಲೇಸ್ ಮಾಡಿ',
    'checkout.emptyCart': 'ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ',
    'checkout.emptyCartMessage': 'ಚೆಕ್‌ಔಟ್‌ಗೆ ಮೊದಲು ಕಾರ್ಟ್‌ಗೆ ಕೆಲವು ಉತ್ಪನ್ನಗಳನ್ನು ಸೇರಿಸಿ.',

    // Farmer Dialog
    'farmerDialog.title': 'ರೈತ ಖಾತೆಗೆ ಬದಲಾಯಿಸಬೇಕೆ?',
    'farmerDialog.description': 'ನೀವು ಪ್ರಸ್ತುತ ಗ್ರಾಹಕರಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ. ರೈತ ಖಾತೆಗೆ ಬದಲಾಯಿಸುವುದರಿಂದ:',
    'farmerDialog.change1': 'ನೀವು ಉತ್ಪನ್ನಗಳನ್ನು ಲಿಸ್ಟ್ ಮಾಡಿ ಮಾರಾಟ ಮಾಡಬಹುದು',
    'farmerDialog.change2': 'ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮತ್ತು ಅನಾಲಿಟಿಕ್ಸ್ ಸಿಗುತ್ತದೆ',
    'farmerDialog.change3': 'ನೀವು ಗ್ರಾಹಕರಾಗಿ ಶಾಪಿಂಗ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗುವುದಿಲ್ಲ',
    'farmerDialog.stay': 'ಗ್ರಾಹಕರಾಗಿಯೇ ಇರಿ',
    'farmerDialog.switch': 'ಬದಲಾಯಿಸಲು ಸಪೋರ್ಟ್ ಟೀಮ್ ಸಂಪರ್ಕಿಸಿ',

    // Common
    'common.loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
    'common.error': 'ಏನೋ ತಪ್ಪಾಗಿದೆ',
    'common.success': 'ಯಶಸ್ವಿ',
    'common.cancel': 'ರದ್ದುಮಾಡಿ',
    'common.save': 'ಸೇವ್ ಮಾಡಿ',
    'common.delete': 'ಡಿಲೀಟ್',
    'common.edit': 'ಎಡಿಟ್',
    'common.view': 'ನೋಡಿ',

    // Top Bar
    'topbar.freeDelivery': '₹500 ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಆರ್ಡರ್‌ಗಳ ಮೇಲೆ ಉಚಿತ ವಿತರಣೆ',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Get language from localStorage, default to 'en'
  const [language, setLanguageState] = React.useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored && SUPPORTED_LANGUAGES.includes(stored as Language))
      ? (stored as Language)
      : DEFAULT_LANGUAGE;
  });

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  const getLocalizedPath = (path: string, targetLang: Language = language): string => {
    // Since we removed language prefixes from URLs, just return the path as-is
    return path;
  };

  const setLanguage = (newLang: Language) => {
    // Store language preference in localStorage
    localStorage.setItem('language', newLang);
    setLanguageState(newLang);
    // No need to navigate since we don't have language in URL anymore
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalizedPath }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
