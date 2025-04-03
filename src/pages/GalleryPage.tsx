import React, { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { motion } from 'framer-motion';

interface GalleryImage {
  id: string;
  src: string;
  category: 'interior' | 'dishes' | 'events';
  caption: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    category: 'interior',
    caption: 'Elegant Main Dining Area'
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=936&q=80',
    category: 'dishes',
    caption: 'Signature Butter Chicken'
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1749&q=80',
    category: 'events',
    caption: 'Live Music Night'
  }
  // Add more images as needed
];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'interior' | 'dishes' | 'events'>('all');

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="pt-20 min-h-screen bg-[#FFF8DC]">
      <div className="container-custom py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Experience Our Culinary Magic</h1>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-8">
          {['all', 'interior', 'dishes', 'events'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as any)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[#D4AF37] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          {filteredImages.map((image) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <Zoom>
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-64 object-cover"
                />
              </Zoom>
              <div className="p-4">
                <p className="text-center text-gray-700">{image.caption}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GalleryPage;