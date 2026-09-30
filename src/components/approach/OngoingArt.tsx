import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';

// 03 · Ongoing care — one clock drives everything, so nothing can drift out of sync:
// a ring of light traces Plan → Check-in → Follow-up → Refine, each stop lights as it's
// reached, then the loop closes with a ripple and the plan version ticks up (v.01 → v.02…).
const C = { x: 165, y: 130 };
const R = 88;
const LOOP = 7; // seconds per cycle
const DRAW = 0.86; // share of the cycle spent tracing; the rest is the ripple/reset
const STOPS = [
  { label: 'PLAN', a: -90 },
  { label: 'CHECK-IN', a: 0 },
  { label: 'FOLLOW-UP', a: 90 },
  { label: 'REFINE', a: 180 },
].map((s, i) => {
  const rad = (s.a * Math.PI) / 180;
  return { ...s, i, x: C.x + R * Math.cos(rad), y: C.y + R * Math.sin(rad) };
});

// Full circle starting at the top, clockwise
const RING = `M ${C.x} ${C.y - R} A ${R} ${R} 0 1 1 ${C.x} ${C.y + R} A ${R} ${R} 0 1 1 ${C.x} ${C.y - R}`;
const LABEL = { fontSize: 10, letterSpacing: '0.2em', fontFamily: 'Barlow, DIN, sans-serif', fontWeight: 500 } as const;

export default function OngoingArt() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const clock = useMotionValue(0); // 0 → 1 per cycle
  const [version, setVersion] = useState(1);

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) clock.set(DRAW * 0.99);
      return;
    }
    const controls = animate(clock, [0, 1], { duration: LOOP, ease: 'linear', repeat: Infinity });
    return () => controls.stop();
  }, [inView, reduce, clock]);

  // Tick the plan version each time the loop wraps
  useMotionValueEvent(clock, 'change', (p) => {
    const prev = clock.getPrevious() ?? 0;
    if (p < prev) setVersion((v) => (v % 9) + 1);
  });

  const trace = useTransform(clock, [0, DRAW], [0, 1], { clamp: true });
  const ringOpacity = useTransform(clock, [0, 0.02, DRAW, 1], [0, 1, 1, 0]);
  const headX = useTransform(trace, (t) => C.x + R * Math.sin(t * Math.PI * 2));
  const headY = useTransform(trace, (t) => C.y - R * Math.cos(t * Math.PI * 2));
  const rippleR = useTransform(clock, [DRAW, 1], [R * 0.5, R * 1.25]);
  const rippleO = useTransform(clock, [DRAW, DRAW + 0.02, 1], [0, 0.6, 0]);

  return (
    <svg ref={ref} viewBox="0 0 330 260" className="h-full w-full overflow-visible" aria-hidden>
      {/* track */}
      <circle cx={C.x} cy={C.y} r={R} fill="none" stroke="var(--ap-line)" strokeWidth="1.2" />
      {/* traced light */}
      <motion.path d={RING} fill="none" stroke="var(--ap-pulse)" strokeWidth="2.4" strokeLinecap="round" style={{ pathLength: trace, opacity: ringOpacity }} />
      {/* loop-close ripple */}
      <motion.circle cx={C.x} cy={C.y} r={rippleR} fill="none" stroke="var(--ap-pulse)" strokeWidth="1.2" style={{ opacity: rippleO }} />

      {STOPS.map((s) => (
        <Stop key={s.label} stop={s} trace={trace} clock={clock} />
      ))}

      {/* travelling head */}
      <motion.g style={{ opacity: ringOpacity }}>
        <motion.circle cx={headX} cy={headY} r="9" fill="var(--ap-pulse)" opacity="0.25" />
        <motion.circle cx={headX} cy={headY} r="4.5" fill="var(--ap-pulse)" />
      </motion.g>

      {/* centre: the plan evolves */}
      <text x={C.x} y={C.y - 2} textAnchor="middle" fill="var(--ap-label)" style={{ fontFamily: '"Matiere Condensed","Instrument Serif",serif', fontSize: 22, fontStyle: 'italic' }}>
        evolving
      </text>
      <motion.text
        key={version}
        x={C.x}
        y={C.y + 20}
        textAnchor="middle"
        fill="var(--ap-pulse)"
        style={LABEL}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        PLAN V.0{version}
      </motion.text>
    </svg>
  );
}

function Stop({ stop, trace, clock }: { stop: (typeof STOPS)[number]; trace: MotionValue<number>; clock: MotionValue<number> }) {
  // Lit once the trace passes this stop; everything resets as the loop closes.
  const at = stop.i / 4;
  const lit = useTransform([trace, clock], ([t, c]: number[]) => (c < DRAW + 0.08 && t >= at - 0.001 && c > 0.005 ? 1 : 0));
  // Brief swell on arrival — animates the radius, not a transform, so the dot can't drift
  // off the ring (SVG transform origins are unreliable).
  const r = useTransform(trace, (t) => {
    const d = t - at;
    return d >= 0 && d < 0.06 ? 7 + 6 * (1 - d / 0.06) : 7;
  });
  const nodeOpacity = useTransform(lit, (l) => (l ? 1 : 0.35));
  const labelOpacity = useTransform(lit, (l) => (l ? 1 : 0.45));
  const lx = stop.x + (stop.a === 0 ? 16 : stop.a === 180 ? -16 : 0);
  const ly = stop.y + (stop.a === -90 ? -16 : stop.a === 90 ? 24 : 4);

  return (
    <g>
      <motion.circle
        cx={stop.x}
        cy={stop.y}
        r={r}
        fill="var(--ap-node)"
        stroke="var(--ap-pulse)"
        strokeWidth="1.5"
        style={{ opacity: nodeOpacity }}
      />
      <motion.text
        x={lx}
        y={ly}
        textAnchor={stop.a === 0 ? 'start' : stop.a === 180 ? 'end' : 'middle'}
        fill="var(--ap-label)"
        style={{ ...LABEL, opacity: labelOpacity }}
      >
        {stop.label}
      </motion.text>
    </g>
  );
}
