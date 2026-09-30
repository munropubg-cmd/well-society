import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ThemedSection from './ui/ThemedSection';
import ArrowIcon from './ui/ArrowIcon';
import Reveal, { RevealLines } from './ui/Reveal';
import { EASE_EXPO } from '../lib/motion';

// Email sign-up ("Join the movement" is allowed for email sign-up only — brief §2).
// No email provider is connected yet: submitting shows a confirmation state only.
export default function JoinMovement() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <ThemedSection id="join" label="Join" defaultTheme="sand" className="py-24 sm:py-28 lg:py-32">
      {(tone, theme) => (
        <div className="container-site grid items-end gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <p className={`label text-[11px] ${tone.eyebrow}`}>Ever evolving. Together.</p>
            </Reveal>
            <h2 className={`mt-6 font-display text-[clamp(64px,7.5vw,150px)] font-normal leading-[0.88] tracking-[-0.02em] ${tone.text}`}>
              <RevealLines lines={['Join the', 'movement.']} />
            </h2>
            <Reveal delay={0.2}>
              <p className={`mt-8 text-[16px] ${tone.muted}`}>A fresh perspective on science, care, and what comes next.</p>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="lg:pb-6">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE_EXPO }}
                >
                  <p className={`label text-[11px] ${tone.eyebrow}`}>You’re in</p>
                  <p className={`mt-4 font-display text-[clamp(36px,3.2vw,56px)] leading-none ${tone.text}`}>
                    Welcome to the <em className={`italic ${tone.accent}`}>movement.</em>
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: EASE_EXPO }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email) setSent(true);
                  }}
                >
                  <label htmlFor="join-email" className={`label text-[11px] ${tone.eyebrow}`}>
                    Email address
                  </label>
                  <div className={`group mt-3 flex items-end gap-4 border-b transition-colors duration-500 ${tone.line} focus-within:border-current ${tone.text}`}>
                    <input
                      id="join-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className={`min-w-0 flex-1 bg-transparent pb-4 font-display text-[clamp(32px,2.8vw,48px)] leading-none placeholder:opacity-45 focus:outline-none ${tone.text}`}
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className={`group/btn relative mb-3 grid h-14 w-14 shrink-0 place-items-center overflow-hidden ${theme === 'blue' ? 'bg-white text-ink' : 'bg-blue text-white'}`}
                    >
                      <span className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-expo group-hover/btn:scale-y-100 ${theme === 'blue' ? 'bg-sand' : 'bg-ink'}`} />
                      <ArrowIcon className="relative h-3 w-3 transition-transform duration-500 ease-expo group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                    </button>
                  </div>
                  <p className={`mt-4 text-[14px] ${tone.muted}`}>Request WELL updates by email. You can unsubscribe at any time.</p>
                  <a href="#privacy" className={`mt-1 inline-block text-[13px] underline underline-offset-4 ${tone.muted}`}>
                    Privacy &amp; your information
                  </a>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      )}
    </ThemedSection>
  );
}
