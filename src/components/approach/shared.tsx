import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { SectionTheme } from '../ui/ThemeSwitcher';
import { EASE_EXPO } from '../../lib/motion';
import OngoingArt from './OngoingArt';

// ---------- Copy ----------
export const PILLARS: { n: string; title: string; sub: string; art: () => ReactNode; note?: string }[] = [
  { n: '01', title: 'The whole picture', sub: 'Goals. History. Labs.', art: () => <WholePictureArt />, note: '*Lab work only when your treatment requires it.' },
  { n: '02', title: 'Human expertise', sub: 'Care guided by your provider.', art: () => <ExpertiseArt /> },
  { n: '03', title: 'Ongoing care', sub: 'Your plan evolves with you.', art: () => <OngoingArt /> },
];

// ---------- Theme tokens (driven by the section background switcher) ----------
type Tokens = {
  text: string; // headings
  muted: string; // sub copy
  eyebrow: string;
  card: string;
  solid: string; // opaque equivalent of `card`, for stacked cards that overlap
  dim: number; // how far a stacked card darkens once covered
  border: string;
  vars: CSSProperties; // consumed by the illustrations
};

export const APPROACH_THEME: Record<SectionTheme, Tokens> = {
  black: {
    text: 'text-white',
    muted: 'text-white/65',
    eyebrow: 'text-gold',
    card: 'bg-white/[0.04]',
    solid: '#0b0b0b',
    dim: 0.4,
    border: 'border-white/10',
    vars: { '--ap-line': 'rgba(255,255,255,0.28)', '--ap-node': '#253990', '--ap-node-text': '#fff', '--ap-pulse': '#9EBEC9', '--ap-label': 'rgba(255,255,255,0.55)' } as CSSProperties,
  },
  blue: {
    text: 'text-white',
    muted: 'text-white/70',
    eyebrow: 'text-gold',
    card: 'bg-black/[0.18]',
    solid: '#1e2f76',
    dim: 0.35,
    border: 'border-white/15',
    vars: { '--ap-line': 'rgba(255,255,255,0.35)', '--ap-node': '#DDD3B9', '--ap-node-text': '#0B0908', '--ap-pulse': '#F3BD25', '--ap-label': 'rgba(255,255,255,0.65)' } as CSSProperties,
  },
  cream: {
    text: 'text-ink',
    muted: 'text-ink/60',
    eyebrow: 'text-blue',
    card: 'bg-white',
    solid: '#ffffff',
    dim: 0.06,
    border: 'border-ink/[0.08]',
    vars: { '--ap-line': 'rgba(11,9,8,0.22)', '--ap-node': '#253990', '--ap-node-text': '#fff', '--ap-pulse': '#253990', '--ap-label': 'rgba(11,9,8,0.5)' } as CSSProperties,
  },
  sand: {
    text: 'text-ink',
    muted: 'text-ink/65',
    eyebrow: 'text-walnut',
    card: 'bg-[#e8e0cb]',
    solid: '#e8e0cb',
    dim: 0.08,
    border: 'border-ink/10',
    vars: { '--ap-line': 'rgba(11,9,8,0.25)', '--ap-node': '#253990', '--ap-node-text': '#fff', '--ap-pulse': '#253990', '--ap-label': 'rgba(11,9,8,0.55)' } as CSSProperties,
  },
};

// Shared "draw in when visible" for strokes
const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
  transition: { duration: 1.4, ease: EASE_EXPO, delay },
});

const LABEL = { fill: 'var(--ap-label)', fontSize: 10, letterSpacing: '0.2em', fontFamily: 'Barlow, DIN, sans-serif', fontWeight: 500 } as const;

