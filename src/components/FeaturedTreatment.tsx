import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Button from './ui/Button';
import ArrowButton from './ui/ArrowButton';
import Reveal from './ui/Reveal';
import Vial from './ui/Vial';
import BraidModel from './ui/BraidModel';
import { SHOWCASE, disclosure } from '../data/treatments';
import { EASE_EXPO } from '../lib/motion';

export const CARE_BG = '/media/care-bg.webp';
// Electric Blue wash laid over CARE_BG so the image sits in the brand colour.
export const CARE_OVERLAY = 'rgba(37,57,144,0.75)';
// CARE_BG's bottom colour (rgb 7,53,164) under that wash — the 400px fades blend into this.
export const CARE_BG_BOTTOM = 'rgb(30,56,149)';

// Featured treatment — V1: Electric Blue panel with a treatment switcher, model on the right.
export default function FeaturedTreatment() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState<[number, 1 | -1]>([0, 1]);
  const t = SHOWCASE[index];

  const step = (d: 1 | -1) => setState(([i]) => [(i + d + SHOWCASE.length) % SHOWCASE.length, d]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const modelY = useTransform(scrollYProgress, [0, 1], ['6%', '-2%']);

  return (
    <section ref={ref} id="featured" className="relative grid bg-black lg:grid-cols-2">
      {/* ---------- Left: brand Electric Blue, content centred ---------- */}
      <div className="relative overflow-hidden bg-blue">
        {/* Half of the 1920 container, pinned right, so it sits on the site grid */}
        <div className="relative ml-auto flex h-full w-full max-w-[960px] items-center justify-center px-5 py-20 sm:px-8 lg:min-h-[860px] lg:px-12 lg:py-24 2xl:min-h-[980px] 2xl:pl-[100px]">
          <div className="flex w-full max-w-[460px] flex-col items-center text-center">
            <Reveal>
              <span className="inline-flex items-center text-white">
                <span className="font-display text-[22px] leading-none">(</span>
                <span className="label px-3 text-[11px] text-gold">Prescribed with care</span>
                <span className="font-display text-[22px] leading-none">)</span>
              </span>
            </Reveal>

            {/* Vial flanked by the arrows */}
            <Reveal delay={0.1} y={40} className="w-full">
              <div className="my-10 flex items-center justify-between gap-4 lg:my-12">
                <ArrowButton dir={-1} onClick={() => step(-1)} label="Previous treatment" />
                <div className="relative h-[260px] flex-1 lg:h-[320px] 2xl:h-[360px]">
                  <AnimatePresence initial={false} custom={dir} mode="popLayout">
                    <motion.div
                      key={t.name}
                      custom={dir}
                      variants={{
                        enter: (d: number) => ({ opacity: 0, x: d * 60, rotate: d * 6 }),
                        center: { opacity: 1, x: 0, rotate: 0 },
                        exit: (d: number) => ({ opacity: 0, x: d * -60, rotate: d * -6 }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.8, ease: EASE_EXPO }}
                      className="absolute inset-0 flex justify-center"
                    >
                      <Vial src={t.image} interactive className="h-full drop-shadow-2xl" />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <ArrowButton dir={1} onClick={() => step(1)} label="Next treatment" />
              </div>
            </Reveal>

            <Reveal delay={0.2} className="w-full">
              <div className="overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={t.name}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-60%', opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE_EXPO }}
                  >
                    <h2 className="font-display text-[clamp(52px,5vw,92px)] font-normal leading-[0.95] tracking-[-0.015em] text-white">
                      {t.name}
                    </h2>
                    <p className="mt-3 text-[17px] text-white/75">{t.category}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Reveal>

            <Reveal delay={0.3} className="w-full">
              <Button variant="light" href={t.href} className="mt-10 w-full">
                Explore
              </Button>
              {/* Brief §2: disclosure stays visible */}
              <p className="mx-auto mt-5 max-w-[400px] text-[12px] leading-relaxed text-white/55">{disclosure(t)}</p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ---------- Right: background image + model ---------- */}
      <div className="relative min-h-[560px] overflow-hidden sm:min-h-[680px] lg:min-h-0">
        <motion.img
          src={CARE_BG}
          alt=""
          style={reduce ? undefined : { scale: bgScale }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundColor: CARE_OVERLAY }} />

        <motion.div style={reduce ? undefined : { y: modelY }} className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 1.6, ease: EASE_EXPO }}
            className="absolute inset-x-0 bottom-0 flex justify-center"
          >
            <BraidModel className="h-[560px] sm:h-[620px] lg:h-[720px] 2xl:h-[820px]" />
          </motion.div>
        </motion.div>

        {/* 400px bottom fade into the image's own deep blue */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[400px]"
          style={{ background: `linear-gradient(to bottom, transparent, ${CARE_BG_BOTTOM})` }}
        />
      </div>
    </section>
  );
}
