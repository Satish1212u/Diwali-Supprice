import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on non-touch devices with fine pointers
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('button, a, input, textarea, [role="button"], .cursor-pointer');
      setIsHovering(!!interactive);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300"
      aria-hidden="true"
    >
      {/* Outer soft lavender/pink atmospheric halo */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-200 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovering ? '42px' : '28px',
          height: isHovering ? '42px' : '28px',
          backgroundColor: isHovering ? 'rgba(220, 204, 244, 0.45)' : 'rgba(248, 200, 220, 0.35)',
          border: '1px solid rgba(214, 168, 95, 0.4)',
          backdropFilter: 'blur(1px)',
        }}
      />

      {/* Inner precise deep red gemstone dot */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-100 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovering ? '8px' : '6px',
          height: isHovering ? '8px' : '6px',
          backgroundColor: '#9E3045',
          boxShadow: '0 0 8px rgba(158, 48, 69, 0.6), 0 0 16px rgba(214, 168, 95, 0.4)',
        }}
      />
    </div>
  );
};
