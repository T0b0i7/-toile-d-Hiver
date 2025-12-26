import React, { useEffect, useRef, useState } from 'react';
import { EmotionalTheme } from '../themes';

interface NameReveal3DProps {
  name: string;
  poem: string;
  theme: EmotionalTheme;
  onComplete: () => void;
}

const NameReveal3D: React.FC<NameReveal3DProps> = ({ name, poem, theme, onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [currentLineIdx, setCurrentLineIdx] = useState(-1);
  const [showEffects, setShowEffects] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lines = poem.split('\n').filter(l => l.trim().length > 0);
  const firstName = name.split(' ')[0];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500), // Apparition ombre
      setTimeout(() => setPhase(2), 1500), // Reveal Prénom
      setTimeout(() => setPhase(3), 3500), // Début poésie
      setTimeout(() => setShowEffects(true), 2000), // Effets visuels
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [name]);

  useEffect(() => {
    if (phase === 3) {
      let current = 0;
      const interval = setInterval(() => {
        if (current < lines.length) {
          setCurrentLineIdx(current);
          current++;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 5000);
        }
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [phase, lines, onComplete]);

  // Effets de particules pour la révélation
  useEffect(() => {
    if (!showEffects || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }> = [];

    const createParticleBurst = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < 100; i++) {
        const angle = (Math.PI * 2 * i) / 100;
        const speed = Math.random() * 5 + 2;
        particles.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 1,
          color: theme.primary,
          size: Math.random() * 3 + 1
        });
      }
    };

    const updateParticles = () => {
      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravité
        p.life -= 0.02;
        return p.life > 0;
      });
    };

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    createParticleBurst();

    const animate = () => {
      updateParticles();
      renderParticles();
      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [showEffects, theme.primary]);

  return (
    <div className="name-reveal-3d fixed inset-0 z-40 pointer-events-none overflow-hidden select-none">
      {/* Canvas pour les effets de particules */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Ombre portée */}
      <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-[3000ms]" style={{
        opacity: phase >= 1 ? 1 : 0
      }}>
        <div
          className="absolute bottom-[15%] left-1/2 -translate-x-1/2 text-white/[0.03] font-magic text-[12rem] md:text-[20rem] blur-2xl scale-y-[-0.5] opacity-20"
          style={{
            color: theme.primary,
            filter: 'blur(50px)',
            transform: 'translateX(-50%) scaleY(-0.5) translateY(20px)'
          }}
        >
          {firstName}
        </div>
      </div>

      {/* Nom principal avec effet de lumière */}
      <div className="relative z-50 text-center mb-16">
        <h1
          style={{
            color: phase >= 2 ? 'white' : 'transparent',
            textShadow: phase >= 2 ? `
              0 0 80px ${theme.primary}88,
              0 0 30px ${theme.primary}44,
              0 0 10px ${theme.primary}22
            ` : 'none',
            background: phase >= 2 ? theme.gradient : 'none',
            WebkitBackgroundClip: phase >= 2 ? 'text' : 'initial',
            WebkitTextFillColor: phase >= 2 ? 'transparent' : 'initial',
            backgroundClip: phase >= 2 ? 'text' : 'initial'
          }}
          className={`text-7xl md:text-[10rem] font-magic transition-all duration-[4000ms] leading-none px-6
            ${phase >= 2 ? 'opacity-100 scale-100 translate-y-0 blur-0' : 'opacity-0 scale-90 translate-y-20 blur-[30px]'}
          `}
        >
          {firstName}
        </h1>
      </div>

      {/* Reflet */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 font-magic text-7xl md:text-[10rem] blur-md scale-y-[-0.3] opacity-30 pointer-events-none"
        style={{
          color: theme.primary,
          transform: 'translateX(-50%) translateY(50%) scaleY(-0.3)',
          filter: 'blur(20px)'
        }}
      >
        {firstName}
      </div>

      {/* Onde de choc */}
      {showEffects && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-white/20 rounded-full animate-ping"
          style={{
            width: '200px',
            height: '200px',
            animation: 'shockwave 2s ease-out forwards'
          }}
        />
      )}

      {/* Lueur persistante */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl pointer-events-none"
        style={{
          width: '400px',
          height: '400px',
          background: theme.gradient,
          opacity: showEffects ? 0.1 : 0,
          transition: 'opacity 1s ease-out'
        }}
      />

      {/* Poésie (centrée au milieu de l'écran pour éviter le chevauchement du sapin) */}
      <div className="absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-1/2 max-w-3xl w-[90vw] px-6 text-center z-50 flex items-center justify-center pointer-events-none">
        {lines.map((line, idx) => (
          <p
            key={idx}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full font-serif italic text-lg md:text-3xl text-white/80 transition-all duration-[3000ms] leading-relaxed px-4
              ${currentLineIdx === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 blur-md'}
            `}
          >
            {line.trim()}
          </p>
        ))}
      </div>

      <style>{`
        @keyframes shockwave {
          0% {
            width: 0px;
            height: 0px;
            opacity: 1;
          }
          100% {
            width: 1000px;
            height: 1000px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default NameReveal3D;