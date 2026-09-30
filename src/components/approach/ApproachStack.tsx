import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion';
import Button from '../ui/Button';
import ThemeSwitcher, { SECTION_THEMES, useSectionTheme } from '../ui/ThemeSwitcher';
import { APPROACH_THEME, ApproachHeader, PILLARS } from './shared';

// Our approach — sticky stacking scroll. The header stays put; card 1 peeks up from the
// bottom, then each card slides up and stacks over the one before it.
//   layout 'split'  → V2: wide cards, copy left / illustration right
//   layout 'column' → V3: the V1 card design (centred, stacked content)
const N = PILLARS.length;

type Props = { id: string; layout: 'split' | 'column'; label: string };

export default function ApproachStack({ id, layout, label }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '-30% 0px -30% 0px' });
  const [theme, setTheme] = useSectionTheme(id, 'black');
  const t = APPROACH_THEME[theme];
  const light = SECTION_THEMES[theme].light;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const ctaOpacity = useTransform(scrollYProgress, [0.82, 0.95], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.82, 0.95], [20, 0]);

  return (
    <section
      ref={ref}
      id={id}
      style={{ backgroundColor: SECTION_THEMES[theme].bg, height: `${(N + 1) * 100}svh`, ...t.vars }}
      className="relative flex flex-col transition-colors duration-700 ease-expo"
    >
      <div className="sticky top-0 flex h-[100svh] min-h-[700px] flex-col overflow-hidden pt-24 lg:pt-28">
        <div className="container-site">
          <ApproachHeader t={t} />
        </div>

        {/* Stack stage */}
        <div className="container-site relative mt-8 flex-1 lg:mt-12">
          {PILLARS.map((p, i) => (
            <StackCard key={p.n} i={i} progress={scrollYProgress} t={t} layout={layout}>
              {layout === 'split' ? (
                <div className="flex h-full flex-col gap-6 md:flex-row md:items-center md:gap-10">
                  <div className="md:w-[45%]">
                    <span className={`label text-[12px] ${t.eyebrow}`}>( {p.n} )</span>
                    <h3 className={`mt-4 font-display text-[clamp(38px,4vw,72px)] leading-[0.95] ${t.text}`}>{p.title}</h3>
                    <p className={`mt-4 text-[17px] ${t.muted}`}>{p.sub}</p>
                    {p.note && <p className={`mt-6 text-[13px] ${t.muted}`}>{p.note}</p>}
                  </div>
                  <div className="mx-auto h-[190px] w-full max-w-[360px] md:h-[260px] md:max-w-[420px] md:flex-1 xl:h-[300px]">{p.art()}</div>
                </div>
              ) : (
                <div className="flex h-full flex-col items-center text-center">
                  <span className={`label text-[12px] ${t.eyebrow}`}>( {p.n} )</span>
                  <h3 className={`mt-4 font-display text-[clamp(34px,3vw,52px)] leading-none ${t.text}`}>{p.title}</h3>
                  <p className={`mt-3 text-[16px] ${t.muted}`}>{p.sub}</p>
                  <div className="mt-auto h-[min(22vh,200px)] w-full max-w-[300px]">{p.art()}</div>
                  <p className={`mt-4 min-h-[18px] text-[13px] ${t.muted}`}>{p.note ?? ''}</p>
                </div>
              )}
            </StackCard>
          ))}
        </div>

        <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="container-site relative z-20 flex justify-center gap-3 pb-8 pt-4">
          <Button variant={theme === 'blue' ? 'light' : 'primary'} href="#start" className="sm:min-w-[200px]">
            Start now
          </Button>
          <Button variant={light ? 'outlineDark' : 'outline'} icon="down" href="#how-it-works" className="hidden sm:inline-flex sm:min-w-[200px]">
            How it works
          </Button>
        </motion.div>
      </div>

      {/* Spacer pushes the switcher to the section's end so its sticky range covers the
          whole pinned scroll, not just the first screen */}
      <div className="flex-1" />
      <ThemeSwitcher section={label} visible={inView} value={theme} onChange={setTheme} />
    </section>
  );
}

// Card i rises over its own slice of the scroll; earlier cards shrink and dim beneath it.
function StackCard({
  i,
  progress,
  t,
  layout,
  children,
}: {
  i: number;
  progress: MotionValue<number>;
  t: (typeof APPROACH_THEME)[keyof typeof APPROACH_THEME];
  layout: Props['layout'];
  children: React.ReactNode;
}) {
  const slice = 1 / (N + 0.4);
  const start = i * slice;
  const end = start + slice * 0.85;
  // Card 1 starts peeking (≈ 62% down); the others start fully below the stage. Each lands
  // a little lower than the last so the stacked edges show. (Same unit at both ends — framer
  // can't interpolate % ↔ px.)
  const y = useTransform(progress, [start - (i === 0 ? slice : 0), end], [i === 0 ? '62%' : '115%', `${i * 4}%`]);
  // Once the next card arrives, this one settles back.
  const nextStart = (i + 1) * slice;
  const scale = useTransform(progress, [nextStart, nextStart + slice * 0.85], [1, i < N - 1 ? 0.94 : 1]);
  const dim = useTransform(progress, [nextStart, nextStart + slice * 0.85], [0, i < N - 1 ? t.dim : 0]);

  const size =
    layout === 'split'
      ? 'h-[min(62vh,560px)] max-w-[1200px] p-7 sm:p-10 lg:p-14'
      : 'h-[min(52vh,480px)] max-w-[540px] px-6 pb-5 pt-8 sm:px-10';

  return (
    <motion.article
      // Opaque fill so stacked cards never show through each other; a soft, short shadow
      // just to separate the edges.
      style={{ y, scale, zIndex: i + 1, transformOrigin: '50% 0%', backgroundColor: t.solid }}
      className={`absolute inset-x-5 top-0 mx-auto overflow-hidden border shadow-[0_-6px_24px_-12px_rgba(0,0,0,0.25)] sm:inset-x-8 lg:inset-x-12 2xl:inset-x-[100px] ${size} ${t.border}`}
    >
      {children}
      <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />
    </motion.article>
  );
}
