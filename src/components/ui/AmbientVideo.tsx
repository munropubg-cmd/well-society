import { useState, type ReactNode } from 'react';

type Props = { src: string; poster?: string; fallback: ReactNode; className?: string };

// Muted looping background film. The fallback stays underneath until the video can play,
// so a missing file never leaves an empty box.
export default function AmbientVideo({ src, poster, fallback, className = '' }: Props) {
  const [ready, setReady] = useState(false);
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {fallback}
      <video
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${ready ? 'opacity-100' : 'opacity-0'}`}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onCanPlay={(e) => {
          setReady(true);
          e.currentTarget.play().catch(() => {}); // nudge browsers that hold muted autoplay
        }}
        aria-hidden
      />
    </div>
  );
}