// ---------- 01 · The whole picture: History, Goals and Labs feed into "You" ----------
export function WholePictureArt() {
  const C = { x: 160, y: 130 };
  const sats = [
    { x: 40, y: 40, label: 'HISTORY', lx: 40, ly: 22 },
    { x: 290, y: 130, label: 'LABS*', lx: 290, ly: 158 },
    { x: 40, y: 220, label: 'GOALS', lx: 40, ly: 248 },
  ];
  return (
    <svg viewBox="0 0 330 260" className="h-full w-full overflow-visible" aria-hidden>
      {/* orbit ring, slowly turning */}
      <motion.circle
        cx={C.x} cy={C.y} r="72" fill="none" stroke="var(--ap-line)" strokeWidth="1" strokeDasharray="2 6"
        style={{ transformOrigin: `${C.x}px ${C.y}px` }}
        animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      {sats.map((s, i) => {
        const d = `M${s.x} ${s.y} L${C.x} ${C.y}`;
        return (
          <g key={s.label}>
            <motion.path d={d} stroke="var(--ap-line)" strokeWidth="1.2" fill="none" {...draw(0.2 + i * 0.2)} />
            {/* data pulse travelling into the centre */}
            <motion.circle
              r="3.5" fill="var(--ap-pulse)"
              initial={{ cx: s.x, cy: s.y, opacity: 0 }}
              animate={{ cx: [s.x, C.x], cy: [s.y, C.y], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 + i * 0.7, repeatDelay: 0.6 }}
            />
            <motion.circle
              cx={s.x} cy={s.y} r="7" fill="var(--ap-node)"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.1 + i * 0.2 }}
              style={{ transformOrigin: `${s.x}px ${s.y}px` }}
            />
            <text x={s.lx} y={s.ly} textAnchor="middle" style={LABEL}>{s.label}</text>
          </g>
        );
      })}
      {/* "You", breathing */}
      <motion.g
        style={{ transformOrigin: `${C.x}px ${C.y}px` }}
        animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx={C.x} cy={C.y} r="44" fill="var(--ap-node)" />
        <text x={C.x} y={C.y + 9} textAnchor="middle" fill="var(--ap-node-text)" style={{ fontFamily: '"Matiere Condensed","Instrument Serif",serif', fontSize: 28 }}>
          ( You )
        </text>
      </motion.g>
    </svg>
  );
}

// ---------- 02 · Human expertise: a provider reviews, recommends, supports ----------
export function ExpertiseArt() {
  const rows = ['REVIEW', 'RECOMMEND', 'SUPPORT'];
  const CYCLE = 4.8;
  return (
    <svg viewBox="0 0 330 260" className="h-full w-full overflow-visible" aria-hidden>
      {/* the lens */}
      <motion.path d="M52 24 Q 18 130 52 236" fill="none" stroke="var(--ap-line)" strokeWidth="1.4" {...draw(0.1)} />
      <motion.path d="M278 24 Q 312 130 278 236" fill="none" stroke="var(--ap-line)" strokeWidth="1.4" {...draw(0.1)} />
      {rows.map((label, i) => {
        const y = 70 + i * 60;
        return (
          <g key={label}>
            <motion.path d={`M80 ${y + 14} H250`} stroke="var(--ap-line)" strokeWidth="1" {...draw(0.3 + i * 0.15)} />
            <text x="80" y={y + 4} style={{ ...LABEL, fontSize: 12 }}>{label}</text>
            {/* check draws in turn, holds, clears — on a loop */}
            <motion.path
              d={`M232 ${y - 2} l6 6 l12 -12`}
              fill="none" stroke="var(--ap-pulse)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{ duration: CYCLE, times: [0, 0.15, 0.85, 1], repeat: Infinity, delay: 0.8 + i * 0.5 }}
            />
            {/* underline fills alongside the check */}
            <motion.path
              d={`M80 ${y + 14} H250`} stroke="var(--ap-node)" strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1, 0] }}
              transition={{ duration: CYCLE, times: [0, 0.2, 0.85, 1], repeat: Infinity, delay: 0.8 + i * 0.5 }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// ---------- Section header ----------
export function ApproachHeader({ t, center = true }: { t: Tokens; center?: boolean }) {
  return (
    <div className={center ? 'text-center' : ''}>
      <span className={`inline-flex items-center ${t.text}`}>
        <span className="font-display text-[22px] leading-none opacity-80">(</span>
        <span className={`label px-3 text-[11px] ${t.eyebrow}`}>Our approach</span>
        <span className="font-display text-[22px] leading-none opacity-80">)</span>
      </span>
      <h2 className={`mt-6 font-display text-[clamp(48px,6vw,112px)] font-normal leading-[0.92] tracking-[-0.015em] ${t.text}`}>
        Science, made <em className="italic">personal.</em>
      </h2>
    </div>
  );
}
