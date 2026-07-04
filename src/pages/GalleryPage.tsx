import { useState, useEffect } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import GallerySkeleton from '../components/skeletons/GallerySkeleton';

type GalleryCategory = 'interior' | 'dishes' | 'events';
type FilterCategory = 'all' | GalleryCategory;

interface GalleryImage {
  id: string;
  src: string;
  category: GalleryCategory;
  caption: string;
  width: number;
  height: number;
}

const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    category: 'interior',
    caption: 'Elegant candlelit main dining room with warm amber lighting',
    width: 2070,
    height: 1380,
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
    category: 'dishes',
    caption: "Maharaja's signature Butter Chicken served in a copper karahi",
    width: 936,
    height: 624,
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4',
    category: 'events',
    caption: 'Live classical music performance in the Maharaja banquet hall',
    width: 1749,
    height: 1166,
  },
];

const CATEGORIES: { value: FilterCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'interior', label: 'Interior' },
  { value: 'dishes', label: 'Dishes' },
  { value: 'events', label: 'Events' },
];

const GalleryPage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <GallerySkeleton />;

  const filteredImages =
    selectedCategory === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <>
      <SEO
        title="Gallery"
        description="Browse Maharaja's gallery — stunning interiors, signature dishes, and memorable events. Get a glimpse of your next dining experience."
        canonicalPath="/gallery"
        ogImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=webp&w=1200&h=630&fit=crop&q=80"
      />

      <div className="pt-20 min-h-screen bg-[#FFF8DC]">
        <div className="container-custom py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Experience Our Culinary Magic
          </h1>

          {/* Category Filter */}
          <div
            className="flex justify-center gap-4 mb-8"
            role="group"
            aria-label="Filter gallery by category"
          >
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSelectedCategory(value)}
                aria-pressed={selectedCategory === value}
                className={`px-6 py-2 rounded-full transition-all duration-300 focus:ring-2 focus:ring-[#7A5C00] focus:ring-offset-2 focus:outline-none ${
                  selectedCategory === value
                    ? 'bg-[#D4AF37] text-[#1A1000] font-semibold'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" layout>
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <Zoom
                  zoomMargin={20}
                  classDialog="custom-zoom"
                  a11yNameButtonUnzoom="Close zoomed image"
                >
                  <picture>
                    <source srcSet={`${image.src}?fm=avif&w=800&q=80`} type="image/avif" />
                    <source srcSet={`${image.src}?fm=webp&w=800&q=80`} type="image/webp" />
                    <img
                      src={`${image.src}?fm=jpg&w=800&q=80`}
                      alt={image.caption}
                      className="w-full h-64 object-cover cursor-zoom-in"
                      loading="lazy"
                      decoding="async"
                      width={image.width}
                      height={image.height}
                    />
                  </picture>
                </Zoom>
                <div className="p-4">
                  <p className="text-center text-gray-700 text-sm">{image.caption}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
