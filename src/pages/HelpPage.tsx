import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Phone, Mail, MessageSquare } from 'lucide-react';
import SEO from '../components/SEO';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: 'Reservations',
    items: [
      {
        question: 'How do I book a table?',
        answer:
          "Go to the Reservations page, pick a date, choose a lunch (12:00–2:30 PM) or dinner (7:00–9:30 PM) slot, and enter your party size (up to 8 guests). You'll get a confirmation with a reference number once it's submitted.",
      },
      {
        question: 'Will I get a confirmation email?',
        answer:
          "Yes, if you provide an email address when booking. You'll always see a confirmation screen with your reference number regardless — save that in case you need to modify or cancel.",
      },
      {
        question: 'Can I book for a large group (9+ guests)?',
        answer:
          'The online form supports up to 8 guests per booking. For larger groups, please call us directly at +91 98765 43210 so we can arrange seating.',
      },
      {
        question: 'How do I change or cancel my reservation?',
        answer:
          "Call us at +91 98765 43210 with your reference number from the confirmation screen or email, and we'll update or cancel it for you.",
      },
    ],
  },
  {
    title: 'Ordering & Payment',
    items: [
      {
        question: 'How does online ordering work?',
        answer:
          'Browse the Menu page and tap "Add to Cart" on any dish. Open the cart from the icon in the navbar to review items, then "Proceed to Checkout" to enter your details and choose dine-in, takeaway, or delivery.',
      },
      {
        question: 'Why does checkout say "Demo Mode"?',
        answer:
          'Live payments are currently disabled on this site, so checkout runs as a demo — it walks through the full flow (order summary, confirmation, reference number) without charging a real card.',
      },
      {
        question: 'What forms of payment will be accepted?',
        answer:
          'Once enabled, payments are processed securely through Razorpay, supporting cards, UPI, and net banking.',
      },
      {
        question: 'How is the total calculated?',
        answer:
          'Your order total is the item subtotal plus 5% GST, plus a flat ₹50 delivery fee for delivery orders. Dine-in and takeaway orders have no delivery fee.',
      },
    ],
  },
  {
    title: 'Delivery & Pickup',
    items: [
      {
        question: 'Do you deliver?',
        answer:
          'Yes — select "Delivery" as your order type at checkout and provide your full address. Select "Takeaway" if you\'d rather collect your order in person.',
      },
      {
        question: 'How long will my order take?',
        answer:
          'Most orders are ready or delivered within 20–30 minutes of confirmation, shown step-by-step on your order confirmation page.',
      },
    ],
  },
  {
    title: 'General',
    items: [
      {
        question: 'What are your opening hours?',
        answer: "We're open every day: Lunch 12:00 PM – 3:00 PM, and Dinner 6:00 PM – 11:00 PM.",
      },
      {
        question: 'Where are you located?',
        answer:
          '456 Spice Avenue, Delhi, India 110001 — see the map and directions on our Contact page.',
      },
      {
        question: "I have a question that isn't answered here.",
        answer:
          "Reach out through the Contact page, call +91 98765 43210, or email contact@maharajarestaurant.in — we're happy to help.",
      },
    ],
  },
];

const FaqAccordionItem = ({
  item,
  isOpen,
  onToggle,
  panelId,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  panelId: string;
}) => (
  <div className="border-b border-gray-100 last:border-b-0">
    <h3>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-medium text-gray-800">{item.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#7A5C00] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
    </h3>
    <div id={panelId} role="region" hidden={!isOpen} className="pb-4 pr-8">
      <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
    </div>
  </div>
);

const HelpPage = () => {
  const [openKey, setOpenKey] = useState<string | null>(`${FAQ_CATEGORIES[0]!.title}-0`);

  const toggle = (key: string) => {
    setOpenKey((current) => (current === key ? null : key));
  };

  return (
    <>
      <SEO
        title="Help & FAQs"
        description="Answers to common questions about reservations, ordering, payment, and delivery at Maharaja Restaurant."
        canonicalPath="/help"
      />

      <div className="pt-20 min-h-screen bg-[#FFF8DC]">
        <div className="container-custom py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-3">Help &amp; FAQs</h1>
          <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
            Answers to common questions about reservations, ordering, and payment. Can't find what
            you need? Reach out below.
          </p>

          <div className="max-w-3xl mx-auto space-y-8">
            {FAQ_CATEGORIES.map((category) => (
              <section key={category.title} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#7A5C00] mb-2">{category.title}</h2>
                <div>
                  {category.items.map((item, i) => {
                    const key = `${category.title}-${i}`;
                    return (
                      <FaqAccordionItem
                        key={key}
                        item={item}
                        isOpen={openKey === key}
                        onToggle={() => toggle(key)}
                        panelId={`faq-panel-${key}`}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Still need help */}
          <div className="max-w-3xl mx-auto mt-8">
            <div className="bg-[#1A1000] rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-[#D4AF37] mb-2">Still need help?</h2>
              <p className="text-gray-300 text-sm mb-6">
                Our team is happy to answer anything not covered above.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-[#D4AF37] text-[#D4AF37] rounded-full text-sm font-semibold hover:bg-[#D4AF37] hover:text-[#1A1000] transition-all"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  +91 98765 43210
                </a>
                <a
                  href="mailto:contact@maharajarestaurant.in"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-[#D4AF37] text-[#D4AF37] rounded-full text-sm font-semibold hover:bg-[#D4AF37] hover:text-[#1A1000] transition-all"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  Email Us
                </a>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-[#1A1000] rounded-full text-sm font-semibold hover:bg-[#c9a227] transition-all"
                >
                  <MessageSquare className="w-4 h-4" aria-hidden="true" />
                  Contact Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpPage;
