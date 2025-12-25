
import React, { useState, useEffect } from 'react';
import { Sparkles, Snowflake } from 'lucide-react';

interface OverlayUIProps {
  onStart: (name: string) => void;
}

const OverlayUI: React.FC<OverlayUIProps> = ({ onStart }) => {
  const [inputValue, setInputValue] = useState('');
  const [lastName, setLastName] = useState('');
  const [showLastName, setShowLastName] = useState(false);

  useEffect(() => {
    const lower = inputValue.trim().toLowerCase();
    // Détection de l'utilisateur spécial Peace
    if (lower === 'peace') {
      setShowLastName(true);
    } else if (lower.length === 0) {
      setShowLastName(false);
      setLastName('');
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length < 2) return;

    const finalName = showLastName && lastName.trim() 
      ? `${inputValue.trim()} ${lastName.trim()}` 
      : inputValue.trim();
      
    onStart(finalName);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 p-6 bg-[#020617]/70 backdrop-blur-lg">
      <div className="max-w-xl w-full text-center space-y-12 bg-white/[0.03] p-12 md:p-20 rounded-[4rem] border border-white/5 shadow-2xl backdrop-blur-3xl animate-[fadeIn_2s_ease-out]">
        
        <div className="space-y-6">
          <Snowflake className="mx-auto text-white/20 animate-pulse" size={48} />
          <h1 className="text-6xl md:text-7xl font-serif italic text-white/90">Éclat d'Hiver</h1>
          <p className="text-amber-200/40 text-[10px] tracking-[0.6em] uppercase">Un Noël pour toi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-8">
            <div className="relative group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ton prénom..."
                className="w-full bg-transparent border-b border-white/10 py-4 px-2 text-center text-4xl font-light focus:outline-none focus:border-amber-200/30 transition-all font-magic text-white/80"
                autoFocus
                required
              />
            </div>

            {showLastName && (
              <div className="animate-[fadeIn_1s_ease-out] space-y-4">
                <p className="text-amber-200/60 text-[9px] tracking-[0.4em] uppercase">✨ Un nom de famille pour la magie ? ✨</p>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="NOUKOUYEKPON..."
                  className="w-full bg-transparent border-b border-white/10 py-4 px-2 text-center text-2xl font-light focus:outline-none focus:border-amber-200/30 transition-all font-magic text-amber-100/60 uppercase"
                  required
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={inputValue.trim().length < 2 || (showLastName && lastName.trim().length < 2)}
            className={`group flex items-center mx-auto gap-4 px-12 py-5 rounded-full border border-white/10 hover:border-amber-200/40 transition-all
              ${inputValue.trim().length >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
            `}
          >
            <Sparkles size={16} className="text-amber-200/50 group-hover:rotate-45 transition-transform" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-white/60 group-hover:text-white">Démarrer l'instant</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default OverlayUI;
