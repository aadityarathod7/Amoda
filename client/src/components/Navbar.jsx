import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Only use transparent/white style on home page when not scrolled
  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    // Reset scroll state on route change
    setScrolled(window.scrollY > 40);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent py-5'
          : 'bg-background/95 backdrop-blur-sm shadow-card py-3'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/src/public/amodalogo.png"
            alt="Amoda"
            className={`h-10 w-auto object-contain transition-all duration-300 ${
              transparent ? 'brightness-0 invert' : ''
            }`}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `font-sans text-sm tracking-wide transition-colors duration-200 ${
                  isActive
                    ? 'text-primary font-medium'
                    : transparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-text-dark hover:text-primary'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Hamburger */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${
            transparent ? 'hover:bg-white/10' : 'hover:bg-accent'
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span
              className={`block h-0.5 transition-all duration-300 ${
                transparent ? 'bg-white' : 'bg-text-dark'
              } ${open ? 'rotate-45 translate-y-1.5' : ''}`}
            />
            <span
              className={`block h-0.5 transition-all duration-300 ${
                transparent ? 'bg-white' : 'bg-text-dark'
              } ${open ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 transition-all duration-300 ${
                transparent ? 'bg-white' : 'bg-text-dark'
              } ${open ? '-rotate-45 -translate-y-1.5' : ''}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-accent overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `py-3 px-3 rounded-lg font-sans text-sm transition-colors duration-200 ${
                      isActive
                        ? 'bg-accent text-secondary font-medium'
                        : 'text-text-dark hover:bg-accent/50'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
