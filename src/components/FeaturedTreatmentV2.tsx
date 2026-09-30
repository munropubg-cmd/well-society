import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Button from './ui/Button';
import ArrowButton from './ui/ArrowButton';
import Reveal, { RevealLines } from './ui/Reveal';
import Vial from './ui/Vial';
import BraidModel from './ui/BraidModel';
import GridGlow from './ui/GridGlow';
import { SHOWCASE } from '../data/treatments';
import { useCarousel } from '../lib/useCarousel';
import { EASE_EXPO } from '../lib/motion';
import { CARE_BG, CARE_BG_BOTTOM, CARE_OVERLAY } from './FeaturedTreatment';

const BRAND_BLUE = '#253990';

type Props = {
  id: string;
  // 'image' = V2: photo background + Electric Blue wash. 'brand' = V3: solid Electric Blue
  // with the animated glowing grid.
  background: 'image' | 'brand';
};

// Featured treatment V2/V3: title, model centred, glass vial-card carousel over her lower
// half (inspired by the Hers hair page).
export default function FeaturedTreatmentV2({ id, background }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { viewportRef, trackRef, index, go, maxIndex, x, progress } = useCarousel();
  const base = background === 'image' ? CARE_BG_BOTTOM : BRAND_BLUE;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const modelY = useTransform(scrollYProgress, [0, 1], ['8%', '-4%']);

  return (
    <section ref={ref} id={id} className="relative overflow-hidden" style={{ backgroundColor: base }}>
      {background === 'image' ? (
        <>
          <motion.img
            src={CARE_BG}
            alt=""
            style={reduce ? undefined : { scale: bgScale }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0" style={{ backgroundColor: CARE_OVERLAY }} />
        </>
      ) : (
        <GridGlow />
      )}

      {/* Title above her head */}
      <div className="container-site relative z-20 pt-16 text-center lg:pt-20">
        <Reveal>
          <span className="inline-flex items-center text-white">
            <span className="font-display text-[22px] leading-none">(</span>
            <span className="label px-3 text-[11px] text-gold">Our treatments</span>
            <span className="font-display text-[22px] leading-none">)</span>
          </span>
        </Reveal>
        <h2 className="mt-6 font-display text-[clamp(48px,5.4vw,104px)] font-normal leading-[0.92] tracking-[-0.015em] text-white">
          <RevealLines lines={[<>Prescribed with <em className="italic text-sand">care</em></>]} />
        </h2>
      </div>

      {/* Model, centred */}
      <motion.div style={reduce ? undefined : { y: modelY }} className="relative z-0 -mt-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.6, ease: EASE_EXPO }}
        >
          <BraidModel className="h-[520px] sm:h-[620px] lg:h-[720px] 2xl:h-[800px]" />
        </motion.div>
      </motion.div>

      {/* 400px bottom fade — under the cards (z-10 vs z-20) so they stay crisp */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[400px]"
        style={{ background: `linear-gradient(to bottom, transparent, ${base})` }}
      />

      {/* Vial card carousel, overlapping her lower half */}
      <div className="container-site relative z-20 -mt-[220px] pb-24 sm:-mt-[260px] lg:-mt-[290px] lg:pb-32">
        <div ref={viewportRef} className="overflow-hidden">
          <motion.div
            ref={trackRef}
            className="flex gap-3"
            style={{ touchAction: 'pan-y' }}
            animate={{ x }}
            transition={{ duration: 1, ease: EASE_EXPO }}
            onPanEnd={(_, info) => {
              if (info.offset.x < -50) go(1);
              else if (info.offset.x > 50) go(-1);
            }}
          >
            {SHOWCASE.map((t, i) => (
              <VialCard key={t.name} t={t} i={i} />
            ))}
          </motion.div>
        </div>

        <div className="mt-8 flex items-center gap-6">
          <div className="relative h-px flex-1 bg-white/20">
            <motion.div
              className="absolute inset-y-0 left-0 bg-white"
              animate={{ width: `${Math.max(progress, 0.06) * 100}%` }}
              transition={{ duration: 1, ease: EASE_EXPO }}
            />
          </div>
          <div className="flex gap-2">
            <ArrowButton dir={-1} disabled={index === 0} onClick={() => go(-1)} label="Previous treatments" />
            <ArrowButton dir={1} disabled={index >= maxIndex} onClick={() => go(1)} label="Next treatments" />
          </div>
        </div>
        <p className="mt-6 text-center text-[12px] text-white/55">
          Compounded medications are not FDA-approved. Hormone therapy requires lab testing. All treatments are prescribed only after review by a licensed provider.
        </p>
      </div>
    </section>
  );
}

function VialCard({ t, i }: { t: (typeof SHOWCASE)[number]; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -5% 0px' }}
      transition={{ duration: 1.1, ease: EASE_EXPO, delay: Math.min(i, 4) * 0.07 }}
      // Electric Blue frosted glass
      className="group relative flex h-[500px] w-[84vw] shrink-0 flex-col overflow-hidden bg-[rgba(37,57,144,0.45)] p-7 shadow-[0_30px_60px_-30px_rgba(10,20,70,0.6)] backdrop-blur-2xl sm:w-[400px] xl:w-[440px] xl:p-8 2xl:w-[480px]"
    >
      {/* Top sheen for the glass */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.12] to-transparent" />
      {/* Soft pool of light behind the vial, brightening on hover */}
      <div
        className="pointer-events-none absolute left-1/2 top-[50%] h-[60%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[60px] transition-opacity duration-700 group-hover:opacity-55"
        style={{ background: `radial-gradient(circle, ${t.tint} 0%, transparent 65%)` }}
      />
      {/* Hairline frame that lights up on hover */}
      <div className="pointer-events-none absolute inset-0 border border-white/25 transition-colors duration-500 group-hover:border-white/55" />

      <h3 className="relative font-display text-[40px] leading-none text-white xl:text-[44px]">{t.name}</h3>
      <span className="label relative mt-3 inline-flex items-center text-[11px] text-gold">
        <span className="font-display text-[18px] font-light leading-none text-white/70">(</span>
        <span className="px-2">{t.category}</span>
        <span className="font-display text-[18px] font-light leading-none text-white/70">)</span>
      </span>

      <div className="relative flex flex-1 items-center justify-center py-4">
        {/* Appear: rises, straightens and scales in when the card comes into view */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotate: -14, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.4, ease: EASE_EXPO, delay: 0.25 + Math.min(i, 4) * 0.1 }}
        >
          {/* Loop: float, sway and sheen (offset per card); hover lifts, cursor tilts */}
          <div className="transition-transform duration-700 ease-expo group-hover:-translate-y-3 group-hover:scale-105">
            <Vial src={t.image} interactive delay={i * 0.9} className="h-[220px] drop-shadow-2xl" />
          </div>
        </motion.div>
      </div>

      <Button variant="light" href={t.href} className="relative w-full">
        Explore
      </Button>
    </motion.article>
  );
}
