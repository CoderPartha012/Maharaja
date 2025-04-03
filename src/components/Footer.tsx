import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-[#D4AF37] mb-4">Maharaja</h3>
            <p className="text-gray-400">
              Experience the finest Indian cuisine in an elegant setting.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" onClick={handleLinkClick} className="text-gray-400 hover:text-[#D4AF37]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" onClick={handleLinkClick} className="text-gray-400 hover:text-[#D4AF37]">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/reservations" onClick={handleLinkClick} className="text-gray-400 hover:text-[#D4AF37]">
                  Reservations
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={handleLinkClick} className="text-gray-400 hover:text-[#D4AF37]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Maharaja Indian Cuisine</li>
              <li>456 Spice Avenue</li>
              <li>Delhi, India 110001</li>
              <li>Phone: +91 98765 43210</li>
              <li>Email: contact@maharajaindiancuisine.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#D4AF37]">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37]">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4AF37]">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Maharaja. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;