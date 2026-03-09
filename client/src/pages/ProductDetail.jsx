import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { fetchProductById, fetchProducts } from '../utils/api';
import BuyNowModal from '../components/BuyNowModal';
import ProductCard from '../components/ProductCard';
import { ProductDetailSkeleton } from '../components/Skeletons';

const Detail = ({ label, value }) => (
  <div className="flex gap-4 py-3 border-b border-accent last:border-0">
    <span className="font-sans text-sm text-secondary/60 w-28 flex-shrink-0">{label}</span>
    <span className="font-sans text-sm text-text-dark capitalize">{value}</span>
  </div>
);

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetchProductById(id)
      .then((r) => {
        setProduct(r.data);
        setActiveImage(0);
        return fetchProducts({ category: r.data.scentCategory, limit: 4 });
      })
      .then((r) => setRelated(r.data.products.filter((p) => p._id !== id)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <p className="font-serif text-2xl text-secondary mb-4">Product not found</p>
        <Link to="/shop" className="btn-primary inline-block">Back to Shop</Link>
      </div>
    </div>
  );

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <>
      <Helmet>
        <title>{product.name} — Amoda Candles</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.name} — Amoda`} />
        <meta property="og:image" content={product.images[0]} />
      </Helmet>

      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="font-sans text-sm text-secondary/60 mb-8 flex gap-2">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-text-dark">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            {/* Gallery */}
            <div>
              <motion.div
                className="aspect-square rounded-candle overflow-hidden shadow-warm mb-4 relative cursor-zoom-in group"
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setZoomOpen(true)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setZoomPos({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100,
                  });
                }}
              >
                <img
                  ref={imgRef}
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-text-dark/60 text-white text-xs font-sans px-2 py-1 rounded-full backdrop-blur-sm">Click to zoom</span>
                </div>
              </motion.div>

              {/* Zoom lightbox */}
              {zoomOpen && (
                <div
                  className="fixed inset-0 z-50 bg-text-dark/90 flex items-center justify-center p-4 cursor-zoom-out"
                  onClick={() => setZoomOpen(false)}
                >
                  <button
                    onClick={() => setZoomOpen(false)}
                    className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 rounded-full p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <img
                    src={product.images[activeImage]}
                    alt={product.name}
                    className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === i ? 'border-primary' : 'border-accent hover:border-secondary'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <span className="inline-block font-sans text-xs text-secondary bg-accent px-3 py-1 rounded-full capitalize mb-3">
                {product.scentCategory}
              </span>
              <h1 className="font-serif text-4xl text-text-dark mb-3">{product.name}</h1>
              <p className="font-sans text-3xl font-semibold text-secondary mb-6">
                ₹{product.price}
              </p>
              <p className="font-sans text-secondary leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Details */}
              <div className="mb-8">
                <Detail label="Burn Time" value={product.burnTime} />
                <Detail label="Wax Type" value={product.waxType} />
                <Detail label="Weight" value={product.weight} />
                <Detail
                  label="Availability"
                  value={isOutOfStock ? 'Out of Stock' : `In Stock (${product.stockQuantity})`}
                />
              </div>

              {/* Desktop Buy button */}
              <button
                onClick={() => !isOutOfStock && setModalOpen(true)}
                disabled={isOutOfStock}
                className={`hidden md:block w-full py-4 rounded-candle font-sans font-medium text-base transition-all min-h-[44px] ${
                  isOutOfStock
                    ? 'bg-accent text-secondary/50 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
              </button>

              <p className="font-sans text-xs text-secondary/50 mt-3 text-center">
                Order via WhatsApp or Instagram DM · No payment online
              </p>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div>
              <p className="section-subheading">More like this</p>
              <h2 className="section-heading mb-8">Related Candles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.slice(0, 3).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky Buy Now bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-accent z-40">
        <button
          onClick={() => !isOutOfStock && setModalOpen(true)}
          disabled={isOutOfStock}
          className={`w-full py-3.5 rounded-candle font-sans font-medium text-base min-h-[44px] ${
            isOutOfStock ? 'bg-accent text-secondary/50 cursor-not-allowed' : 'btn-primary'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : `Buy Now · ₹${product.price}`}
        </button>
      </div>

      <BuyNowModal product={product} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
