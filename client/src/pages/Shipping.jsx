import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const Section = ({ title, children, icon: Icon }) => (
  <motion.div
    className="bg-white rounded-candle shadow-card p-6 mb-6"
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-primary/10 text-primary rounded-lg"><Icon size={20} /></div>
      <h2 className="font-serif text-xl text-text-dark">{title}</h2>
    </div>
    <div className="font-sans text-sm text-secondary leading-relaxed space-y-3">{children}</div>
  </motion.div>
);

export default function Shipping() {
  return (
    <>
      <Helmet>
        <title>Shipping & Policy — Amoda Candles</title>
        <meta name="description" content="Shipping, returns, and policy information for Amoda Candles." />
      </Helmet>

      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="section-subheading">Policies</p>
            <h1 className="section-heading">Shipping & Returns</h1>
            <p className="font-sans text-secondary">Everything you need to know about orders and delivery.</p>
          </div>

          <Section title="Shipping Information" icon={Truck}>
            <p><strong className="text-text-dark">Processing time:</strong> Orders are dispatched within 2–3 business days of payment confirmation.</p>
            <p><strong className="text-text-dark">Delivery time:</strong> Standard delivery takes 4–7 business days. Express (2–3 days) is available at an additional charge.</p>
            <p><strong className="text-text-dark">Coverage:</strong> We ship pan-India. International shipping is available on request — reach out via WhatsApp or Instagram to check feasibility and rates.</p>
            <p><strong className="text-text-dark">Free shipping:</strong> On all orders above ₹999. A flat ₹80 shipping charge applies below this amount.</p>
            <p><strong className="text-text-dark">Tracking:</strong> A tracking number will be shared via WhatsApp once your order is dispatched.</p>
          </Section>

          <Section title="Returns & Refunds" icon={RotateCcw}>
            <p><strong className="text-text-dark">Damaged products:</strong> If your candle arrives damaged, please send photos within 48 hours of receipt via WhatsApp or Instagram. We'll arrange a replacement or full refund promptly.</p>
            <p><strong className="text-text-dark">Fragrance preference:</strong> As candles are a personal fragrance product, we cannot accept returns due to scent preference. Please read all product descriptions carefully before ordering.</p>
            <p><strong className="text-text-dark">Return window:</strong> 7 days from the date of delivery for eligible returns.</p>
            <p><strong className="text-text-dark">Refund processing:</strong> Refunds are processed within 5–7 business days via the original payment method.</p>
          </Section>

          <Section title="How to Order" icon={Clock}>
            <p>We currently process orders through WhatsApp and Instagram DMs. Here's how it works:</p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Browse our shop and click "Buy Now" on your chosen candle.</li>
              <li>Choose WhatsApp or Instagram DM to place your order.</li>
              <li>We'll confirm availability and share payment details within a few hours.</li>
              <li>Once payment is received, we'll pack and dispatch within 2–3 business days.</li>
            </ol>
            <p><strong className="text-text-dark">Payment methods:</strong> UPI, bank transfer, and other digital payments accepted.</p>
          </Section>

          <Section title="Privacy & Data" icon={ShieldCheck}>
            <p>We collect only the information needed to process your order (name, contact, delivery address). This information is never shared with third parties.</p>
            <p>Order conversations on WhatsApp and Instagram are subject to those platforms' privacy policies.</p>
            <p>If you have any privacy concerns, please reach out to us directly.</p>
          </Section>

          <div className="bg-accent/40 rounded-candle p-6 text-center">
            <p className="font-serif text-xl text-text-dark mb-2">Still have questions?</p>
            <p className="font-sans text-sm text-secondary mb-4">We're always happy to help.</p>
            <div className="flex justify-center gap-3">
              <a href="/contact" className="btn-primary inline-block">Contact Us</a>
              <a href="/faq" className="btn-outline inline-block">View FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
