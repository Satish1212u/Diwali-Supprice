import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HandDrawnStar, MarigoldFlower, DiyaIllustration } from './Decorations';

interface FinalSurpriseProps {
  name: string;
  sender: string;
  onOpenFinal: () => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({
  name,
  sender,
  onOpenFinal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    onOpenFinal();
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-2xl mx-auto text-center relative">
      <div className="space-y-6">
        {/* Envelope Container */}
        <div className="relative mx-auto max-w-lg">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              /* Sealed Red/Pink Festive Envelope */
              <motion.div
                key="envelope-closed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-3xl bg-gradient-to-br from-[#FFF8F2] to-[#FADDE8] border-2 border-[#9E3045]/40 p-8 sm:p-12 luxury-card-shadow overflow-hidden"
              >
                {/* Washi tape at top */}
                <div className="w-28 h-6 washi-tape-gold absolute -top-3 left-1/2 -translate-x-1/2 rotate-1 rounded-xs pointer-events-none" />

                <div className="space-y-4 py-4 flex flex-col items-center">
                  <span className="font-handwriting text-2xl text-[#9E3045] block">
                    One last thing...
                  </span>

                  <div className="w-16 h-16 rounded-full bg-[#9E3045] text-[#FFFDF9] flex items-center justify-center shadow-lg border-2 border-[#FFFDF9] ring-2 ring-[#FADDE8]">
                    <span className="text-2xl">💌</span>
                  </div>

                  <p className="font-serif-cormorant text-xl text-[#292524] font-medium max-w-xs">
                    A closing blessing to carry with you into the new year.
                  </p>

                  <button
                    onClick={handleOpen}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#9E3045] text-[#FFFDF9] text-base font-serif-cormorant font-semibold tracking-wide shadow-md hover:bg-[#A52A3A] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <span>Open ♡</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Opened Envelope with Heartfelt Message */
              <motion.div
                key="envelope-opened"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-3xl bg-[#FFFDF9] border-2 border-[#D6A85F] p-8 sm:p-12 luxury-card-shadow space-y-6"
              >
                {/* Floral Top Accent */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <HandDrawnStar size={16} color="#D6A85F" />
                  <MarigoldFlower size={22} />
                  <HandDrawnStar size={16} color="#D6A85F" />
                </div>

                {/* Big Final Blessing */}
                <h3 className="font-serif-cormorant text-4xl sm:text-5xl md:text-6xl font-semibold text-[#9E3045] tracking-tight">
                  Happy Diwali, {name} 🪔
                </h3>

                <div className="space-y-4 max-w-lg mx-auto py-2">
                  <p className="font-serif-cormorant text-2xl sm:text-3xl text-[#292524] italic font-medium leading-snug">
                    &ldquo;May your life always be filled with the kind of light that doesn&apos;t need a diya.&rdquo;
                  </p>
                  <p className="font-serif-cormorant text-lg sm:text-xl text-[#9E3045] leading-relaxed">
                    Keep smiling. Keep shining. And never change the wonderful person you are.
                  </p>
                </div>

                {/* Center Diya */}
                <div className="py-2 flex justify-center">
                  <DiyaIllustration size="lg" lit={true} />
                </div>

                {/* Signature */}
                <div className="pt-4 border-t border-[#FADDE8] flex items-center justify-center gap-2">
                  <span className="font-handwriting text-3xl sm:text-4xl text-[#9E3045]">
                    — {sender}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
