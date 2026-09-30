import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from '../ui/Button';
import Reveal from '../ui/Reveal';
import ThemeSwitcher, { SECTION_THEMES, useSectionTheme } from '../ui/ThemeSwitcher';
import { APPROACH_THEME, ApproachHeader, PILLARS } from './shared';
import { EASE_EXPO } from '../../lib/motion';

// Our approach — V1: three pillar cards side by side (layout from the client's current site).
export default function ApproachGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '-30% 0px -30% 0px' });
  const [theme, setTheme] = useSectionTheme('approach-grid', 'black');
  const t = APPROACH_THEME[theme];
  const light = SECTION_THEMES[theme].light;

  return (
    <section
      ref={ref}
      id="approach"
      style={{ backgroundColor: SECTION_THEMES[theme].bg, ...t.vars }}
      className="relative py-24 transition-colors duration-700 ease-expo sm:py-28 lg:py-36"
    >
      <div className="container-site">
        <Reveal>
          <ApproachHeader t={t} />
        </Reveal>

        <div className="mt-16 grid gap-4 lg:mt-24 lg:grid-cols-3 lg:gap-5">
          {PILLARS.map((p, i) => (
            <motion.article
              key={p.n}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 1.2, ease: EASE_EXPO, delay: i * 0.12 }}
              className={`flex flex-col items-center border px-6 pb-8 pt-12 text-center transition-colors duration-700 sm:px-10 ${t.card} ${t.border}`}
            >
              <span className={`label text-[12px] ${t.eyebrow}`}>( {p.n} )</span>
              <h3 className={`mt-4 font-display text-[clamp(36px,3vw,52px)] leading-none ${t.text}`}>{p.title}</h3>
              <p className={`mt-4 text-[16px] ${t.muted}`}>{p.sub}</p>
              <div className="mt-10 h-[240px] w-full max-w-[340px] xl:h-[260px]">{p.art()}</div>
              <p className={`mt-6 min-h-[18px] text-[13px] ${t.muted}`}>{p.note ?? ''}</p>
            </motion.article>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-14 flex flex-col justify-center gap-3 sm:flex-row lg:mt-16">
          <Button variant={theme === 'blue' ? 'light' : 'primary'} href="#start" className="sm:min-w-[200px]">
            Start now
          </Button>
          <Button variant={light ? 'outlineDark' : 'outline'} icon="down" href="#how-it-works" className="sm:min-w-[200px]">
            How it works
          </Button>
        </Reveal>
      </div>

      <ThemeSwitcher section="Approach V1" visible={inView} value={theme} onChange={setTheme} />
    </section>
  );
}
