import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

// Product render (transparent webp, see /public/media/vials). Compliance (brief §2): renders
// must carry no Well Society logo, name or website — treatment name only.
type Props = { src: string; className?: string; delay?: number; interactive?: boolean };

// Living vial:
// - idle float + slow 3D sway (offset by `delay` so rows don't move in lockstep)
// - a sheen sweeps across the glass, masked to the bottle's own silhouette
// - soft contact shadow that tightens as the bottle rises
// - `interactive`: tilts towards the cursor
// The box has a fixed portrait ratio; each render is contained and centred inside it, so
// bottles of different shapes (vial, jar, dropper) line up.
export default function Vial({ src, className = '', delay = 0, interactive = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 14 });

  const onMove = (e: React.PointerEvent) => {
    if (!interactive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const mask = {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`relative aspect-[5/9] [perspective:900px] ${className}`}>
      {/* contact shadow */}
      <div
        className={`absolute -bottom-[3%] left-1/2 h-[5%] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-md ${reduce ? '' : 'vial-shadow'}`}
        style={{ animationDelay: `${-delay}s` }}
      />
      <div className={`absolute inset-0 ${reduce ? '' : 'vial-float'}`} style={{ animationDelay: `${-delay}s` }}>
        <motion.div className="absolute inset-0" style={interactive && !reduce ? { rotateX: rx, rotateY: ry } : undefined}>
          <div className={`absolute inset-0 ${reduce ? '' : 'vial-sway'}`} style={{ animationDelay: `${-delay * 1.3}s`, transformStyle: 'preserve-3d' }}>
            <img src={src} alt="" draggable={false} className="absolute inset-0 h-full w-full select-none object-contain" />
            {/* sheen, clipped to the bottle */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" style={mask}>
              <div className={`absolute -inset-y-[10%] left-0 w-[45%] ${reduce ? 'hidden' : 'vial-img-sheen'}`} style={{ animationDelay: `${delay * 0.8}s` }} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
