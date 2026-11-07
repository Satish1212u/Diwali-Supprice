import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { HandDrawnStar } from './Decorations';
import { soundEffects } from '../utils/audio';

interface SecretNoteProps {
  sender: string;
}

export const SecretNote: React.FC<SecretNoteProps> = ({ sender }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleHeartClick = () => {
    soundEffects.playWishChime(3);
    setIsPulsing(true);
    setTimeout(() => {
      setIsRevealed(true);
      setIsPulsing(false);
    }, 600);
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-xl mx-auto text-center relative">
      {!isRevealed ? (
        /* Attractive, Unmistakably Clickable Wax Seal / Secret Locket */
        <div className="flex flex-col items-center space-y-4">
          {/* Decorative Section Header */}
          <div className="space-y-1">
            <span className="font-handwriting text-lg sm:text-xl text-[#9E3045] block font-medium">
              psst... something is tucked away here
            </span>
            <p className="font-serif-cormorant text-2xl sm:text-3xl text-[#292524] font-medium">
              A Tiny Secret Note
            </p>
          </div>

          {/* Interactive Tactile Button Badge with Ripple Waves */}
          <div className="relative my-2">
            {/* Outer Continuous Soft Pulse Wave */}
            <span className="absolute -inset-2.5 rounded-full bg-[#F8C8DC]/50 blur-sm animate-ping pointer-events-none opacity-40" />
            <span className="absolute -inset-4 rounded-full bg-[#DCCCF4]/35 blur-md pointer-events-none" />

            <button
              onClick={handleHeartClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative flex items-center gap-3.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#FFFDF9] via-[#FFF8F2] to-[#FADDE8]/40 border-2 border-[#9E3045]/50 hover:border-[#9E3045] shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-106 active:scale-95 cursor-pointer ring-4 ring-[#FADDE8]/60"
              aria-label="Click to unlock the secret note"
            >
              {/* Inner Pulsing Heart Stamp */}
              <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-[#9E3045] text-[#FFFDF9] shadow-inner transition-transform duration-300 group-hover:scale-115">
                <Heart
                  className="w-5 h-5 fill-current text-white animate-pulse"
                />
                {/* Tiny Gold Star Badge on Heart */}
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D6A85F] text-[#FFFDF9] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                </span>
              </div>

              {/* Clear, Engaging Action Text */}
              <div className="text-left pr-1">
                <span className="block font-serif-cormorant text-base sm:text-lg font-bold text-[#9E3045] leading-tight tracking-wide">
                  Tap to unlock secret ♡
                </span>
                <span className="block font-handwriting text-xs sm:text-sm text-[#292524]/60">
                  (a little message from {sender.split(' ')[0]})
                </span>
              </div>

              {/* Animated Sparkle Icon */}
              <HandDrawnStar
                size={16}
                color="#D6A85F"
                className="transition-transform duration-500 group-hover:rotate-90 group-hover:scale-125"
              />
            </button>

            {/* Sparkle particles radiating when clicked */}
            {isPulsing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <motion.div
                    key={deg}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{
                      scale: 1.2,
                      x: Math.cos((deg * Math.PI) / 180) * 55,
                      y: Math.sin((deg * Math.PI) / 180) * 55,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    className="absolute w-2.5 h-2.5 rounded-full bg-[#D6A85F]"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Reassuring Micro-Copy */}
          <p className="font-handwriting text-sm text-[#9E3045]/75 animate-bounce">
            👇 click the badge above to open 👇
          </p>
        </div>
      ) : (
        /* Revealed handwritten note */
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="p-7 sm:p-10 bg-[#FFF8F2] rounded-3xl border-2 border-[#D6A85F] luxury-card-shadow relative text-left"
        >
          {/* Top Washi Tape */}
          <div className="w-24 h-5 washi-tape-gold absolute -top-2 left-10 -rotate-2 rounded-xs pointer-events-none" />

          {/* Discovery Note Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#9E3045] text-white flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-handwriting text-xl text-[#9E3045] font-semibold">
              okay... you found it ♡
            </span>
          </div>

          <div className="space-y-4 pt-1">
            <p className="font-serif-cormorant text-2xl sm:text-3xl text-[#292524] font-medium leading-snug">
              &ldquo;You&apos;re genuinely one of those people I&apos;m glad life introduced me to.&rdquo;
            </p>

            <div className="pt-3 border-t border-[#FADDE8]">
              <p className="font-handwriting text-xl sm:text-2xl text-[#9E3045]">
                And yes, I spent way too much time making this. 😂
              </p>
              <p className="font-handwriting text-lg text-[#292524]/70 text-right mt-1.5">
                — {sender}
              </p>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 opacity-75">
            <HandDrawnStar size={18} color="#D6A85F" />
          </div>
        </motion.div>
      )}
    </section>
  );
};
