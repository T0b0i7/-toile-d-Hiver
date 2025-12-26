import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Sparkles } from 'lucide-react';
import { EmotionalTheme } from '../themes';

interface WishMakerProps {
  userName: string;
  theme: EmotionalTheme;
  onComplete: () => void;
}

const WishMaker: React.FC<WishMakerProps> = ({ userName, theme, onComplete }) => {
  const [wish, setWish] = useState('');
  const [isMakingWish, setIsMakingWish] = useState(false);
  const [candlesLit, setCandlesLit] = useState<boolean[]>([false, false, false]);
  const [showWishStar, setShowWishStar] = useState(false);
  const [starPosition, setStarPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const firstName = userName.split(' ')[0];

  const lightCandle = (index: number) => {
    if (isMakingWish) return;
    const newCandlesLit = [...candlesLit];
    newCandlesLit[index] = !newCandlesLit[index];
    setCandlesLit(newCandlesLit);
  };

  const animateCandleLighting = () => {
    return new Promise<void>((resolve) => {
      // Animation de préparation
      setTimeout(() => resolve(), 1000);
    });
  };

  const animateBlowingCandles = () => {
    return new Promise<void>((resolve) => {
      // Simulation du souffle
      setCandlesLit([false, false, false]);
      setTimeout(() => resolve(), 1500);
    });
  };

  const createWishStar = (wishText: string, name: string) => {
    return {
      wish: wishText,
      name: name,
      createdAt: new Date(),
      color: theme.primary
    };
  };

  const launchStarToSky = (star: any) => {
    return new Promise<void>((resolve) => {
      setShowWishStar(true);
      setStarPosition({ x: Math.random() * window.innerWidth, y: window.innerHeight });

      // Animation de lancement vers le ciel comme une fusée
      const animation = setInterval(() => {
        setStarPosition(prev => ({
          x: prev.x + (Math.random() - 0.5) * 4, // Mouvement plus erratique comme une fusée
          y: prev.y - 5 // Vitesse plus rapide
        }));
      }, 30); // Plus fluide

      setTimeout(() => {
        clearInterval(animation);
        setShowWishStar(false);
        // Déclencher les feux d'artifice
        triggerFireworks();
        resolve();
      }, 2500);
    });
  };

  const triggerFireworks = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const fireworks: Array<{
          x: number;
          y: number;
          particles: Array<{x: number; y: number; vx: number; vy: number; life: number; color: string}>
        }> = [];

        // Créer plusieurs feux d'artifice
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            const firework = {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height * 0.6,
              particles: []
            };

            // Créer les particules
            for (let j = 0; j < 30; j++) {
              const angle = (Math.PI * 2 * j) / 30;
              const speed = Math.random() * 5 + 2;
              firework.particles.push({
                x: firework.x,
                y: firework.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                color: `hsl(${Math.random() * 360}, 100%, 70%)`
              });
            }

            fireworks.push(firework);
          }, i * 300);
        }

        const animate = () => {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          fireworks.forEach(firework => {
            firework.particles.forEach(particle => {
              particle.x += particle.vx;
              particle.y += particle.vy;
              particle.vy += 0.1; // Gravité
              particle.life -= 0.02;

              if (particle.life > 0) {
                ctx.save();
                ctx.globalAlpha = particle.life;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
              }
            });
          });

          if (fireworks.some(f => f.particles.some(p => p.life > 0))) {
            requestAnimationFrame(animate);
          }
        };

        animate();
      }
    }
  };

  const showWishConfirmation = () => {
    // Effet de confirmation magique
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Créer un effet de particules magiques
        const particles: Array<{x: number, y: number, vx: number, vy: number, life: number}> = [];
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1
          });
        }

        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life -= 0.02;

            if (p.life > 0) {
              ctx.save();
              ctx.globalAlpha = p.life;
              ctx.fillStyle = theme.primary;
              ctx.beginPath();
              ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          });

          if (particles.some(p => p.life > 0)) {
            requestAnimationFrame(animate);
          }
        };

        animate();
      }
    }
  };

  const makeWish = async () => {
    if (!wish.trim() || isMakingWish) return;

    setIsMakingWish(true);

    // Animation de préparation
    await animateCandleLighting();

    // L'utilisateur souffle les bougies
    await animateBlowingCandles();

    // Transformer le vœu en étoile
    const star = createWishStar(wish, userName);

    // Lancement vers le ciel
    await launchStarToSky(star);

    // Confirmation magique
    showWishConfirmation();

    setTimeout(() => {
      onComplete();
    }, 4000);
  };

  return (
    <div className="wish-maker fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Canvas pour effets magiques */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Étoile du vœu en vol */}
      {showWishStar && (
        <div
          className="absolute text-4xl animate-pulse"
          style={{
            left: starPosition.x,
            top: starPosition.y,
            color: theme.primary,
            textShadow: `0 0 20px ${theme.primary}`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          ⭐
        </div>
      )}

      <div className="wish-altar text-center space-y-8 max-w-2xl px-8">
        {/* Bougies interactives */}
        <div className="wish-candles flex justify-center gap-8 mb-8">
          {candlesLit.map((lit, i) => (
            <div
              key={i}
              className="candle cursor-pointer transition-all duration-500"
              onClick={() => lightCandle(i)}
            >
              <div className="w-8 h-16 bg-amber-800 rounded-b-lg relative">
                {lit && (
                  <div className="flame absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-4 bg-orange-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-2 bg-yellow-300 rounded-full animate-ping absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Zone d'écriture du vœu */}
        <textarea
          className="wish-scroll w-full p-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 resize-none focus:outline-none focus:border-white/30 transition-all"
          placeholder="Écris ton vœu le plus cher..."
          value={wish}
          onChange={(e) => {
            setWish(e.target.value);
            // Allumer automatiquement les bougies quand l'utilisateur commence à écrire
            if (e.target.value.trim() && !isMakingWish && !candlesLit.every(lit => lit)) {
              setCandlesLit([true, true, true]);
            }
          }}
          maxLength={200}
          rows={4}
          disabled={isMakingWish}
        />

        {/* Bouton magique */}
        <button
          className="wish-button px-8 py-4 rounded-full text-white uppercase tracking-widest transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: candlesLit.every(lit => lit) && wish.trim() ? theme.gradient : 'rgba(255, 255, 255, 0.1)',
            border: `1px solid ${theme.primary}40`
          }}
          onClick={makeWish}
          disabled={!candlesLit.every(lit => lit) || !wish.trim() || isMakingWish}
        >
          {isMakingWish ? (
            <div className="flex items-center gap-2">
              <Sparkles className="animate-spin" size={20} />
              ✨ Le vœu prend son envol...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wand2 size={20} />
              🌟 Souffler les bougies
            </div>
          )}
        </button>

        {/* Instructions poétiques */}
        <div className="wish-instructions text-white/60 text-sm space-y-2">
          <p>"Chuchote ton vœu à la flamme..."</p>
          <p>"Et laisse l'hiver le porter aux étoiles."</p>
        </div>
      </div>

      <style>{`
        .candle:hover {
          transform: scale(1.05);
        }

        .flame {
          animation: flicker 2s ease-in-out infinite alternate;
        }

        @keyframes flicker {
          0%, 100% { transform: translateX(-50%) scaleY(1); }
          50% { transform: translateX(-50%) scaleY(1.1); }
        }
      `}</style>
    </div>
  );
};

export default WishMaker;