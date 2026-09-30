import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import Logo from './ui/Logo';
import Button from './ui/Button';
import SearchOverlay from './SearchOverlay';
import { EASE_EXPO, EASE_INOUT } from '../lib/motion';

export const NAV = [
  { label: 'Treatments', href: '#treatments' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'About', href: '#about' },
  { label: 'Journal', href: '#journal' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Glass background once past the top; tuck away on scroll down, return on scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 200 && y > prev && !menuOpen);
  });

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: hidden ? '-100%' : 0, opacity: 1 }}
        transition={{ duration: hidden ? 0.5 : 0.9, ease: EASE_EXPO, delay: scrolled ? 0 : 0.4 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`absolute inset-0 border-b transition-all duration-700 ease-expo ${
            scrolled ? 'border-white/10 bg-ink/70 backdrop-blur-xl' : 'border-white/15 bg-transparent'
          }`}
        />
        <div className="container-site relative grid h-[76px] grid-cols-[1fr_auto] items-center lg:h-[84px] lg:grid-cols-[1fr_auto_1fr]">
          <Logo className="justify-self-start text-white" />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9 xl:gap-11">
              {NAV.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="group relative block py-2 text-[15px] text-white/85 transition-colors duration-300 hover:text-white">
                    {item.label}
                    <span className="absolute bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-11 w-11 place-items-center rounded-full text-white/85 transition-colors duration-300 hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 20 20" fill="none" className="h-[19px] w-[19px]" aria-hidden>
                <circle cx="9" cy="9" r="6.25" stroke="currentColor" strokeWidth="1.4" />
                <path d="m13.5 13.5 4 4" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
            <Button variant="light" href="#consult" className="hidden sm:inline-flex">
              Schedule a Consult
            </Button>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="relative grid h-11 w-11 place-items-center lg:hidden"
            >
              <span className={`absolute h-px w-6 bg-white transition-transform duration-500 ease-expo ${menuOpen ? 'rotate-45' : '-translate-y-[4px]'}`} />
              <span className={`absolute h-px w-6 bg-white transition-transform duration-500 ease-expo ${menuOpen ? '-rotate-45' : 'translate-y-[4px]'}`} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: EASE_INOUT }}
            className="grain fixed inset-0 z-40 overflow-hidden bg-ink-2 lg:hidden"
          >
            <div className="container-site flex h-full flex-col justify-between pb-10 pt-[110px]">
              <ul className="space-y-1">
                {NAV.map((item, i) => (
                  <li key={item.label} className="overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      initial={{ y: '110%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.25 + i * 0.06 }}
                      className="block font-display text-[52px] leading-[1.05] text-white sm:text-[64px]"
                    >
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.7 }}
              >
                <Button variant="primary" href="#consult" onClick={() => setMenuOpen(false)} className="w-full">
                  Schedule a Consult
                </Button>
                <p className="label mt-6 text-[10px] text-white/40">1820 Bay Rd, Miami Beach</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
