import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type PetalType = 'rose' | 'cherry' | 'jasmine' | 'lavender' | 'marigold';
export type DepthLayer = 'background' | 'midground' | 'foreground';

interface PetalConfig {
  id: number;
  type: PetalType;
  layer: DepthLayer;
  startX: number; // percentage 0 - 100
  size: number;
  color: string;
  duration: number;
  delay: number;
  swayAmount: number; // horizontal drift px
  swayDuration: number;
  initialRotation: number;
  rotationDelta: number;
  opacity: number;
  blur: string;
}

interface FlowerBurstParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: PetalType;
  color: string;
  size: number;
  rotation: number;
  opacity: number;
}

// Global emitter so any component can trigger special flower bursts
type FlowerListener = (type: 'open-card' | 'fireworks' | 'diya-ignite') => void;
const flowerListeners: Set<FlowerListener> = new Set();

export const triggerFlowerBurst = (type: 'open-card' | 'fireworks' | 'diya-ignite') => {
  flowerListeners.forEach((fn) => fn(type));
};

interface FloatingFlowerSystemProps {
  currentSection?: string;
  isDiyaLit?: boolean;
}

export const FloatingFlowerSystem: React.FC<FloatingFlowerSystemProps> = ({
  currentSection = 'intro',
  isDiyaLit = false,
}) => {
  const [burstParticles, setBurstParticles] = useState<FlowerBurstParticle[]>([]);
  const [scrollSpeedMultiplier, setScrollSpeedMultiplier] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<number | null>(null);

  // Palette: Baby Pink, Soft Blush, Lavender, Very Light Purple, Selective Deep Rose, Subtle Champagne Gold
  const palette = useMemo(
    () => ({
      babyPink: '#F8C8DC',
      softBlush: '#FADDE8',
      lavender: '#DCCCF4',
      lightPurple: '#EEE6FA',
      deepRose: '#9E3045',
      softGold: '#D6A85F',
    }),
    []
  );

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track scroll velocity to gently accelerate petals on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - lastScrollY.current);
      lastScrollY.current = currentY;

      if (delta > 15) {
        setScrollSpeedMultiplier(1.4);
        if (scrollTimer.current) clearTimeout(scrollTimer.current);
        scrollTimer.current = window.setTimeout(() => {
          setScrollSpeedMultiplier(1);
        }, 400);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  // Handle special burst moments ("Open it ♡", fireworks wave, diya ignite)
  const triggerBurst = useCallback(
    (type: 'open-card' | 'fireworks' | 'diya-ignite') => {
      const count = type === 'fireworks' ? 24 : type === 'open-card' ? 20 : 12;
      const originX = typeof window !== 'undefined' ? window.innerWidth / 2 : 400;
      const originY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;

      const types: PetalType[] = ['cherry', 'rose', 'jasmine', 'lavender', 'marigold'];
      const colors = [
        palette.babyPink,
        palette.softBlush,
        palette.lavender,
        palette.deepRose,
        palette.softGold,
      ];

      const newParticles: FlowerBurstParticle[] = Array.from({ length: count }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 4.5 + 2.5;
        return {
          id: Date.now() + i,
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2, // initial upward lift
          type: types[i % types.length],
          color: colors[i % colors.length],
          size: Math.random() * 12 + 16,
          rotation: Math.random() * 360,
          opacity: 0.95,
        };
      });

      setBurstParticles(newParticles);

      // Fade out burst particles over 2.8s
      setTimeout(() => {
        setBurstParticles([]);
      }, 2800);
    },
    [palette]
  );

  useEffect(() => {
    flowerListeners.add(triggerBurst);
    return () => {
      flowerListeners.delete(triggerBurst);
    };
  }, [triggerBurst]);

  // Total continuous petals: 30 on desktop, 15 on mobile
  const petalCount = isMobile ? 15 : 30;

  // Generate continuous floating petals across 3 depth layers
  const petals = useMemo<PetalConfig[]>(() => {
    const items: PetalConfig[] = [];
    const types: PetalType[] = ['cherry', 'rose', 'jasmine', 'lavender', 'marigold'];

    for (let i = 0; i < petalCount; i++) {
      const layer: DepthLayer = i % 3 === 0 ? 'foreground' : i % 3 === 1 ? 'midground' : 'background';
      const type = types[i % types.length];

      // Palette tuned to sections or general harmony
      let color = palette.softBlush;
      if (type === 'cherry') color = palette.babyPink;
      if (type === 'lavender') color = palette.lavender;
      if (type === 'rose') color = i % 5 === 0 ? palette.deepRose : palette.babyPink;
      if (type === 'jasmine') color = palette.lightPurple;
      if (type === 'marigold') color = i % 2 === 0 ? palette.softGold : palette.softBlush;

      // Layer specific sizes, opacities, and speeds
      let size = 18;
      let opacity = 0.65;
      let duration = 16;
      let blur = '0px';

      if (layer === 'background') {
        size = Math.random() * 4 + 10; // 10px - 14px
        opacity = Math.random() * 0.15 + 0.3; // 0.3 - 0.45
        duration = Math.random() * 6 + 18; // 18s - 24s slow
        blur = '1.2px';
      } else if (layer === 'midground') {
        size = Math.random() * 6 + 17; // 17px - 23px
        opacity = Math.random() * 0.15 + 0.6; // 0.6 - 0.75
        duration = Math.random() * 5 + 14; // 14s - 19s
        blur = '0px';
      } else {
        // Foreground
        size = Math.random() * 8 + 24; // 24px - 32px
        opacity = Math.random() * 0.2 + 0.7; // 0.7 - 0.9
        duration = Math.random() * 4 + 11; // 11s - 15s slightly faster
        blur = '0.4px';
      }

      items.push({
        id: i,
        type,
        layer,
        startX: (i / petalCount) * 100 + (Math.random() - 0.5) * 8,
        size,
        color,
        duration,
        delay: (i * 0.7) % 14,
        swayAmount: Math.random() * 45 + 30, // 30px to 75px
        swayDuration: Math.random() * 2 + 3.5, // 3.5s - 5.5s
        initialRotation: Math.random() * 360,
        rotationDelta: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 180),
        opacity,
        blur,
      });
    }

    return items;
  }, [petalCount, palette]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Continuous Multi-Layer Ambient Floating Petals */}
      {petals.map((petal) => {
        // Effective duration scaled subtly during user scroll
        const effectiveDuration = petal.duration / scrollSpeedMultiplier;

        return (
          <motion.div
            key={petal.id}
            initial={{
              x: `${petal.startX}vw`,
              y: '-8vh',
              rotate: petal.initialRotation,
              opacity: 0,
            }}
            animate={{
              y: '108vh',
              rotate: petal.initialRotation + petal.rotationDelta,
              opacity: [0, petal.opacity, petal.opacity * 0.9, 0],
            }}
            transition={{
              duration: effectiveDuration,
              delay: petal.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              filter: `blur(${petal.blur}) ${
                isDiyaLit ? 'drop-shadow(0 0 6px rgba(214, 168, 95, 0.4))' : ''
              }`,
            }}
          >
            {/* Horizontal Gentle Wind Sway (left -> right -> left) */}
            <motion.div
              animate={{
                x: [0, petal.swayAmount, -petal.swayAmount * 0.6, 0],
                y: [0, -8, 8, 0], // subtle upward breeze dip
                rotateZ: [0, 18, -14, 0],
              }}
              transition={{
                duration: petal.swayDuration,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <PetalShape
                type={petal.type}
                size={petal.size}
                color={petal.color}
                isDiyaLit={isDiyaLit}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {/* 2. Special Celebration Petal Bursts ("Open it ♡" & Fireworks wave) */}
      <AnimatePresence>
        {burstParticles.map((burst) => (
          <motion.div
            key={burst.id}
            initial={{
              x: burst.x,
              y: burst.y,
              scale: 0.2,
              rotate: burst.rotation,
              opacity: burst.opacity,
            }}
            animate={{
              x: burst.x + burst.vx * 38,
              y: burst.y + burst.vy * 32 + 140, // gravity drop
              scale: 1,
              rotate: burst.rotation + 240,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ position: 'absolute' }}
          >
            <PetalShape
              type={burst.type}
              size={burst.size}
              color={burst.color}
              isDiyaLit={true}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Handcrafted SVG Petal & Blossom Shapes:
 * 1. Cherry Blossom Petal (notched delicate curve)
 * 2. Rose Petal (voluptuous soft teardrop)
 * 3. Jasmine Flower (tiny 5-petaled white/lavender bloom)
 * 4. Lavender Blossom (slender lilac petal)
 * 5. Marigold Petal (sunlit warm scalloped petal)
 */
const PetalShape: React.FC<{
  type: PetalType;
  size: number;
  color: string;
  isDiyaLit?: boolean;
}> = ({ type, size, color, isDiyaLit = false }) => {
  switch (type) {
    case 'cherry':
      return (
        <svg
          width={size}
          height={size * 1.15}
          viewBox="0 0 32 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle cherry petal notch at the tip */}
          <path
            d="M16 2 C13 6, 8 10, 8 18 C8 26, 12 32, 16 34 C20 32, 24 26, 24 18 C24 10, 19 6, 16 2 Z"
            fill={color}
            fillOpacity="0.85"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          {/* Delicate petal vein */}
          <path
            d="M16 10 L16 28"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'rose':
      return (
        <svg
          width={size * 1.1}
          height={size}
          viewBox="0 0 36 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 4 C10 4, 4 10, 4 18 C4 26, 12 30, 18 30 C24 30, 32 26, 32 18 C32 10, 26 4, 18 4 Z"
            fill={color}
            fillOpacity="0.82"
          />
          <path
            d="M18 7 C13 9, 8 14, 8 19"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'jasmine':
      return (
        <svg
          width={size * 1.1}
          height={size * 1.1}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 5-Petal delicate jasmine blossom */}
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="18"
              cy="18"
              rx="4"
              ry="10"
              fill={color}
              fillOpacity="0.85"
              transform={`rotate(${deg} 18 18)`}
            />
          ))}
          {/* Warm blossom center */}
          <circle cx="18" cy="18" r="2.5" fill="#D6A85F" />
        </svg>
      );

    case 'lavender':
      return (
        <svg
          width={size * 0.75}
          height={size * 1.3}
          viewBox="0 0 24 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2 C8 10, 4 18, 4 26 C4 34, 8 38, 12 38 C16 38, 20 34, 20 26 C20 18, 16 10, 12 2 Z"
            fill={color}
            fillOpacity="0.8"
          />
          <path
            d="M12 12 Q 14 20 12 32"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.6"
          />
        </svg>
      );

    case 'marigold':
    default:
      return (
        <svg
          width={size}
          height={size * 1.1}
          viewBox="0 0 32 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 2 C11 8, 6 15, 6 22 C6 28, 10 32, 16 33 C22 32, 26 28, 26 22 C26 15, 21 8, 16 2 Z"
            fill={color}
            fillOpacity="0.84"
          />
          <circle cx="16" cy="24" r="2.5" fill="#9E3045" fillOpacity="0.5" />
        </svg>
      );
  }
};
