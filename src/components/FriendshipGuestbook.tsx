import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HandDrawnStar, MarigoldFlower, RangoliCorner } from './Decorations';
import { soundEffects } from '../utils/audio';

interface GuestbookMessage {
  id: string;
  tag: string;
  title: string;
  preview: string;
  message: string;
  signOff: string;
  author: string;
  icon: string;
  ribbonColor: 'rose' | 'lavender' | 'gold' | 'cream';
  isCustom?: boolean;
}

const defaultMessages: GuestbookMessage[] = [
  {
    id: 'gb-1',
    tag: 'Chapter I · Steadfast Presence',
    title: 'The Silent Anchor',
    preview: 'For the friend who turns chaos into calm with just one conversation...',
    message:
      'In a world where everyone is constantly rushing and pretending, having a friend like you who listens without judgment is an absolute rarity. You have this quiet way of making heavy days feel lighter just by being around. Thank you for always being genuine, grounded, and steady.',
    signOff: 'With all my respect & gratitude ♡',
    author: 'Satish Gupta',
    icon: '🪷',
    ribbonColor: 'rose',
  },
  {
    id: 'gb-2',
    tag: 'Chapter II · 2 AM Realness',
    title: 'The Midnight Philosopher',
    preview: 'From deep life theories to crying laughing over the stupidest joke...',
    message:
      'Whether it is debating the universe, discussing life goals, or laughing uncontrollably until our stomachs hurt over something nobody else would understand — there is never an ordinary moment with you. Those unscripted, spontaneous conversations are the ones I value the most.',
    signOff: 'Never change that chaotic brilliance 😂',
    author: 'Satish Gupta',
    icon: '🕯️',
    ribbonColor: 'lavender',
  },
  {
    id: 'gb-3',
    tag: 'Chapter III · Quiet Strength',
    title: 'The Unapologetic Dreamer',
    preview: 'May you see yourself with the same confidence and admiration your friends see in you...',
    message:
      'You are always so generous in encouraging the people around you and celebrating their small wins, but you sometimes forget just how extraordinarily capable, resilient, and brilliant you are yourself. Step forward with total conviction — you deserve every good thing blooming in your life.',
    signOff: 'Rooting for you, always ✨',
    author: 'Satish Gupta',
    icon: '🌟',
    ribbonColor: 'gold',
  },
  {
    id: 'gb-4',
    tag: 'Chapter IV · Radiant Presence',
    title: 'The Warm Heart',
    preview: 'You make people feel genuinely heard, valued, and welcome...',
    message:
      'There are people who walk into a room demanding attention, and then there are people like you who quietly make everyone in that room feel comfortable, appreciated, and at ease. That gentle warmth is your quiet superpower. Never let the noise of the world dim it.',
    signOff: 'A heart of pure gold 🌸',
    author: 'Satish Gupta',
    icon: '🌸',
    ribbonColor: 'rose',
  },
  {
    id: 'gb-5',
    tag: 'Chapter V · Timeless Connection',
    title: 'Unspoken Loyalty',
    preview: 'The rare kind of bond where months can pass and we pick up without missing a beat...',
    message:
      'The true test of friendship isn’t talking every hour of every day; it’s being able to go weeks without speaking, and then picking up the exact same rhythm in three seconds flat. Thank you for a friendship that never carries pretense, expectation, or transactional weight.',
    signOff: 'Treasured across every season ♡',
    author: 'Satish Gupta',
    icon: '🕊️',
    ribbonColor: 'lavender',
  },
  {
    id: 'gb-6',
    tag: 'Chapter VI · Festive Light',
    title: 'The Diwali Blessing',
    preview: 'May the light of Diwali chase away every shadow and bring you peace...',
    message:
      'May the diyas you light this festival illuminate every path you choose, dissolve every worry, and fill your home and mind with deep peace, boundless laughter, and extraordinary good fortune. May this upcoming year be your kindest, brightest, and most triumphant chapter yet.',
    signOff: 'Happy Diwali, Saba 🪔',
    author: 'Satish Gupta',
    icon: '🪔',
    ribbonColor: 'gold',
  },
];

interface FriendshipGuestbookProps {
  recipientName: string;
}

