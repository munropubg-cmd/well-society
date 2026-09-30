import { motion, useReducedMotion } from 'framer-motion';
import Button from './ui/Button';
import Vial from './ui/Vial';
import { EASE_EXPO } from '../lib/motion';

// Footer (no background switcher). Before LegitScript certification: no links to
// wellsocietyclub.com and no social icons (brief §1) — the columns leave room to add them.
const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Treatments', href: '#goals' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'About', href: '#about' },
      { label: 'Journal', href: '#journal' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: '#contact' },
      { label: 'hello@wellsociety.com', href: 'mailto:hello@wellsociety.com' },
      { label: '(305) 747-4236', href: 'tel:+13057474236' },
    ],
    address: ['1820 Bay Rd', 'Miami Beach, FL 33139'],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Telehealth Consent', href: '#telehealth-consent' },
      { label: 'Cancellation & Refunds', href: '#cancellation' },
      { label: 'HIPAA Policy', href: '#hipaa' },
    ],
  },
];

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -5% 0px' },
  transition: { duration: 1, ease: EASE_EXPO, delay },
});

export default function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-black text-white">
      <div className="container-site pt-24 lg:pt-32">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_repeat(3,minmax(0,2fr))] lg:gap-10">
          <motion.div {...rise()}>
            <p className="label text-[11px] text-gold">Aging on your terms</p>
            <p className="mt-5 font-display text-[clamp(40px,3.4vw,60px)] leading-[0.98]">The next evolution of you.</p>
            <Button variant="outline" href="#consult" className="mt-9">
              Schedule a consult
            </Button>
          </motion.div>

          {COLUMNS.map((col, i) => (
            <motion.nav key={col.title} aria-label={col.title} {...rise(0.1 + i * 0.08)}>
              <p className="label text-[11px] text-gold">{col.title}</p>
              <ul className="mt-6 space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="group relative inline-block text-[16px] text-white/75 transition-colors duration-300 hover:text-white">
                      {l.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
              {col.address && (
                <address className="mt-3.5 text-[16px] not-italic leading-relaxed text-white/90">
                  {col.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              )}
            </motion.nav>
          ))}
        </div>

        {/* Required disclosures (brief §2) */}
        <motion.div {...rise(0.1)} className="mt-20 grid gap-6 border-y border-white/15 py-8 text-[13px] leading-relaxed text-white/70 lg:grid-cols-2 lg:gap-16">
          <p>
            Clinical care is provided by Elite Care Health. Prescriptions, when appropriate, are filled by Rx Ave. A licensed provider reviews every intake and determines
            whether treatment is appropriate. Treatment is not guaranteed.
          </p>
          <p>
            Compounded medications are not FDA-approved. The FDA does not review them for safety, effectiveness, or quality before marketing. This website is for general
            information and is not a substitute for personalized medical advice.
          </p>
        </motion.div>

        <div className="flex items-center justify-between py-8">
          <p className="label text-[11px] text-white/70">© {new Date().getFullYear()} Well Society</p>
          <a href="#top" className="group label inline-flex items-center gap-3 text-[11px] text-white/70 transition-colors hover:text-white">
            Back to top
            <svg viewBox="0 0 12 14" fill="none" className="h-3.5 w-3 transition-transform duration-500 ease-expo group-hover:-translate-y-1" aria-hidden>
              <path d="M6 13V1M1 6l5-5 5 5" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </a>
        </div>
      </div>

      <Wordmark />
    </footer>
  );
}

/* Giant "Well ( vial ) Society™" sign-off: letters rise, the lens opens around the vial */
function Wordmark() {
  const reduce = useReducedMotion();
  const word = (text: string, delay: number) => (
    <span className="inline-flex overflow-hidden pb-[0.12em]">
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: reduce ? 0 : '110%' }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE_EXPO, delay: delay + i * 0.04 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );

  return (
    <div className="container-site relative pb-6 pt-10 lg:pt-16">
      <div className="flex items-end justify-between font-display leading-[0.8] tracking-[-0.02em] text-white" style={{ fontSize: 'clamp(64px,13vw,260px)' }}>
        {word('Well', 0)}
        <span className="relative mb-[0.08em] flex items-center font-light">
          <motion.span
            initial={{ x: reduce ? 0 : '0.35em', opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE_EXPO, delay: 0.3 }}
          >
            (
          </motion.span>
          <motion.span
            className="mx-[0.12em] block h-[0.62em]"
            initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE_EXPO, delay: 0.5 }}
          >
            <Vial src="/media/vials/semaglutide.webp" interactive className="h-full" />
          </motion.span>
          <motion.span
            initial={{ x: reduce ? 0 : '-0.35em', opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE_EXPO, delay: 0.3 }}
          >
            )
          </motion.span>
        </span>
        <span className="relative">
          {word('Society', 0.15)}
          <span className="label absolute bottom-[0.2em] left-full ml-1 text-[clamp(10px,1.1vw,18px)] tracking-normal">TM</span>
        </span>
      </div>
    </div>
  );
}
