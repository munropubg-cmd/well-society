import type { AnchorHTMLAttributes } from 'react';
import ArrowIcon from './ArrowIcon';

type Variant = 'primary' | 'outline' | 'outlineDark' | 'light';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  icon?: 'up-right' | 'down';
  size?: 'md' | 'sm';
};

const base: Record<Variant, string> = {
  primary: 'bg-blue text-white',
  outline: 'border border-white/35 text-white backdrop-blur-md bg-white/[0.03] hover:border-white',
  outlineDark: 'border border-ink/30 text-ink hover:border-ink', // for light backgrounds
  light: 'bg-white text-ink',
};

// Fill that wipes up from the bottom on hover
const wipe: Record<Variant, string> = {
  primary: 'bg-sand',
  outline: 'bg-white',
  outlineDark: 'bg-ink',
  light: 'bg-blue',
};

const hoverText: Record<Variant, string> = {
  primary: 'group-hover:text-ink',
  outline: 'group-hover:text-ink',
  outlineDark: 'group-hover:text-white',
  light: 'group-hover:text-white',
};

export default function Button({
  variant = 'primary',
  icon = 'up-right',
  size = 'md',
  className = '',
  children,
  ...rest
}: Props) {
  const sizing = size === 'md' ? 'h-[52px] px-8 text-[12px]' : 'h-[46px] px-6 text-[11px]';

  return (
    <a
      {...rest}
      className={`group relative inline-flex items-center justify-center overflow-hidden transition-colors duration-500 ${sizing} ${base[variant]} ${className}`}
    >
      <span
        aria-hidden
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[650ms] ease-expo group-hover:scale-y-100 ${wipe[variant]}`}
      />
      <span
        className={`label relative z-10 flex items-center gap-3 transition-colors duration-500 ${hoverText[variant]}`}
      >
        {children}
        <span className="relative block h-[10px] w-[10px] overflow-hidden">
          {icon === 'up-right' ? (
            <>
              <ArrowIcon className="absolute inset-0 transition-transform duration-500 ease-expo group-hover:-translate-y-full group-hover:translate-x-full" />
              <ArrowIcon className="absolute inset-0 -translate-x-full translate-y-full transition-transform duration-500 ease-expo group-hover:translate-x-0 group-hover:translate-y-0" />
            </>
          ) : (
            <>
              <ArrowIcon direction="down" className="absolute inset-0 transition-transform duration-500 ease-expo group-hover:translate-y-full" />
              <ArrowIcon direction="down" className="absolute inset-0 -translate-y-full transition-transform duration-500 ease-expo group-hover:translate-y-0" />
            </>
          )}
        </span>
      </span>
    </a>
  );
}
