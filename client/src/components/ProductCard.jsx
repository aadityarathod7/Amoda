import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BuyNowModal from './BuyNowModal';

const scentColors = {
  floral: 'bg-pink-100 text-pink-700',
  woody: 'bg-amber-100 text-amber-800',
  fruity: 'bg-orange-100 text-orange-700',
  fresh: 'bg-teal-100 text-teal-700',
  sweet: 'bg-purple-100 text-purple-700',
  custom: 'bg-accent text-secondary',
};

export default function ProductCard({ product }) {
  const [modalOpen, setModalOpen] = useState(false);
  const isOutOfStock = product.stockQuantity === 0;

  return (
    <>
      <motion.div
        className="card group relative"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Image */}
        <Link to={`/products/${product._id}`} className="block overflow-hidden aspect-[4/5]">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? 'opacity-60' : ''
            }`}
          />
          {isOutOfStock && (
            <div className="absolute top-3 left-3 bg-text-dark text-white text-xs font-sans px-2 py-1 rounded-full">
              Out of Stock
            </div>
          )}
          {product.isFeatured && !isOutOfStock && (
            <div className="absolute top-3 left-3 bg-primary text-white text-xs font-sans px-2 py-1 rounded-full">
              Featured
            </div>
          )}
        </Link>

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

          <span
            className={`inline-block text-xs font-sans px-2 py-0.5 rounded-full mb-3 capitalize ${
              scentColors[product.scentCategory] || scentColors.custom
            }`}
          >
            {product.scentCategory}
          </span>

          <button
            onClick={() => !isOutOfStock && setModalOpen(true)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 rounded-candle text-sm font-sans font-medium transition-all duration-200 min-h-[44px] ${
              isOutOfStock
                ? 'bg-accent text-secondary/50 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
          </button>
        </div>
      </motion.div>

      <BuyNowModal
        product={product}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
