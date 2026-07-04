import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const RESTAURANT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Maharaja',
  description:
    'Award-winning authentic Indian fine dining restaurant serving traditional North and South Indian cuisine.',
  url: 'https://maharajaindiancuisine.com',
  telephone: '+91-98765-43210',
  email: 'contact@maharajaindiancuisine.com',
  image:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=webp&w=1200&h=630&fit=crop&q=80',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '456 Spice Avenue',
    addressLocality: 'Delhi',
    addressRegion: 'DL',
    postalCode: '110001',
    addressCountry: 'IN',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 28.6139, longitude: 77.209 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '12:00',
      closes: '15:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '18:00',
      closes: '23:00',
    },
  ],
  servesCuisine: ['Indian', 'North Indian', 'South Indian'],
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, UPI',
  hasMenu: 'https://maharajaindiancuisine.com/menu',
  acceptsReservations: true,
};

const HomePage = () => (
  <>
    <SEO
      title="Maharaja - Authentic Indian Fine Dining"
      description="Experience award-winning authentic Indian cuisine at Maharaja. Traditional North & South Indian dishes in an elegant setting. Reserve your table today."
      canonicalPath="/"
      ogImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=webp&w=1200&h=630&fit=crop&q=80"
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(RESTAURANT_JSONLD) }}
    />

    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <picture>
            <source
              srcSet="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=avif&w=2070&q=80"
              type="image/avif"
            />
            <source
              srcSet="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=webp&w=2070&q=80"
              type="image/webp"
            />
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&w=2070&q=80"
              alt="Elegant candlelit dining room with warm amber lighting at Maharaja Restaurant"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              width="2070"
              height="1380"
            />
          </picture>
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        </div>

        <div className="container-custom relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Experience Authentic Indian Cuisine
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Embark on a culinary journey through the rich flavors and traditions of India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/reservations" className="btn-primary">
                Reserve a Table
              </Link>
              <Link
                to="/menu"
                className="px-6 py-3 border-2 border-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                View Menu
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                Icon: Star,
                title: 'Award Winning',
                desc: 'Recognized for excellence in Indian cuisine',
              },
              { Icon: Clock, title: 'Open Daily', desc: 'Lunch 12–3pm | Dinner 6–11pm' },
              { Icon: MapPin, title: 'Prime Location', desc: 'In the heart of Delhi' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                {/* Icons on white: using accessible gold #7A5C00 (5.71:1) */}
                <Icon className="w-12 h-12 text-[#7A5C00] mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section-padding bg-[#FFF8DC]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <picture>
                <source
                  srcSet="https://images.unsplash.com/photo-1585937421612-70a008356fbe?fm=avif&w=936&q=80"
                  type="image/avif"
                />
                <source
                  srcSet="https://images.unsplash.com/photo-1585937421612-70a008356fbe?fm=webp&w=936&q=80"
                  type="image/webp"
                />
                <img
                  src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?fm=jpg&w=936&q=80"
                  alt="Maharaja head chef plating a traditional North Indian curry dish in the kitchen"
                  className="rounded-lg shadow-xl"
                  loading="lazy"
                  decoding="async"
                  width="936"
                  height="624"
                />
              </picture>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Culinary Journey</h2>
              <p className="text-lg text-gray-700 mb-6">
                For over two decades, Maharaja has been serving authentic Indian cuisine, bringing
                the rich flavors and traditions of India to your table. Our expert chefs use
                time-honored recipes and the finest ingredients to create an unforgettable dining
                experience.
              </p>
              <Link to="/menu" className="btn-primary">
                Explore Our Menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default HomePage;
