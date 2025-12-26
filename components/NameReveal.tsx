
import React, { useEffect, useState } from 'react';
import { EmotionalTheme } from '../themes';

interface NameRevealProps {
  name: string;
  poem: string;
  onComplete: () => void;
  theme: EmotionalTheme;
}

const NameReveal: React.FC<NameRevealProps> = ({ name, poem, onComplete, theme }) => {
  const accentColor = theme.primary;
  const [phase, setPhase] = useState(0);
  const [currentLineIdx, setCurrentLineIdx] = useState(-1);
  const lines = poem.split('\n').filter(l => l.trim().length > 0);

  const firstName = name.split(' ')[0];

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000), // Apparition ombre
      setTimeout(() => setPhase(2), 3500), // Reveal Prénom
      setTimeout(() => setPhase(3), 7000), // Début poésie
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

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-40 pointer-events-none overflow-hidden select-none">
      {/* Ombre de fond */}
      <div className={`absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-[3000ms] ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
         <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 text-white/[0.03] font-magic text-[12rem] md:text-[20rem] blur-2xl scale-y-[-0.5] opacity-20">
            {firstName}
         </div>
      </div>

      {/* Prénom Principal */}
      <div className="relative z-50 text-center mb-16">
        <h1 
          style={{ 
            color: phase >= 2 ? 'white' : 'transparent', 
            textShadow: phase >= 2 ? `0 0 80px ${accentColor}88, 0 0 30px ${accentColor}44` : 'none' 
          }}
          className={`text-7xl md:text-[10rem] font-magic transition-all duration-[4000ms] leading-none px-6
            ${phase >= 2 ? 'opacity-100 scale-100 translate-y-0 blur-0' : 'opacity-0 scale-90 translate-y-20 blur-[30px]'}
          `}
        >
          {firstName}
        </h1>
      </div>

      {/* Poésie */}
      <div className="max-w-2xl px-12 text-center h-48 relative z-50 flex items-center justify-center">
        {lines.map((line, idx) => (
          <p 
            key={idx}
            className={`absolute inset-0 flex items-center justify-center font-serif italic text-lg md:text-3xl text-white/80 transition-all duration-[3000ms] leading-relaxed
              ${currentLineIdx === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 blur-md'}
            `}
          >
            {line.trim()}
          </p>
        ))}
      </div>
    </div>
  );
};

export default NameReveal;
