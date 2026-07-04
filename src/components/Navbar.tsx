import { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../lib/cart';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
  { to: '/help', label: 'Help' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const linkClass = (to: string) =>
    `text-gray-700 hover:text-[#7A5C00] transition-colors ${
      pathname === to ? 'font-semibold text-[#7A5C00]' : ''
    }`;

  return (
    <nav className="bg-white shadow-md fixed w-full z-50" aria-label="Main navigation">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#7A5C00]" aria-label="Maharaja — Home">
            Maharaja
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={linkClass(to)}
                aria-current={pathname === to ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}

            {/* Cart icon */}
            <button
              type="button"
              onClick={openCart}
              className="relative text-gray-700 hover:text-[#7A5C00] transition-colors p-1"
              aria-label={
                itemCount > 0
                  ? `Open cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`
                  : 'Open cart'
              }
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 bg-[#D4AF37] text-[#1A1000] text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center leading-none px-0.5"
                  aria-hidden="true"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <Link to="/reservations" className="btn-primary flex items-center gap-2">
              <Phone className="w-4 h-4" aria-hidden="true" />
              Book Now
            </Link>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={openCart}
              className="relative text-gray-700 hover:text-[#7A5C00] transition-colors p-2"
              aria-label={
                itemCount > 0
                  ? `Open cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`
                  : 'Open cart'
              }
            >
              <ShoppingCart className="w-5 h-5" aria-hidden="true" />
              {itemCount > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 bg-[#D4AF37] text-[#1A1000] text-[10px] font-bold rounded-full min-w-[16px] min-h-[16px] flex items-center justify-center leading-none px-0.5"
                  aria-hidden="true"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              ref={menuButtonRef}
              onClick={() => setIsOpen((o) => !o)}
              className="text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
          aria-hidden={!isOpen}
        >
          <div className="px-2 pt-2 pb-4 space-y-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`block px-3 py-2 rounded-md ${linkClass(to)} hover:bg-gray-50`}
                aria-current={pathname === to ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
            <Link to="/reservations" className="btn-primary w-full mt-3 text-center block">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
