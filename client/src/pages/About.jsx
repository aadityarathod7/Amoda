import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6 } }),
};

const whyItems = [
  { icon: '🌿', title: 'Eco-Friendly', desc: 'Made with 100% natural soy wax — clean-burning and sustainable.' },
  { icon: '✋', title: 'Handmade', desc: 'Every candle is hand-poured in small batches with love and attention.' },
  { icon: '💎', title: 'Premium Wax', desc: 'We use only food-grade soy wax for the purest, cleanest burn.' },
  { icon: '⏱️', title: 'Long Burn Time', desc: '45-55 hours of fragrance — more moments, more value.' },
];

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us — Amoda Candles</title>
        <meta name="description" content="The story behind Amoda — handcrafted soy candles made with love." />
      </Helmet>

      <div className="pt-24 pb-16">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="section-subheading">Our Story</p>
            <h1 className="font-serif text-4xl md:text-5xl text-text-dark mb-6 leading-tight">
              Born from a love of fragrance
            </h1>
            <p className="font-sans text-secondary leading-relaxed mb-4">
              Amoda started in a small kitchen in 2022, born from a simple desire: to create candles
              that felt like a warm hug at the end of a long day. What began as a hobby quickly became
              a passion project, and then a brand.
            </p>
            <p className="font-sans text-secondary leading-relaxed mb-6">
              Every fragrance we choose tells a story. Every pour is intentional. We believe that a
              candle isn't just decor — it's an experience, a ritual, a moment of pause in a busy world.
            </p>
            <Link to="/shop" className="btn-primary inline-block">Shop Now</Link>
          </motion.div>
          <motion.div
            className="rounded-candle overflow-hidden shadow-warm aspect-[4/5]"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <img
              src="https://images.unsplash.com/photo-1571781565036-d3f759be73e4?w=800&q=80"
              alt="Candle making"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </section>

        {/* Why our candles */}
        <section className="bg-accent/30 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="section-subheading">Why Amoda</p>
              <h2 className="section-heading">Crafted differently</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="bg-white rounded-candle p-6 text-center shadow-card"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="font-serif text-lg text-text-dark mb-2">{item.title}</h3>
                  <p className="font-sans text-sm text-secondary leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Behind the scenes */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <p className="section-subheading">Process</p>
            <h2 className="section-heading">Behind the scenes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80', label: 'Measuring fragrance oils' },
              { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', label: 'Hand-pouring in batches' },
              { img: 'https://images.unsplash.com/photo-1611072337226-1b8a4638f252?w=600&q=80', label: 'Quality checking each candle' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="rounded-candle overflow-hidden shadow-card relative group aspect-[4/5]"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <img
                  src={item.img}
                  alt={item.label}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-text-dark/60 to-transparent flex items-end p-4">
                  <p className="font-sans text-sm text-white">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
