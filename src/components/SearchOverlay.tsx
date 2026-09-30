import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_EXPO, EASE_INOUT } from '../lib/motion';

// Popular search chips from the brief; hrefs get pointed at real pages as they're built.
const CHIPS = [
  { label: 'Hormones', href: '#treatments' },
  { label: 'Longevity', href: '#treatments' },
  { label: 'Energy', href: '#treatments' },
  { label: 'Sexual Health', href: '#treatments' },
  { label: 'Skin', href: '#treatments' },
  { label: 'Hair', href: '#treatments' },
];

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 500);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[60]"
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          <motion.div
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="grain relative overflow-hidden border-b border-white/10 bg-ink-2"
            variants={{ hidden: { clipPath: 'inset(0 0 100% 0)' }, show: { clipPath: 'inset(0 0 0% 0)' } }}
            transition={{ duration: 0.75, ease: EASE_INOUT }}
          >
            <div className="container-site relative pb-14 pt-8 lg:pb-20">
              <div className="flex items-center justify-between">
                <span className="label text-[11px] text-gold">( Search )</span>
                <button onClick={onClose} className="label text-[11px] text-white/60 transition-colors hover:text-white">
                  Close — Esc
                </button>
              </div>
              <motion.form
                role="search"
                onSubmit={(e) => e.preventDefault()}
                className="mt-10 border-b border-white/20 focus-within:border-white lg:mt-14"
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.3 }}
              >
                <input
                  ref={inputRef}
                  type="search"
                  placeholder="What would you like to optimize?"
                  className="w-full bg-transparent pb-5 font-display text-[36px] text-white placeholder:text-white/30 focus:outline-none sm:text-[52px] lg:text-[72px]"
                />
              </motion.form>
              <motion.div
                className="mt-8 flex flex-wrap items-center gap-2.5"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                <span className="label mr-2 text-[10px] text-white/40">Popular</span>
                {CHIPS.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    onClick={onClose}
                    className="rounded-full border border-white/20 px-4 py-2 text-[14px] text-white/80 transition-all duration-300 hover:border-sand hover:bg-sand hover:text-ink"
                  >
                    {c.label}
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
