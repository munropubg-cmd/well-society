import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useIntro } from '../lib/intro';
import { EASE_EXPO, EASE_INOUT } from '../lib/motion';

const LOGO = '/media/logo-light.png'; // 2000×330
const LINES_PER_SIDE = 7; // 3 on phones

// Timeline (s)
const FILL_START = 0.25;
const FILL_DURATION = 0.9;
const FILL_STAGGER = 0.085;
const SHEEN_START = FILL_START + (LINES_PER_SIDE - 1) * FILL_STAGGER + FILL_DURATION * 0.55;
const SHEEN_DURATION = 1.1;
const MIN_SHOW_MS = (SHEEN_START + SHEEN_DURATION + 0.15) * 1000; // ≈ 2.4s
const MAX_WAIT_MS = 6000; // never hold the page longer than this

// Black preloader: the logo sits centred between rows of vertical hairlines. The lines fill
// with white from the outside in (left ones downward, right ones upward), a sheen sweeps
// across the logo like the product vials, then the black lifts away to reveal the hero.
export default function Preloader() {
  const { setReady } = useIntro();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  // Hold until the page has loaded *and* the sequence has played (capped by MAX_WAIT_MS).
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const html = document.documentElement;
    html.style.overflow = 'hidden';

    const minMs = reduce ? 600 : MIN_SHOW_MS;
    const start = performance.now();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, minMs - (performance.now() - start));
      setTimeout(() => {
        setVisible(false); // curtain starts lifting…
        setReady(true); // …and the hero/header entrance starts with it
      }, wait);
    };
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish, { once: true });
    const cap = setTimeout(finish, MAX_WAIT_MS);

    return () => {
      clearTimeout(cap);
      window.removeEventListener('load', finish);
    };
  }, [reduce, setReady]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.style.overflow = '';
      }}
    >
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] overflow-hidden bg-black"
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.1, ease: EASE_INOUT }}
          // Lenis ignores wheel/touch on this element, so the page can't scroll underneath
          data-lenis-prevent
          aria-label="Loading Well Society"
          role="status"
        >
          <motion.div
            className="flex h-full items-stretch"
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE_EXPO }}
          >
            <LineGroup side="left" reduce={!!reduce} />

            {/* Logo */}
            <div className="relative mx-[4vw] flex shrink-0 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE_EXPO }}
                className="relative aspect-[2000/330] w-[clamp(200px,34vw,520px)]"
              >
                <img src={LOGO} alt="Well (Society)" className="absolute inset-0 h-full w-full" draggable={false} />
                {/* Sheen, clipped to the letterforms */}
                {!reduce && (
                  <div
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    style={{
                      WebkitMaskImage: `url(${LOGO})`,
                      maskImage: `url(${LOGO})`,
                      WebkitMaskSize: '100% 100%',
                      maskSize: '100% 100%',
                    }}
                  >
                    <motion.div
                      className="absolute -inset-y-1/2 w-[35%]"
                      style={{
                        background:
                          'linear-gradient(100deg, transparent 0%, rgba(158,190,201,0.0) 15%, rgba(158,190,201,0.9) 42%, #ffffff 50%, rgba(243,189,37,0.6) 58%, transparent 85%)',
                        filter: 'blur(2px)',
                      }}
                      initial={{ x: '-120%', skewX: -18 }}
                      animate={{ x: '420%', skewX: -18 }}
                      transition={{ duration: SHEEN_DURATION, ease: [0.45, 0, 0.2, 1], delay: SHEEN_START }}
                    />
                  </div>
                )}
                {/* soft glow that blooms with the sheen */}
                {!reduce && (
                  <motion.div
                    className="pointer-events-none absolute -inset-x-[10%] -inset-y-[60%] -z-10 rounded-[50%] blur-3xl"
                    style={{ background: 'radial-gradient(ellipse, rgba(158,190,201,0.22), transparent 70%)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.4] }}
                    transition={{ duration: SHEEN_DURATION + 0.4, delay: SHEEN_START, times: [0, 0.5, 1] }}
                  />
                )}
              </motion.div>
            </div>

            <LineGroup side="right" reduce={!!reduce} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* A row of full-height hairlines; each fills with white in turn, outermost first. */
function LineGroup({ side, reduce }: { side: 'left' | 'right'; reduce: boolean }) {
  return (
    <div className="flex flex-1 justify-evenly">
      {Array.from({ length: LINES_PER_SIDE }).map((_, i) => {
        // distance from the screen edge: 0 = outermost
        const fromEdge = side === 'left' ? i : LINES_PER_SIDE - 1 - i;
        // on phones keep only the 3 lines nearest the logo
        const phoneHidden = fromEdge < LINES_PER_SIDE - 3 ? 'hidden sm:block' : '';
        return (
          <div key={i} className={`relative h-full w-px bg-white/[0.09] ${phoneHidden}`}>
            <motion.div
              className={`absolute inset-0 bg-white ${side === 'left' ? 'origin-top' : 'origin-bottom'}`}
              initial={{ scaleY: reduce ? 1 : 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: FILL_DURATION, ease: EASE_EXPO, delay: FILL_START + fromEdge * FILL_STAGGER }}
            />
          </div>
        );
      })}
    </div>
  );
}
