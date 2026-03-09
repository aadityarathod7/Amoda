import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Flame, Clock } from 'lucide-react';
import BuyNowModal from './BuyNowModal';

const scentColors = {
  floral: 'bg-pink-100 text-pink-700',
  woody: 'bg-amber-100 text-amber-800',
  fruity: 'bg-orange-100 text-orange-700',
  fresh: 'bg-teal-100 text-teal-700',
  sweet: 'bg-purple-100 text-purple-700',
  custom: 'bg-accent text-secondary',
};

function isNew(createdAt) {
  const days = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24);
  return days < 30;
}

function TrendingIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function QuickViewModal({ product, onClose, onBuy }) {
  const isOutOfStock = product.stockQuantity === 0;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-text-dark/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative bg-background rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-secondary transition-colors"
          >
            <X size={16} />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="aspect-square sm:aspect-auto overflow-hidden">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex flex-col">
              <span className={`inline-block self-start text-xs font-sans px-2 py-0.5 rounded-full mb-3 capitalize ${scentColors[product.scentCategory] || scentColors.custom}`}>
                {product.scentCategory}
              </span>
              <h2 className="font-serif text-2xl text-text-dark mb-1">{product.name}</h2>
              <p className="font-sans text-2xl font-semibold text-secondary mb-3">₹{product.price}</p>
              <p className="font-sans text-sm text-secondary leading-relaxed mb-4 flex-1 line-clamp-4">
                {product.description}
              </p>
              <div className="space-y-1.5 mb-5 text-xs font-sans text-secondary/70">
                <div className="flex items-center gap-2"><Clock size={12} /> Burn time: {product.burnTime}</div>
                <div className="flex items-center gap-2"><Flame size={12} /> Wax: {product.waxType}</div>
                <div className="flex items-center gap-2"><Eye size={12} /> Weight: {product.weight}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { onBuy(); onClose(); }}
                  disabled={isOutOfStock}
                  className={`w-full py-2.5 rounded-candle text-sm font-sans font-medium transition-all min-h-[44px] ${
                    isOutOfStock ? 'bg-accent text-secondary/50 cursor-not-allowed' : 'btn-primary'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
                </button>
                <Link
                  to={`/products/${product._id}`}
                  onClick={onClose}
                  className="text-center font-sans text-xs text-primary hover:underline"
                >
                  View full details →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ProductCard({ product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const isOutOfStock = product.stockQuantity === 0;
  const isBestseller = (product.orderCount ?? 0) >= 5;
  const isNewProduct = product.createdAt && isNew(product.createdAt);

  return (
    <>
      <motion.div
        className="card group relative"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/5]">
          <Link to={`/products/${product._id}`}>
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                isOutOfStock ? 'opacity-60' : ''
              }`}
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {isOutOfStock && (
              <span className="bg-text-dark text-white text-xs font-sans px-2 py-1 rounded-full">Out of Stock</span>
            )}
            {!isOutOfStock && isBestseller && (
              <span className="bg-primary text-white text-xs font-sans px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingIcon /> Bestseller
              </span>
            )}
            {!isOutOfStock && !isBestseller && isNewProduct && (
              <span className="bg-primary text-white text-xs font-sans px-2 py-1 rounded-full">New</span>
            )}
            {!isOutOfStock && !isBestseller && !isNewProduct && product.isFeatured && (
              <span className="bg-primary text-white text-xs font-sans px-2 py-1 rounded-full">Featured</span>
            )}
          </div>

          {/* Quick View */}
          <button
            onClick={() => setQuickView(true)}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-text-dark text-xs font-sans px-4 py-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:bg-white flex items-center gap-1.5 whitespace-nowrap"
          >
            <Eye size={12} /> Quick View
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link to={`/products/${product._id}`}>
              <h3 className="font-serif text-lg text-text-dark leading-tight hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <span className="font-sans font-semibold text-secondary whitespace-nowrap">
              ₹{product.price}
            </span>
          </div>

          <span className={`inline-block text-xs font-sans px-2 py-0.5 rounded-full mb-3 capitalize ${scentColors[product.scentCategory] || scentColors.custom}`}>
            {product.scentCategory}
          </span>

          <button
            onClick={() => !isOutOfStock && setModalOpen(true)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 rounded-candle text-sm font-sans font-medium transition-all duration-200 min-h-[44px] ${
              isOutOfStock ? 'bg-accent text-secondary/50 cursor-not-allowed' : 'btn-primary'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
          </button>
        </div>
      </motion.div>

      {quickView && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickView(false)}
          onBuy={() => setModalOpen(true)}
        />
      )}

      <BuyNowModal product={product} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
