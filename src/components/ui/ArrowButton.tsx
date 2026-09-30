type Props = { dir: 1 | -1; light?: boolean; disabled?: boolean; onClick: () => void; label?: string };

// Square slider arrow. `light` = for use on light backgrounds.
export default function ArrowButton({ dir, light = false, disabled = false, onClick, label }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label ?? (dir === 1 ? 'Next' : 'Previous')}
      className={`group grid h-[52px] w-[52px] shrink-0 place-items-center border transition-all duration-500 ease-expo disabled:opacity-30 ${
        light
          ? 'border-ink/25 text-ink enabled:hover:border-ink enabled:hover:bg-ink enabled:hover:text-white'
          : 'border-white/30 text-white enabled:hover:border-white enabled:hover:bg-white enabled:hover:text-ink'
      }`}
    >
      <svg viewBox="0 0 16 12" fill="none" className={`h-3 w-4 transition-transform duration-500 ease-expo ${dir === -1 ? 'rotate-180' : ''} group-enabled:group-hover:translate-x-0.5`} aria-hidden>
        <path d="M0 6h15M10 1l5 5-5 5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    </button>
  );
}
