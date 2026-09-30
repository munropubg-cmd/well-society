// The "Prescribed with care" model with glowing points on her braid partings, as in the
// Hers reference. Shared by both versions of the featured-treatment section.
export const MODEL_IMAGE = '/media/care-model-2.webp'; // 1122×1402, transparent
export const MODEL_RATIO = 'aspect-[1122/1402]';

// % of the image; each row runs front-to-back so the stagger reads as light travelling
// along the parting. Mapped against a gridded close-up of the image.
const PARTINGS: [number, number][][] = [
  [[33.0, 11.3], [36.5, 10.1], [41.0, 9.0], [45.5, 8.4], [49.9, 8.1], [54.4, 8.2], [58.8, 8.6], [63.3, 9.6], [66.8, 10.8]],
  [[40.1, 14.6], [44.6, 14.3], [49.0, 14.2], [53.5, 14.4], [58.8, 16.8], [62.4, 18.5], [65.1, 20.7], [67.3, 22.8], [68.6, 25.3]],
  [[42.8, 19.6], [47.2, 19.3], [51.7, 19.3], [56.1, 19.8], [59.7, 20.7], [62.4, 22.1]],
];

export default function BraidModel({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${MODEL_RATIO} ${className}`}>
      <img
        src={MODEL_IMAGE}
        alt="Woman in profile with braided hair"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain"
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {PARTINGS.map((row, r) =>
          row.map(([x, y], i) => (
            <span
              key={`${r}-${i}`}
              className="braid-dot absolute"
              style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${r * 0.45 + i * 0.26}s`, ['--s' as string]: (r + i) % 3 === 0 ? 1.25 : 1 }}
            />
          )),
        )}
      </div>
    </div>
  );
}
