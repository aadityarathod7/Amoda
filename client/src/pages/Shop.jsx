import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { fetchProducts } from '../utils/api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { ProductCardSkeleton } from '../components/Skeletons';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const DEFAULT_FILTERS = { category: '', minPrice: '', maxPrice: '', inStock: '' };

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Restore state from URL
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') || '',
  });
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [showFilters, setShowFilters] = useState(false);

  // Sync state → URL
  useEffect(() => {
    const params = {};
    if (search) params.q = search;
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.inStock) params.inStock = filters.inStock;
    if (sort !== 'newest') params.sort = sort;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [search, filters, sort, page]);

  const load = useCallback(() => {
    setLoading(true);
    fetchProducts({ ...filters, search, sort, page, limit: 9 })
      .then((r) => {
        setProducts(r.data.products);
        setTotal(r.data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters, search, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [filters, search, sort]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
  };

  const pages = Math.ceil(total / 9);

  return (
    <>
      <Helmet>
        <title>Shop All Candles — Amoda</title>
        <meta name="description" content="Browse our full collection of handcrafted soy candles." />
      </Helmet>

      <div className="pt-24 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <p className="section-subheading">Explore</p>
            <h1 className="section-heading">All Candles</h1>
            <p className="font-sans text-secondary text-sm">{total} products</p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/50" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or scent..."
                className="w-full pl-9 pr-10 py-2.5 border border-accent rounded-lg font-sans text-sm focus:outline-none focus:border-primary transition-colors"
              />
              {searchInput && (
                <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/50 hover:text-secondary">
                  <X size={14} />
                </button>
              )}
            </div>
          </form>

          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-2 text-sm font-sans text-secondary border border-accent rounded-lg px-4 py-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6" />
              </svg>
              Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm font-sans border border-accent rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {showFilters && (
            <div className="mb-4 md:hidden">
              <FilterSidebar
                filters={filters}
                onChange={(f) => { setFilters(f); setPage(1); }}
                onReset={() => { setFilters(DEFAULT_FILTERS); setPage(1); }}
              />
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden md:block w-60 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onChange={(f) => { setFilters(f); setPage(1); }}
                onReset={() => { setFilters(DEFAULT_FILTERS); setPage(1); }}
              />
            </aside>

            {/* Products */}
            <div className="flex-1">
              {/* Desktop sort */}
              <div className="hidden md:flex justify-end mb-5">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm font-sans border border-accent rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-serif text-2xl text-secondary mb-2">No candles found</p>
                  <p className="font-sans text-sm text-secondary/60">Try adjusting your filters or search</p>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </motion.div>
              )}

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-full text-sm font-sans transition-all ${
                        page === p
                          ? 'bg-primary text-white'
                          : 'border border-accent text-secondary hover:border-primary hover:text-primary'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
