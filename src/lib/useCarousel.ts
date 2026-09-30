import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// Index-based track slider: measures card step and max offset so the last card lands
// flush with the viewport edge.
export function useCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [metrics, setMetrics] = useState({ step: 0, maxOffset: 0, maxIndex: 0 });

  const measure = useCallback(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!vp || !track || !first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = first.offsetWidth + gap;
    // Computed from layout, not scrollWidth — card entry transforms would inflate that.
    const contentWidth = track.children.length * step - gap;
    const maxOffset = Math.max(0, contentWidth - vp.clientWidth);
    setMetrics({ step, maxOffset, maxIndex: step ? Math.ceil(maxOffset / step - 0.01) : 0 });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    setIndex((i) => Math.min(i, metrics.maxIndex));
  }, [metrics.maxIndex]);

  const go = (dir: 1 | -1) => setIndex((i) => Math.max(0, Math.min(metrics.maxIndex, i + dir)));

  return {
    viewportRef,
    trackRef,
    index,
    go,
    maxIndex: metrics.maxIndex,
    x: -Math.min(index * metrics.step, metrics.maxOffset),
    progress: metrics.maxIndex ? index / metrics.maxIndex : 1,
  };
}
