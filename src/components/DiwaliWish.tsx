import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HandDrawnStar, MarigoldFlower, RangoliCorner } from './Decorations';
import { soundEffects } from '../utils/audio';

interface DiwaliWishProps {
  name: string;
}

export const DiwaliWish: React.FC<DiwaliWishProps> = ({ name }) => {
  const wishes = [
    { icon: '✨', label: 'Happiness', desc: 'The genuine kind that stays in your chest and turns into quiet, content smiles.' },
    { icon: '🪔', label: 'Peace', desc: 'Calm evenings, good sleep, and days where your mind feels light and clear.' },
    { icon: '🌸', label: 'Beautiful memories', desc: 'Moments worth holding onto, shared with people who truly cherish you.' },
    { icon: '❤️', label: 'Good people', desc: 'Surrounded by warmth, real loyalty, and friendships that require zero pretense.' },
    { icon: '🌟', label: 'Success', desc: 'Every single goal and ambition you quietly work towards blooming into reality.' },
    { icon: '😊', label: 'Lots of reasons to smile', desc: 'Laughing until your cheeks ache, especially on ordinary random Tuesdays.' },
  ];

  // Number of wishes revealed sequentially
  const [revealedCount, setRevealedCount] = useState<number>(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [allRevealed, setAllRevealed] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    if (revealedCount < wishes.length) {
      const timer = setTimeout(() => {
        soundEffects.playWishChime(revealedCount);
        setRevealedCount((prev) => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setAllRevealed(true);
    }
  }, [hasStarted, revealedCount, wishes.length]);

  return (
    <section id="wishes-section" className="py-24 px-4 sm:px-6 max-w-4xl mx-auto relative overflow-hidden">
      {/* Background container with delicate baby pink & lavender border */}
      <div className="relative bg-[#FFFDF9] rounded-3xl p-8 sm:p-12 border-2 border-[#DCCCF4]/80 luxury-card-shadow">
        {/* Four Rangoli Corners */}
        <RangoliCorner position="top-left" className="absolute top-2 left-2" size={65} />
        <RangoliCorner position="top-right" className="absolute top-2 right-2" size={65} />
        <RangoliCorner position="bottom-left" className="absolute bottom-2 left-2" size={65} />
        <RangoliCorner position="bottom-right" className="absolute bottom-2 right-2" size={65} />

        {/* Section Header */}
        <div className="text-center space-y-2 mb-10 relative z-10">
          <span className="font-handwriting text-xl sm:text-2xl text-[#9E3045] block">
            sent with love and intention...
          </span>
          <h3 className="font-serif-cormorant text-4xl sm:text-5xl font-medium text-[#292524] tracking-tight">
            My Diwali wish for <span className="text-[#9E3045] font-semibold">{name}</span>...
          </h3>
          <p className="font-serif-cormorant italic text-base sm:text-lg text-[#292524]/75">
            On this luminous celebration:
          </p>

          {!hasStarted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-2"
            >
              <button
                onClick={() => {
                  setHasStarted(true);
                  soundEffects.playWishChime(0);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFF8F2] border border-[#9E3045]/50 text-[#9E3045] font-serif-cormorant text-sm font-semibold tracking-wide shadow-xs hover:bg-[#FADDE8]/50 hover:border-[#9E3045] transition-all cursor-pointer active:scale-95"
              >
                <span>Reveal blessings one by one ✨</span>
              </button>
            </motion.div>
          )}
        </div>

        {/* Wishes Grid with Sequential Reveal & Gentle Floating Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
          {wishes.slice(0, hasStarted ? revealedCount : 1).map((wish, index) => (
            <motion.div
              key={wish.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: allRevealed ? [0, -4, 0] : 0,
                scale: 1,
              }}
              transition={{
                duration: 0.5,
                y: allRevealed
                  ? {
                      duration: 3 + (index % 3) * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : undefined,
              }}
              className="p-5 rounded-2xl border border-[#FADDE8] bg-[#FFF8F2]/80 hover:bg-[#FFFDF9] hover:border-[#D6A85F] transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[135px] shadow-2xs hover:shadow-xs group"
            >
              <span className="text-3xl mb-2 select-none transform transition-transform group-hover:scale-120">
                {wish.icon}
              </span>
              <h4 className="font-serif-cormorant text-xl font-semibold text-[#9E3045]">
                {wish.label}
              </h4>
              <p className="font-sans-clean text-xs text-[#292524]/75 mt-1.5 leading-relaxed">
                {wish.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Final Benediction appears once all wishes revealed */}
        <AnimatePresence>
          {(allRevealed || !hasStarted) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mt-12 pt-8 border-t border-[#FADDE8] relative z-10"
            >
              <MarigoldFlower size={24} className="mx-auto mb-3 opacity-80" />
              <p className="font-serif-cormorant text-2xl sm:text-3xl italic text-[#9E3045] max-w-xl mx-auto leading-relaxed font-medium">
                &ldquo;And may you always have something beautiful to look forward to.&rdquo;
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <HandDrawnStar size={14} color="#D6A85F" />
                <span className="font-handwriting text-sm text-[#9E3045]/80">
                  happy diwali
                </span>
                <HandDrawnStar size={14} color="#D6A85F" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
