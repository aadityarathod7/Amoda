const SCENT_CATEGORIES = ['floral', 'woody', 'fruity', 'fresh', 'sweet', 'custom'];

export default function FilterSidebar({ filters, onChange, onReset }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className="bg-white rounded-candle shadow-card p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-text-dark">Filters</h3>
        <button
          onClick={onReset}
          className="font-sans text-xs text-primary hover:text-secondary transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Scent category */}
      <div>
        <p className="font-sans text-xs tracking-widest uppercase text-secondary/60 mb-3">
          Scent
        </p>
        <div className="flex flex-wrap gap-2">
          {SCENT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => set('category', filters.category === cat ? '' : cat)}
              className={`capitalize text-xs font-sans px-3 py-1.5 rounded-full border transition-all duration-150 ${
                filters.category === cat
                  ? 'bg-primary text-white border-primary'
                  : 'border-accent text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="font-sans text-xs tracking-widest uppercase text-secondary/60 mb-3">
          Price Range
        </p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={(e) => set('minPrice', e.target.value)}
            className="w-full border border-accent rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
          />
          <span className="text-accent font-sans">—</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={(e) => set('maxPrice', e.target.value)}
            className="w-full border border-accent rounded-lg px-3 py-2 text-sm font-sans focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="font-sans text-xs tracking-widest uppercase text-secondary/60 mb-3">
          Availability
        </p>
        <div className="space-y-2">
          {[
            { label: 'All', value: '' },
            { label: 'In Stock', value: 'true' },
            { label: 'Out of Stock', value: 'false' },
          ].map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="inStock"
                checked={filters.inStock === value}
                onChange={() => set('inStock', value)}
                className="accent-primary"
              />
              <span className="font-sans text-sm text-text-dark">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
