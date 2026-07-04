import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, Mail, Hash, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationState {
  orderId: string;
  paymentId: string;
  name: string;
  email: string | null;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  items: OrderItem[];
  subtotal: number;
  gst: number;
  deliveryFee: number;
  grandTotal: number;
  isDemo: boolean;
}

const ORDER_TYPE_LABELS: Record<string, string> = {
  'dine-in': 'Dine In 🍽️',
  takeaway: 'Takeaway 🛍️',
  delivery: 'Delivery 🛵',
};

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const state = location.state as OrderConfirmationState | null;

  useEffect(() => {
    if (!state?.orderId) {
      navigate('/menu', { replace: true });
      return;
    }
    headingRef.current?.focus();
  }, [state, navigate]);

  if (!state?.orderId) return null;

  const shortId = state.orderId.slice(-8).toUpperCase();

  return (
    <>
      <SEO
        title="Order Confirmed"
        description="Your food order at Maharaja Restaurant has been placed successfully."
        canonicalPath="/order/confirmation"
      />

      <div className="pt-20 min-h-screen bg-[#FFF8DC] py-12 px-4">
        <div className="max-w-xl mx-auto">
          {/* Success card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" aria-hidden="true" />
              </div>
            </div>

            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-3xl font-bold text-[#7A5C00] mb-2 focus:outline-none"
            >
              Order Placed!
            </h1>
            <p className="text-gray-500 text-sm">
              Thank you, {state.name}.{state.email ? ' A receipt has been sent to your email.' : ''}
            </p>

            {state.isDemo && (
              <div className="mt-4 inline-block bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full">
                🧪 Demo Order — no real payment was processed
              </div>
            )}

            {/* Order reference */}
            <div className="mt-6 bg-[#1A1000] rounded-xl p-5">
              <p className="text-[#c9a227] text-xs uppercase tracking-[3px] mb-1">
                Order Reference
              </p>
              <p className="text-[#D4AF37] font-mono text-2xl font-bold tracking-wider">
                {shortId}
              </p>
            </div>

            {/* Order details */}
            <div className="mt-6 grid grid-cols-2 gap-3 text-left">
              <div className="bg-[#FFF8DC] rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Order type</p>
                <p className="text-sm font-semibold">
                  {ORDER_TYPE_LABELS[state.orderType] ?? state.orderType}
                </p>
              </div>
              <div className="bg-[#FFF8DC] rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Items</p>
                <p className="text-sm font-semibold">
                  {state.items.reduce((s, i) => s + i.quantity, 0)} items
                </p>
              </div>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="font-bold text-base mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#7A5C00]" aria-hidden="true" />
              Your Order
            </h2>
            <ul className="divide-y divide-gray-50">
              {state.items.map((item, i) => (
                <li key={item.id ?? i} className="flex justify-between py-2.5 text-sm">
                  <span className="text-gray-700">
                    {item.name} <span className="text-gray-400">×{item.quantity}</span>
                  </span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            <div className="border-t mt-3 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{state.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>GST (5%)</span>
                <span>₹{state.gst}</span>
              </div>
              {state.deliveryFee > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Delivery fee</span>
                  <span>₹{state.deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total Paid</span>
                <span className="text-[#7A5C00]">₹{state.grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Email / what next */}
          {state.email && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-sm">Receipt sent to {state.email}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Check your inbox for the order confirmation with itemised bill.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order tracking flow */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="font-bold text-sm mb-4 flex items-center gap-2 text-[#7A5C00]">
              <Hash className="w-4 h-4" aria-hidden="true" />
              What happens next
            </h2>
            <ol className="space-y-3">
              {[
                { step: 'Order received by kitchen', time: 'Now' },
                { step: 'Preparation begins', time: '5–10 min' },
                {
                  step:
                    state.orderType === 'delivery'
                      ? 'Out for delivery'
                      : state.orderType === 'takeaway'
                        ? 'Ready for pickup'
                        : 'Served at your table',
                  time: '20–30 min',
                },
              ].map(({ step, time }, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#1A1000] text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-gray-700 flex-1">{step}</span>
                  <span className="text-xs text-gray-400 shrink-0">{time}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/menu"
              className="btn-primary flex-1 text-center flex items-center justify-center gap-2"
            >
              Order More
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to="/"
              className="flex-1 text-center px-6 py-3 border-2 border-[#D4AF37] text-[#7A5C00] rounded-full hover:bg-[#D4AF37] hover:text-[#1A1000] transition-all font-semibold"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
