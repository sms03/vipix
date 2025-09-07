import { useEffect, useState } from 'react';

// Determines when to switch to a compact layout based on viewport dimensions.
export function useCompact() {
  const [compact, setCompact] = useState<boolean>(false);

  useEffect(() => {
    const evaluate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Thresholds: treat smaller preview panes or low-height screens as compact
      setCompact(w < 1180 || h < 820);
    };
    evaluate();
    window.addEventListener('resize', evaluate);
    return () => window.removeEventListener('resize', evaluate);
  }, []);

  return compact;
}