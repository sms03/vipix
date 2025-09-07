import { useEffect, useState } from 'react';

/**
 * Calculates a scale factor so the designed layout (designW x designH) fits within the current viewport.
 * Will never upscale above 1.0. Clamped to a minimum so content remains legible.
 */
export function useViewportScale(designW = 1280, designH = 900, minScale = 0.7) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const s = Math.min(w / designW, h / designH, 1);
      setScale(Math.max(minScale, Number(s.toFixed(3))));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [designW, designH, minScale]);

  return scale;
}