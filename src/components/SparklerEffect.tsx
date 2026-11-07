import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface SparklerParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  decay: number;
  branch: boolean;
}

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

export const SparklerEffect: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const particlesRef = useRef<SparklerParticle[]>([]);
  const trailRef = useRef<TrailPoint[]>([]);
  const lastSoundTime = useRef<number>(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Palette: Champagne Gold, Amber, Warm White, Soft Baby Pink, Deep Rose embers
  const colors = [
    '#FFFDF9', // Core white hot
    '#D6A85F', // Champagne gold
    '#F5A623', // Festive amber
    '#F8C8DC', // Baby pink sparkle
    '#FADDE8', // Soft blush
    '#9E3045', // Deep rose ember
  ];

  // Spawn sparkler particle cluster at (x, y)
  const spawnSparkles = useCallback(
    (x: number, y: number, intensity: number = 6) => {
      const now = Date.now();
      if (now - lastSoundTime.current > 110) {
        soundEffects.playSparklerCrackle();
        lastSoundTime.current = now;
      }

      const count = Math.min(intensity, 14);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.8 + 1.2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const maxLife = Math.random() * 45 + 35; // ~1.5 - 2.5 seconds at 60fps

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1.2,
          vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 1.2 - 0.4,
          size: Math.random() * 2.8 + 1.2,
          color,
          alpha: 1,
          life: maxLife,
          maxLife,
          decay: Math.random() * 0.015 + 0.015,
          branch: Math.random() > 0.65,
        });
      }

      // Add to core trail
      trailRef.current.push({ x, y, time: now });
      if (trailRef.current.length > 30) {
        trailRef.current.shift();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Canvas loop & animation frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      // Clear with soft fade for glowing trails
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const now = Date.now();
      // Clean old trail points (> 450ms)
      trailRef.current = trailRef.current.filter((pt) => now - pt.time < 450);

      // 1. Draw glowing connecting sparkler core line
      if (trailRef.current.length > 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Outer soft golden glow
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#D6A85F';
        ctx.strokeStyle = 'rgba(214, 168, 95, 0.45)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        for (let i = 1; i < trailRef.current.length; i++) {
          const pt = trailRef.current[i];
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();

        // Inner white-hot core
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#FFFFFF';
        ctx.strokeStyle = 'rgba(255, 253, 249, 0.9)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Update & render sparkler particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        // Physics: velocity, slight gravity, air resistance
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.055; // gentle gravity
        p.vx *= 0.975;
        p.vy *= 0.975;

        p.life -= 1;
        p.alpha = Math.max(0, p.life / p.maxLife);

        // Branching micro-spark
        if (p.branch && p.life === Math.floor(p.maxLife * 0.6)) {
          p.branch = false;
          particlesRef.current.push({
            x: p.x,
            y: p.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 0.5,
            size: p.size * 0.7,
            color: '#D6A85F',
            alpha: p.alpha,
            life: p.life * 0.7,
            maxLife: p.maxLife * 0.7,
            decay: p.decay * 1.2,
            branch: false,
          });
        }

        if (p.alpha <= 0 || p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        // Draw individual sparkler particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;

        // Spark shape: 4-pointed cross star for larger sparks, glowing circle for embers
        if (p.size > 2.2 && p.alpha > 0.4) {
          ctx.beginPath();
          const s = p.size * 1.5;
          ctx.moveTo(p.x, p.y - s);
          ctx.lineTo(p.x + s * 0.25, p.y);
          ctx.lineTo(p.x + s, p.y);
          ctx.lineTo(p.x + s * 0.25, p.y + s * 0.25);
          ctx.lineTo(p.x, p.y + s);
          ctx.lineTo(p.x - s * 0.25, p.y + s * 0.25);
          ctx.lineTo(p.x - s, p.y);
          ctx.lineTo(p.x - s * 0.25, p.y - s * 0.25);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Global mouse & touch listeners when active
  useEffect(() => {
    if (!isActive) {
      trailRef.current = [];
      particlesRef.current = [];
      return;
    }

    const handlePointerDown = (e: PointerEvent) => {
      setIsDrawing(true);
      lastPos.current = { x: e.clientX, y: e.clientY };
      spawnSparkles(e.clientX, e.clientY, 10);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const current = { x: e.clientX, y: e.clientY };

      if (lastPos.current) {
        const dx = current.x - lastPos.current.x;
        const dy = current.y - lastPos.current.y;
        const dist = Math.hypot(dx, dy);

        // Spawn sparkles along movement path
        if (dist > 6) {
          const intensity = isDrawing ? 9 : 4;
          const steps = Math.min(Math.floor(dist / 14), 4);
          for (let s = 0; s <= steps; s++) {
            const ratio = steps === 0 ? 1 : s / steps;
            spawnSparkles(
              lastPos.current.x + dx * ratio,
              lastPos.current.y + dy * ratio,
              intensity
            );
          }
        }
      }

      lastPos.current = current;
    };

    const handlePointerUp = () => {
      setIsDrawing(false);
      lastPos.current = null;
    };

    // Touch event fallback for mobile devices
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        spawnSparkles(touch.clientX, touch.clientY, 8);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isActive, isDrawing, spawnSparkles]);

  // Special Auto-Draw Preset: Draw a glowing sparkler heart for Saba!
  const drawSparklerHeart = () => {
    if (!isActive) setIsActive(true);
    soundEffects.playWishChime(2);

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.42;
    const scale = Math.min(window.innerWidth * 0.016, 14);

    const points: { x: number; y: number }[] = [];
    const totalPoints = 60;

    for (let i = 0; i < totalPoints; i++) {
      const t = (Math.PI * 2 * i) / totalPoints;
      // Parametric heart formula
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      points.push({
        x: centerX + hx * scale,
        y: centerY + hy * scale,
      });
    }

    // Sequentially ignite points along the heart path
    points.forEach((pt, index) => {
      setTimeout(() => {
        spawnSparkles(pt.x, pt.y, 8);
      }, index * 26);
    });
  };

  return (
    <>
      {/* 1. Full-screen hardware-accelerated sparkler canvas (click-through) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-30 select-none"
        aria-hidden="true"
      />

      {/* 2. Handcrafted Stationery Floating Sparkler Wand Control Charm */}
      <div className="fixed bottom-5 left-4 sm:left-6 z-40 flex items-center gap-2 select-none pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="relative flex items-center"
        >
          {/* Main Toggle Button */}
          <button
            onClick={() => setIsActive(!isActive)}
            className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer active:scale-95 ${
              isActive
                ? 'bg-[#FFFDF9]/95 border-[#D6A85F] ring-2 ring-[#FADDE8] text-[#9E3045]'
                : 'bg-[#FFFDF9]/80 border-[#FADDE8] text-[#292524]/60 hover:text-[#9E3045]'
            }`}
            title="Toggle Diwali Sparkler Trails"
          >
            {/* Sparkler Wand Icon with glowing ember */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${
                isActive
                  ? 'bg-gradient-to-tr from-[#9E3045] to-[#D6A85F] text-[#FFFDF9] scale-110'
                  : 'bg-[#FFF8F2] text-[#D6A85F]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <div className="text-left hidden sm:block">
              <span className="block font-serif-cormorant text-xs font-bold leading-none tracking-wide text-[#9E3045]">
                Sparkler Wand {isActive ? '✨' : '(Off)'}
              </span>
              <span className="block font-handwriting text-[10px] text-[#292524]/60 leading-none mt-0.5">
                {isActive ? 'move mouse or finger to draw' : 'tap to turn on'}
              </span>
            </div>

            {/* Indicator Dot */}
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                isActive ? 'bg-[#D6A85F] animate-pulse' : 'bg-gray-300'
              }`}
            />
          </button>

          {/* Preset Button: Draw Sparkler Heart for Saba */}
          {isActive && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={drawSparklerHeart}
              className="ml-2 p-2 rounded-full bg-[#FFFDF9]/95 border border-[#F8C8DC] text-[#9E3045] hover:bg-[#FADDE8]/50 hover:border-[#9E3045] shadow-2xs hover:shadow transition-all cursor-pointer active:scale-90"
              title="Draw Sparkler Heart for Saba ♡"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-[#9E3045]" />
            </motion.button>
          )}
        </motion.div>
      </div>
    </>
  );
};
