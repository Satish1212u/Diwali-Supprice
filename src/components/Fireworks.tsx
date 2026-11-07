import React, { useEffect, useRef, useState } from 'react';
import { DiyaIllustration, HandDrawnStar, MarigoldFlower, SecretEasterEggStar } from './Decorations';
import { soundEffects } from '../utils/audio';
import { triggerFlowerBurst } from './FloatingFlowerSystem';

interface FireworksProps {
  name: string;
  sender: string;
  onReplay: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  radius: number;
  decay: number;
  shape?: 'spark' | 'heart' | 'star' | 'petal';
}

export const Fireworks: React.FC<FireworksProps> = ({
  name,
  sender,
  onReplay,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const [clickCount, setClickCount] = useState(0);

  // Soft luxury palette: Lavender, Baby Pink, Champagne Gold, Deep Rose, Warm Red
  const fireworkColors = [
    '#9E3045', // Selective Deep Rose
    '#A52A3A', // Warm Red
    '#F8C8DC', // Baby Pink
    '#DCCCF4', // Lavender
    '#D6A85F', // Champagne Gold
    '#FADDE8', // Soft Blush
  ];

  // Helper to spawn shape bursts (circle, heart, star, or flower)
  const spawnShapedBurst = (
    centerX: number,
    centerY: number,
    shapeType: 'circle' | 'heart' | 'star' | 'flower' = 'circle'
  ) => {
    soundEffects.playFireworkPop();
    const newParticles: Particle[] = [];
    const baseColor = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
    const count = shapeType === 'circle' ? 36 : 42;

    for (let i = 0; i < count; i++) {
      let vx = 0;
      let vy = 0;
      const t = (Math.PI * 2 * i) / count;

      if (shapeType === 'heart') {
        // Parametric heart curve: x = 16 sin^3(t), y = -(13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t))
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const scale = 0.12;
        vx = hx * scale;
        vy = hy * scale;
      } else if (shapeType === 'star') {
        // 5-pointed star modulation
        const r = 2.2 * (1 + 0.5 * Math.sin(5 * t));
        vx = r * Math.cos(t);
        vy = r * Math.sin(t);
      } else if (shapeType === 'flower') {
        // 6-petal rose curve
        const r = 2.0 * Math.sin(3 * t) + 1.2;
        vx = r * Math.cos(t);
        vy = r * Math.sin(t);
      } else {
        // Classic circular sparkler burst
        const angle = t + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 2.8 + 1.2;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      }

      newParticles.push({
        x: centerX,
        y: centerY,
        vx,
        vy,
        alpha: 1,
        color: Math.random() > 0.35 ? baseColor : fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
        radius: Math.random() * 2 + 1.2,
        decay: Math.random() * 0.014 + 0.009,
        shape: shapeType === 'heart' ? 'heart' : 'spark',
      });
    }

    particlesRef.current.push(...newParticles);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 460;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initial celebratory wave of petals alongside fireworks
    setTimeout(() => {
      triggerFlowerBurst('fireworks');
    }, 300);

    // Periodic gentle automatic bursts with alternating shapes
    const shapes: ('circle' | 'heart' | 'star' | 'flower')[] = ['heart', 'star', 'flower', 'circle'];
    let shapeIdx = 0;

    const interval = setInterval(() => {
      if (document.hidden) return;
      const randomX = Math.random() * (canvas.width * 0.7) + canvas.width * 0.15;
      const randomY = Math.random() * (canvas.height * 0.45) + canvas.height * 0.15;
      spawnShapedBurst(randomX, randomY, shapes[shapeIdx % shapes.length]);
      shapeIdx++;
    }, 2400);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.032; // gentle gravity
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle warm glow halo for primary sparks
        if (p.radius > 2) {
          ctx.strokeStyle = '#FFFDF9';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(interval);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickShapes: ('heart' | 'star' | 'flower' | 'circle')[] = ['heart', 'flower', 'star', 'circle'];
    const chosen = clickShapes[clickCount % clickShapes.length];
    spawnShapedBurst(x, y, chosen);
    setClickCount((c) => c + 1);
  };

  return (
    <div id="evening-celebration" className="relative py-20 px-4 overflow-hidden">
      {/* Soft Sunset / Evening Atmosphere (Ivory, Baby Pink, Lavender) */}
      <div className="relative max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#FFF8F2] via-[#FADDE8]/50 to-[#EEE6FA]/45 border border-[#F8C8DC] luxury-card-shadow overflow-hidden min-h-[520px] flex flex-col justify-between">
        {/* Canvas for Heart, Star & Flower Fireworks */}
        <div className="relative w-full h-[300px] sm:h-[350px] cursor-crosshair">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="w-full h-full block"
          />

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none">
            <span className="font-handwriting text-xs sm:text-sm text-[#9E3045] bg-[#FFFDF9]/90 px-3.5 py-1 rounded-full border border-[#FADDE8] shadow-2xs">
              {clickCount === 0 ? '✨ tap the sky to spark hearts & stars ✨' : 'keep sparkling! ✨'}
            </span>
          </div>
        </div>

        {/* Floating Diyas with Independent Flame Flickers along the Bottom */}
        <div className="relative z-10 px-4 pb-8 pt-4 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 sm:gap-7 flex-wrap">
            <div className="animate-atmosphere">
              <DiyaIllustration size="sm" lit={true} />
            </div>
            <div className="animate-atmosphere-reverse">
              <DiyaIllustration size="md" lit={true} />
            </div>
            <div className="transform scale-105">
              <DiyaIllustration size="lg" lit={true} />
            </div>
            <div className="animate-atmosphere">
              <DiyaIllustration size="md" lit={true} />
            </div>
            <div className="animate-atmosphere-reverse">
              <DiyaIllustration size="sm" lit={true} />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <HandDrawnStar size={16} color="#D6A85F" />
            <p className="font-serif-cormorant text-xl sm:text-2xl italic text-[#9E3045] font-medium text-center">
              &ldquo;May every diya lit this evening bring peace to your heart.&rdquo;
            </p>
            <HandDrawnStar size={16} color="#D6A85F" />
          </div>
        </div>
      </div>

      {/* FINAL SCREEN — Back of a handmade Diwali card */}
      <div className="mt-24 max-w-lg mx-auto bg-[#FFFDF9] rounded-3xl border-2 border-dashed border-[#DCCCF4] p-8 sm:p-12 luxury-card-shadow text-center relative">
        {/* Top washi tape */}
        <div className="w-24 h-5 washi-tape-lavender absolute -top-2.5 left-1/2 -translate-x-1/2 rotate-1 rounded-xs pointer-events-none" />

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <MarigoldFlower size={20} className="opacity-80" />
            <h3 className="font-serif-cormorant text-3xl sm:text-4xl font-semibold text-[#9E3045]">
              Happy Diwali, {name} ♡
            </h3>
            <MarigoldFlower size={20} className="opacity-80" />
          </div>

          <p className="font-handwriting text-lg sm:text-xl text-[#292524]/85">
            Made with code, memories, and a little too much effort.
          </p>

          <p className="font-handwriting text-2xl sm:text-3xl text-[#9E3045] font-semibold">
            — {sender}
          </p>

          {/* Secret Easter Egg Star */}
          <div className="py-2 flex items-center justify-center">
            <SecretEasterEggStar senderName={sender} />
          </div>

          {/* Replay Button */}
          <div className="pt-4 border-t border-[#FADDE8] flex flex-col items-center gap-3">
            <button
              onClick={onReplay}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FFF8F2] border border-[#9E3045]/40 text-[#9E3045] hover:bg-[#FADDE8]/50 hover:border-[#9E3045] text-xs font-serif-cormorant font-semibold tracking-wide transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>Replay this little surprise ↻</span>
            </button>

            <span className="font-handwriting text-xs text-[#292524]/50">
              yes, I actually made this.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
