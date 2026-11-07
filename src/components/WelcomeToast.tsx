import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HandDrawnStar } from './Decorations';

interface WelcomeToastProps {
  show: boolean;
  name: string;
  sender?: string;
  onClose: () => void;
  duration?: number;
}

export const WelcomeToast: React.FC<WelcomeToastProps> = ({
  show,
  name,
  sender = 'Satish Gupta',
  onClose,
  duration = 6000,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!show || isPaused) return;

    timerRef.current = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show, isPaused, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 max-w-sm sm:max-w-md w-[92vw] pointer-events-auto"
          role="status"
          aria-live="polite"
        >
          {/* Handcrafted Stationery Toast Container */}
          <div className="relative rounded-2xl bg-[#FFFDF9]/95 backdrop-blur-md border border-[#F8C8DC] letter-shadow p-3.5 sm:p-4 pr-9 overflow-hidden flex items-center gap-3">
            {/* Top delicate washi tape accent */}
            <div className="w-16 h-3.5 washi-tape-pink absolute -top-1.5 left-8 -rotate-1 rounded-xs pointer-events-none opacity-80" />

            {/* Glowing Diya / Seal Icon */}
            <div className="relative shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#FFF8F2] to-[#FADDE8] border border-[#D6A85F]/60 flex items-center justify-center shadow-xs">
              <span className="text-lg select-none">🪔</span>
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6A85F] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D6A85F]" />
              </span>
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-serif-cormorant text-base sm:text-lg font-semibold text-[#9E3045] tracking-wide truncate">
                  Welcome back, {name} ♡
                </h4>
                <HandDrawnStar size={12} color="#D6A85F" className="shrink-0" />
              </div>
              <p className="font-handwriting text-xs sm:text-sm text-[#292524]/75 leading-tight mt-0.5">
                Your little Diwali surprise is right where you left it.
              </p>
            </div>

            {/* Paper '✕' Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#FFF8F2] border border-[#FADDE8] text-[#9E3045] hover:bg-[#FADDE8] hover:scale-110 flex items-center justify-center text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
              aria-label="Close notification"
            >
              ✕
            </button>

            {/* Subtle auto-dismiss timeline bar at bottom */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-[#FADDE8]/40">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: isPaused ? '100%' : '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-[#D6A85F] to-[#9E3045]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
