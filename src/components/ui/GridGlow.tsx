import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

// V3 backdrop on Electric Blue: a large hairline grid where soft spotlights bloom at random
// places, brightening a patch of the line pattern, then fade out and reappear elsewhere.
const SPOTS = 4; // spotlights alive at once
const SWAP_MS = 1300; // one spot retires and a new one blooms this often

type Grid = { size: number; ox: number; oy: number; w: number; h: number };
type Spot = { id: number; x: number; y: number; r: number };

const LINES = (alpha: number) =>
  `linear-gradient(to right, rgba(255,255,255,${alpha}) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,${alpha}) 1px, transparent 1px)`;

export default function GridGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [grid, setGrid] = useState<Grid>({ size: 120, ox: 0, oy: 0, w: 0, h: 0 });
  const [spots, setSpots] = useState<Spot[]>([]);
  const uid = useRef(0);

  // Grid is centred; find where the first line falls on each axis.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      const size = width < 768 ? 72 : width < 1280 ? 100 : 120;
      setGrid({ size, ox: ((width / 2) % size) - size, oy: ((height / 2) % size) - size, w: width, h: height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!grid.w) return;
    const make = (): Spot => ({
      id: uid.current++,
      x: grid.w * (0.08 + Math.random() * 0.84),
      y: grid.h * (0.08 + Math.random() * 0.8),
      r: grid.size * (1.6 + Math.random() * 1.6),
    });
    setSpots(Array.from({ length: SPOTS }, make));
    if (reduce) return;
    const t = setInterval(() => setSpots((s) => [...s.slice(1), make()]), SWAP_MS);
    return () => clearInterval(t);
  }, [grid.w, grid.h, grid.size, reduce]);

  const { size, ox, oy } = grid;

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden bg-blue" aria-hidden>
      {/* Soft drifting light under the grid */}
      <div
        className="absolute left-1/2 top-[15%] h-[70vmax] w-[70vmax] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #5f7fe0 0%, rgba(95,127,224,0.3) 35%, transparent 65%)' }}
      />
      <div
        className="absolute -right-[20%] -top-[10%] h-[60vmax] w-[60vmax] rounded-full opacity-60 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #16235f 0%, transparent 62%)', animation: 'drift-b 28s ease-in-out infinite' }}
      />
      <div
        className="absolute -bottom-[25%] -left-[10%] h-[55vmax] w-[55vmax] rounded-full opacity-60 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #16235f 0%, transparent 62%)', animation: 'drift-a 30s ease-in-out infinite' }}
      />

      {/* Grid, faded towards the edges */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, #000 40%, transparent 100%)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: LINES(0.08), backgroundSize: `${size}px ${size}px`, backgroundPosition: `${ox}px ${oy}px` }}
        />

        {/* Spotlights: a brighter copy of the same grid, revealed through a soft circle */}
        <AnimatePresence>
          {spots.map((s) => {
            const left = s.x - s.r;
            const top = s.y - s.r;
            const mask = 'radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 35%, transparent 70%)';
            return (
              <motion.div
                key={s.id}
                className="absolute"
                style={{ left, top, width: s.r * 2, height: s.r * 2 }}
                // Opacity only — scaling would slide the bright lines off the grid
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
              >
                {/* glow wash */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(158,190,201,0.22) 0%, rgba(158,190,201,0.06) 40%, transparent 70%)' }}
                />
                {/* bright lines, aligned to the global grid */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: LINES(0.75),
                    backgroundSize: `${size}px ${size}px`,
                    backgroundPosition: `${ox - left}px ${oy - top}px`,
                    maskImage: mask,
                    WebkitMaskImage: mask,
                    filter: 'drop-shadow(0 0 3px rgba(158,190,201,0.9))',
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
