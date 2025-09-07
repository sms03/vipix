import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface CustomScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  showTrack?: boolean; // whether to render the custom scrollbar track/thumb
}

/**
 * Fully custom vertical scrollbar overlay.
 * Hides native scrollbar (Chrome/Firefox) and renders gradient thumb.
 */
export const CustomScrollArea: React.FC<CustomScrollAreaProps> = ({ children, className, contentClassName, showTrack = true }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [thumbHeight, setThumbHeight] = useState(40);

  const recalc = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { clientHeight, scrollHeight } = el;
    const ratio = clientHeight / scrollHeight;
    const h = Math.max(32, Math.floor(ratio * clientHeight));
    setThumbHeight(h);
    updateThumb();
  }, []);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    const thumb = thumbRef.current;
    if (!el || !thumb) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScrollTop = scrollHeight - clientHeight;
    const maxThumbTop = clientHeight - thumb.offsetHeight;
    const top = maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbTop : 0;
    thumb.style.transform = `translateY(${top}px)`;
  }, []);

  useEffect(() => {
    recalc();
  }, [recalc, children]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => updateThumb();
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => recalc());
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [recalc, updateThumb]);

  // Drag logic
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const el = scrollRef.current; const track = trackRef.current; const thumb = thumbRef.current;
      if (!el || !track || !thumb) return;
      const rect = track.getBoundingClientRect();
      const offsetY = e.clientY - rect.top - thumbHeight / 2;
      const maxThumbTop = rect.height - thumbHeight;
      const clamped = Math.max(0, Math.min(maxThumbTop, offsetY));
      const scrollRatio = clamped / maxThumbTop;
      const maxScrollTop = el.scrollHeight - el.clientHeight;
      el.scrollTop = scrollRatio * maxScrollTop;
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging, thumbHeight]);

  return (
    <div ref={wrapperRef} className={cn('custom-scroll-wrapper relative h-full', className)}>
      <div ref={scrollRef} className={cn('custom-scroll-container h-full', showTrack && 'pr-3', contentClassName)}>
        {children}
      </div>
      {showTrack && (
        <div ref={trackRef} className={cn('custom-scroll-track')} aria-hidden>
          <div
            ref={thumbRef}
            className={cn('custom-scroll-thumb', dragging && 'dragging')}
            style={{ height: thumbHeight }}
            onMouseDown={(e) => { e.preventDefault(); setDragging(true); }}
          />
        </div>
      )}
    </div>
  );
};

export default CustomScrollArea;