export const FriendshipGuestbook: React.FC<FriendshipGuestbookProps> = ({
  recipientName = 'Saba',
}) => {
  const [messages, setMessages] = useState<GuestbookMessage[]>(defaultMessages);
  const [revealedIds, setRevealedIds] = useState<string[]>(['gb-1']); // First one unsealed for natural onboarding
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newSignOff, setNewSignOff] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  // Load any previously signed custom guestbook entries from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('saba_guestbook_custom');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages([...defaultMessages, ...parsed]);
        }
      }
    } catch {
      // safe fallback
    }
  }, []);

  const toggleReveal = (id: string, index: number) => {
    soundEffects.playWishChime(index);
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRevealAll = () => {
    soundEffects.playEnvelopeOpen();
    if (revealedIds.length === messages.length) {
      setRevealedIds([]);
    } else {
      setRevealedIds(messages.map((m) => m.id));
    }
  };

  const handleAddCustomEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    soundEffects.playDiyaIgnite();

    const newEntry: GuestbookMessage = {
      id: `gb-custom-${Date.now()}`,
      tag: 'Guestbook Addition · Special Note',
      title: newTitle.trim() || 'A Heartfelt Whisper',
      preview: newMessage.slice(0, 65) + '...',
      message: newMessage.trim(),
      signOff: newSignOff.trim() || 'With warmth & affection ♡',
      author: newAuthor.trim() || recipientName,
      icon: '✨',
      ribbonColor: 'gold',
      isCustom: true,
    };

    const updated = [...messages, newEntry];
    setMessages(updated);
    setRevealedIds((prev) => [...prev, newEntry.id]);

    try {
      const existingCustom = messages.filter((m) => m.isCustom);
      localStorage.setItem(
        'saba_guestbook_custom',
        JSON.stringify([...existingCustom, newEntry])
      );
    } catch {
      // safe fallback
    }

    // Reset form
    setNewTitle('');
    setNewMessage('');
    setNewSignOff('');
    setNewAuthor('');
    setIsSignModalOpen(false);
  };

  const allUnsealed = revealedIds.length === messages.length;

  return (
    <section
      id="guestbook-section"
      className="py-24 px-4 sm:px-6 max-w-6xl mx-auto relative overflow-hidden"
    >
      {/* Decorative Floral Rangoli Corners */}
      <div className="absolute top-8 left-4 pointer-events-none opacity-30 hidden sm:block">
        <RangoliCorner position="top-left" size={85} />
      </div>
      <div className="absolute top-8 right-4 pointer-events-none opacity-30 hidden sm:block">
        <RangoliCorner position="top-right" size={85} />
      </div>

      {/* Handcrafted Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 relative z-10 mb-14">
        <div className="inline-flex items-center gap-2">
          <HandDrawnStar size={15} color="#D6A85F" />
          <span className="font-handwriting text-xl sm:text-2xl text-[#9E3045] font-semibold">
            friendship guestbook folio...
          </span>
          <HandDrawnStar size={15} color="#D6A85F" />
        </div>

        <h3 className="font-serif-cormorant text-4xl sm:text-5xl font-medium text-[#292524] tracking-tight">
          Words Dedicated to <span className="text-[#9E3045] font-semibold">{recipientName}</span> ♡
        </h3>

        <p className="font-serif-cormorant italic text-base sm:text-lg text-[#292524]/75 max-w-lg mx-auto">
          Each parchment card below holds a pre-written message of friendship, gratitude, and festive warmth. Tap to break the wax seal.
        </p>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
          <button
            onClick={handleRevealAll}
            className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFFDF9] border border-[#D6A85F] text-[#9E3045] hover:bg-[#FFF8F2] hover:border-[#9E3045] transition-all duration-300 font-serif-cormorant font-semibold tracking-wide shadow-xs active:scale-95 cursor-pointer"
          >
            <span>{allUnsealed ? 'Fold All Parchments 📜' : 'Unseal All Parchments ✨'}</span>
            <span className="font-sans text-[11px] text-[#D6A85F]">
              ({revealedIds.length}/{messages.length})
            </span>
          </button>

          <button
            onClick={() => setIsSignModalOpen(true)}
            className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF8F2] border border-[#9E3045]/50 text-[#9E3045] hover:bg-[#9E3045] hover:text-[#FFFDF9] transition-all duration-300 font-serif-cormorant font-semibold tracking-wide shadow-xs active:scale-95 cursor-pointer"
          >
            <span>Sign Saba’s Folio ✍️</span>
          </button>
        </div>
      </div>

      {/* Parchment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
        {messages.map((item, index) => {
          const isRevealed = revealedIds.includes(item.id);

          return (
            <ParchmentCard
              key={item.id}
              item={item}
              index={index}
              isRevealed={isRevealed}
              onToggle={() => toggleReveal(item.id, index)}
            />
          );
        })}
      </div>

      {/* Floating Decorative Marigold at Bottom */}
      <div className="flex items-center justify-center gap-3 mt-14 opacity-60">
        <span className="w-16 h-[1px] bg-[#D6A85F]" />
        <MarigoldFlower size={20} />
        <span className="font-handwriting text-sm text-[#9E3045]">
          ~ bound with friendship and good wishes ~
        </span>
        <MarigoldFlower size={20} />
        <span className="w-16 h-[1px] bg-[#D6A85F]" />
      </div>

      {/* Sign Guestbook Modal */}
      <AnimatePresence>
        {isSignModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSignModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292524]/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 luxury-card-shadow border-2 border-[#D6A85F]"
            >
              {/* Paper Close Button */}
              <button
                onClick={() => setIsSignModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#FFF8F2] border border-[#9E3045]/40 text-[#9E3045] flex items-center justify-center text-xs font-bold hover:scale-110 cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Top Washi Tape */}
              <div className="w-24 h-5 washi-tape-gold absolute -top-2 left-10 -rotate-1 rounded-xs pointer-events-none" />

              <div className="space-y-1 mb-5">
                <span className="font-handwriting text-lg text-[#9E3045] block font-semibold">
                  write into Saba’s folio...
                </span>
                <h4 className="font-serif-cormorant text-2xl sm:text-3xl font-medium text-[#292524]">
                  Add a Parchment Message
                </h4>
                <p className="font-handwriting text-xs text-[#292524]/60">
                  This note will appear as an unsealed parchment in the guestbook.
                </p>
              </div>

              <form onSubmit={handleAddCustomEntry} className="space-y-4">
                <div>
                  <label className="block font-serif-cormorant text-sm font-semibold text-[#9E3045] mb-1">
                    Note Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A Note on Your Laughter"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8F2] border border-[#FADDE8] focus:border-[#9E3045] focus:outline-none font-serif-cormorant text-sm text-[#292524]"
                    maxLength={40}
                  />
                </div>

                <div>
                  <label className="block font-serif-cormorant text-sm font-semibold text-[#9E3045] mb-1">
                    Your Heartfelt Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write a warm note of friendship, appreciation, or festive blessings for Saba..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8F2] border border-[#FADDE8] focus:border-[#9E3045] focus:outline-none font-handwriting text-base text-[#292524] resize-none"
                    maxLength={350}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-serif-cormorant text-sm font-semibold text-[#9E3045] mb-1">
                      Sign-off Wish
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Always smiling ♡"
                      value={newSignOff}
                      onChange={(e) => setNewSignOff(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-[#FFF8F2] border border-[#FADDE8] focus:border-[#9E3045] focus:outline-none font-handwriting text-sm text-[#292524]"
                      maxLength={30}
                    />
                  </div>
                  <div>
                    <label className="block font-serif-cormorant text-sm font-semibold text-[#9E3045] mb-1">
                      Author Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Satish / Saba"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-[#FFF8F2] border border-[#FADDE8] focus:border-[#9E3045] focus:outline-none font-serif-cormorant text-sm text-[#292524]"
                      maxLength={25}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSignModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#FADDE8] text-[#292524]/70 font-serif-cormorant text-sm hover:bg-[#FFF8F2] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#9E3045] text-[#FFFDF9] font-serif-cormorant text-sm font-semibold tracking-wide hover:bg-[#A52A3A] transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    Seal into Folio 📜
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/**
 * Individual Parchment Card with interactive reveal animation
 */
const ParchmentCard: React.FC<{
  item: GuestbookMessage;
  index: number;
  isRevealed: boolean;
  onToggle: () => void;
}> = ({ item, index, isRevealed, onToggle }) => {
  const ribbonClass = {
    rose: 'bg-[#9E3045] text-[#FFFDF9]',
    lavender: 'bg-[#DCCCF4] text-[#292524]',
    gold: 'bg-[#D6A85F] text-[#FFFDF9]',
    cream: 'bg-[#FFF8F2] text-[#9E3045] border border-[#D6A85F]',
  }[item.ribbonColor];

  return (
    <div className="relative flex flex-col">
      <motion.div
        layout
        transition={{ type: 'spring', damping: 26, stiffness: 280 }}
        className={`relative w-full rounded-3xl transition-all duration-500 overflow-hidden ${
          isRevealed
            ? 'bg-[#FFFDF9] border-2 border-[#D6A85F] luxury-card-shadow'
            : 'bg-[#FFF8F2] border border-[#FADDE8] hover:border-[#D6A85F]/80 hover:shadow-md'
        }`}
      >
        {/* Subtle Deckle Parchment Paper Texture */}
        <div className="absolute inset-0 luxury-paper-texture opacity-60 pointer-events-none" />

        {/* Top Fold Ribbon / Seal Header */}
        <div className="relative px-6 pt-5 pb-3 flex items-center justify-between border-b border-[#FADDE8]/70 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl select-none">{item.icon}</span>
            <span className="font-serif-cormorant text-xs font-semibold uppercase tracking-wider text-[#9E3045]">
              {item.tag}
            </span>
          </div>

          {/* Reveal status badge */}
          <span
            className={`font-handwriting text-xs px-2.5 py-0.5 rounded-full ${
              isRevealed
                ? 'bg-[#FADDE8] text-[#9E3045]'
                : 'bg-[#FFFDF9] border border-[#D6A85F]/60 text-[#D6A85F]'
            }`}
          >
            {isRevealed ? 'unsealed ✓' : 'wax-sealed'}
          </span>
        </div>

        {/* Content Area with AnimatePresence Reveal */}
        <div className="p-6 relative z-10">
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              /* FOLDED PARCHMENT STATE (Click to Reveal) */
              <motion.div
                key="folded"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.25 }}
                onClick={onToggle}
                className="flex flex-col items-center text-center py-4 cursor-pointer group"
              >
                {/* Tactile Wax Seal Stamp */}
                <div className="relative mb-4">
                  <span className="absolute -inset-2 rounded-full bg-[#D6A85F]/20 blur-sm group-hover:scale-115 transition-transform" />
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2 border-[#FFFDF9] ring-2 ring-[#FADDE8] transition-all duration-300 group-hover:scale-110 ${ribbonClass}`}
                  >
                    <span className="font-serif-cormorant text-xl font-bold">
                      {item.author.charAt(0) || 'S'}
                    </span>
                  </div>
                </div>

                <h4 className="font-serif-cormorant text-2xl font-medium text-[#292524] mb-2 group-hover:text-[#9E3045] transition-colors">
                  {item.title}
                </h4>

                <p className="font-serif-cormorant italic text-sm text-[#292524]/70 mb-5 line-clamp-2 px-2">
                  &ldquo;{item.preview}&rdquo;
                </p>

                {/* Clear, Engaging Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFFDF9] border border-[#9E3045]/60 text-[#9E3045] group-hover:bg-[#9E3045] group-hover:text-[#FFFDF9] text-xs font-serif-cormorant font-semibold tracking-wider uppercase transition-all duration-300 shadow-2xs group-hover:shadow cursor-pointer active:scale-95"
                >
                  <span>Break Wax Seal 📜</span>
                </button>
              </motion.div>
            ) : (
              /* UNSEALED / REVEALED PARCHMENT STATE */
              <motion.div
                key="revealed"
                initial={{ opacity: 0, y: 12, rotateX: -6 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* Parchment Title */}
                <div>
                  <h4 className="font-serif-cormorant text-2xl sm:text-3xl font-medium text-[#9E3045] leading-snug">
                    {item.title}
                  </h4>
                  <div className="w-12 h-[1px] bg-[#D6A85F] mt-1.5" />
                </div>

                {/* Heartwarming handwritten message */}
                <p className="font-handwriting text-lg sm:text-xl text-[#292524] leading-relaxed pt-1">
                  &ldquo;{item.message}&rdquo;
                </p>

                {/* Sign-off footer */}
                <div className="pt-3 border-t border-[#FADDE8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-handwriting text-base text-[#9E3045] font-semibold">
                    {item.signOff}
                  </span>
                  <span className="font-serif-cormorant text-xs font-semibold text-[#292524]/65 uppercase tracking-wider text-right">
                    — {item.author}
                  </span>
                </div>

                {/* Fold back control */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onToggle}
                    className="text-[11px] font-handwriting text-[#292524]/50 hover:text-[#9E3045] transition-colors underline decoration-dotted cursor-pointer"
                  >
                    (fold parchment back ⌃)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
