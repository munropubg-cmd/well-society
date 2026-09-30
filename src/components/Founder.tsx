import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import ThemedSection from './ui/ThemedSection';
import Eyebrow from './ui/Eyebrow';
import Reveal, { RevealLines } from './ui/Reveal';
import { EASE_EXPO } from '../lib/motion';

// Founder portrait + bio are pending from the client — drop the photo at
// /public/media/founder.webp and it replaces the abstract panel automatically.
const FOUNDER_IMAGE = '/media/founder.webp';

export default function Founder() {
  return (
    <ThemedSection id="about" label="Founder" defaultTheme="cream" className="py-24 sm:py-28 lg:py-40">
      {(tone) => (
        <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-28">
          <Portrait />

          <div className="max-w-[560px]">
            <Reveal>
              <Eyebrow className={tone.eyebrow}>Founder / Well Society</Eyebrow>
            </Reveal>
            <h2 className={`mt-8 font-display text-[clamp(56px,6vw,112px)] font-normal leading-[0.92] tracking-[-0.015em] ${tone.text}`}>
              <RevealLines lines={['A different', <em key="l" className={`italic ${tone.accent}`}>lens.</em>]} />
            </h2>
            <Reveal delay={0.15}>
              <div className={`mt-10 space-y-5 text-[17px] leading-relaxed lg:text-[18px] ${tone.muted}`}>
                <p>Founded by Sirin, WELL Society brings a considered perspective to the way we approach wellbeing.</p>
                <p>Our philosophy is simple: understand the person. Respect the science. Make room for what comes next.</p>
              </div>
            </Reveal>
            <Reveal delay={0.25}>
              <p className={`mt-12 font-display text-[56px] leading-none ${tone.text}`}>Sirin</p>
              <p className={`label mt-4 text-[11px] ${tone.muted}`}>Founder, Well Society</p>
            </Reveal>
          </div>
        </div>
      )}
    </ThemedSection>
  );
}

function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hasPhoto, setHasPhoto] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const innerY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  // The lens opens as the portrait passes through the viewport
  const open = useTransform(scrollYProgress, [0.15, 0.55], [60, 0]);
  const openR = useTransform(open, (v) => -v);

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: 'inset(12% 12% 12% 12%)', opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 1.6, ease: EASE_EXPO }}
      className="relative aspect-square overflow-hidden"
    >
      <motion.div style={reduce ? undefined : { y: innerY }} className="absolute -inset-[8%]">
        {/* warm abstract stand-in */}
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#d8c9a8_0%,#9a7550_45%,#512314_100%)]" />
        <div
          className="absolute left-[15%] top-[15%] h-[55%] w-[55%] rounded-full opacity-80 blur-[70px]"
          style={{ background: 'radial-gradient(circle, #efe4c9 0%, transparent 65%)', animation: 'drift-a 16s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[5%] right-[5%] h-[50%] w-[50%] rounded-full opacity-70 blur-[70px]"
          style={{ background: 'radial-gradient(circle, #3d170c 0%, transparent 65%)', animation: 'drift-b 20s ease-in-out infinite' }}
        />
        <img
          src={FOUNDER_IMAGE}
          alt="Sirin, founder of Well Society"
          onLoad={() => setHasPhoto(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${hasPhoto ? 'opacity-100' : 'opacity-0'}`}
        />
      </motion.div>
      <div className="grain pointer-events-none absolute inset-0 overflow-hidden" />

      {/* the lens */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 400 300" className="h-[42%] w-[64%] overflow-visible" aria-hidden>
          <motion.path d="M20 0 Q -10 150 20 300" fill="none" stroke="#fff" strokeWidth="2" style={reduce ? undefined : { x: open }} />
          <motion.path d="M380 0 Q 410 150 380 300" fill="none" stroke="#fff" strokeWidth="2" style={reduce ? undefined : { x: openR }} />
        </svg>
      </div>

      {!hasPhoto && (
        <span className="label absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[11px] text-white/85">Founder portrait: Sirin</span>
      )}
      <span className="label absolute bottom-6 left-6 text-[11px] text-white">A different lens.</span>
    </motion.div>
  );
}
