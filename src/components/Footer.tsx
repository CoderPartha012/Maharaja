import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          {/* Gold on gray-900 = 9.6:1 — passes AA */}
          <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Maharaja</h3>
          <p className="text-gray-400">
            Experience the finest Indian cuisine in an elegant setting.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {[
              { to: '/', label: 'Home' },
              { to: '/menu', label: 'Menu' },
              { to: '/reservations', label: 'Reservations' },
              { to: '/contact', label: 'Contact' },
              { to: '/help', label: 'Help & FAQs' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Contact</h4>
          <address className="not-italic space-y-1 text-gray-400 text-sm">
            <p>456 Spice Avenue</p>
            <p>Delhi, India 110001</p>
            <p>
              <a href="tel:+919876543210" className="hover:text-[#D4AF37] transition-colors">
                +91 98765 43210
              </a>
            </p>
            <p>
              <a
                href="mailto:contact@maharajaindiancuisine.com"
                className="hover:text-[#D4AF37] transition-colors"
              >
                contact@maharajaindiancuisine.com
              </a>
            </p>
          </address>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-[#D4AF37] transition-colors"
              aria-label="Follow Maharaja on Facebook"
            >
              <Facebook className="w-6 h-6" aria-hidden="true" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#D4AF37] transition-colors"
              aria-label="Follow Maharaja on Instagram"
            >
              <Instagram className="w-6 h-6" aria-hidden="true" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#D4AF37] transition-colors"
              aria-label="Follow Maharaja on Twitter"
            >
              <Twitter className="w-6 h-6" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Maharaja. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
