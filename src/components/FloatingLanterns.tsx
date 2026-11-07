import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';

type LanternShape = 'oval' | 'balloon' | 'kandil';
type LanternDepth = 'far' | 'mid' | 'near';

interface LanternConfig {
  id: number;
  shape: LanternShape;
  depth: LanternDepth;
  startX: number; // 0 to 100 vw
  size: number;
  duration: number; // upward float speed (seconds)
  delay: number;
  swayAmount: number; // horizontal drift px
  swayDuration: number;
  opacity: number;
  glowColor: string;
  paperColor: string;
  blur: string;
  initialSwayOffset: number;
}

interface FloatingLanternsProps {
  className?: string;
  isWarmMode?: boolean;
}

export const FloatingLanterns: React.FC<FloatingLanternsProps> = ({
  className = '',
  isWarmMode = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lantern count: 14 on desktop, 7 on mobile for optimal performance
  const lanternCount = isMobile ? 7 : 14;

  const lanterns = useMemo<LanternConfig[]>(() => {
    const items: LanternConfig[] = [];
    const shapes: LanternShape[] = ['oval', 'balloon', 'kandil'];

    for (let i = 0; i < lanternCount; i++) {
      const depth: LanternDepth = i % 3 === 0 ? 'near' : i % 3 === 1 ? 'mid' : 'far';
      const shape = shapes[i % shapes.length];

      // Depth parameters
      let size = 34;
      let opacity = 0.55;
      let duration = 24;
      let blur = '0px';

      if (depth === 'far') {
        size = Math.random() * 6 + 18; // 18px - 24px
        opacity = Math.random() * 0.15 + 0.3; // 0.3 - 0.45
        duration = Math.random() * 8 + 32; // 32s - 40s slow ascent
        blur = '1.2px';
      } else if (depth === 'mid') {
        size = Math.random() * 8 + 28; // 28px - 36px
        opacity = Math.random() * 0.15 + 0.55; // 0.55 - 0.7
        duration = Math.random() * 6 + 24; // 24s - 30s
        blur = '0px';
      } else {
        // near
        size = Math.random() * 10 + 42; // 42px - 52px
        opacity = Math.random() * 0.2 + 0.72; // 0.72 - 0.92
        duration = Math.random() * 5 + 18; // 18s - 23s
        blur = '0.4px';
      }

      // Warm festive palette: Ivory Cream, Soft Blush Pink, Light Lavender, Champagne Gold
      const colorOptions = [
        { paper: '#FFF8F2', glow: '#D6A85F' },
        { paper: '#FADDE8', glow: '#9E3045' },
        { paper: '#EEE6FA', glow: '#DCCCF4' },
        { paper: '#FFFDF9', glow: '#D6A85F' },
      ];
      const selectedColor = colorOptions[i % colorOptions.length];

      items.push({
        id: i,
        shape,
        depth,
        startX: (i / lanternCount) * 94 + 3 + (Math.random() - 0.5) * 6,
        size,
        duration,
        delay: (i * 2.8) % 24,
        swayAmount: Math.random() * 25 + 18, // 18px - 43px horizontal sway
        swayDuration: Math.random() * 2.5 + 4.5, // 4.5s - 7s
        opacity,
        paperColor: selectedColor.paper,
        glowColor: selectedColor.glow,
        blur,
        initialSwayOffset: Math.random() * 10,
      });
    }

    return items;
  }, [lanternCount]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[12] overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {lanterns.map((lantern) => (
        <motion.div
          key={lantern.id}
          initial={{
            x: `${lantern.startX}vw`,
            y: '112vh',
            opacity: 0,
          }}
          animate={{
            y: '-18vh',
            opacity: [0, lantern.opacity, lantern.opacity * 0.9, lantern.opacity * 0.4, 0],
          }}
          transition={{
            duration: lantern.duration,
            delay: lantern.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            filter: `blur(${lantern.blur}) drop-shadow(0 0 10px ${lantern.glowColor}55)`,
          }}
        >
          {/* Gentle organic thermal breeze sway (left <-> right) */}
          <motion.div
            animate={{
              x: [0, lantern.swayAmount, -lantern.swayAmount * 0.7, 0],
              y: [0, -6, 4, 0],
              rotate: [0, 2.5, -2, 0],
            }}
            transition={{
              duration: lantern.swayDuration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <LanternIllustration
              shape={lantern.shape}
              size={lantern.size}
              paperColor={lantern.paperColor}
              glowColor={lantern.glowColor}
              depth={lantern.depth}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Handcrafted SVG Lantern Illustrations with glowing inner candle flame
 */
const LanternIllustration: React.FC<{
  shape: LanternShape;
  size: number;
  paperColor: string;
  glowColor: string;
  depth: LanternDepth;
}> = ({ shape, size, paperColor, glowColor, depth }) => {
  const width = size;
  const height = size * 1.35;

  if (shape === 'kandil') {
    // Akash Kandil / Star Lantern
    return (
      <svg
        width={width}
        height={height * 1.25}
        viewBox="0 0 40 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Ambient Candle Glow Behind */}
        <ellipse cx="20" cy="24" rx="14" ry="14" fill={glowColor} fillOpacity="0.25" />

        {/* Diamond Center Body */}
        <polygon
          points="20,4 34,22 20,40 6,22"
          fill={paperColor}
          fillOpacity="0.88"
          stroke={glowColor}
          strokeWidth="0.8"
        />

        {/* Geometric facets */}
        <line x1="20" y1="4" x2="20" y2="40" stroke={glowColor} strokeWidth="0.5" strokeOpacity="0.6" />
        <line x1="6" y1="22" x2="34" y2="22" stroke={glowColor} strokeWidth="0.5" strokeOpacity="0.6" />

        {/* Inner Flame */}
        <circle cx="20" cy="22" r="3.5" fill="#FFF8F2" />
        <circle cx="20" cy="22" r="2" fill="#D6A85F" className="animate-pulse" />

        {/* Hanging Tassels / Streamers */}
        <path
          d="M12 40 Q 11 48 10 54 M20 40 L 20 56 M28 40 Q 29 48 30 54"
          stroke={glowColor}
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeDasharray="1.5 1.5"
          strokeOpacity="0.8"
        />
      </svg>
    );
  }

  if (shape === 'balloon') {
    // Teardrop Sky Lantern
    return (
      <svg
        width={width}
        height={height}
        viewBox="0 0 36 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Soft Radial Backlight */}
        <circle cx="18" cy="26" r="15" fill={glowColor} fillOpacity="0.22" />

        {/* Balloon Body */}
        <path
          d="M18 4 C9 4 5 13 5 24 C5 34 12 42 15 44 L21 44 C24 42 31 34 31 24 C31 13 27 4 18 4 Z"
          fill={paperColor}
          fillOpacity="0.85"
          stroke={glowColor}
          strokeWidth="0.75"
        />

        {/* Bamboo Frame Ribs */}
        <path
          d="M18 4 Q 13 24 16 44"
          stroke={glowColor}
          strokeWidth="0.5"
          strokeOpacity="0.45"
        />
        <path
          d="M18 4 Q 23 24 20 44"
          stroke={glowColor}
          strokeWidth="0.5"
          strokeOpacity="0.45"
        />

        {/* Bottom Wooden Rim */}
        <ellipse cx="18" cy="44" rx="3.5" ry="1.2" fill="#9E3045" fillOpacity="0.7" />

        {/* Flickering Flame at Base */}
        <ellipse cx="18" cy="41" rx="2.5" ry="3.5" fill="#FFFDF9" />
        <ellipse cx="18" cy="41" rx="1.5" ry="2" fill="#D6A85F" className="animate-pulse" />

        {/* Trailing Thread */}
        {depth === 'near' && (
          <line
            x1="18"
            y1="45"
            x2="18"
            y2="52"
            stroke={glowColor}
            strokeWidth="0.6"
            strokeOpacity="0.6"
          />
        )}
      </svg>
    );
  }

  // Classic Oval Sky Lantern (Default)
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="overflow-visible"
    >
      {/* Outer Atmospheric Aura */}
      <ellipse cx="18" cy="24" rx="16" ry="18" fill={glowColor} fillOpacity="0.24" />

      {/* Arched Top Lantern Body */}
      <path
        d="M18 4 C11 4 6 12 6 23 C6 33 11 41 14 43 L22 43 C25 41 30 33 30 23 C30 12 25 4 18 4 Z"
        fill={paperColor}
        fillOpacity="0.87"
        stroke={glowColor}
        strokeWidth="0.75"
      />

      {/* Soft Paper Vertical Ribs */}
      <path
        d="M18 4 L18 43"
        stroke={glowColor}
        strokeWidth="0.5"
        strokeOpacity="0.4"
      />
      <path
        d="M12 7 Q 10 23 15 42"
        stroke={glowColor}
        strokeWidth="0.45"
        strokeOpacity="0.35"
      />
      <path
        d="M24 7 Q 26 23 21 42"
        stroke={glowColor}
        strokeWidth="0.45"
        strokeOpacity="0.35"
      />

      {/* Inner Flame Light Source */}
      <circle cx="18" cy="38" r="3" fill="#FFFDF9" />
      <circle cx="18" cy="38" r="1.8" fill="#D6A85F" className="animate-pulse" />

      {/* Rim Base Ring */}
      <ellipse cx="18" cy="43" rx="4" ry="1.2" stroke={glowColor} strokeWidth="0.6" fill="#FFF8F2" />
    </svg>
  );
};
