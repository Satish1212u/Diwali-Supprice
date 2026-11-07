import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DiyaIllustration, HandDrawnStar, MarigoldFlower, RangoliCorner } from './Decorations';
import { soundEffects } from '../utils/audio';

interface DiyaSceneProps {
  name: string;
  year: string;
}

export const DiyaScene: React.FC<DiyaSceneProps> = ({ name, year }) => {
  const [diyasLit, setDiyasLit] = useState<number[]>([1]); // Center diya lit initially
  const [isCascading, setIsCascading] = useState(false);
  const [isHoveringCentral, setIsHoveringCentral] = useState(false);
  const [hoveredSideIndex, setHoveredSideIndex] = useState<number | null>(null);

  // Dedicated reactive states for the sequential cascading glow effect
  // Directly controls opacity and box-shadow / drop-shadow across surrounding elements
  const [centralDiyaGlow, setCentralDiyaGlow] = useState({
    opacity: 1,
    boxShadow: '0 0 20px rgba(214, 168, 95, 0.4)',
    scale: 1,
  });

  const [surroundingDiyasGlow, setSurroundingDiyasGlow] = useState({
    opacity: 0.8,
    boxShadow: '0 0 0px rgba(214, 168, 95, 0)',
    scale: 1,
  });

  const [starsGlow, setStarsGlow] = useState({
    opacity: 0.75,
    filter: 'drop-shadow(0 0 0px rgba(214, 168, 95, 0))',
    scale: 1,
  });

  const [petalsGlow, setPetalsGlow] = useState({
    opacity: 0.75,
    filter: 'drop-shadow(0 0 0px rgba(248, 200, 220, 0))',
    scale: 1,
  });

  const [rangoliGlow, setRangoliGlow] = useState({
    opacity: 0.4,
    filter: 'drop-shadow(0 0 0px rgba(214, 168, 95, 0))',
  });

  const [cardGlow, setCardGlow] = useState({
    opacity: 1,
    boxShadow: '0 4px 20px -2px rgba(184, 58, 75, 0.08)',
  });

  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  /**
   * triggerCascadingGlow:
   * Sequentially updates the opacity, box-shadow, and glow filters of surrounding
   * decorative elements (diyas, stars, petals, rangoli) across the component.
   */
  const triggerCascadingGlow = () => {
    soundEffects.playDiyaIgnite();
    setIsCascading(true);
    setDiyasLit([0, 1, 2]);

    // 0ms: Step 1 - Central diya flares intensely
    setCentralDiyaGlow({
      opacity: 1,
      boxShadow: '0 0 40px rgba(214, 168, 95, 0.95), 0 0 70px rgba(165, 42, 58, 0.5)',
      scale: 1.14,
    });

    // Spawn floating golden sparks
    const newSparks = Array.from({ length: 18 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 280,
      y: (Math.random() - 0.5) * 90 - 25,
      color: i % 2 === 0 ? '#D6A85F' : '#F8C8DC',
    }));
    setSparks(newSparks);

    // 160ms: Step 2 - Surrounding side diyas ignite and increase opacity and box-shadow
    setTimeout(() => {
      setSurroundingDiyasGlow({
        opacity: 1,
        boxShadow: '0 0 25px rgba(214, 168, 95, 0.85), 0 0 40px rgba(165, 42, 58, 0.35)',
        scale: 1.1,
      });
    }, 160);

    // 340ms: Step 3 - Surrounding decorative stars illuminate with high opacity and radiant box-shadow
    setTimeout(() => {
      setStarsGlow({
        opacity: 1,
        filter: 'drop-shadow(0 0 14px rgba(214, 168, 95, 0.95)) drop-shadow(0 0 24px rgba(214, 168, 95, 0.6))',
        scale: 1.28,
      });
    }, 340);

    // 520ms: Step 4 - Floating marigolds and rose petals bloom with vibrant opacity and warm glow
    setTimeout(() => {
      setPetalsGlow({
        opacity: 1,
        filter: 'drop-shadow(0 0 16px rgba(245, 166, 35, 0.85)) drop-shadow(0 0 25px rgba(248, 200, 220, 0.6))',
        scale: 1.22,
      });
    }, 520);

    // 700ms: Step 5 - Corner Rangoli ornaments glow with increased opacity and delicate golden shadows
    setTimeout(() => {
      setRangoliGlow({
        opacity: 0.95,
        filter: 'drop-shadow(0 0 15px rgba(214, 168, 95, 0.8)) drop-shadow(0 0 28px rgba(220, 204, 244, 0.5))',
      });
    }, 700);

    // 880ms: Step 6 - Handwritten greeting card frame shimmers with golden champagne box-shadow
    setTimeout(() => {
      setCardGlow({
        opacity: 1,
        boxShadow: '0 0 35px rgba(214, 168, 95, 0.4), 0 12px 36px -4px rgba(158, 48, 69, 0.15)',
      });
    }, 880);

    // 3000ms: Gracefully settle into a warm, harmonious ambient resting state
    setTimeout(() => {
      setCentralDiyaGlow({
        opacity: 1,
        boxShadow: '0 0 20px rgba(214, 168, 95, 0.4)',
        scale: 1,
      });
      setSurroundingDiyasGlow({
        opacity: 0.9,
        boxShadow: '0 0 12px rgba(214, 168, 95, 0.35)',
        scale: 1,
      });
      setStarsGlow({
        opacity: 0.85,
        filter: 'drop-shadow(0 0 4px rgba(214, 168, 95, 0.4))',
        scale: 1,
      });
      setPetalsGlow({
        opacity: 0.85,
        filter: 'drop-shadow(0 0 4px rgba(245, 166, 35, 0.3))',
        scale: 1,
      });
      setRangoliGlow({
        opacity: 0.5,
        filter: 'drop-shadow(0 0 0px rgba(214, 168, 95, 0))',
      });
      setCardGlow({
        opacity: 1,
        boxShadow: '0 4px 20px -2px rgba(184, 58, 75, 0.08)',
      });
      setIsCascading(false);
      setSparks([]);
    }, 3200);
  };

  const toggleDiya = (index: number) => {
    if (!diyasLit.includes(index)) {
      setDiyasLit([...diyasLit, index]);
    }
    triggerCascadingGlow();
  };

  return (
    <section id="intro-section" className="relative py-20 px-4 sm:px-6 max-w-4xl mx-auto overflow-hidden">
      {/* Decorative Floral Rangoli Corners with cascading opacity and shadow */}
      <div
        className="absolute top-10 left-4 pointer-events-none hidden sm:block transition-all duration-700"
        style={{
          opacity: rangoliGlow.opacity,
          filter: rangoliGlow.filter,
        }}
      >
        <RangoliCorner position="top-left" size={95} />
      </div>

      <div
        className="absolute top-10 right-4 pointer-events-none hidden sm:block transition-all duration-700"
        style={{
          opacity: rangoliGlow.opacity,
          filter: rangoliGlow.filter,
        }}
      >
        <RangoliCorner position="top-right" size={95} />
      </div>

      <div className="relative text-center space-y-6">
        {/* Subtle Editorial Kicker with Cascading Star Glow */}
        <div className="flex items-center justify-center gap-2">
          <span
            className="h-[1px] transition-all duration-500"
            style={{
              width: isCascading ? '64px' : '32px',
              backgroundColor: '#D6A85F',
              boxShadow: isCascading ? '0 0 10px #D6A85F' : 'none',
            }}
          />
          <span className="text-xs uppercase tracking-widest text-[#9E3045] font-semibold">
            DIWALI {year}
          </span>
          <span
            className="h-[1px] transition-all duration-500"
            style={{
              width: isCascading ? '64px' : '32px',
              backgroundColor: '#D6A85F',
              boxShadow: isCascading ? '0 0 10px #D6A85F' : 'none',
            }}
          />
        </div>

        {/* Large Editorial Heading */}
        <h2
          className="font-serif-cormorant text-3xl sm:text-4xl md:text-5xl font-medium text-[#292524] max-w-2xl mx-auto leading-tight"
          style={{ textWrap: 'balance' }}
        >
          &ldquo;For someone who makes ordinary moments a little brighter.&rdquo;
        </h2>

        {/* Happy Diwali, Saba with cascading twinkle stars */}
        <div className="flex items-center justify-center gap-2.5 pt-1">
          <div
            className="transition-all duration-500"
            style={{
              opacity: starsGlow.opacity,
              filter: starsGlow.filter,
              transform: `scale(${starsGlow.scale})`,
            }}
          >
            <HandDrawnStar size={18} color="#D6A85F" />
          </div>

          <p className="font-serif-cormorant text-2xl sm:text-3xl font-semibold text-[#9E3045] tracking-wide">
            Happy Diwali, <span className="text-[#A52A3A] font-bold">{name}</span> 🪔
          </p>

          <div
            className="transition-all duration-500"
            style={{
              opacity: starsGlow.opacity,
              filter: starsGlow.filter,
              transform: `scale(${starsGlow.scale})`,
            }}
          >
            <HandDrawnStar size={18} color="#D6A85F" />
          </div>
        </div>

        {/* Floating Decorative Marigold Petals that respond to cascade */}
        <div className="flex items-center justify-center gap-6 py-1 pointer-events-none">
          {[-25, -10, 10, 25].map((deg, i) => (
            <div
              key={i}
              className="transition-all duration-500"
              style={{
                opacity: petalsGlow.opacity,
                filter: petalsGlow.filter,
                transform: `rotate(${deg}deg) scale(${petalsGlow.scale})`,
              }}
            >
              {i % 2 === 0 ? (
                <MarigoldFlower size={18} />
              ) : (
                <span className="text-sm select-none">🌸</span>
              )}
            </div>
          ))}
        </div>

        {/* CENTER INTERACTIVE DIYA & CASCADING LIGHTING SEQUENCE */}
        <div className="py-4 relative flex flex-col items-center">
          {/* Expanding golden light shockwave during cascade */}
          <AnimatePresence>
            {isCascading && (
              <motion.div
                initial={{ scale: 0.3, opacity: 0.9 }}
                animate={{ scale: 3.4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-[#D6A85F]/80 bg-[#FADDE8]/25 blur-[3px] pointer-events-none z-0"
              />
            )}
          </AnimatePresence>

          {/* Floating magical sparkle particles generated from diya */}
          <div className="absolute top-1/2 left-1/2 pointer-events-none z-20">
            {sparks.map((spark) => (
              <motion.div
                key={spark.id}
                initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                animate={{
                  x: spark.x,
                  y: spark.y - 75,
                  scale: [0, 1.4, 0.8],
                  opacity: [1, 0.85, 0],
                }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: spark.color,
                  boxShadow: `0 0 8px ${spark.color}`,
                }}
              />
            ))}
          </div>

          {/* The Diya Trio Container */}
          <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-9">
            {/* Left Accent Diya */}
            <button
              onClick={() => toggleDiya(0)}
              onMouseEnter={() => setHoveredSideIndex(0)}
              onMouseLeave={() => setHoveredSideIndex(null)}
              className="group relative flex flex-col items-center cursor-pointer transition-all duration-500 focus:outline-none rounded-full p-1"
              style={{
                opacity: surroundingDiyasGlow.opacity,
                transform: `scale(${hoveredSideIndex === 0 ? 1.08 : surroundingDiyasGlow.scale})`,
                filter: hoveredSideIndex === 0
                  ? 'drop-shadow(0 0 16px rgba(245, 166, 35, 0.8))'
                  : surroundingDiyasGlow.boxShadow !== 'none'
                  ? `drop-shadow(${surroundingDiyasGlow.boxShadow.replace('0 0 ', '0 0 ')})`
                  : undefined,
              }}
              title="Click to trigger lighting sequence"
            >
              {/* Warm-up base underglow for side diya */}
              <div
                className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-14 h-6 rounded-full transition-all duration-300 pointer-events-none ${
                  hoveredSideIndex === 0
                    ? 'bg-gradient-to-t from-[#F5A623]/60 via-[#D6A85F]/40 to-transparent blur-xs opacity-100 scale-120'
                    : 'opacity-0 scale-75'
                }`}
              />
              <DiyaIllustration size="sm" lit={diyasLit.includes(0)} isWarmingUp={hoveredSideIndex === 0} />
              <span className="font-handwriting text-xs text-[#9E3045] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {diyasLit.includes(0) ? 'glow ✨' : 'tap to light'}
              </span>
            </button>

            {/* Central Master Diya with triggerCascadingGlow and Warm-Up Base Illumination */}
            <motion.div
              onClick={triggerCascadingGlow}
              onMouseEnter={() => setIsHoveringCentral(true)}
              onMouseLeave={() => setIsHoveringCentral(false)}
              animate={{
                scale: isCascading ? [1.14, 1.1] : [1, 1.055, 1],
              }}
              transition={{
                duration: 2.2,
                repeat: isCascading ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="diya-container relative cursor-pointer transition-all duration-500 rounded-full p-2 flex flex-col items-center"
              style={{
                opacity: centralDiyaGlow.opacity,
                filter: isHoveringCentral
                  ? 'drop-shadow(0 6px 26px rgba(245, 166, 35, 0.95)) drop-shadow(0 0 40px rgba(214, 168, 95, 0.8))'
                  : `drop-shadow(0 0 20px rgba(214, 168, 95, ${isCascading ? '0.95' : '0.4'}))`,
              }}
              title="Click the central diya to ignite the cascade!"
            >
              {/* Subtle Base Warm-up Glow Halo directly beneath and around diya bowl */}
              <div
                className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-16 rounded-full transition-all duration-500 pointer-events-none ${
                  isHoveringCentral
                    ? 'bg-gradient-to-t from-[#F5A623]/75 via-[#D6A85F]/55 to-transparent blur-md scale-125 opacity-100'
                    : 'opacity-0 scale-90'
                }`}
              />

              {/* Pulsing warmth anticipation ring */}
              <div
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-8 rounded-full border border-[#D6A85F]/60 transition-all duration-700 pointer-events-none ${
                  isHoveringCentral ? 'opacity-80 scale-110 animate-ping' : 'opacity-0 scale-75'
                }`}
              />

              {/* Small 'tap me' handwritten-style hint on hover */}
              <AnimatePresence>
                {isHoveringCentral && !isCascading && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.88 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.88 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#FFFDF9]/95 border border-[#D6A85F]/80 shadow-xs whitespace-nowrap"
                  >
                    <span className="font-handwriting text-sm text-[#9E3045] font-semibold tracking-wide">
                      tap me ✨
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <DiyaIllustration
                size="xl"
                lit={diyasLit.includes(1)}
                isWarmingUp={isHoveringCentral}
              />
            </motion.div>

            {/* Right Accent Diya */}
            <button
              onClick={() => toggleDiya(2)}
              onMouseEnter={() => setHoveredSideIndex(2)}
              onMouseLeave={() => setHoveredSideIndex(null)}
              className="group relative flex flex-col items-center cursor-pointer transition-all duration-500 focus:outline-none rounded-full p-1"
              style={{
                opacity: surroundingDiyasGlow.opacity,
                transform: `scale(${hoveredSideIndex === 2 ? 1.08 : surroundingDiyasGlow.scale})`,
                filter: hoveredSideIndex === 2
                  ? 'drop-shadow(0 0 16px rgba(245, 166, 35, 0.8))'
                  : surroundingDiyasGlow.boxShadow !== 'none'
                  ? `drop-shadow(${surroundingDiyasGlow.boxShadow.replace('0 0 ', '0 0 ')})`
                  : undefined,
              }}
              title="Click to trigger lighting sequence"
            >
              {/* Warm-up base underglow for side diya */}
              <div
                className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-14 h-6 rounded-full transition-all duration-300 pointer-events-none ${
                  hoveredSideIndex === 2
                    ? 'bg-gradient-to-t from-[#F5A623]/60 via-[#D6A85F]/40 to-transparent blur-xs opacity-100 scale-120'
                    : 'opacity-0 scale-75'
                }`}
              />
              <DiyaIllustration size="sm" lit={diyasLit.includes(2)} isWarmingUp={hoveredSideIndex === 2} />
              <span className="font-handwriting text-xs text-[#9E3045] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {diyasLit.includes(2) ? 'glow ✨' : 'tap to light'}
              </span>
            </button>
          </div>

          {/* Interactive instruction with festive anticipation indicator */}
          <p className="font-handwriting text-sm text-[#9E3045] mt-3 flex items-center justify-center gap-1.5 transition-colors">
            {isHoveringCentral ? (
              <span className="text-[#A52A3A] font-semibold animate-pulse">
                (warmth gathers at the base... tap to ignite the cascade! ✨)
              </span>
            ) : (
              <span>(tap the central diya to ignite the festive lighting cascade ✨)</span>
            )}
          </p>

          {isCascading && (
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-serif-cormorant italic text-xs text-[#D6A85F] font-semibold tracking-wider uppercase mt-1"
            >
              Light cascades across the room...
            </motion.span>
          )}
        </div>

        {/* Handwritten note block that shimmers with box-shadow during the cascade */}
        <div
          className="max-w-lg mx-auto p-6 sm:p-7 rounded-3xl bg-[#FFF8F2] border transition-all duration-700 relative mt-6"
          style={{
            opacity: cardGlow.opacity,
            boxShadow: cardGlow.boxShadow,
            borderColor: isCascading ? '#D6A85F' : '#FADDE8',
          }}
        >
          <div
            className="absolute -top-3 right-6 transition-all duration-500"
            style={{
              opacity: petalsGlow.opacity,
              filter: petalsGlow.filter,
              transform: `scale(${petalsGlow.scale})`,
            }}
          >
            <MarigoldFlower size={22} className="opacity-85" />
          </div>

          <p className="font-handwriting text-xl sm:text-2xl text-[#9E3045] leading-relaxed text-center">
            &ldquo;Diwali is supposed to be about lights, happiness and beautiful moments...
            <br />
            So I thought, why not make one little moment just for you?&rdquo;
          </p>

          {/* Golden bottom sparkle accent */}
          <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-[#FADDE8]/70">
            <div
              className="transition-all duration-500"
              style={{
                opacity: starsGlow.opacity,
                filter: starsGlow.filter,
              }}
            >
              <HandDrawnStar size={12} color="#D6A85F" />
            </div>
            <span className="font-handwriting text-xs text-[#9E3045]/70">
              illuminated for Saba
            </span>
            <div
              className="transition-all duration-500"
              style={{
                opacity: starsGlow.opacity,
                filter: starsGlow.filter,
              }}
            >
              <HandDrawnStar size={12} color="#D6A85F" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
