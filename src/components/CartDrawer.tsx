import { useEffect, useRef } from 'react';
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../lib/cart';

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCart();
  const navigate = useNavigate();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus close button when drawer opens; restore focus on close via closeCart caller
  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  // Trap Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[60] transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <aside
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold flex items-center gap-2 font-sans">
            <ShoppingCart className="w-5 h-5 text-[#7A5C00]" aria-hidden="true" />
            Your Cart
            {itemCount > 0 && (
              <span className="bg-[#D4AF37] text-[#1A1000] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={closeCart}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 px-6">
            <ShoppingCart className="w-14 h-14 opacity-20" aria-hidden="true" />
            <p className="text-sm font-medium">Your cart is empty</p>
            <button
              onClick={closeCart}
              className="text-sm text-[#7A5C00] underline underline-offset-2"
            >
              Continue browsing menu
            </button>
          </div>
        ) : (
          <>
            <ul
              className="flex-1 overflow-y-auto divide-y divide-gray-50 px-5"
              aria-label="Cart items"
            >
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="font-medium text-sm leading-snug pr-1">{item.name}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <p className="text-[#7A5C00] font-semibold text-sm mt-0.5">₹{item.price}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <Minus className="w-3 h-3" aria-hidden="true" />
                      </button>
                      <span className="text-sm font-medium w-5 text-center" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Plus className="w-3 h-3" aria-hidden="true" />
                      </button>
                      <span className="ml-auto text-sm font-semibold text-gray-700">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="border-t border-gray-100 p-5 space-y-4 bg-white">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Subtotal</span>
                <span className="font-bold text-lg text-[#7A5C00]">₹{total}</span>
              </div>
              <p className="text-xs text-gray-400">GST & delivery fees calculated at checkout</p>
              <button
                className="btn-primary w-full"
                onClick={() => {
                  closeCart();
                  navigate('/order/checkout');
                }}
              >
                Proceed to Checkout →
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
