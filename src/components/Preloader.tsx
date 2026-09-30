import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { useIntro } from '../lib/intro';
import { EASE_EXPO, EASE_INOUT } from '../lib/motion';

const LOGO = '/media/logo-light.png'; // 2000×330

// Frame ticks: small upright outlined bars (square corners, like the outlined buttons)
const TICK_W = 3;
const TICK_H = 13;
const TICK_GAP = 8;

// Timeline (s)
const FILL_START = 0.5;
const FILL_TOTAL = 2.8; // one smooth pass all the way round the frame
const HOLD = 0.6; // a breath once the frame is complete, before lifting
const MIN_SHOW_MS = (FILL_START + FILL_TOTAL + HOLD) * 1000; // ≈ 3.9s
const MAX_WAIT_MS = 8000; // never hold the page longer than this
const EXIT_DURATION = 1.3;

// Black preloader: the logo sits inside a square-cornered frame built from small vertical
// bars — an outlined-button border made of ticks. A single eased progress value travels
// clockwise round the frame from the top-left: each bar brightens from outline to solid
// white as it passes, and the bars at the leading edge swell briefly, like a soft wave.
// The logo brightens with the same progress. Then the black lifts to the hero.
export default function Preloader() {
  const { setReady } = useIntro();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const progress = useMotionValue(0); // 0 → 1 round the frame

  // Drive the fill with one eased clock so every bar moves in step.
  useEffect(() => {
    if (reduce) {
      progress.set(1);
      return;
    }
    const controls = animate(progress, 1, { duration: FILL_TOTAL, delay: FILL_START, ease: [0.65, 0, 0.35, 1] });
    return () => controls.stop();
  }, [progress, reduce]);

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

  // Logo: dim at first, reaching full brightness as the frame completes
  const logoOpacity = useTransform(progress, [0, 1], [0.22, 1]);

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
          transition={{ duration: EXIT_DURATION, ease: EASE_INOUT }}
          // Lenis ignores wheel/touch on this element, so the page can't scroll underneath
          data-lenis-prevent
          aria-label="Loading Well Society"
          role="status"
        >
          <motion.div
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: EXIT_DURATION * 0.8, ease: EASE_EXPO }}
            className="relative px-[clamp(28px,4vw,56px)] py-[clamp(26px,3.4vw,46px)]"
          >
            <TickFrame progress={progress} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE_EXPO }}
              className="relative aspect-[2000/330] w-[clamp(200px,30vw,460px)]"
            >
              <motion.img
                src={LOGO}
                alt="Well (Society)"
                draggable={false}
                className="absolute inset-0 h-full w-full"
                style={{ opacity: logoOpacity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type Tick = { x: number; y: number };

/* The frame: bars laid along all four sides of the padded box, in clockwise order from the
   top-left. Counts adapt to the box size. */
function TickFrame({ progress }: { progress: MotionValue<number> }) {
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

  return (
    <motion.div
      ref={ref}
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE_EXPO }}
      aria-hidden
    >
      {ticks.map((t, i) => (
        <TickBar key={i} t={t} i={i} n={ticks.length} progress={progress} />
      ))}
    </motion.div>
  );
}

// Width of the soft leading edge, in bars
const EDGE = 4;

function TickBar({ t, i, n, progress }: { t: Tick; i: number; n: number; progress: MotionValue<number> }) {
  // Position of the travelling front relative to this bar (in bars; >0 once it has passed)
  const d = useTransform(progress, (p) => p * (n + EDGE) - i);
  // Brightness: eases from outline to solid white across the leading edge
  const fill = useTransform(d, (v) => {
    const x = Math.min(1, Math.max(0, v / EDGE));
    return x * x * (3 - 2 * x); // smoothstep
  });
  // Wave: bars right at the front swell briefly, then settle
  const scaleY = useTransform(d, (v) => 1 + 0.55 * Math.exp(-((v - EDGE * 0.5) ** 2) / 2.2));

  return (
    <motion.span
      className="absolute border-white/30"
      style={{ left: t.x, top: t.y, width: TICK_W, height: TICK_H, borderWidth: 0.75, borderStyle: 'solid', scaleY }}
    >
      <motion.span className="absolute inset-0 bg-white" style={{ opacity: fill }} />
    </motion.span>
  );
}
