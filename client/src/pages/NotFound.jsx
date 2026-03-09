import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Flame } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet><title>Page Not Found — Amoda Candles</title></Helmet>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6 text-primary">
            <Flame size={56} strokeWidth={1.5} />
          </div>
          <p className="font-sans text-primary text-sm tracking-widest uppercase mb-3">404 — Page Not Found</p>
          <h1 className="font-serif text-4xl md:text-5xl text-text-dark mb-4 leading-tight">
            The flame went out
          </h1>
          <p className="font-sans text-secondary leading-relaxed mb-8 max-w-sm mx-auto">
            Looks like this page doesn't exist. It may have moved or been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary inline-block">Back to Home</Link>
            <Link to="/shop" className="btn-outline inline-block">Shop Candles</Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
