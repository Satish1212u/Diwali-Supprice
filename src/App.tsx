import React, { useRef, useState, useEffect } from 'react';
import { diwaliConfig } from './data/memories';
import { OpeningCard } from './components/OpeningCard';
import { DiyaScene } from './components/DiyaScene';
import { PersonalLetter } from './components/PersonalLetter';
import { FriendshipGuestbook } from './components/FriendshipGuestbook';
import { SecretNote } from './components/SecretNote';
import { DiwaliWish } from './components/DiwaliWish';
import { FloatingDiyas } from './components/FloatingDiyas';
import { FinalSurprise } from './components/FinalSurprise';
import { Fireworks } from './components/Fireworks';
import { CustomCursor } from './components/CustomCursor';
import { ScrollProgress } from './components/ScrollProgress';
import { FloatingLanterns } from './components/FloatingLanterns';
import { FloatingFlowerSystem } from './components/FloatingFlowerSystem';
import { WelcomeToast } from './components/WelcomeToast';
import { SparklerEffect } from './components/SparklerEffect';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const storyRef = useRef<HTMLDivElement | null>(null);

  // Mouse Parallax coordinates (normalized -1 to 1)
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only track mouse parallax on desktop / fine pointers
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouseParallax({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Check if returning visitor on page mount
  useEffect(() => {
    try {
      const hasVisited = localStorage.getItem('saba_diwali_visited');
      if (hasVisited) {
        const timer = setTimeout(() => {
          setShowWelcomeToast(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleOpenComplete = () => {
    setHasEntered(true);
    try {
      localStorage.setItem('saba_diwali_visited', 'true');
    } catch {
      // safe fallback
    }
    // Gently show welcome back toast as Saba steps inside the experience
    setTimeout(() => {
      setShowWelcomeToast(true);
    }, 400);

    setTimeout(() => {
      storyRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  const handleReplay = () => {
    setHasEntered(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFinal = () => {
    setTimeout(() => {
      const fireworksElement = document.getElementById('evening-celebration');
      fireworksElement?.scrollIntoView({ behavior: 'smooth' });
    }, 450);
  };

  return (
    <main className="min-h-screen bg-[#FFFDF9] text-[#292524] selection:bg-[#F8C8DC] selection:text-[#9E3045] relative font-sans-clean overflow-x-hidden">
      {/* Subtle Desktop Custom Cursor */}
      <CustomCursor />

      {/* Interactive Golden Sparkler Wand Trails */}
      <SparklerEffect />

      {/* Warm Personal Welcome Toast for Saba */}
      <WelcomeToast
        show={showWelcomeToast}
        name={diwaliConfig.name}
        sender={diwaliConfig.sender}
        onClose={() => setShowWelcomeToast(false)}
      />

      {/* Vertical Chapter Indicator */}
      {hasEntered && <ScrollProgress />}

      {/* LAYER 1: Dynamic Multi-Layer Atmospheric Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Base warm ivory field */}
        <div className="absolute inset-0 bg-[#FFFDF9]" />

        {/* Top-Left Lavender Haze (Parallax Layer 1) */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-[#DCCCF4]/35 to-transparent blur-3xl animate-atmosphere"
          style={{
            transform: `translate(${mouseParallax.x * -12}px, ${mouseParallax.y * -12}px)`,
            transition: 'transform 0.4s ease-out',
          }}
        />

        {/* Top-Right Baby Pink Glow (Parallax Layer 2) */}
        <div
          className="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-bl from-[#F8C8DC]/40 via-[#FADDE8]/25 to-transparent blur-3xl animate-atmosphere-reverse"
          style={{
            transform: `translate(${mouseParallax.x * 15}px, ${mouseParallax.y * 15}px)`,
            transition: 'transform 0.4s ease-out',
          }}
        />

        {/* Center Warm Cream Aura */}
        <div
          className="absolute top-[35%] left-[20%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-r from-[#FFF8F2]/70 via-[#FADDE8]/20 to-[#EEE6FA]/30 blur-3xl animate-atmosphere"
          style={{
            transform: `translate(${mouseParallax.x * -8}px, ${mouseParallax.y * -8}px)`,
            transition: 'transform 0.4s ease-out',
          }}
        />

        {/* Bottom Soft Blush Pink Glow */}
        <div
          className="absolute -bottom-[15%] right-[10%] w-[60vw] h-[60vw] max-w-[850px] max-h-[850px] rounded-full bg-gradient-to-t from-[#FADDE8]/45 via-[#DCCCF4]/25 to-transparent blur-3xl animate-atmosphere-reverse"
          style={{
            transform: `translate(${mouseParallax.x * 10}px, ${mouseParallax.y * 10}px)`,
            transition: 'transform 0.4s ease-out',
          }}
        />

        {/* Soft champagne gold center highlight */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-[#D6A85F]/10 blur-[100px]" />
      </div>

      {/* LAYER 2: Ultra-subtle Luxury Paper Grain Texture */}
      <div className="fixed inset-0 luxury-paper-texture pointer-events-none opacity-55 z-0" aria-hidden="true" />

      {/* LAYER 3: Animated Festive Light Dust Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {[
          { color: '#D6A85F', left: '12%', top: '22%', delay: '0s', size: 4 },
          { color: '#F8C8DC', left: '84%', top: '18%', delay: '2.5s', size: 5 },
          { color: '#DCCCF4', left: '28%', top: '65%', delay: '4s', size: 4 },
          { color: '#9E3045', left: '72%', top: '75%', delay: '1.2s', size: 3 },
          { color: '#D6A85F', left: '50%', top: '45%', delay: '3.2s', size: 4 },
          { color: '#F8C8DC', left: '92%', top: '88%', delay: '5s', size: 5 },
        ].map((particle, idx) => (
          <div
            key={idx}
            className="absolute rounded-full animate-dust"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 10px ${particle.color}`,
              animationDelay: particle.delay,
              opacity: 0.6,
            }}
          />
        ))}
      </div>


      {/* LAYER 3.2: Traditional Glowing Floating Lanterns */}
      <FloatingLanterns />

      {/* LAYER 3.5: Premium Floating Flower Animation System */}
      <FloatingFlowerSystem />

      {/* LAYER 4: Foreground Interactive Content */}
      <div className="relative z-10 flex flex-col">
        {/* Step 1: Cinematic Intro & Central Interactive Diya */}
        <OpeningCard
          name={diwaliConfig.name}
          sender={diwaliConfig.sender}
          onOpenComplete={handleOpenComplete}
        />

        {/* Step-by-Step Storytelling Experience */}
        {hasEntered && (
          <div ref={storyRef} className="space-y-16 sm:space-y-28 pb-24">
            {/* Transition 1: Soft Lavender Wash into Diwali 2026 Intro */}
            <div className="relative">
              <div className="h-12 w-full bg-gradient-to-b from-transparent via-[#DCCCF4]/15 to-transparent pointer-events-none" />
              <DiyaScene
                name={diwaliConfig.name}
                year={diwaliConfig.year}
              />
            </div>

            {/* Transition 2: Luxury Paper & Stationery Note */}
            <div className="relative">
              <div className="h-12 w-full bg-gradient-to-b from-transparent via-[#FADDE8]/20 to-transparent pointer-events-none" />
              <PersonalLetter
                name={diwaliConfig.name}
                sender={diwaliConfig.sender}
              />
            </div>

            {/* Transition 3: Parchment Folio & Friendship Guestbook */}
            <div className="relative">
              <div className="h-12 w-full bg-gradient-to-b from-transparent via-[#EEE6FA]/20 to-transparent pointer-events-none" />
              <FriendshipGuestbook recipientName={diwaliConfig.name} />
            </div>


            {/* Transition 4: Pink Light into Secret Discovery */}
            <div className="relative">
              <div className="h-10 w-full bg-gradient-to-b from-transparent via-[#F8C8DC]/20 to-transparent pointer-events-none" />
              <SecretNote
                sender={diwaliConfig.sender}
              />
            </div>

            {/* Transition 5: Warm Cream & Gold into Diwali Wishes */}
            <div className="relative">
              <div className="h-12 w-full bg-gradient-to-b from-transparent via-[#D6A85F]/15 to-transparent pointer-events-none" />
              <DiwaliWish
                name={diwaliConfig.name}
              />

              <FloatingDiyas
                recipientName={diwaliConfig.name}
                senderName={diwaliConfig.sender}
              />
            </div>

            {/* Step 7: Final Surprise Envelope */}
            <FinalSurprise
              name={diwaliConfig.name}
              sender={diwaliConfig.sender}
              onOpenFinal={handleOpenFinal}
            />

            {/* Step 8 & 9: Soft Sunset Fireworks & Card Back */}
            <Fireworks
              name={diwaliConfig.name}
              sender={diwaliConfig.sender}
              onReplay={handleReplay}
            />
          </div>
        )}
      </div>
    </main>
  );
}
