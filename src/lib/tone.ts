import type { SectionTheme } from '../components/ui/ThemeSwitcher';

// Text/line colours for a section on each switchable background.
export type Tone = {
  text: string;
  muted: string;
  eyebrow: string;
  accent: string; // italic accent word
  line: string; // hairline borders
  primaryBtn: 'primary' | 'light';
  outlineBtn: 'outline' | 'outlineDark';
};

export const TONES: Record<SectionTheme, Tone> = {
  black: { text: 'text-white', muted: 'text-white/65', eyebrow: 'text-gold', accent: 'text-sky', line: 'border-white/15', primaryBtn: 'primary', outlineBtn: 'outline' },
  blue: { text: 'text-white', muted: 'text-white/70', eyebrow: 'text-gold', accent: 'text-sand', line: 'border-white/20', primaryBtn: 'light', outlineBtn: 'outline' },
  cream: { text: 'text-ink', muted: 'text-ink/65', eyebrow: 'text-walnut', accent: 'text-blue', line: 'border-ink/10', primaryBtn: 'primary', outlineBtn: 'outlineDark' },
  sand: { text: 'text-ink', muted: 'text-ink/70', eyebrow: 'text-walnut', accent: 'text-blue', line: 'border-ink/15', primaryBtn: 'primary', outlineBtn: 'outlineDark' },
};
