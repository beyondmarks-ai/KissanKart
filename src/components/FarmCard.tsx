import { Star, Clock, MapPin } from 'lucide-react';
import { Farm } from '@/types';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { motion } from 'framer-motion';


interface FarmCardProps {
  farm: Farm;
}

export function FarmCard({ farm }: FarmCardProps) {
  const { getLocalizedPath } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to={getLocalizedPath(`/farm/${farm.id}`)}
      className="block"
    >
      <motion.div
        className="relative overflow-hidden rounded-lg sm:rounded-xl border border-border bg-card shadow-card"
        whileHover={{
          y: -8,
          scale: 1.02,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transition: { duration: 0.3, ease: 'easeOut' }
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          <motion.img
            src={farm.image_url}
            alt={farm.name}
            loading="lazy"
            className={cn(
              'h-full w-full object-cover',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />

          {/* Featured Badge */}
          {farm.is_featured && (
            <motion.div
              className="absolute left-2 top-2 sm:left-3 sm:top-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <span className="inline-block rounded-full bg-kisan-orange px-2 py-0.5 text-[10px] sm:px-3 sm:py-1 sm:text-xs font-semibold text-white shadow-md">
                Featured
              </span>
            </motion.div>
          )}

          {/* Delivery Time */}
          <motion.div
            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-2 py-0.5 text-[10px] sm:px-3 sm:py-1 sm:text-xs font-medium text-foreground backdrop-blur-sm">
              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {farm.delivery_time}
            </span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-lg font-semibold text-card-foreground line-clamp-1">
                {farm.name}
              </h3>
              <p className="hidden sm:block mt-1 text-sm text-muted-foreground line-clamp-1">
                {farm.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-0.5 sm:gap-1 rounded bg-primary px-1 sm:px-2 py-0.5 sm:py-1 shrink-0">
              <span className="text-[10px] sm:text-sm font-bold text-primary-foreground">{farm.rating}</span>
              <Star className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 fill-primary-foreground text-primary-foreground" />
            </div>
          </div>

          {/* Location & Tags */}
          <div className="mt-1 sm:mt-3 flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
            <span className="line-clamp-1">{farm.location}</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline text-muted-foreground">{farm.review_count} reviews</span>
          </div>

          {/* Specialty Tags */}
          <div className="mt-1.5 sm:mt-3 flex flex-wrap gap-1 sm:gap-1.5">
            {farm.specialty.slice(0, 2).map((tag, index) => (
              <motion.span
                key={tag}
                className="inline-block rounded-full bg-muted px-1.5 py-0.5 text-[9px] sm:px-2 sm:py-0.5 sm:text-xs text-muted-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
