import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';

const faqs = [
  {
    category: 'Ordering',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Click "Buy Now" on any product page and choose to order via WhatsApp or Instagram DM. We\'ll confirm availability, share payment details, and arrange shipping — all within your DM conversation.',
      },
      {
        q: 'Do you accept online payments?',
        a: 'We accept UPI, bank transfer, and other digital payments — details are shared once you initiate an order via WhatsApp or Instagram.',
      },
      {
        q: 'Can I place a custom order?',
        a: 'Absolutely! We love custom orders — custom fragrance blends, gift sets, bulk wedding/event orders. Just reach out via WhatsApp or Instagram to discuss.',
      },
    ],
  },
  {
    category: 'Shipping',
    items: [
      {
        q: 'Where do you ship?',
        a: 'We currently ship pan-India. International shipping is available on request — message us to check feasibility and rates.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 4-7 business days. Express shipping (2-3 days) is available at an additional charge.',
      },
      {
        q: 'Is there a minimum order for free shipping?',
        a: 'Free shipping on orders above ₹999. A flat ₹80 shipping charge applies for orders below that.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 7 days for damaged or defective products. Since candles are a perishable product, we cannot accept returns due to fragrance preferences. Please read the scent descriptions carefully before ordering.',
      },
      {
        q: 'My candle arrived damaged. What do I do?',
        a: 'We\'re so sorry! Please send us photos via WhatsApp or Instagram within 48 hours of receiving the package and we\'ll arrange a replacement or refund promptly.',
      },
    ],
  },
  {
    category: 'Candle Care',
    items: [
      {
        q: 'How do I get the best burn from my candle?',
        a: 'Always trim your wick to 5mm before each burn. Allow the wax to melt all the way to the edges on the first burn (2-4 hours) to avoid tunnelling. Never burn for more than 4 hours at a time.',
      },
      {
        q: 'How long will my candle last?',
        a: 'Our candles are rated for 45-55 hours depending on the size. Burn time varies based on wick trimming, draft exposure, and burn duration per session.',
      },
      {
        q: 'Is soy wax better than paraffin?',
        a: 'Soy wax is natural, renewable, and burns cleaner with less soot. It also has a better scent throw and longer burn time compared to paraffin.',
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-accent last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="font-sans text-sm font-medium text-text-dark pr-4">{q}</span>
        <span
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center transition-transform duration-300 ${
            open ? 'rotate-45 bg-primary' : ''
          }`}
        >
          <svg
            className={`w-3 h-3 transition-colors ${open ? 'text-white' : 'text-primary'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="font-sans text-sm text-secondary leading-relaxed pb-4">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <>
      <Helmet>
        <title>FAQ — Amoda Candles</title>
        <meta name="description" content="Frequently asked questions about ordering, shipping, and candle care." />
      </Helmet>

      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subheading">Help Centre</p>
            <h1 className="section-heading">Frequently Asked Questions</h1>
          </div>

          <div className="space-y-10">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="font-sans text-xs tracking-widest uppercase text-primary mb-4">
                  {section.category}
                </h2>
                <div className="bg-white rounded-candle shadow-card px-6">
                  {section.items.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-accent/40 rounded-candle p-6 text-center">
            <p className="font-serif text-xl text-text-dark mb-2">Still have questions?</p>
            <p className="font-sans text-sm text-secondary mb-4">
              We're happy to help. Reach out directly.
            </p>
            <a href="/contact" className="btn-primary inline-block">Contact Us</a>
          </div>
        </div>
      </div>
    </>
  );
}
