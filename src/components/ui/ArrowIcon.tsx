type Props = { direction?: 'up-right' | 'down'; className?: string };

export default function ArrowIcon({ direction = 'up-right', className = '' }: Props) {
  if (direction === 'down') {
    return (
      <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
        <path d="M6 1v10M1.5 6.5 6 11l4.5-4.5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
      <path d="M2 10 10 2M3.5 2H10v6.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
