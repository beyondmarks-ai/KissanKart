import { ArrowRight, Leaf, Truck, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Animation variants for organic, smooth animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // Smooth easing
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.98,
  },
};

export function HeroSection() {
  const { user, profile } = useAuth();
  const { t, getLocalizedPath } = useLanguage();
  const isLoggedInCustomer = user && profile?.role === 'customer';
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedMetadata = () => {
    // Set playback speed as soon as metadata is loaded
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.4;
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Full Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          key="hero-video"
          autoPlay
          muted
          playsInline
          loop={false}
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          className="h-full w-full object-cover"
        >
          <source src="/Farm.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      {/* Decorative glow effects */}
      <div className="absolute right-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute left-1/4 bottom-1/4 h-72 w-72 rounded-full bg-kisan-leaf/20 blur-[100px]" />

      <div className="container relative mx-auto flex min-h-screen items-center justify-center px-4 py-20">
        <motion.div
          className="max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md"
            variants={badgeVariants}
          >
            <span className="flex h-2.5 w-2.5 rounded-full bg-kisan-leaf animate-pulse" />
            <span className="text-sm font-medium text-white">
              {t('hero.badge')}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="mb-8 pb-2 text-4xl font-bold leading-[1.35] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            variants={itemVariants}
          >
            {t('hero.title')}
            <br />
            <span className="block pb-[0.12em] leading-[1.35] bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent whitespace-normal break-words">
              {t('hero.titleHighlight')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mb-10 mx-auto max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl lg:text-2xl"
            variants={itemVariants}
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
            variants={itemVariants}
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                size="xl"
                className="group bg-kisan-leaf text-white shadow-2xl shadow-kisan-leaf/30 hover:bg-kisan-leaf/90 hover:shadow-kisan-leaf/40 transition-all duration-300 text-lg px-8 py-6"
                asChild
              >
                <Link to="/shop">
                  {t('hero.shopNow')}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
            {!isLoggedInCustomer && (
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="outline"
                  size="xl"
                  className="border-2 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/50 text-lg px-8 py-6"
                  asChild
                >
                  <Link to="/auth">{t('hero.joinFarmer')}</Link>
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8"
            variants={itemVariants}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 text-sm font-semibold text-white">4.9/5</span>
              <span className="text-sm text-white/70">(2.5k reviews)</span>
            </div>
            <div className="h-6 w-px bg-white/30" />
            <div className="text-sm text-white/80">
              <span className="font-bold text-white">10,000+</span> {t('hero.customers')}
            </div>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-3"
            variants={itemVariants}
          >
            {[
              { icon: Leaf, label: t('hero.organic') },
              { icon: Truck, label: t('hero.farmFresh') },
              { icon: Shield, label: t('hero.localFarmers') },
            ].map((feature) => (
              <motion.div
                key={feature.label}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                transition={{ duration: 0.2 }}
              >
                <feature.icon className="h-4 w-4 text-kisan-leaf" />
                <span className="text-sm font-medium text-white">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
