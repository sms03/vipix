import React from 'react';
import PixelBlast from './PixelBlast';

/* GlobalBackground renders a single full-viewport PixelBlast instance.
   Place once at the root (e.g. in App.tsx). */
const GlobalBackground: React.FC = () => {
  // Optional: could read prefers-reduced-motion here and early-return null.
  return (
    <div className="fixed inset-0 -z-10">
      <PixelBlast
        variant="circle"
        pixelSize={6}
        color="#4B3A99"
        patternScale={3}
        patternDensity={1.2}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.45}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={1.15}
        edgeFade={0.0} /* full bleed */
        transparent
        className="w-full h-full pointer-events-auto"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/55 to-background/80 backdrop-blur-[1px] pointer-events-none" />
    </div>
  );
};

export default GlobalBackground;
