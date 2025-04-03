import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            alt="Elegant restaurant interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="container-custom relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Experience Authentic Indian Cuisine</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">Embark on a culinary journey through the rich flavors and traditions of India.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/reservations" className="btn-primary">Reserve a Table</Link>
              <Link to="/menu" className="px-6 py-3 border-2 border-white rounded-full hover:bg-white hover:text-black transition-all duration-300">
                View Menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Star className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Award Winning</h3>
              <p className="text-gray-600">Recognized for excellence in Indian cuisine</p>
            </div>
            <div className="text-center p-6">
              <Clock className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Open Daily</h3>
              <p className="text-gray-600">Lunch 12-3pm | Dinner 6-11pm</p>
            </div>
            <div className="text-center p-6">
              <MapPin className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Prime Location</h3>
              <p className="text-gray-600">In the heart of the city</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-[#FFF8DC]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=936&q=80"
                alt="Chef preparing food"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Culinary Journey</h2>
              <p className="text-lg text-gray-700 mb-6">
                For over two decades, Maharaja has been serving authentic Indian cuisine, 
                bringing the rich flavors and traditions of India to your table. Our expert 
                chefs use time-honored recipes and the finest ingredients to create an 
                unforgettable dining experience.
              </p>
              <Link to="/about" className="btn-primary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;