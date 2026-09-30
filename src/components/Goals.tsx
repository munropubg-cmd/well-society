import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from './ui/Button';
import ArrowButton from './ui/ArrowButton';
import { useCarousel } from '../lib/useCarousel';
import ThemeSwitcher, { SECTION_THEMES, useSectionTheme } from './ui/ThemeSwitcher';
import AmbientVideo from './ui/AmbientVideo';
import Reveal, { RevealLines } from './ui/Reveal';
import { EASE_EXPO } from '../lib/motion';

// Runner loop — client's portrait film, web-encoded (720px wide, muted, 8s loop).
const FEATURE_VIDEO = '/media/goals.mp4';
const FEATURE_POSTER = '/media/goals-poster.webp';

type Goal = {
  title: string;
  copy: string;
  href: string;
  // Distinct visual per goal (brief: each category gets its own visual)
  image: string;
  focus?: string; // object-position, to keep the subject in frame in the tall card
};

const img = (slug: string) => `/media/goals/${slug}.webp`;

// Copy follows the brief's compliance rules: "may support", weight management, no brand drugs.
const GOALS: Goal[] = [
  {
    title: 'Weight + Body Composition',
    copy: 'Provider-guided weight management built around your metabolism.',
    href: '#weight-management',
    image: img('weight'),
    focus: '50% 35%',
  },
  {
    title: 'Hormones + Energy',
    copy: 'Lab-guided hormone and thyroid care, always with provider oversight.',
    href: '#hormones',
    image: img('energy'),
    focus: '62% 50%',
  },
  {
    title: 'Sexual Health',
    copy: 'Discreet, provider-reviewed support for desire and intimacy.',
    href: '#sexual-health',
    image: img('sexual-health'),
    focus: '50% 40%',
  },
  {
    title: 'Beauty + Skin',
    copy: 'Peptide protocols that may support skin and hair from within.',
    href: '#skin',
    image: img('skin'),
    focus: '30% 50%',
  },
  {
    title: 'Longevity',
    copy: 'Cellular-health protocols designed around how you want to age.',
    href: '#longevity',
    image: img('longevity'),
    focus: '60% 50%',
  },
  {
    title: 'Focus + Cognition',
    copy: 'Support that may help sustain focus and mental energy.',
    href: '#focus',
    image: img('focus'),
    focus: '55% 50%',
  },
];

const CARD_SIZE = 'h-[540px] sm:h-[620px] xl:h-[700px] 2xl:h-[740px]';

export default function Goals() {
  const { viewportRef, trackRef, index, go, maxIndex, x, progress } = useCarousel();

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: '-30% 0px -30% 0px' });
  const [theme, setTheme] = useSectionTheme('goals', 'black');
  const { bg, light } = SECTION_THEMES[theme];

  return (
    <section
      ref={sectionRef}
      id="goals"
      style={{ backgroundColor: bg }}
      className={`relative py-24 transition-colors duration-700 ease-expo sm:py-28 lg:py-36 ${light ? 'text-ink' : 'text-white'}`}
    >
      {/* ---------- Top row: eyebrow / heading / CTA, top-aligned (1920 container) ---------- */}
      <div className="container-site">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-3">
            <span className={`inline-flex items-center ${light ? 'text-ink' : 'text-white/80'}`}>
              <span className="font-display text-[22px] leading-none">(</span>
              <span className={`label px-3 text-[11px] ${light ? 'text-blue' : 'text-gold'}`}>Begin with you</span>
              <span className="font-display text-[22px] leading-none">)</span>
            </span>
          </Reveal>

          <h2 className="font-display text-[clamp(44px,4.6vw,88px)] font-normal leading-[0.95] tracking-[-0.015em] lg:col-span-6">
            <RevealLines lines={['What would you like', <>to <em className={`italic ${light ? 'text-blue' : 'text-sand'}`}>optimize?</em></>]} />
          </h2>

          <Reveal delay={0.15} className="lg:col-span-3 lg:justify-self-end">
            {/* Blue button would vanish on the blue background */}
            <Button variant={theme === 'blue' ? 'light' : 'primary'} href="#start">
              Get matched
            </Button>
          </Reveal>
        </div>
      </div>

      {/* ---------- Slider row: full bleed, feature card flush to the left edge ---------- */}
      <div className="mt-16 lg:mt-24">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:gap-3">
          <Reveal y={40} className="shrink-0 lg:w-[400px] xl:w-[480px] 2xl:w-[540px]">
            <FeatureCard />
          </Reveal>

          {/* Clipped viewport: cards slide under this edge, never behind the feature card */}
          <div className="min-w-0 flex-1">
            <div ref={viewportRef} className="overflow-hidden">
              <motion.div
                ref={trackRef}
                className="flex gap-2.5 lg:gap-3"
                style={{ touchAction: 'pan-y' }}
                animate={{ x }}
                transition={{ duration: 1, ease: EASE_EXPO }}
                onPanEnd={(_, info) => {
                  if (info.offset.x < -50) go(1);
                  else if (info.offset.x > 50) go(-1);
                }}
              >
                {GOALS.map((g, i) => (
                  <GoalCard key={g.title} goal={g} i={i} />
                ))}
              </motion.div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center gap-6 px-5 sm:px-8 lg:pl-0 lg:pr-12 2xl:pr-[100px]">
              <div className={`relative h-px flex-1 ${light ? 'bg-ink/15' : 'bg-white/15'}`}>
                <motion.div
                  className={`absolute inset-y-0 left-0 ${light ? 'bg-ink' : 'bg-sand'}`}
                  animate={{ width: `${Math.max(progress, 0.08) * 100}%` }}
                  transition={{ duration: 1, ease: EASE_EXPO }}
                />
              </div>
              <div className="flex gap-2">
                <ArrowButton dir={-1} light={light} disabled={index === 0} onClick={() => go(-1)} />
                <ArrowButton dir={1} light={light} disabled={index >= maxIndex} onClick={() => go(1)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review-only background switcher — keep as the section's last child (sticky-scoped) */}
      <ThemeSwitcher section="Goals" visible={inView} value={theme} onChange={setTheme} />
    </section>
  );
}

