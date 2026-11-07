import React, { useState } from 'react';

/**
 * Handcrafted Indian decorative elements:
 * Diyas, delicate rangoli patterns, marigolds, stars, washi tapes, and doodles.
 */

export const DiyaIllustration: React.FC<{
  className?: string;
  lit?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isWarmingUp?: boolean;
}> = ({ className = '', lit = true, size = 'md', isWarmingUp = false }) => {
  const sizeMap = {
    sm: 'w-12 h-10',
    md: 'w-20 h-16',
    lg: 'w-32 h-24',
    xl: 'w-44 h-32',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeMap[size]} overflow-visible`}
      >
        {/* Soft atmospheric glow when lit */}
        {lit && (
          <ellipse
            cx="80"
            cy="45"
            rx="50"
            ry="40"
            fill="url(#glowGradient)"
            className="opacity-70 animate-pulse pointer-events-none"
          />
        )}

        {/* Anticipation Warm-up Glow at Diya Base when hovered */}
        {isWarmingUp && (
          <ellipse
            cx="80"
            cy="92"
            rx="56"
            ry="26"
            fill="url(#warmUpGlow)"
            className="animate-pulse pointer-events-none"
          />
        )}

        <defs>
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FADDE8" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#D6A85F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFDF9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="warmUpGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5A623" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#D6A85F" stopOpacity="0.6" />
            <stop offset="75%" stopColor="#9E3045" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFDF9" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="clayGradient" x1="20" y1="60" x2="140" y2="115" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D9822B" />
            <stop offset="45%" stopColor="#A52A3A" />
            <stop offset="100%" stopColor="#9E3045" />
          </linearGradient>
          <linearGradient id="rimGold" x1="20" y1="65" x2="140" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D6A85F" />
            <stop offset="50%" stopColor="#FCE7B8" />
            <stop offset="100%" stopColor="#C49348" />
          </linearGradient>
          <radialGradient id="flameInner" cx="50%" cy="80%" r="75%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#FFF1B8" />
            <stop offset="60%" stopColor="#F5A623" />
            <stop offset="100%" stopColor="#B83A4B" />
          </radialGradient>
        </defs>

        {/* Diya Base - Terracotta & Brass feel */}
        <g>
          {/* Base shadow */}
          <ellipse cx="80" cy="112" rx="36" ry="6" fill="#8F3041" fillOpacity="0.15" />
          
          {/* Main bowl */}
          <path
            d="M20 70 C 22 100, 60 112, 80 112 C 100 112, 138 100, 140 70 C 130 76, 105 82, 80 82 C 55 82, 30 76, 20 70 Z"
            fill="url(#clayGradient)"
            stroke="#8F3041"
            strokeWidth="1.5"
          />

          {/* Diya Rim */}
          <ellipse
            cx="80"
            cy="70"
            rx="60"
            ry="14"
            fill="#B83A4B"
            stroke="url(#rimGold)"
            strokeWidth="2"
          />
          <ellipse
            cx="80"
            cy="70"
            rx="52"
            ry="10"
            fill="#5E1B27"
          />

          {/* Golden oil pool */}
          <ellipse
            cx="80"
            cy="71"
            rx="46"
            ry="7"
            fill="#804A15"
            fillOpacity="0.8"
          />

          {/* Anticipation oil pool warm-up ember */}
          {isWarmingUp && (
            <ellipse
              cx="80"
              cy="71"
              rx="38"
              ry="5.5"
              fill="#F5A623"
              fillOpacity="0.65"
              className="animate-pulse"
            />
          )}

          {/* Intimate decorative etched patterns on bowl */}
          <path
            d="M48 88 Q 80 98 112 88"
            stroke="#D6A85F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 4"
          />
          <circle cx="80" cy="95" r="2.5" fill="#D6A85F" />
          <circle cx="65" cy="93" r="2" fill="#D6A85F" opacity="0.8" />
          <circle cx="95" cy="93" r="2" fill="#D6A85F" opacity="0.8" />

          {/* Wick */}
          <path
            d="M80 72 Q 79 56 80 48"
            stroke="#3B2314"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Anticipation ember spark at wick tip */}
          {isWarmingUp && !lit && (
            <g className="animate-pulse">
              <circle cx="80" cy="48" r="4.5" fill="#F5A623" fillOpacity="0.6" />
              <circle cx="80" cy="48" r="2.5" fill="#FFF1B8" />
            </g>
          )}
        </g>

        {/* Diya Flame */}
        {lit && (
          <g className="animate-diya-flame" style={{ transformOrigin: '80px 48px' }}>
            {/* Outer flame aura */}
            <path
              d="M80 15 C 65 35, 66 52, 80 54 C 94 52, 95 35, 80 15 Z"
              fill="url(#flameInner)"
              opacity="0.9"
            />
            {/* Inner intense heart of flame */}
            <path
              d="M80 25 C 72 38, 73 50, 80 52 C 87 50, 88 38, 80 25 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export const RangoliCorner: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number;
}> = ({ position = 'top-left', className = '', size = 90 }) => {
  const rotationClass = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  }[position];

  return (
    <div className={`pointer-events-none select-none ${rotationClass} ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-45"
      >
        <path
          d="M0 0 L 70 0 C 65 25, 45 45, 20 50 L 0 50 Z"
          fill="#FADDE8"
          fillOpacity="0.4"
        />
        <path
          d="M0 80 Q 40 40 80 0"
          stroke="#D6A85F"
          strokeWidth="1.2"
          strokeDasharray="3 3"
        />
        <path
          d="M0 60 Q 30 30 60 0"
          stroke="#B83A4B"
          strokeWidth="1"
        />
        <path
          d="M0 40 Q 20 20 40 0"
          stroke="#DCCCF4"
          strokeWidth="1.5"
        />
        <circle cx="20" cy="20" r="4" fill="#B83A4B" fillOpacity="0.5" />
        <circle cx="36" cy="12" r="2.5" fill="#D6A85F" />
        <circle cx="12" cy="36" r="2.5" fill="#D6A85F" />
        <circle cx="48" cy="8" r="1.5" fill="#DCCCF4" />
        <circle cx="8" cy="48" r="1.5" fill="#DCCCF4" />
        {/* Delicate petals */}
        <path
          d="M20 20 Q 28 8 36 20 Q 28 32 20 20 Z"
          fill="#F8C8DC"
          stroke="#8F3041"
          strokeWidth="0.75"
        />
      </svg>
    </div>
  );
};

