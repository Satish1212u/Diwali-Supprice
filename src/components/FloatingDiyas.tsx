import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DiyaIllustration, HandDrawnStar, MarigoldFlower } from './Decorations';

export interface FloatingDiyaItem {
  id: string;
  label: string;
  senderNote?: string;
  xOffsetPercent: number; // 0 to 100
  floatDelay: number;
  floatDuration: number;
  scale?: number;
  petalType?: 'marigold' | 'rose' | 'lotus';
}

interface FloatingDiyasProps {
  recipientName?: string;
  senderName?: string;
  className?: string;
}

export const FloatingDiyas: React.FC<FloatingDiyasProps> = ({
  recipientName = 'Saba',
  senderName = 'Satish Gupta',
  className = '',
}) => {
  // Preset traditional river floating diyas with warm blessings
  const [diyas, setDiyas] = useState<FloatingDiyaItem[]>([
    {
      id: 'fd-1',
      label: 'Peace & Serenity',
      senderNote: 'For calm mornings & quiet happiness',
      xOffsetPercent: 12,
      floatDelay: 0,
      floatDuration: 4.8,
      scale: 0.9,
      petalType: 'marigold',
    },
    {
      id: 'fd-2',
      label: 'Endless Smiles',
      senderNote: 'For laughing until your ribs hurt',
      xOffsetPercent: 32,
      floatDelay: 1.2,
      floatDuration: 5.4,
      scale: 1.05,
      petalType: 'lotus',
    },
    {
      id: 'fd-3',
      label: 'Golden Light',
      senderNote: `Guiding all your steps in ${new Date().getFullYear()}`,
      xOffsetPercent: 54,
      floatDelay: 0.6,
      floatDuration: 4.2,
      scale: 1.15,
      petalType: 'rose',
    },
    {
      id: 'fd-4',
      label: 'Warm Friendship',
      senderNote: 'The kind that stays effortless forever',
      xOffsetPercent: 74,
      floatDelay: 1.8,
      floatDuration: 5.0,
      scale: 1,
      petalType: 'marigold',
    },
    {
      id: 'fd-5',
      label: 'Sweet Blessings',
      senderNote: 'And unlimited boxes of Kaju Katli',
      xOffsetPercent: 88,
      floatDelay: 2.2,
      floatDuration: 4.6,
      scale: 0.95,
      petalType: 'rose',
    },
  ]);

  const [activeDiya, setActiveDiya] = useState<FloatingDiyaItem | null>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Allow Saba to release their own personalized floating diya
  const [showAddModal, setShowAddModal] = useState(false);
  const [customWish, setCustomWish] = useState('');
  const [customNote, setCustomNote] = useState('');

  const handleWaterClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now();

    setRipples((prev) => [...prev.slice(-6), { id: rippleId, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 1200);
  };

  const handleAddDiya = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWish.trim()) return;

    const newDiya: FloatingDiyaItem = {
      id: `custom-${Date.now()}`,
      label: customWish.trim(),
      senderNote: customNote.trim() || `Dedicated to ${recipientName}`,
      xOffsetPercent: Math.floor(Math.random() * 70) + 15,
      floatDelay: 0,
      floatDuration: 4.5 + Math.random(),
      scale: 1,
      petalType: Math.random() > 0.5 ? 'marigold' : 'rose',
    };

    setDiyas((prev) => [...prev, newDiya]);
    setActiveDiya(newDiya);
    setCustomWish('');
    setCustomNote('');
    setShowAddModal(false);
  };

  return (
    <div className={`relative w-full max-w-5xl mx-auto my-12 px-4 ${className}`}>
      {/* Decorative Warm Paper Container */}
      <div className="relative rounded-3xl bg-[#FFFDF9] border border-[#FADDE8] paper-shadow-soft overflow-hidden p-6 sm:p-8">
        {/* Subtle Water Ripples and Ambient Gradient */}
        <div
          onClick={handleWaterClick}
          className="relative min-h-[300px] sm:min-h-[340px] rounded-2xl bg-gradient-to-b from-[#FFF8F2] via-[#FADDE8]/40 to-[#EEE6FA]/50 border border-[#DCCCF4]/60 overflow-hidden cursor-pointer select-none"
        >
          {/* Subtle water surface shimmer lines */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#D6A85F_0.8px,transparent_0.8px)] [background-size:24px_24px]" />

          {/* Header prompt inside the water pool */}
          <div className="absolute top-4 inset-x-0 text-center pointer-events-none z-10 space-y-1">
            <span className="font-handwriting text-base sm:text-lg text-[#9E3045] block">
              floating river of blessings...
            </span>
            <p className="font-serif-cormorant text-xl sm:text-2xl font-medium text-[#292524]">
              Gently Floating Diyas for {recipientName}
            </p>
            <span className="font-handwriting text-xs sm:text-sm text-[#D6A85F]">
              (tap the water to create ripples, or tap a diya to read its blessing)
            </span>
          </div>

          {/* Interactive water ripples */}
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              style={{ left: ripple.x, top: ripple.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-[#D6A85F]/50 pointer-events-none"
            />
          ))}

          {/* Floating flower petals scattered in water */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[18, 38, 62, 82, 45, 90].map((leftPct, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -8, 0],
                  x: [0, (i % 2 === 0 ? 5 : -5), 0],
                  rotate: [0, 8, -6, 0],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  left: `${leftPct}%`,
                  bottom: `${20 + (i * 12) % 60}px`,
                }}
                className="absolute"
              >
                {i % 2 === 0 ? (
                  <MarigoldFlower size={16} className="opacity-60" />
                ) : (
                  <span className="text-sm opacity-60">🌸</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Floating Diyas Row */}
          <div className="absolute inset-x-0 bottom-4 sm:bottom-8 h-44 flex items-center justify-around px-2 sm:px-6 pointer-events-none">
            {diyas.map((item) => (
              <motion.div
                key={item.id}
                animate={{
                  y: [0, -10, 0],
                  rotate: [-1.5, 1.5, -1.5],
                }}
                transition={{
                  duration: item.floatDuration,
                  delay: item.floatDelay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  transformOrigin: 'bottom center',
                }}
                className="pointer-events-auto flex flex-col items-center cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDiya(item);
                }}
              >
                {/* Floating Diya on Lotus/Leaf base */}
                <div
                  className="relative transition-transform duration-300 group-hover:scale-110"
                  style={{ transform: `scale(${item.scale || 1})` }}
                >
                  {/* Subtle water reflection / ripple under diya */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-[#D6A85F]/20 blur-[2px] animate-pulse" />

                  {/* Diya SVG */}
                  <DiyaIllustration size="md" lit={true} />

                  {/* Lotus leaf collar underneath */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 opacity-75">
                    <span className="text-[11px]">🍃</span>
                  </div>
                </div>

                {/* Diya Name Tag */}
                <div className="mt-2 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFFDF9]/90 border border-[#FADDE8] font-handwriting text-xs sm:text-sm text-[#8F3041] font-semibold tracking-wide shadow-2xs group-hover:bg-[#FFF8F2] group-hover:border-[#D6A85F] transition-all">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating Diya Controls Strip */}
        <div className="mt-4 pt-3 border-t border-[#FADDE8] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <HandDrawnStar size={14} color="#D6A85F" />
            <p className="font-handwriting text-sm text-[#8F3041]/80">
              Each diya carries a heartfelt prayer for your year ahead.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF8F2] border border-[#B83A4B]/40 text-[#8F3041] hover:bg-[#FADDE8]/50 hover:border-[#B83A4B] font-serif-cormorant text-xs font-semibold tracking-wide transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <span>+ Float another diya ♡</span>
          </button>
        </div>
      </div>

      {/* Diya Blessing Detail Modal */}
      <AnimatePresence>
        {activeDiya && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveDiya(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292524]/60 backdrop-blur-2xs"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm w-full bg-[#FFFDF9] rounded-2xl p-6 letter-shadow border border-[#F8C8DC] text-center space-y-4"
            >
              <button
                onClick={() => setActiveDiya(null)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#FFF8F2] border border-[#B83A4B]/40 text-[#8F3041] flex items-center justify-center text-xs font-bold hover:scale-105"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="flex justify-center pt-2">
                <DiyaIllustration size="lg" lit={true} />
              </div>

              <div className="space-y-1">
                <span className="font-sans-clean text-[10px] uppercase tracking-widest text-[#D6A85F] font-bold">
                  Floating Blessing
                </span>
                <h4 className="font-serif-cormorant text-2xl font-semibold text-[#8F3041]">
                  {activeDiya.label}
                </h4>
              </div>

              <p className="font-handwriting text-lg text-[#292524] italic px-2">
                &ldquo;{activeDiya.senderNote}&rdquo;
              </p>

              <div className="pt-3 border-t border-[#FADDE8] flex items-center justify-between text-xs font-handwriting text-[#8F3041]/70">
                <span>floating on water ✨</span>
                <span>— {senderName}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Custom Diya Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292524]/60 backdrop-blur-2xs"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-[#FFFDF9] rounded-2xl p-6 sm:p-7 letter-shadow border border-[#DCCCF4] space-y-4"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#FFF8F2] border border-[#B83A4B]/40 text-[#8F3041] flex items-center justify-center text-xs font-bold hover:scale-105"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="text-center space-y-1">
                <span className="font-handwriting text-lg text-[#8F3041] block">
                  make a festive wish...
                </span>
                <h4 className="font-serif-cormorant text-2xl font-semibold text-[#292524]">
                  Float a New Diya for {recipientName}
                </h4>
              </div>

              <form onSubmit={handleAddDiya} className="space-y-4 pt-2">
                <div>
                  <label className="block font-serif-cormorant text-sm font-medium text-[#292524] mb-1">
                    Wish Title (e.g. Good Health, Adventure, Joy)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={customWish}
                    onChange={(e) => setCustomWish(e.target.value)}
                    placeholder="e.g. Dream Travel, Calm Evenings..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#FADDE8] bg-[#FFF8F2] text-sm text-[#292524] focus:outline-none focus:border-[#B83A4B] focus:ring-1 focus:ring-[#B83A4B]"
                  />
                </div>

                <div>
                  <label className="block font-serif-cormorant text-sm font-medium text-[#292524] mb-1">
                    Short Personal Note
                  </label>
                  <textarea
                    rows={2}
                    maxLength={100}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="Write a sweet little prayer or memory..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#FADDE8] bg-[#FFF8F2] text-sm text-[#292524] focus:outline-none focus:border-[#B83A4B] focus:ring-1 focus:ring-[#B83A4B] resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full border border-[#DCCCF4] text-xs font-medium text-[#292524]/70 hover:bg-[#FADDE8]/30 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#B83A4B] text-[#FFFDF9] text-xs font-serif-cormorant font-semibold shadow hover:bg-[#8F3041] transition-all"
                  >
                    Float Diya 🪔
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
