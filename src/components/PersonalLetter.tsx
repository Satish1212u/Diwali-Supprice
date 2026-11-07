import React from 'react';
import { motion } from 'motion/react';
import { HandDrawnStar, MarigoldFlower } from './Decorations';

interface PersonalLetterProps {
  name: string;
  sender: string;
}

export const PersonalLetter: React.FC<PersonalLetterProps> = ({
  name,
  sender,
}) => {
  return (
    <section id="letter-section" className="py-20 sm:py-28 px-4 sm:px-6 relative max-w-3xl mx-auto">
      {/* Section Kicker */}
      <div className="text-center mb-8">
        <span className="font-handwriting text-xl sm:text-2xl text-[#9E3045] block">
          from my desk to yours...
        </span>
        <h3 className="font-serif-cormorant text-3xl sm:text-4xl font-medium text-[#292524] tracking-tight mt-1">
          A little note for you...
        </h3>
      </div>

      {/* Handwritten Letter on Warm Ivory Paper */}
      <div className="relative mx-auto bg-[#FFFDF9] rounded-3xl letter-shadow border border-[#F8C8DC] p-8 sm:p-12 overflow-hidden">
        {/* Decorative Washi Tape at Top Corner */}
        <div className="absolute -top-3 left-10 w-24 h-6 washi-tape-lavender -rotate-2 rounded-xs pointer-events-none" />
        <div className="absolute -top-3 right-10 w-20 h-6 washi-tape-gold rotate-3 rounded-xs pointer-events-none" />

        {/* Vintage Postmark / Stamp in top right corner */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex flex-col items-center pointer-events-none select-none opacity-85">
          <div className="w-16 h-20 sm:w-20 sm:h-24 border-2 border-dashed border-[#9E3045]/40 rounded-md p-1 bg-[#FFF8F2] flex flex-col items-center justify-between text-center shadow-inner">
            <span className="text-[9px] uppercase tracking-wider font-sans font-semibold text-[#9E3045]">
              Diwali Airmail
            </span>
            <div className="relative my-0.5">
              <span className="text-xl sm:text-2xl">🪔</span>
            </div>
            <span className="text-[8px] font-sans text-[#D6A85F] font-bold tracking-widest">
              2026 • FRIENDSHIP
            </span>
          </div>
          {/* Postmark stamp ring */}
          <div className="w-14 h-14 rounded-full border border-[#9E3045]/30 -mt-6 -ml-4 flex items-center justify-center text-[8px] uppercase tracking-widest font-sans text-[#9E3045]/40 rotate-[-15deg]">
            DELIVERED
          </div>
        </div>

        {/* Subtle lined paper texture styling */}
        <div className="relative z-10 max-w-xl pr-12 sm:pr-20 space-y-6">
          {/* Salutation */}
          <p className="font-serif-cormorant text-3xl sm:text-4xl font-semibold text-[#9E3045] tracking-wide">
            {name},
          </p>

          {/* Letter Body */}
          <div className="space-y-4 font-serif-cormorant text-lg sm:text-xl text-[#292524] leading-relaxed">
            <p>
              I didn&apos;t want to send you just another &apos;Happy Diwali&apos; message.
            </p>
            <p>
              I wanted to make something that you could actually remember.
            </p>
            <p className="italic text-[#9E3045] font-medium">
              Because some friendships become special through all the random conversations, stupid jokes, unexpected moments and little memories that we don&apos;t even realize we&apos;re collecting.
            </p>
            <p>
              So here&apos;s a tiny digital Diwali gift made especially for you.
            </p>
            <p>
              I hope this Diwali brings you happiness, peace, success and lots of reasons to smile.
            </p>
            <p className="font-medium text-[#9E3045] flex items-center gap-1.5 pt-1">
              Keep shining. <HandDrawnStar size={18} color="#D6A85F" />
            </p>
          </div>

          {/* Handwritten Signature */}
          <div className="pt-6 border-t border-[#FADDE8]/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-handwriting text-3xl sm:text-4xl text-[#9E3045] tracking-wide font-semibold">
                — {sender}
              </span>
              <MarigoldFlower size={20} className="opacity-75 -mt-2" />
            </div>

            <span className="font-handwriting text-sm text-[#9E3045]/70">
              with warm wishes ♡
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
