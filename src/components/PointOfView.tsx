import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { EASE_EXPO } from '../lib/motion';

// Our point of view — sticky scroll: "We don't do ( … )" cycles through the words as you
// scroll. Based on the client's reference, rebuilt in the brand system; the parentheses
// "refocus" (the Brandbook's evolving lens) each time the word changes.
const WORDS = ['guesswork', 'quick fixes', 'uniform care', 'clichés', 'shortcuts', 'generic plans'];

export default function PointOfView() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(Math.min(WORDS.length - 1, Math.max(0, Math.round(p * (WORDS.length - 1)))));
  });
  const rail = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={ref} id="point-of-view" className="relative h-[480svh] bg-blue">
      <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden text-white">
        {/* soft depth in brand blues */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #3a55c4 0%, transparent 65%)' }}
          />
          <div
            className="absolute -bottom-1/4 -right-1/4 h-[55vmax] w-[55vmax] rounded-full opacity-60 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #16235f 0%, transparent 62%)', animation: 'drift-b 26s ease-in-out infinite' }}
          />
        </div>

        {/* Eyebrow, on the site grid */}
        <div className="container-site relative pt-24 lg:pt-28">
          <span className="inline-flex items-center text-gold">
            <span className="font-display text-[24px] leading-none">(</span>
            <span className="label px-3 text-[12px]">Our point of view</span>
            <span className="font-display text-[24px] leading-none">)</span>
          </span>
        </div>

        {/* Stage */}
        <div className="absolute inset-0 flex items-center justify-center px-5">
          <div className="flex flex-col items-center gap-6 font-display text-[clamp(52px,7.4vw,142px)] leading-none lg:flex-row lg:gap-0">
            <span className="whitespace-nowrap lg:pr-[0.35em]">We don’t do</span>
            <div className="flex items-center">
              <Paren side="left" k={active} />
              <div className="relative h-[1.1em] w-[min(78vw,5.2em)] overflow-hidden lg:w-[5.4em] lg:overflow-visible">
                {WORDS.map((w, i) => {
                  const d = i - active;
                  return (
                    <motion.span
                      key={w}
                      className="absolute inset-0 flex items-center justify-center whitespace-nowrap italic"
                      initial={false}
                      animate={{
                        y: `${Math.max(-2, Math.min(2, d)) * 105}%`,
                        opacity: d === 0 ? 1 : Math.abs(d) === 1 ? 0.16 : 0,
                        filter: d === 0 ? 'blur(0px)' : 'blur(2px)',
                      }}
                      transition={{ duration: 0.8, ease: EASE_EXPO }}
                      style={{ color: d === 0 ? '#DDD3B9' : '#fff' }}
                    >
                      {w}
                    </motion.span>
                  );
                })}
              </div>
              <Paren side="right" k={active} />
            </div>
          </div>
        </div>

        {/* Statement + counter */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-site relative flex flex-col items-center pb-16 lg:pb-20">
            <p className="max-w-[760px] text-center text-[16px] leading-relaxed text-white/85 lg:text-[19px]">
              Personalized, provider-led care built around your goals, health information, and biology.
            </p>
            <span className="label absolute bottom-6 right-5 text-[12px] text-gold sm:right-8 lg:bottom-[82px] lg:right-12 2xl:right-[100px]">
              {String(active + 1).padStart(2, '0')} / {String(WORDS.length).padStart(2, '0')}
            </span>
          </div>
          {/* scroll rail */}
          <div className="h-px w-full bg-white/15">
            <motion.div className="h-full bg-gold" style={{ width: rail }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Parenthesis that pulls in and eases back out on every word change */
function Paren({ side, k }: { side: 'left' | 'right'; k: number }) {
  const dir = side === 'left' ? 1 : -1;
  return (
    <motion.span
      key={`${side}-${k}`}
      className="inline-block font-light text-white/80"
      initial={{ x: dir * 18, scaleY: 1.08 }}
      animate={{ x: 0, scaleY: 1 }}
      transition={{ duration: 0.9, ease: EASE_EXPO }}
    >
      {side === 'left' ? '(' : ')'}
    </motion.span>
  );
}
