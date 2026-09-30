import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ThemedSection from './ui/ThemedSection';
import Eyebrow from './ui/Eyebrow';
import ArrowIcon from './ui/ArrowIcon';
import Reveal, { RevealLines } from './ui/Reveal';
import { EASE_EXPO } from '../lib/motion';

// Standard Karpa FAQ set (brief §2) — every item must expand to show its answer.
const FAQS = [
  {
    q: 'Where are telehealth services available?',
    a: 'Telehealth services may be available where clinically appropriate and permitted by applicable law. Care is provided only by a licensed provider authorized to practice in the state where you are located.',
  },
  {
    q: 'Is treatment guaranteed?',
    a: 'No. A licensed provider reviews every intake and determines whether treatment is appropriate for you. Treatment is not guaranteed, and individual results vary.',
  },
  {
    q: 'Do I need to speak with a provider?',
    a: 'Yes. Every intake is reviewed by a licensed provider, who may reach out by message, phone, or video before deciding whether any treatment is appropriate.',
  },
  {
    q: 'Are compounded medications FDA-approved?',
    a: 'No. Compounded medications are not FDA-approved. The FDA does not review them for safety, effectiveness, or quality before marketing. They are prepared by a licensed pharmacy only when prescribed by a provider.',
  },
  {
    q: 'Can I use Well Society for emergency care?',
    a: 'No. Well Society is not for emergencies. If you are experiencing a medical emergency, call 911 or go to the nearest emergency room.',
  },
  {
    q: 'Who provides the clinical care?',
    a: 'Clinical care is provided by licensed providers through Elite Care Health.',
  },
  {
    q: 'Who handles pharmacy and prescription fulfillment?',
    a: 'Prescriptions, when appropriate, are filled by Rx Ave, a licensed pharmacy.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ThemedSection id="faq" label="FAQ" defaultTheme="cream" className="py-24 sm:py-28 lg:py-40">
      {(tone) => (
        <div className="container-site grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <Eyebrow className={tone.eyebrow}>Good questions</Eyebrow>
            </Reveal>
            <h2 className={`mt-8 font-display text-[clamp(56px,6vw,112px)] font-normal leading-[0.92] tracking-[-0.015em] ${tone.text}`}>
              <RevealLines lines={['Clarity', <>starts <em className={`italic ${tone.accent}`}>here.</em></>]} />
            </h2>
            <Reveal delay={0.15}>
              <p className={`mt-12 text-[15px] ${tone.muted}`}>Still curious?</p>
              <a href="#contact" className={`group mt-1 inline-flex items-center gap-3 border-b pb-1.5 text-[16px] ${tone.text} ${tone.line}`}>
                Talk to the WELL team
                <ArrowIcon className="h-2.5 w-2.5 transition-transform duration-500 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Reveal>
          </div>

          <ul className={`border-t ${tone.line}`}>
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <motion.li
                  key={f.q}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                  transition={{ duration: 0.9, ease: EASE_EXPO, delay: i * 0.05 }}
                  className={`border-b ${tone.line}`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className={`group flex w-full items-center justify-between gap-6 py-7 text-left text-[18px] lg:text-[20px] ${tone.text}`}
                  >
                    <span className="transition-transform duration-500 ease-expo group-hover:translate-x-1">{f.q}</span>
                    <span className={`relative h-4 w-4 shrink-0 ${tone.accent}`} aria-hidden>
                      <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current" />
                      <motion.span
                        className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-current"
                        animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                        transition={{ duration: 0.5, ease: EASE_EXPO }}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="a"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: EASE_EXPO }}
                        className="overflow-hidden"
                      >
                        <p className={`max-w-[760px] pb-8 text-[16px] leading-relaxed ${tone.muted}`}>{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}
    </ThemedSection>
  );
}
