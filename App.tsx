
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Snowflake, Sparkles, Volume2, VolumeX, Wand2, ChevronRight, Gamepad2, Heart, Star } from 'lucide-react';
import CinematicScene from './components/CinematicScene';
import OverlayUI from './components/OverlayUI';
import NameReveal from './components/NameReveal';
import ChristmasTicTacToe from './components/ChristmasTicTacToe';
import { getLocalPoem } from './services/poetryService';

export enum AppState { 
  IDLE, 
  LOADING, 
  METAMORPHOSIS, 
  INTRO, 
  CINEMATIC, 
  REVEAL, 
  GAME_CHALLENGE,
  TIC_TAC_TOE,
  WISH, 
  OUTRO 
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [name, setName] = useState<string>('');
  const [poem, setPoem] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialisation de la musique
  useEffect(() => {
    audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3');
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = isMuted ? 0 : 0.4;
    }
    
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 0.4;
    }
  }, [isMuted]);

  useEffect(() => {
    if (state >= AppState.REVEAL && audioRef.current) {
      audioRef.current.play().catch(() => {
        // L'utilisateur doit interagir pour l'audio
      });
    }
  }, [state]);

  const accentColor = useMemo(() => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('peace') || lowerName.includes('noukouyekpon')) return '#f472b6'; // Rose pour elle
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash % 360)}, 70%, 75%)`;
  }, [name]);

  const startExperience = (targetName: string) => {
    setName(targetName);
    setState(AppState.LOADING);
    
    setTimeout(() => {
      setState(AppState.METAMORPHOSIS);
      const generatedPoem = getLocalPoem(targetName);
      setPoem(generatedPoem);
      setTimeout(() => setState(AppState.INTRO), 2000);
    }, 1500);
  };

  const handleRestart = () => {
    setState(AppState.IDLE);
    setName('');
    setPoem('');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const renderFinalName = () => {
    const firstName = name.split(' ')[0];
    const lastName = name.split(' ').slice(1).join(' ');

    return (
      <div className="flex flex-col items-center justify-center w-full px-4 text-center">
        <span className="text-xl md:text-3xl opacity-60 font-serif italic mb-4 tracking-widest uppercase">Ma chère,</span>
        <div className="flex flex-col items-center w-full">
          <span 
            style={{ color: accentColor, textShadow: `0 0 30px ${accentColor}44` }} 
            className="text-6xl md:text-[8rem] font-magic block leading-none mb-4"
          >
            {firstName}
          </span>
          {lastName && (
            <span className="text-3xl md:text-6xl font-magic opacity-90 break-words max-w-[90vw]">
              {lastName}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen bg-[#020617] overflow-hidden text-white">
      <CinematicScene 
        active={state >= AppState.METAMORPHOSIS} 
        slowMode={state >= AppState.REVEAL}
        accentColor={accentColor}
        showTree={state >= AppState.REVEAL}
        treeSideMode={state === AppState.REVEAL || state === AppState.TIC_TAC_TOE}
      />

      {/* Barre de contrôles */}
      <div className="absolute top-8 right-8 z-[100] flex items-center gap-4">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 transition-all text-white/40 hover:text-white backdrop-blur-xl"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {state === AppState.IDLE && <OverlayUI onStart={startExperience} />}

      {state === AppState.LOADING && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#020617]">
          <Snowflake className="text-white/10 animate-spin-slow mb-8" size={100} />
          <p className="font-serif italic text-white/30 tracking-[1em] animate-pulse uppercase text-[10px]">
            L'instant s'éveille...
          </p>
        </div>
      )}

      {state === AppState.METAMORPHOSIS && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
           <div className="text-center animate-pulse">
             <Sparkles className="text-amber-200/40 mb-4 mx-auto" size={32} />
             <h3 className="text-lg font-light tracking-[0.5em] uppercase text-white/40">Émotion en cours...</h3>
           </div>
        </div>
      )}

      {state === AppState.INTRO && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-[#020617] px-8 text-center animate-[fadeOut_2s_ease-in_forwards_delay-5s]">
          <div className="max-w-4xl space-y-16">
            <h2 className="text-4xl md:text-6xl font-serif italic text-white/90 leading-relaxed animate-[fadeInOut_5s_ease-in-out_forwards]">
              "Dans le silence de cette nuit de Noël, ton nom brille plus que tout."
            </h2>
            <button 
              onClick={() => setState(AppState.CINEMATIC)}
              className="px-12 py-5 border border-white/10 text-white/40 hover:text-white transition-all tracking-[0.6em] uppercase text-[10px] animate-[fadeIn_3s_ease-out_2s_forwards] opacity-0"
            >
              Découvrir ton Noël
            </button>
          </div>
        </div>
      )}

      {state === AppState.CINEMATIC && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
           <p className="text-[11px] tracking-[2em] text-white/30 uppercase animate-[fadeSlideUp_6s_ease-in-out_forwards]">
             Le monde s'arrête...
           </p>
           <TimeoutTrigger delay={6000} onTrigger={() => setState(AppState.REVEAL)} />
        </div>
      )}

      {state === AppState.REVEAL && (
        <NameReveal 
          name={name} 
          poem={poem} 
          accentColor={accentColor}
          onComplete={() => setState(AppState.GAME_CHALLENGE)} 
        />
      )}

      {state === AppState.GAME_CHALLENGE && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm animate-[fadeIn_2s_ease-out]">
           <div className="max-w-xl w-full text-center space-y-12 p-12 bg-white/5 border border-white/10 rounded-[3rem]">
              <Gamepad2 className="mx-auto text-amber-200" size={48} />
              <div className="space-y-4">
                <h2 className="text-4xl font-serif italic">Défi de Noël</h2>
                <p className="text-white/60 tracking-widest text-sm uppercase">Pour libérer ton vœu, bats le Gardien du Cœur Gelé !</p>
              </div>
              <button 
                onClick={() => setState(AppState.TIC_TAC_TOE)}
                className="px-12 py-4 rounded-full bg-amber-200/10 border border-amber-200/40 text-amber-100 uppercase tracking-[0.3em] text-xs hover:bg-amber-200/20 transition-all"
              >
                Accepter le défi
              </button>
           </div>
        </div>
      )}

      {state === AppState.TIC_TAC_TOE && (
        <div className="absolute inset-0 flex items-center justify-center z-[120] bg-[#020617]/80 backdrop-blur-2xl animate-[fadeIn_1s_ease-out]">
          <div className="max-w-md w-full p-8 bg-white/5 border border-white/10 rounded-[3rem] relative shadow-2xl">
            <ChristmasTicTacToe onWin={() => setState(AppState.WISH)} />
          </div>
        </div>
      )}

      {state === AppState.WISH && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/20 backdrop-blur-[2px] animate-[fadeIn_3s_ease-out]">
          <div className="text-center space-y-16 max-w-3xl px-10">
            <div className="relative inline-block">
               <Wand2 className="text-amber-200 animate-pulse" size={64} />
            </div>
            <div className="space-y-6">
              <h2 className="text-5xl md:text-[5rem] font-serif italic text-white">Fais un vœu, {name.split(' ')[0]}...</h2>
              <p className="text-white/30 tracking-[0.5em] uppercase text-[10px]">Laisse ton cœur parler aux étoiles</p>
            </div>
            <button 
              onClick={() => setState(AppState.OUTRO)}
              className="px-12 py-5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white uppercase tracking-[0.5em] text-[10px] transition-all"
            >
              C'est fait
            </button>
          </div>
        </div>
      )}

      {state === AppState.OUTRO && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#020617]/90 backdrop-blur-xl animate-[fadeIn_3s_ease-out]">
           <div className="text-center space-y-12">
              {renderFinalName()}
              <div className="space-y-6">
                <Heart className="mx-auto text-pink-400 animate-bounce" size={32} />
                <p className="font-serif italic text-white/70 text-2xl max-w-lg mx-auto leading-relaxed">
                  "Que ce Noël soit le début d'une année remplie de lumière."
                </p>
              </div>
              <button 
                onClick={handleRestart}
                className="mt-12 text-[9px] tracking-[0.5em] uppercase text-white/20 hover:text-white transition-all"
              >
                Recommencer le voyage
              </button>
           </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(20px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(40px); }
          30% { opacity: 1; transform: translateY(0); }
          70% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-40px); }
        }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; visibility: hidden; } }
      `}</style>
    </div>
  );
};

const TimeoutTrigger: React.FC<{ delay: number; onTrigger: () => void }> = ({ delay, onTrigger }) => {
  useEffect(() => {
    const timer = setTimeout(onTrigger, delay);
    return () => clearTimeout(timer);
  }, [delay, onTrigger]);
  return null;
};

export default App;
