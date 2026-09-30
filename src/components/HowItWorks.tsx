import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import Button from './ui/Button';
import { EASE_EXPO } from '../lib/motion';

// Background film per version; the still shows while it loads, the abstract layer if
// neither loads.
const VERSIONS = {
  v1: { id: 'how-it-works', video: '/media/how-bg.mp4', poster: '/media/how-bg-poster.webp' },
  v2: { id: 'how-it-works-v2', video: '/media/how-bg-2.mp4', poster: '/media/how-bg-2-poster.webp' },
};

type Props = {
  version: keyof typeof VERSIONS;
  // Colour of the section above; the top fade blends into it.
  fadeFrom: string;
};

const STEPS = [
  { n: '01', title: 'Tell us about you.', sub: 'Goals. Health. History.' },
  { n: '02', title: 'Meet your provider.', sub: 'Find what’s right for you.' },
  { n: '03', title: 'Start your treatment.', sub: 'Delivered to your door.*' },
];

// Scroll share given to each step as the section scrolls into view.
const SEG = 1 / STEPS.length;
const stepAt = (i: number) => (i === 0 ? 0.02 : i * SEG + SEG * 0.1);

// As the section scrolls into view each step fills with colour and the line to the next one
// fills in, like progressing through the real flow (no scroll pinning).
// Panel + CTA are sized in vh so the whole flow fits one screen (client request).
export default function HowItWorks({ version, fadeFrom }: Props) {
  const { id, video, poster } = VERSIONS[version];
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [bgReady, setBgReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [active, setActive] = useState(0); // steps filled so far (0–3)

  // No pinning: progress runs while the section scrolls up into view — 0 as its top enters
  // the lower part of the screen, 1 as it reaches the top — so the steps fill as you arrive.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'start 0.05'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  // Step i fills once scroll passes its threshold; the connector into it finishes filling
  // at the same point (see Connector ranges below).
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(STEPS.filter((_, i) => p >= stepAt(i)).length);
  });
  const allDone = active >= STEPS.length;

  return (
    <section ref={ref} id={id} className="relative bg-ink">
      <div className="relative flex h-[100svh] min-h-[680px] items-center justify-center overflow-hidden">
        {/* ---------- Background ---------- */}
        <motion.div style={reduce ? undefined : { scale: bgScale }} className="absolute inset-0">
          <div className="absolute inset-0 bg-[#0d1024]">
            <div
              className="absolute -left-[10%] top-[10%] h-[60vmax] w-[60vmax] rounded-full opacity-70 blur-[120px]"
              style={{ background: 'radial-gradient(circle, #253990 0%, transparent 65%)', animation: 'drift-a 22s ease-in-out infinite' }}
            />
            <div
              className="absolute -right-[10%] bottom-0 h-[55vmax] w-[55vmax] rounded-full opacity-50 blur-[120px]"
              style={{ background: 'radial-gradient(circle, #9EBEC9 0%, transparent 60%)', animation: 'drift-b 26s ease-in-out infinite' }}
            />
          </div>
          <img
            src={poster}
            alt=""
            onLoad={() => setBgReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${bgReady ? 'opacity-100' : 'opacity-0'}`}
          />
          <video
            src={video}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={(e) => {
              setVideoReady(true);
              e.currentTarget.play().catch(() => {});
            }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/50" />
        {/* Top fade: blends out of the previous section's colour */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px]" style={{ background: `linear-gradient(to bottom, ${fadeFrom}, transparent)` }} />
        <div className="grain pointer-events-none absolute inset-0 overflow-hidden" />

        {/* ---------- Panel ---------- */}
        <div className="relative z-10 flex w-full max-w-[600px] flex-col px-5">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 1.2, ease: EASE_EXPO }}
            // Light glass: a thin Electric Blue tint + gentle blur so the film reads through,
            // with a soft text shadow keeping the copy legible over bright frames.
            className="relative border border-white/25 bg-[rgba(37,57,144,0.22)] px-6 py-[clamp(28px,5vh,56px)] text-center backdrop-blur-[6px] [text-shadow:0_1px_18px_rgba(0,0,0,0.35)] sm:px-12"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent" />
            {/* Panel-edge progress rail */}
            <motion.div
              className="absolute left-0 top-0 h-full w-[2px] origin-top bg-gold"
              style={{ scaleY: scrollYProgress }}
            />

            <h2 className="relative font-display text-[clamp(40px,6vh,64px)] font-normal leading-none tracking-[-0.01em] text-white">
              How it <em className="italic text-sand">works.</em>
            </h2>

            <ol className="relative mt-[clamp(20px,4vh,44px)]">
              {STEPS.map((s, i) => {
                const on = active > i;
                return (
                  <li key={s.n}>
                    {i > 0 && <Connector progress={scrollYProgress} from={(i - 1) * SEG + SEG * 0.35} to={stepAt(i)} />}
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                      transition={{ duration: 1, ease: EASE_EXPO, delay: 0.2 + i * 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <span
                        className={`label border px-2.5 py-1 text-[11px] tracking-[0.14em] transition-all duration-700 ease-expo ${
                          on ? 'border-white bg-white text-ink shadow-[0_0_24px_rgba(255,255,255,0.35)]' : 'border-white/35 bg-transparent text-white/50'
                        }`}
                      >
                        {s.n}
                      </span>
                      <h3
                        className={`mt-[clamp(10px,1.6vh,16px)] font-display text-[clamp(28px,4vh,40px)] leading-none transition-colors duration-700 ease-expo ${
                          on ? 'text-white' : 'text-white/45'
                        }`}
                      >
                        {s.title}
                      </h3>
                      <p className={`mt-2 text-[15px] transition-colors duration-700 ${on ? 'text-white/85' : 'text-white/40'}`}>{s.sub}</p>
                    </motion.div>
                  </li>
                );
              })}
            </ol>
          </motion.div>

          <div className="mt-[clamp(14px,2.5vh,28px)] text-center">
            <Button
              variant={allDone ? 'primary' : 'light'}
              href="#start"
              className="w-full transition-colors duration-700"
            >
              Start now
            </Button>
            <p className="mt-3 text-[12px] text-white/55">*If prescribed.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Vertical line: a dim track that fills with light as you scroll, plus a looping pulse */
function Connector({ progress, from, to }: { progress: MotionValue<number>; from: number; to: number }) {
  const fill = useTransform(progress, [from, to], [0, 1]);
  return (
    <div className="relative mx-auto my-[clamp(12px,2.4vh,24px)] h-[clamp(28px,6vh,64px)] w-px overflow-hidden bg-white/15">
      <motion.div className="absolute inset-0 origin-top bg-white" style={{ scaleY: fill }} />
      <motion.div
        className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-white to-transparent"
        initial={{ y: '-100%' }}
        animate={{ y: '200%' }}
        transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6 }}
      />
    </div>
  );
}
