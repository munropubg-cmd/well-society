import { motion } from 'framer-motion';
import ThemedSection from './ui/ThemedSection';
import Eyebrow from './ui/Eyebrow';
import ArrowIcon from './ui/ArrowIcon';
import Reveal, { RevealLines } from './ui/Reveal';
import { EASE_EXPO } from '../lib/motion';

// Article images are pending — each card uses a brand-colour gradient until then.
// Journal copy follows the treatment-page rules (brief §2): no outcome claims or brand drugs.
const ARTICLES = [
  {
    kicker: 'The Well perspective',
    title: 'A better conversation with your biology.',
    href: '#journal',
    art: { base: 'linear-gradient(135deg,#efe9dc,#ddd3b9)', glow: '#ffffff', ink: 'text-ink/70' },
  },
  {
    kicker: 'Your care, explained',
    title: 'What happens before a treatment plan?',
    href: '#journal',
    art: { base: 'linear-gradient(160deg,#865833,#512314)', glow: '#F3BD25', ink: 'text-white/85' },
  },
  {
    kicker: 'The art of evolving',
    title: 'Start with a question. Not a prescription.',
    href: '#journal',
    art: { base: 'linear-gradient(160deg,#253990,#141f63)', glow: '#9EBEC9', ink: 'text-white/85' },
  },
];

export default function Journal() {
  return (
    <ThemedSection id="journal" label="Journal" defaultTheme="cream" className="py-24 sm:py-28 lg:py-36">
      {(tone) => (
        <div className="container-site">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Reveal>
                <Eyebrow className={tone.eyebrow}>A little more understanding</Eyebrow>
              </Reveal>
              <h2 className={`mt-8 font-display text-[clamp(56px,6vw,112px)] font-normal leading-[0.92] tracking-[-0.015em] ${tone.text}`}>
                <RevealLines lines={[<>The <em className={`italic ${tone.accent}`}>journal.</em></>]} />
              </h2>
            </div>
            <Reveal delay={0.15} className="lg:text-right">
              <p className={`text-[17px] leading-relaxed ${tone.muted}`}>
                New perspectives.
                <br />
                Better questions.
              </p>
              <a href="#journal" className={`group mt-5 inline-flex items-center gap-3 border-b pb-1.5 text-[16px] ${tone.text} ${tone.line}`}>
                View all articles
                <ArrowIcon className="h-2.5 w-2.5 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-5 lg:mt-20">
            {ARTICLES.map((a, i) => (
              <motion.a
                key={a.title}
                href={a.href}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 1.2, ease: EASE_EXPO, delay: i * 0.12 }}
                className="group block"
              >
                <div className="relative aspect-[7/5] overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.06]" style={{ background: a.art.base }}>
                    <div
                      className="absolute left-1/2 top-1/2 h-[80%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-[50px]"
                    >
                      <div
                        className="h-full w-full rounded-full"
                        style={{ background: `radial-gradient(circle, ${a.art.glow} 0%, transparent 65%)`, animation: `drift-${'abc'[i]} ${14 + i * 3}s ease-in-out infinite` }}
                      />
                    </div>
                  </div>
                  <span className={`label absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[11px] ${a.art.ink}`}>Article image</span>
                </div>
                <p className={`label mt-6 text-[11px] ${tone.muted}`}>{a.kicker}</p>
                <div className="mt-3 flex items-end justify-between gap-6">
                  <h3 className={`font-display text-[clamp(32px,2.6vw,48px)] leading-[1.02] ${tone.text}`}>
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-expo group-hover:bg-[length:100%_1px]">
                      {a.title}
                    </span>
                  </h3>
                  <ArrowIcon className={`mb-2 h-2.5 w-2.5 shrink-0 transition-transform duration-500 ease-expo group-hover:-translate-y-1 group-hover:translate-x-1 ${tone.text}`} />
                </div>
                <p className={`label mt-6 text-[11px] ${tone.muted}`}>Read the perspective</p>
              </motion.a>
            ))}
          </div>
        </div>
      )}
    </ThemedSection>
  );
}
