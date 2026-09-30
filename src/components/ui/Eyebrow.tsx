// "( LABEL )" — the Brandbook parentheses eyebrow, in DIN.
export default function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className="font-display text-[22px] leading-none opacity-80">(</span>
      <span className="label px-3 text-[11px]">{children}</span>
      <span className="font-display text-[22px] leading-none opacity-80">)</span>
    </span>
  );
}
