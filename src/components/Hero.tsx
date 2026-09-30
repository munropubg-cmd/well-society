import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Button from './ui/Button';
import { EASE_EXPO } from '../lib/motion';
import { useIntro } from '../lib/intro';

// Client hero film (web-optimised copy: 1080p/30fps, no audio) + its first frame as poster.
// The abstract gradient layer below shows until the video can play, and stays as the fallback.
const HERO_VIDEO = '/media/hero.mp4';
const HERO_POSTER = '/media/hero-poster.webp';

const LINES: React.ReactNode[] = [
  'The next',
  'evolution',
  <>
    of <em className="italic">you.</em>
  </>,
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [videoReady, setVideoReady] = useState(false);
  const { ready } = useIntro(); // entrance waits for the preloader to lift
  const videoRef = useRef<HTMLVideoElement>(null);

  // Start the film only once the preloader lifts, from the beginning
  useEffect(() => {
    const v = videoRef.current;
    if (!ready || !v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [ready]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[680px] overflow-hidden bg-ink">
      {/* ---------- Background ---------- */}
      <motion.div
        style={reduce ? undefined : { scale: bgScale, y: bgY }}
        className="absolute inset-0 will-change-transform"
      >
        <motion.div
          initial={{ scale: 1.18, opacity: 0 }}
          animate={ready ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 2.4, ease: EASE_EXPO }}
          className="absolute inset-0"
        >
          <AbstractBackdrop />
          {/* No autoplay: it buffers during the preloader and starts from frame one as it lifts */}
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${videoReady ? 'opacity-100' : 'opacity-0'}`}
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setVideoReady(true)}
            aria-hidden
          />
        </motion.div>
      </motion.div>

      {/* Legibility + mood */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/10 to-transparent" />
      <div className="grain pointer-events-none absolute inset-0 overflow-hidden" />
      <GridLines />

      {/* ---------- Content ---------- */}
      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="container-site relative flex h-full flex-col justify-end pb-12 sm:pb-16 lg:pb-[72px]"
      >
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow />

            <h1 className="mt-7 font-display text-[clamp(58px,7vw,132px)] font-normal leading-[0.9] tracking-[-0.02em] text-white">
              {LINES.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={{ y: '105%' }}
                    animate={ready ? { y: 0 } : undefined}
                    transition={{ duration: 1.3, ease: EASE_EXPO, delay: 0.6 + i * 0.12 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, ease: EASE_EXPO, delay: 1.25 }}
              className="mt-7 text-[18px] text-white/85 lg:text-[20px]"
            >
              Longevity, personalized.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1, ease: EASE_EXPO, delay: 1.4 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Button variant="primary" href="#start" className="sm:min-w-[200px]">
              Start now
            </Button>
            <Button variant="outline" icon="down" href="#goals" className="sm:min-w-[200px]">
              Explore
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* Parentheses open like the Brandbook's "evolving lens" to reveal the label */
function Eyebrow() {
  const { ready } = useIntro();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : undefined}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="inline-flex items-center text-white"
    >
      <span className="font-display text-[26px] font-light leading-none">(</span>
      <motion.span
        initial={{ maxWidth: 0, opacity: 0 }}
        animate={ready ? { maxWidth: 320, opacity: 1 } : undefined}
        transition={{ duration: 1.4, ease: EASE_EXPO, delay: 0.45 }}
        className="overflow-hidden whitespace-nowrap"
      >
        <span className="label block px-3.5 text-[12px] tracking-[0.2em]">Precision longevity</span>
      </motion.span>
      <span className="font-display text-[26px] font-light leading-none">)</span>
    </motion.div>
  );
}

/* Abstract, warm, slowly drifting gradients in brand tones — the placeholder "footage" */
function AbstractBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#120c09]">
      <div
        className="absolute -left-[10%] top-[5%] h-[80vmax] w-[80vmax] rounded-full opacity-80 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #865833 0%, rgba(81,35,20,0.6) 40%, transparent 70%)', animation: 'drift-a 22s ease-in-out infinite' }}
      />
      <div
        className="absolute right-[-15%] top-[-20%] h-[70vmax] w-[70vmax] rounded-full opacity-70 blur-[140px]"
        style={{ background: 'radial-gradient(circle, #DDD3B9 0%, rgba(134,88,51,0.5) 35%, transparent 68%)', animation: 'drift-b 26s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-[-35%] right-[5%] h-[65vmax] w-[65vmax] rounded-full opacity-60 blur-[140px]"
        style={{ background: 'radial-gradient(circle, #253990 0%, rgba(37,57,144,0.35) 40%, transparent 70%)', animation: 'drift-c 30s ease-in-out infinite' }}
      />
    </div>
  );
}

/* Hairline column grid — the quiet, slightly technical layer over the editorial image */
function GridLines() {
  const { ready } = useIntro();
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="container-site grid h-full grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={ready ? { scaleY: 1 } : undefined}
            transition={{ duration: 1.8, ease: EASE_EXPO, delay: 0.2 + i * 0.08 }}
            className={`origin-top border-l border-white/[0.05] ${i >= 4 ? 'hidden lg:block' : ''} ${i === 0 ? 'border-l-0' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
