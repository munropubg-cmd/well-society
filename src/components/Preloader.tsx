import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useIntro } from '../lib/intro';
import { EASE_EXPO, EASE_INOUT } from '../lib/motion';

const LOGO = '/media/logo-light.png'; // 2000×330

// Frame ticks: small upright outlined bars (square corners, like the outlined buttons)
const TICK_W = 5;
const TICK_H = 16;
const TICK_GAP = 7;

// Timeline (s)
const FILL_START = 0.3;
const FILL_TOTAL = 1.5; // time for the fill to travel all the way round the frame
const SHEEN_START = FILL_START + FILL_TOTAL - 0.1;
const SHEEN_DURATION = 1.1;
const MIN_SHOW_MS = (SHEEN_START + SHEEN_DURATION + 0.2) * 1000; // ≈ 3s
const MAX_WAIT_MS = 6000; // never hold the page longer than this

// Black preloader: the logo sits inside a square-cornered frame built from small vertical
// bars — an outlined-button border made of ticks. The bars start as empty outlines and fill
// with white one after another, clockwise from the top-left, like a progress border. Then a
// sheen sweeps across the logo (as on the product vials) and the black lifts to the hero.
export default function Preloader() {
  const { setReady } = useIntro();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  // Hold until the page has loaded *and* the sequence has played (capped by MAX_WAIT_MS).
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';

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
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 1.1, ease: EASE_INOUT }}
          // Lenis ignores wheel/touch on this element, so the page can't scroll underneath
          data-lenis-prevent
          aria-label="Loading Well Society"
          role="status"
        >
          <motion.div exit={{ y: -60, opacity: 0 }} transition={{ duration: 0.9, ease: EASE_EXPO }} className="relative px-[clamp(28px,4vw,56px)] py-[clamp(26px,3.4vw,46px)]">
            <TickFrame reduce={!!reduce} />

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
              className="relative aspect-[2000/330] w-[clamp(200px,30vw,460px)]"
            >
              <img src={LOGO} alt="Well (Society)" className="absolute inset-0 h-full w-full" draggable={false} />
              {!reduce && (
                <>
                  {/* Sheen, clipped to the letterforms */}
                  <div
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                    style={{ WebkitMaskImage: `url(${LOGO})`, maskImage: `url(${LOGO})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' }}
                  >
                    <motion.div
                      className="absolute -inset-y-1/2 w-[35%]"
                      style={{
                        background:
                          'linear-gradient(100deg, transparent 0%, rgba(158,190,201,0) 15%, rgba(158,190,201,0.9) 42%, #ffffff 50%, rgba(243,189,37,0.6) 58%, transparent 85%)',
                        filter: 'blur(2px)',
                      }}
                      initial={{ x: '-120%', skewX: -18 }}
                      animate={{ x: '420%', skewX: -18 }}
                      transition={{ duration: SHEEN_DURATION, ease: [0.45, 0, 0.2, 1], delay: SHEEN_START }}
                    />
                  </div>
                  {/* soft glow that blooms with the sheen */}
                  <motion.div
                    className="pointer-events-none absolute -inset-x-[10%] -inset-y-[60%] -z-10 rounded-[50%] blur-3xl"
                    style={{ background: 'radial-gradient(ellipse, rgba(158,190,201,0.22), transparent 70%)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.4] }}
                    transition={{ duration: SHEEN_DURATION + 0.4, delay: SHEEN_START, times: [0, 0.5, 1] }}
                  />
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type Tick = { x: number; y: number };

/* The frame: bars laid along all four sides of the padded box, in clockwise order from the
   top-left so the fill travels round like a progress border. Counts adapt to the box size. */
function TickFrame({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ticks, setTicks] = useState<Tick[]>([]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const build = () => {
      const { width: W, height: H } = el.getBoundingClientRect();
      const along = (len: number, size: number) => Math.max(2, Math.floor((len + TICK_GAP) / (size + TICK_GAP)));
      // top & bottom rows span the full width
      const nx = along(W, TICK_W);
      const xs = Array.from({ length: nx }, (_, i) => (i * (W - TICK_W)) / (nx - 1));
      // side columns fill the space between the rows
      const innerTop = TICK_H + TICK_GAP;
      const innerLen = H - 2 * (TICK_H + TICK_GAP);
      const ny = Math.max(1, Math.floor((innerLen + TICK_GAP) / (TICK_H + TICK_GAP)));
      const step = ny > 1 ? (innerLen - TICK_H) / (ny - 1) : 0;
      const ys = Array.from({ length: ny }, (_, i) => innerTop + (ny > 1 ? i * step : (innerLen - TICK_H) / 2));

      setTicks([
        ...xs.map((x) => ({ x, y: 0 })), // top, left → right
        ...ys.map((y) => ({ x: W - TICK_W, y })), // right, top → bottom
        ...[...xs].reverse().map((x) => ({ x, y: H - TICK_H })), // bottom, right → left
        ...[...ys].reverse().map((y) => ({ x: 0, y })), // left, bottom → top
      ]);
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const stagger = ticks.length ? FILL_TOTAL / ticks.length : 0;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0" aria-hidden>
      {ticks.map((t, i) => (
        <motion.span
          key={i}
          className="absolute overflow-hidden border border-white/35"
          style={{ left: t.x, top: t.y, width: TICK_W, height: TICK_H }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05 + (i / ticks.length) * 0.25 }}
        >
          {/* white fill rising inside the outline */}
          <motion.span
            className="absolute inset-0 origin-bottom bg-white"
            initial={{ scaleY: reduce ? 1 : 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.35, ease: EASE_EXPO, delay: FILL_START + i * stagger }}
          />
        </motion.span>
      ))}
    </div>
  );
}