/* Sticky feature card: ambient film, intro copy top-left, Explore all at the bottom */
function FeatureCard() {
  return (
    <article className={`grain relative overflow-hidden bg-ink-3 ${CARD_SIZE} max-lg:h-[480px]`}>
      <AmbientVideo
        src={FEATURE_VIDEO}
        poster={FEATURE_POSTER}
        fallback={
          <div className="absolute inset-0 bg-[#0d0f1c]">
            <div
              className="absolute -left-1/4 top-[10%] h-[120%] w-[140%] rounded-full opacity-80 blur-[90px]"
              style={{ background: 'radial-gradient(circle, #253990 0%, rgba(37,57,144,0.4) 40%, transparent 70%)', animation: 'drift-a 18s ease-in-out infinite' }}
            />
            <div
              className="absolute -right-1/3 -top-1/4 h-[80%] w-[110%] rounded-full opacity-60 blur-[100px]"
              style={{ background: 'radial-gradient(circle, #DDD3B9 0%, rgba(134,88,51,0.45) 40%, transparent 70%)', animation: 'drift-b 22s ease-in-out infinite' }}
            />
          </div>
        }
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/70" />

      {/* Heading plate: blurred black glass, square, flush to the top-left corner */}
      <div className="absolute left-0 top-0 max-w-[300px] bg-black/35 p-6 backdrop-blur-md xl:p-7">
        <p className="font-display text-[30px] leading-[1.02] text-white xl:text-[34px]">
          Every plan starts <em className="italic text-sand">with you.</em>
        </p>
      </div>

      <div className="relative flex h-full flex-col justify-end p-7 sm:p-9 xl:p-11">
        <Button variant="light" href="#treatments" className="w-full">
          Explore all
        </Button>
      </div>
    </article>
  );
}

function GoalCard({ goal, i }: { goal: Goal; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: EASE_EXPO, delay: Math.min(i, 3) * 0.08 }}
      className={`group relative w-[82vw] shrink-0 overflow-hidden bg-ink-2 sm:w-[420px] xl:w-[470px] 2xl:w-[520px] ${CARD_SIZE}`}
    >
      {/* Goal image: slow breathing zoom, a little more on hover */}
      <div className="absolute inset-0 transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.06]">
        <img
          src={goal.image}
          alt=""
          draggable={false}
          className="goal-breathe h-full w-full select-none object-cover"
          style={{ objectPosition: goal.focus ?? 'center', animationDelay: `${-i * 3}s` }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      <div className="relative flex h-full flex-col justify-end p-7 sm:p-8 xl:p-10">
        <h3 className="font-display text-[38px] leading-[1] text-white xl:text-[46px]">{goal.title}</h3>
        <p className="mt-4 max-w-[340px] text-[15px] leading-relaxed text-white/70">{goal.copy}</p>
        <Button variant="outline" href={goal.href} className="mt-8 w-full">
          Explore
        </Button>
      </div>
    </motion.article>
  );
}