export const HandDrawnStar: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 20, color = '#D6A85F' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    <path
      d="M12 2 L13.8 8.6 L20.5 9.2 L15.2 13.5 L17 20 L12 16 L7 20 L8.8 13.5 L3.5 9.2 L10.2 8.6 Z"
      fill={color}
      stroke={color}
      strokeWidth="0.8"
      strokeLinejoin="round"
      opacity="0.85"
    />
  </svg>
);

export const MarigoldFlower: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block select-none ${className}`}
  >
    {/* Outer petals */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
      <ellipse
        key={i}
        cx="20"
        cy="20"
        rx="5"
        ry="12"
        fill={i % 2 === 0 ? "#F5A623" : "#F8C8DC"}
        opacity="0.85"
        transform={`rotate(${deg} 20 20)`}
      />
    ))}
    {/* Inner center */}
    <circle cx="20" cy="20" r="7" fill="#B83A4B" />
    <circle cx="20" cy="20" r="4" fill="#D6A85F" />
  </svg>
);

/**
 * Secret Star with delightful easter egg interaction
 */
export const SecretEasterEggStar: React.FC<{
  senderName: string;
}> = ({ senderName }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setRevealed(!revealed)}
        className="group relative p-1.5 rounded-full transition-transform hover:scale-125 focus:outline-none focus:ring-1 focus:ring-[#D6A85F]"
        title="What's this tiny star?"
        aria-label="Secret decorative star"
      >
        <HandDrawnStar
          size={24}
          color="#D6A85F"
          className="animate-spin-slow transition-colors group-hover:fill-[#B83A4B]"
        />
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B83A4B] opacity-40"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D6A85F]"></span>
        </span>
      </button>

      {revealed && (
        <div
          role="dialog"
          aria-live="polite"
          className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-[#FFFDF9] border border-[#F8C8DC] rounded-xl shadow-lg text-center font-handwriting text-base text-[#8F3041] animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="text-xs uppercase tracking-wider text-[#D6A85F] font-sans font-medium mb-1">
            You found a secret ✨
          </div>
          <p className="leading-snug">
            {senderName} says: &ldquo;Psst... you officially owe me a box of Kaju Katli for making this whole website!&rdquo; 🎁
          </p>
          <button
            onClick={() => setRevealed(false)}
            className="mt-2 text-xs text-[#8F3041]/60 underline hover:text-[#8F3041]"
          >
            okay fine 😂
          </button>
        </div>
      )}
    </div>
  );
};
