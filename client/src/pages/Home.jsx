import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { fetchFeaturedProducts } from '../utils/api';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeletons';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const testimonials = [
  { name: 'Priya S.', text: 'These candles transformed my apartment. The Sandalwood Serenity is my forever favourite.', rating: 5 },
  { name: 'Ananya R.', text: 'Beautifully packaged and the scent lasts for hours. Ordered twice already!', rating: 5 },
  { name: 'Meera K.', text: 'Rose Petal Bliss is exactly what I needed for my evening wind-down routine.', rating: 5 },
];

export default function Home() {
  const { heroTagline, instagramUsername } = useSettings();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    fetchFeaturedProducts()
      .then((r) => setFeatured(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((i) => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Helmet>
        <title>Amoda Candles — Handcrafted with Love</title>
        <meta name="description" content="Luxury handcrafted soy candles. Scented with soul, made with care." />
        <meta property="og:title" content="Amoda Candles" />
        <meta property="og:description" content={heroTagline} />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#2c1f14] via-[#3d2b1a] to-[#1a1008]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1602928298849-325cec8771cd?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1008]/80 via-transparent to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <motion.p
            className="font-sans text-primary text-sm tracking-widest uppercase mb-4"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Handcrafted Luxury
          </motion.p>
          <motion.h1
            className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Amoda
          </motion.h1>
          <motion.p
            className="font-sans text-accent/80 text-lg md:text-xl mb-10 leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            {heroTagline}
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Link
              to="/shop"
              className="inline-block bg-primary text-white font-sans font-medium px-8 py-4 rounded-candle
                         hover:bg-primary/90 transition-all duration-300
                         shadow-[0_0_30px_rgba(212,165,116,0.4)] hover:shadow-[0_0_50px_rgba(212,165,116,0.6)]"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-5 h-8 border-2 border-primary/50 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-primary/70 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Featured Collection */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="section-subheading">Our Bestsellers</p>
          <h2 className="section-heading">Featured Collection</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((p, i) => (
                <motion.div
                  key={p._id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/shop" className="btn-outline inline-block">
            View All Candles
          </Link>
        </div>
      </section>

      {/* About snippet */}
      <section className="bg-accent/30 py-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="section-subheading">Our Story</p>
            <h2 className="section-heading">Made with intention,<br />lit with love</h2>
            <p className="font-sans text-secondary leading-relaxed mt-4 mb-6">
              Amoda began in a small kitchen, with a love for fragrance and a desire to create
              something slow, intentional, and beautiful. Every candle is hand-poured in small
              batches using premium soy wax and carefully sourced fragrance oils.
            </p>
            <Link to="/about" className="btn-primary inline-block">
              Our Story
            </Link>
          </motion.div>
          <motion.div
            className="rounded-candle overflow-hidden shadow-warm aspect-square"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <img
              src="https://images.unsplash.com/photo-1603905042124-33d06c2e0c10?w=800&q=80"
              alt="Candle making process"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 max-w-3xl mx-auto text-center">
        <p className="section-subheading">What they say</p>
        <h2 className="section-heading mb-10">Customer Love</h2>
        <motion.div
          key={activeTestimonial}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-card p-8"
        >
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
              <span key={i} className="text-primary text-xl">★</span>
            ))}
          </div>
          <p className="font-serif text-xl text-text-dark italic leading-relaxed mb-6">
            "{testimonials[activeTestimonial].text}"
          </p>
          <p className="font-sans text-sm text-secondary font-medium">
            — {testimonials[activeTestimonial].name}
          </p>
        </motion.div>
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTestimonial(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === activeTestimonial ? 'bg-primary w-6' : 'bg-accent'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Instagram CTA */}
      {instagramUsername && (
        <section className="bg-text-dark py-16 px-4 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="section-subheading text-primary/70">Social</p>
            <h2 className="font-serif text-3xl text-white mb-4">Follow our journey</h2>
            <p className="font-sans text-accent/60 mb-8">
              Behind the scenes, new launches, and candle inspiration daily.
            </p>
            <a
              href={`https://instagram.com/${instagramUsername}`}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-sans font-medium px-8 py-3 rounded-candle hover:opacity-90 transition-opacity"
            >
              @{instagramUsername}
            </a>
          </motion.div>
        </section>
      )}
    </>
  );
}
