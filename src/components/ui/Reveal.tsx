import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { EASE_EXPO } from '../../lib/motion';

type Props = { children: ReactNode; delay?: number; y?: number; className?: string };

// Fade + rise once when scrolled into view.
export default function Reveal({ children, delay = 0, y = 28, className = '' }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, ease: EASE_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}

// Line-masked headline reveal, same motion language as the hero.
export function RevealLines({ lines, className = '', delay = 0 }: { lines: ReactNode[]; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            initial={{ y: '105%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.2, ease: EASE_EXPO, delay: delay + i * 0.1 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
