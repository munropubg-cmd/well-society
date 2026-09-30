import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_EXPO } from '../../lib/motion';

export type SectionTheme = 'black' | 'blue' | 'cream' | 'sand';

export const SECTION_THEMES: Record<SectionTheme, { label: string; bg: string; light: boolean }> = {
  black: { label: 'True Black', bg: '#000000', light: false },
  blue: { label: 'Electric Blue', bg: '#253990', light: false },
  cream: { label: 'Cream', bg: '#FBF7F0', light: true },
  sand: { label: 'Sand Beige', bg: '#DDD3B9', light: true },
};

// Review-only: lets the client try background colours on a section. The choice is
// remembered per section in this browser.
export function useSectionTheme(key: string, fallback: SectionTheme) {
  const storageKey = `ws-theme:${key}`;
  const [theme, setTheme] = useState<SectionTheme>(() => {
    try {
      const saved = localStorage.getItem(storageKey) as SectionTheme | null;
      return saved && saved in SECTION_THEMES ? saved : fallback;
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      /* storage unavailable */
    }
  }, [storageKey, theme]);
  return [theme, setTheme] as const;
}

type Props = { section: string; visible: boolean; value: SectionTheme; onChange: (t: SectionTheme) => void };

// Swatch pill scoped to one section. Render it as the LAST child of the section: it is
// sticky inside the section, so it rides the bottom of the screen only while that section
// is on screen and can never appear over any other section.
export default function ThemeSwitcher({ section, visible, value, onChange }: Props) {
  return (
    <div className="pointer-events-none sticky bottom-0 z-30 h-0">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
            className="pointer-events-auto absolute bottom-5 left-5 flex items-center gap-3 rounded-full border border-white/15 bg-ink/80 py-2 pl-5 pr-2 shadow-2xl backdrop-blur-xl"
            role="radiogroup"
            aria-label={`${section} background`}
          >
            <span className="label text-[10px] text-white/60">
              <span className="text-gold">{section}</span> · Background
            </span>
          <div className="flex gap-1.5">
            {(Object.keys(SECTION_THEMES) as SectionTheme[]).map((key) => {
              const t = SECTION_THEMES[key];
              const active = key === value;
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={t.label}
                  title={t.label}
                  onClick={() => onChange(key)}
                  className={`grid h-9 w-9 place-items-center rounded-full transition-all duration-300 ${active ? 'ring-1 ring-white' : 'hover:ring-1 hover:ring-white/40'}`}
                >
                  <span className="h-6 w-6 rounded-full border border-white/25" style={{ backgroundColor: t.bg }} />
                </button>
              );
            })}
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
