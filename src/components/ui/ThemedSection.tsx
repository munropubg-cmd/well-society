import { useRef, type ReactNode } from 'react';
import { useInView } from 'framer-motion';
import ThemeSwitcher, { SECTION_THEMES, useSectionTheme, type SectionTheme } from './ThemeSwitcher';
import { TONES, type Tone } from '../../lib/tone';

type Props = {
  id: string;
  label: string; // shown on the switcher pill
  defaultTheme: SectionTheme;
  className?: string;
  children: (tone: Tone, theme: SectionTheme) => ReactNode;
};

// A section with the review-only background switcher wired in (scoped to this section).
export default function ThemedSection({ id, label, defaultTheme, className = '', children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '-30% 0px -30% 0px' });
  const [theme, setTheme] = useSectionTheme(id, defaultTheme);

  return (
    <section
      ref={ref}
      id={id}
      style={{ backgroundColor: SECTION_THEMES[theme].bg }}
      className={`relative transition-colors duration-700 ease-expo ${className}`}
    >
      {children(TONES[theme], theme)}
      <ThemeSwitcher section={label} visible={inView} value={theme} onChange={setTheme} />
    </section>
  );
}
