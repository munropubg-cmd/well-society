// "Well (Society)™" wordmark from the client's logo file. The supplied file is black; a
// white copy (same shapes, recoloured) is generated for dark backgrounds.
const SRC = { light: '/media/logo-light.png', dark: '/media/logo-dark.png' };

type Props = { tone?: 'light' | 'dark'; className?: string };

export default function Logo({ tone = 'light', className = '' }: Props) {
  return (
    <a href="#top" aria-label="Well Society — home" className={`inline-block ${className}`}>
      <img src={SRC[tone]} alt="Well (Society)" width={2000} height={330} className="h-[26px] w-auto sm:h-[30px] lg:h-[32px]" />
    </a>
  );
}
