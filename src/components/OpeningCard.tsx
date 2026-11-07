import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DiyaIllustration, HandDrawnStar, MarigoldFlower, RangoliCorner } from './Decorations';
import { soundEffects } from '../utils/audio';
import { triggerFlowerBurst } from './FloatingFlowerSystem';

interface OpeningCardProps {
  name: string;
  sender: string;
  onOpenComplete: () => void;
}

export const OpeningCard: React.FC<OpeningCardProps> = ({
  name,
  sender,
  onOpenComplete,
}) => {
  // Cinematic progression stages:
  // 0: Initial soft particles drifting in
  // 1: Glowing aura forms
  // 2: "for..." and "Saba" reveal
  // 3: Unlit central diya appears with "Something is missing... Light it."
  // 4: Diya lit, golden light expands, background diyas illuminate one by one
  // 5: Unlocked invitation card with "Open it ♡" and step inside transition
  const [stage, setStage] = useState<number>(0);
  const [backgroundDiyasLit, setBackgroundDiyasLit] = useState<number[]>([]);
  const [isHoveringDiya, setIsHoveringDiya] = useState(false);

  useEffect(() => {
    // Cinematic timeline
    const t1 = setTimeout(() => setStage(1), 700);  // Aura forms
    const t2 = setTimeout(() => setStage(2), 1600); // Saba reveals
    const t3 = setTimeout(() => setStage(3), 2600); // Central Diya with "Light it" appears

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleLightDiya = () => {
    if (stage !== 3) return;
    soundEffects.playDiyaIgnite();
    triggerFlowerBurst('diya-ignite');
    setStage(4);

    // Stagger illumination of surrounding mini diyas
    setTimeout(() => setBackgroundDiyasLit((prev) => [...prev, 0]), 400);
    setTimeout(() => setBackgroundDiyasLit((prev) => [...prev, 1]), 800);
    setTimeout(() => setBackgroundDiyasLit((prev) => [...prev, 2]), 1200);
    setTimeout(() => setBackgroundDiyasLit((prev) => [...prev, 3]), 1600);

    // Transition to physical card / invitation reveal
    setTimeout(() => {
      setStage(5);
    }, 2400);
  };

  const handleCardOpen = () => {
    soundEffects.playEnvelopeOpen();
    // Special flower burst when opening the card
    setTimeout(() => {
      triggerFlowerBurst('open-card');
    }, 450);
    onOpenComplete();
  };

  return (
    <section className="relative min-h-[96vh] flex flex-col items-center justify-center px-4 py-12 overflow-hidden transition-colors duration-1000">
      {/* Dynamic warm aura background expander when diya is lit */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${
          stage >= 4 ? 'bg-[#FFF8F2]/70 backdrop-blur-[1px]' : 'bg-transparent'
        }`}
      />

      {/* Decorative Corner Rangoli Motifs */}
      <RangoliCorner position="top-left" className="absolute top-3 left-3 opacity-40" size={85} />
      <RangoliCorner position="top-right" className="absolute top-3 right-3 opacity-40" size={85} />

      {/* Cinematic Ambient Drifting Sparks & Dust */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: Math.random() * 800 + 100,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
              opacity: 0,
              scale: 0.6,
            }}
            animate={{
              y: [null, '-=140'],
              x: [null, `+=${(Math.random() - 0.5) * 60}`],
              opacity: [0, 0.65, 0],
              scale: [0.6, 1.2, 0.8],
            }}
            transition={{
              duration: 7 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? '5px' : '3px',
              height: i % 3 === 0 ? '5px' : '3px',
              backgroundColor: i % 2 === 0 ? '#D6A85F' : '#DCCCF4',
              boxShadow: '0 0 8px currentColor',
            }}
          />
        ))}
      </div>

      {/* Central Experience Stage */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Glowing Circular Aura that gathers particles */}
        <div className="relative my-2 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{
              scale: stage >= 1 ? [1, 1.06, 1] : 0.4,
              opacity: stage >= 1 ? 1 : 0,
            }}
            transition={{
              scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 1.2 },
            }}
            className="absolute -inset-10 sm:-inset-16 rounded-full bg-gradient-to-tr from-[#F8C8DC]/45 via-[#DCCCF4]/35 to-[#FFF8F2]/60 blur-xl pointer-events-none"
          />

          {/* Intimate "for..." Note */}
          <div className="relative z-10 flex flex-col items-center">
            <AnimatePresence>
              {stage >= 2 && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="font-handwriting text-2xl sm:text-3xl text-[#9E3045] mb-1 tracking-wide"
                >
                  for...
                </motion.p>
              )}
            </AnimatePresence>

            {/* Recipient Saba reveal with Selective Deep Rose/Red and Hand-drawn Elements */}
            <AnimatePresence>
              {stage >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="relative inline-flex items-center justify-center my-1"
                >
                  <HandDrawnStar size={18} color="#D6A85F" className="mr-3 -mt-2 animate-pulse" />
                  <h1 className="font-serif-cormorant text-6xl sm:text-7xl md:text-8xl font-medium tracking-tight text-[#9E3045]">
                    {name}
                  </h1>
                  <HandDrawnStar size={18} color="#D6A85F" className="ml-3 -mt-2 animate-pulse" />
                  <MarigoldFlower size={24} className="absolute -top-3 -right-6 opacity-85" />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {stage >= 2 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="font-serif-cormorant italic text-lg sm:text-xl text-[#292524]/75 mt-1"
                >
                  a little Diwali surprise ♡
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Central Interactive Diya & Lighting Ritual */}
        <div className="my-8 relative w-full flex flex-col items-center">
          {/* Background Surrounding Mini Diyas that illuminate in sequence */}
          <div className="absolute inset-x-0 -top-4 flex justify-between px-4 sm:px-12 pointer-events-none opacity-85">
            <div className="transform -translate-y-4">
              <DiyaIllustration size="sm" lit={backgroundDiyasLit.includes(0)} />
            </div>
            <div className="transform translate-y-6">
              <DiyaIllustration size="sm" lit={backgroundDiyasLit.includes(1)} />
            </div>
            <div className="transform translate-y-6">
              <DiyaIllustration size="sm" lit={backgroundDiyasLit.includes(2)} />
            </div>
            <div className="transform -translate-y-4">
              <DiyaIllustration size="sm" lit={backgroundDiyasLit.includes(3)} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {stage === 3 ? (
              /* Stage 3: Unlit Diya waiting for touch */
              <motion.div
                key="unlit-phase"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center space-y-4 cursor-pointer pt-4"
                onClick={handleLightDiya}
                onMouseEnter={() => setIsHoveringDiya(true)}
                onMouseLeave={() => setIsHoveringDiya(false)}
              >
                {/* Diya container with subtle pulsating scale animation */}
                <motion.div
                  className="diya-container relative group cursor-pointer flex flex-col items-center"
                  animate={{
                    scale: [1, 1.055, 1],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.09 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Small 'tap me' handwritten-style hint on hover */}
                  <AnimatePresence>
                    {isHoveringDiya && stage === 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.88 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.88 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#FFFDF9]/95 border border-[#D6A85F]/70 shadow-xs whitespace-nowrap"
                      >
                        <span className="font-handwriting text-sm text-[#9E3045] font-semibold tracking-wide">
                          tap me ✨
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Subtle golden hint halo on hover */}
                  {isHoveringDiya && (
                    <div className="absolute inset-0 rounded-full bg-[#D6A85F]/20 blur-md pointer-events-none" />
                  )}
                  <DiyaIllustration size="xl" lit={false} isWarmingUp={isHoveringDiya} />
                </motion.div>

                <div className="space-y-1">
                  <p className="font-handwriting text-lg text-[#292524]/60">
                    Something is missing...
                  </p>
                  <button
                    onClick={handleLightDiya}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#FFFDF9] border border-[#9E3045]/50 text-[#9E3045] text-sm font-serif-cormorant font-semibold tracking-wide shadow-xs hover:bg-[#FADDE8]/40 hover:border-[#9E3045] hover:shadow transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    <span>Light it ✨</span>
                  </button>
                </div>
              </motion.div>
            ) : stage === 4 ? (
              /* Stage 4: Diya just lit, warm aura expanding */
              <motion.div
                key="lighting-phase"
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1.08, opacity: 1 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col items-center space-y-3 pt-4"
              >
                <div className="relative">
                  <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-[#D6A85F]/35 via-[#F8C8DC]/40 to-[#9E3045]/20 blur-2xl animate-pulse" />
                  <DiyaIllustration size="xl" lit={true} />
                </div>
                <p className="font-handwriting text-xl text-[#9E3045] animate-pulse">
                  The flame awakens... ✨
                </p>
              </motion.div>
            ) : stage >= 5 ? (
              /* Stage 5: Luxury Greeting Card Revealed */
              <motion.div
                key="card-phase"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md mx-auto"
              >
                <div className="relative rounded-3xl bg-[#FFFDF9] border border-[#FADDE8] luxury-card-shadow p-6 sm:p-8 overflow-hidden">
                  {/* Top washi tape */}
                  <div className="w-24 h-5 washi-tape-pink absolute -top-2 left-1/2 -translate-x-1/2 -rotate-1 rounded-xs pointer-events-none" />

                  <div className="border border-dashed border-[#DCCCF4] rounded-2xl p-6 bg-[#FFF8F2]/60 text-center space-y-5">
                    {/* Handcrafted Wax Seal */}
                    <div className="relative mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#9E3045] to-[#A52A3A] flex items-center justify-center shadow-md border-2 border-[#FFFDF9] ring-2 ring-[#FADDE8]">
                      <span className="font-serif-cormorant text-2xl font-bold text-[#FFFDF9]">
                        {name.charAt(0)}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <p className="font-serif-cormorant text-xl sm:text-2xl font-medium text-[#292524] leading-snug">
                        For <span className="text-[#9E3045] font-semibold">{name}</span>, with a little extra warmth this Diwali.
                      </p>
                      <p className="font-handwriting text-base text-[#9E3045]/80">
                        from {sender}
                      </p>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={handleCardOpen}
                        className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FFFDF9] border border-[#9E3045]/60 text-[#9E3045] hover:bg-[#9E3045] hover:text-[#FFFDF9] shadow-sm hover:shadow-md transition-all duration-300 font-serif-cormorant text-base font-semibold tracking-wide cursor-pointer active:scale-95"
                      >
                        <span>Open it ♡</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
