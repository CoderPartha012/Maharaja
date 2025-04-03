import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#D4AF37]">Maharaja</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#D4AF37] transition-colors">Home</Link>
            <Link to="/menu" className="text-gray-700 hover:text-[#D4AF37] transition-colors">Menu</Link>
            <Link to="/reservations" className="text-gray-700 hover:text-[#D4AF37] transition-colors">Reservations</Link>
            <Link to="/gallery" className="text-gray-700 hover:text-[#D4AF37] transition-colors">Gallery</Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#D4AF37] transition-colors">Contact</Link>
            <Link to="/reservations" className="btn-primary flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-[#D4AF37]">Home</Link>
              <Link to="/menu" className="block px-3 py-2 text-gray-700 hover:text-[#D4AF37]">Menu</Link>
              <Link to="/reservations" className="block px-3 py-2 text-gray-700 hover:text-[#D4AF37]">Reservations</Link>
              <Link to="/gallery" className="block px-3 py-2 text-gray-700 hover:text-[#D4AF37]">Gallery</Link>
              <Link to="/contact" className="block px-3 py-2 text-gray-700 hover:text-[#D4AF37]">Contact</Link>
              <Link to="/reservations" className="btn-primary w-full mt-4">Book Now</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;