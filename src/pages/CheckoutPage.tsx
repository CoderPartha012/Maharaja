import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Lock, CreditCard, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import { useCart } from '../lib/cart';
import { supabase } from '../lib/supabase';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;
const IS_DEMO = !RAZORPAY_KEY;

const GST_RATE = 0.05;
const DELIVERY_FEE = 50;

const checkoutSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z
      .string()
      .min(10, 'Enter at least 10 digits')
      .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number'),
    email: z.string().email('Invalid email').or(z.literal('')).optional().default(''),
    orderType: z.enum(['dine-in', 'takeaway', 'delivery']),
    address: z.string().optional(),
    tableNumber: z.string().optional(),
  })
  .refine((d) => d.orderType !== 'delivery' || (d.address && d.address.trim().length > 5), {
    message: 'Delivery address is required',
    path: ['address'],
  });

type CheckoutFormData = z.infer<typeof checkoutSchema>;

function useRazorpayScript() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!RAZORPAY_KEY) return;
    if (document.getElementById('rzp-script')) {
      setLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'rzp-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, []);

  return loaded;
}

const ORDER_TYPES = [
  { value: 'dine-in', label: 'Dine In', icon: '🍽️' },
  { value: 'takeaway', label: 'Takeaway', icon: '🛍️' },
  { value: 'delivery', label: 'Delivery', icon: '🛵' },
] as const;

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-red-600 text-sm mt-1">{message}</p> : null;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const rzpLoaded = useRazorpayScript();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { orderType: 'dine-in' },
  });

  const orderType = watch('orderType');

  const gst = Math.round(total * GST_RATE);
  const deliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
  const grandTotal = total + gst + deliveryFee;

  useEffect(() => {
    if (items.length === 0) navigate('/menu', { replace: true });
  }, [items.length, navigate]);

  const handlePayment = async (formData: CheckoutFormData) => {
    setPayError(null);
    setIsProcessing(true);

    const orderSummary = items.map((i) => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    }));

    if (IS_DEMO) {
      await new Promise((r) => setTimeout(r, 1800));
      const demoId = 'DEMO_' + Math.random().toString(36).slice(2, 9).toUpperCase();
      clearCart();
      navigate('/order/confirmation', {
        state: {
          orderId: demoId,
          paymentId: demoId,
          name: formData.name,
          email: formData.email || null,
          orderType: formData.orderType,
          items: orderSummary,
          subtotal: total,
          gst,
          deliveryFee,
          grandTotal,
          isDemo: true,
        },
      });
      setIsProcessing(false);
      return;
    }

    try {
      const { data: orderData, error: orderErr } = await supabase.functions.invoke<{
        orderId: string;
        amount: number;
      }>('create-razorpay-order', { body: { amount: grandTotal * 100 } });

      if (orderErr || !orderData?.orderId) throw new Error('Could not create payment order');

      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY!,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Maharaja Restaurant',
        description: `${items.length} item${items.length !== 1 ? 's' : ''}`,
        order_id: orderData.orderId,
        prefill: {
          name: formData.name,
          email: formData.email || undefined,
          contact: formData.phone,
        },
        theme: { color: '#D4AF37' },
        handler: async (response) => {
          try {
            const { data: confirmed, error: confErr } = await supabase.functions.invoke<{
              id: string;
            }>('confirm-order', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                name: formData.name,
                phone: formData.phone,
                email: formData.email || null,
                orderType: formData.orderType,
                address: formData.address || null,
                items: orderSummary,
                grandTotal,
              },
            });

            if (confErr || !confirmed?.id) throw new Error('Verification failed');

            clearCart();
            navigate('/order/confirmation', {
              state: {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                name: formData.name,
                email: formData.email || null,
                orderType: formData.orderType,
                items: orderSummary,
                subtotal: total,
                gst,
                deliveryFee,
                grandTotal,
                isDemo: false,
              },
            });
          } catch {
            setPayError(
              'Payment received but confirmation failed. Contact us with payment ID: ' +
                response.razorpay_payment_id
            );
            setIsProcessing(false);
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      });

      rzp.open();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <>
      <SEO
        title="Checkout"
        description="Complete your food order at Maharaja Restaurant"
        canonicalPath="/order/checkout"
      />

      <div className="pt-20 min-h-screen bg-[#FFF8DC]">
        <div className="container-custom py-10">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-[#7A5C00] mb-6 text-sm hover:underline"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to menu
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* ── Form ── */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-2">Complete Your Order</h1>
                <p className="text-gray-500 text-sm mb-6">
                  Fill in your details to place the order
                </p>

                {/* Test card hint (real Razorpay test key) */}
                {!IS_DEMO && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" aria-hidden="true" />
                      Test Mode — Use these card details
                    </p>
                    <div className="text-xs text-blue-700 font-mono space-y-0.5">
                      <p>Card: 4111 1111 1111 1111</p>
                      <p>Expiry: Any future date &nbsp;·&nbsp; CVV: Any 3 digits</p>
                      <p>OTP: 1234</p>
                    </div>
                  </div>
                )}

                {payError && (
                  <div
                    className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                    role="alert"
                  >
                    {payError}
                  </div>
                )}

                <form onSubmit={handleSubmit(handlePayment)} className="space-y-6" noValidate>
                  {/* Contact details */}
                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Contact Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          autoComplete="name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                          {...register('name')}
                        />
                        <FieldError message={errors.name?.message} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone <span aria-hidden="true">*</span>
                        </label>
                        <input
                          type="tel"
                          autoComplete="tel"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                          {...register('phone')}
                        />
                        <FieldError message={errors.phone?.message} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email{' '}
                        <span className="text-gray-400 font-normal text-xs">
                          (receipt sent here)
                        </span>
                      </label>
                      <input
                        type="email"
                        autoComplete="email"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                        {...register('email')}
                      />
                      <FieldError message={errors.email?.message} />
                    </div>
                  </div>

                  {/* Order type */}
                  <div>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Order Type
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                      {ORDER_TYPES.map(({ value, label, icon }) => (
                        <label
                          key={value}
                          className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            orderType === value
                              ? 'border-[#D4AF37] bg-[#FFF8DC] shadow-sm'
                              : 'border-gray-200 hover:border-[#D4AF37]/50'
                          }`}
                        >
                          <input
                            type="radio"
                            value={value}
                            className="sr-only"
                            {...register('orderType')}
                          />
                          <span className="text-2xl" aria-hidden="true">
                            {icon}
                          </span>
                          <span className="text-xs font-semibold">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {orderType === 'dine-in' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Table Number{' '}
                        <span className="text-gray-400 font-normal text-xs">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Table 5"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                        {...register('tableNumber')}
                      />
                    </div>
                  )}

                  {orderType === 'delivery' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Address <span aria-hidden="true">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="House no., street, area, city — full address for delivery"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent resize-none"
                        {...register('address')}
                      />
                      <FieldError message={errors.address?.message} />
                    </div>
                  )}

                  {/* Pay button */}
                  {!IS_DEMO && !rzpLoaded && (
                    <p className="text-xs text-gray-400 text-center -mb-2 flex items-center justify-center gap-1.5">
                      <span
                        className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      Loading payment gateway…
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessing || (!IS_DEMO && !rzpLoaded)}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <span
                        className="w-4 h-4 border-2 border-[#1A1000]/30 border-t-[#1A1000] rounded-full animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Lock className="w-4 h-4" aria-hidden="true" />
                    )}
                    {isProcessing
                      ? 'Processing…'
                      : IS_DEMO
                        ? 'Simulate Payment (Demo)'
                        : `Pay ₹${grandTotal} Securely`}
                  </button>

                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    Payments secured by Razorpay · 256-bit SSL encryption
                  </p>
                </form>
              </div>
            </div>

            {/* ── Order summary ── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                <ul
                  className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1"
                  aria-label="Items in order"
                >
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug">{item.name}</p>
                        <p className="text-xs text-gray-400">×{item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">
                        ₹{item.price * item.quantity}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-4 space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (5%)</span>
                    <span>₹{gst}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery fee</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2.5 border-t">
                    <span>Total</span>
                    <span className="text-[#7A5C00] text-lg">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Payment flow diagram */}
                <div className="mt-6 p-4 bg-[#FFF8DC] rounded-xl">
                  <p className="text-xs font-semibold text-[#7A5C00] mb-3 uppercase tracking-wide">
                    Payment Flow
                  </p>
                  <div className="space-y-2">
                    {[
                      { step: '1', label: 'Place Order' },
                      { step: '2', label: 'Razorpay Checkout Opens' },
                      { step: '3', label: 'Secure Payment' },
                      { step: '4', label: 'Order Confirmed + Email' },
                    ].map(({ step, label }) => (
                      <div key={step} className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#1A1000] text-xs font-bold flex items-center justify-center shrink-0">
                          {step}
                        </span>
                        <span className="text-xs text-gray-600">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
