import React, { useEffect, useRef, useState } from 'react';
import { EmotionalTheme } from '../themes';

interface CinematicIntroProps {
  userName?: string;
  theme: EmotionalTheme;
  onComplete: () => void;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ userName, theme, onComplete }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showEffects, setShowEffects] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const narrationLines = [
    "Dans le silence de l'hiver...",
    "...chaque prénom murmure une histoire...",
    userName ? `"...et le tien, ${userName}, est une mélodie..."` : `"...attendant d'être entendue..."`
  ];

  useEffect(() => {
    // Démarrer la musique thématique
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // L'utilisateur doit interagir pour l'audio
      });
    }

    // Séquence de narration
    const timers = [
      setTimeout(() => setShowEffects(true), 500),
      setTimeout(() => setCurrentLine(1), 2000),
      setTimeout(() => setCurrentLine(2), 4000),
      setTimeout(() => setCurrentLine(3), 6000),
      setTimeout(onComplete, 8000)
    ];

    return () => timers.forEach(clearTimeout);
  }, [userName, onComplete]);

  return (
    <div className="cinematic-scene fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Audio thématique */}
      <audio
        ref={audioRef}
        src={`/sounds/${theme.music}`}
        loop
      />

      {/* Effet de caméra qui dézoome depuis un flocon */}
      <div className="camera-effect absolute inset-0 flex items-center justify-center">
        <div className={`snowflake-closeup transition-all duration-[2000ms] ${
          showEffects ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}>
          <div className="w-32 h-32 bg-white rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>

      {/* Voix off subtile - simulation avec des ondes */}
      <div className="voice-waves absolute top-20 left-1/2 -translate-x-1/2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-8 bg-white/30 rounded-full transition-all duration-1000 ${
              currentLine > 0 ? 'animate-pulse' : 'opacity-0'
            }`}
            style={{
              left: `${i * 20 - 40}px`,
              animationDelay: `${i * 200}ms`
            }}
          ></div>
        ))}
      </div>

      {/* Texte narratif avec effets */}
      <div className="narration-sequence absolute inset-0 flex items-center justify-center">
        {narrationLines.map((line, index) => (
          <div
            key={index}
            className={`narration-line absolute text-center transition-all duration-[2000ms] ${
              currentLine === index + 1
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <p className="text-2xl md:text-4xl font-serif italic text-white/90 leading-relaxed">
              {line}
            </p>
          </div>
        ))}
      </div>

      {/* Effets visuels synchronisés */}
      <div className="visual-effects absolute inset-0 pointer-events-none">
        {/* Lueur persistante */}
        <div className={`persistent-glow absolute inset-0 transition-opacity duration-1000 ${
          showEffects ? 'opacity-20' : 'opacity-0'
        }`} style={{ background: theme.gradient }}></div>

        {/* Éclairs de lumière */}
        {showEffects && (
          <>
            <div className="light-streak absolute top-1/4 left-1/4 w-px h-32 bg-white/50 rotate-45 animate-pulse"></div>
            <div className="light-streak absolute top-1/3 right-1/3 w-px h-24 bg-white/30 -rotate-12 animate-pulse" style={{ animationDelay: '500ms' }}></div>
          </>
        )}

        {/* Grain de film */}
        <div className="film-grain absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-noise animate-pulse"></div>
        </div>
      </div>

      <style>{`
        @keyframes noise {
          0%, 100% { background-position: 0 0; }
          10% { background-position: -5% -10%; }
          20% { background-position: -15% 5%; }
          30% { background-position: 7% -25%; }
          40% { background-position: 20% 25%; }
          50% { background-position: -27% 10%; }
          60% { background-position: 15% -22%; }
          70% { background-position: -35% 15%; }
          80% { background-position: 25% 5%; }
          90% { background-position: -10% -18%; }
        }
        .bg-noise {
          background-image: radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, white 1px, transparent 1px);
          background-size: 4px 4px, 2px 2px;
          animation: noise 0.5s steps(10) infinite;
        }
      `}</style>
    </div>
  );
};

export default CinematicIntro;