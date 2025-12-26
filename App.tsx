
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Snowflake, Sparkles, Volume2, VolumeX, Wand2, ChevronRight, Gamepad2, Heart, Star } from 'lucide-react';
import CinematicScene from './components/CinematicScene';
import OverlayUI from './components/OverlayUI';
import NameReveal3D from './components/NameReveal3D';
import ChristmasTicTacToe from './components/ChristmasTicTacToe';
import CinematicIntro from './components/CinematicIntro';
import WishMaker from './components/WishMaker';
import SpecialCoracheIntro from './components/SpecialCoracheIntro';
import ConfirmLastName from './components/ConfirmLastName';
import { getLocalPoem } from './services/poetryService';
import { getEmotionalTheme, EmotionalTheme } from './themes';
import { createPersonalizedOutro } from './utils/WinterMemory';

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
  OUTRO,
  CONFIRM_LAST_NAME,
  SPECIAL
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [name, setName] = useState<string>('');
  const [poem, setPoem] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [outroData, setOutroData] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialisation de la musique
  useEffect(() => {
    audioRef.current = new Audio('/assets/s1.mpeg');
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

  const theme = useMemo((): EmotionalTheme => {
    return getEmotionalTheme(name);
  }, [name]);

  useEffect(() => {
    if (state === AppState.OUTRO && name && !outroData) {
      const userData = {
        fullName: name,
        isSpecial: name.toLowerCase().includes('peace') || name.toLowerCase().includes('noukouyekpon') || name.toLowerCase().includes('isabelle') || name.toLowerCase().includes('corache')
      };
      const experienceData = {
        theme: theme.particles,
        duration: 300, // simulated duration
        interactions: 10, // simulated interactions
        wish: 'A magical wish' // could be passed from WishMaker
      };
      const outro = createPersonalizedOutro(userData, experienceData);
      setOutroData(outro);
    }
  }, [state, name, outroData, theme]);

  const startExperience = (targetName: string) => {
    setName(targetName);
    const isPotentialSpecial = targetName.toLowerCase().includes('corache') || targetName.toLowerCase().includes('isabelle');
    if (isPotentialSpecial) {
      setState(AppState.CONFIRM_LAST_NAME);
    } else {
      setState(AppState.LOADING);

      setTimeout(() => {
        setState(AppState.METAMORPHOSIS);
        const generatedPoem = getLocalPoem(targetName);
        setPoem(generatedPoem);
        setTimeout(() => setState(AppState.INTRO), 2000);
      }, 1500);
    }
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

  const getNextState = (currentState: AppState): AppState => {
    switch (currentState) {
      case AppState.IDLE: return AppState.LOADING;
      case AppState.LOADING: return AppState.METAMORPHOSIS;
      case AppState.METAMORPHOSIS: return AppState.INTRO;
      case AppState.INTRO: return AppState.CINEMATIC;
      case AppState.CINEMATIC: return AppState.REVEAL;
      case AppState.REVEAL: return AppState.GAME_CHALLENGE;
      case AppState.GAME_CHALLENGE: return AppState.TIC_TAC_TOE;
      case AppState.TIC_TAC_TOE: return AppState.WISH;
      case AppState.WISH: return AppState.OUTRO;
      case AppState.OUTRO: return AppState.IDLE;
      default: return currentState;
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
            style={{ color: theme.primary, textShadow: `0 0 30px ${theme.primary}44` }}
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
        theme={theme}
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

      {/* Boutons de contrôle */}
      {state >= AppState.INTRO && (
        <div className="absolute top-8 left-8 z-[110] flex gap-2">
          <button
            onClick={() => setState(getNextState(state))}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 transition-all"
            title="Aller à l'étape suivante"
          >
            Passer
          </button>
          <button
            onClick={handleRestart}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 transition-all"
            title="Terminer l'expérience et revenir à l'accueil"
          >
            Fin
          </button>
        </div>
      )}

      {state === AppState.IDLE && <OverlayUI onStart={startExperience} />}

      {state === AppState.CONFIRM_LAST_NAME && (
        <ConfirmLastName
          firstName={name.split(' ')[0]}
          onConfirm={(lastName) => {
            if (lastName.toLowerCase() === 'akpakoun') {
              setName(`${name} ${lastName}`);
              // Start special music
              if (audioRef.current) {
                audioRef.current.src = '/assets/s3.mpeg';
                audioRef.current.play().catch(() => {});
              }
              setState(AppState.SPECIAL);
            } else {
              setState(AppState.LOADING);
              setTimeout(() => {
                setState(AppState.METAMORPHOSIS);
                const generatedPoem = getLocalPoem(name);
                setPoem(generatedPoem);
                setTimeout(() => setState(AppState.INTRO), 2000);
              }, 1500);
            }
          }}
        />
      )}

      {state === AppState.SPECIAL && (
        <SpecialCoracheIntro
          name={name}
          onComplete={() => {
            setState(AppState.LOADING);
            setTimeout(() => {
              setState(AppState.METAMORPHOSIS);
              const generatedPoem = getLocalPoem(name);
              setPoem(generatedPoem);
              setTimeout(() => setState(AppState.INTRO), 2000);
            }, 1500);
          }}
        />
      )}

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
        <CinematicIntro
          userName={name}
          theme={theme}
          onComplete={() => setState(AppState.CINEMATIC)}
        />
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
        <NameReveal3D
          name={name}
          poem={poem}
          theme={theme}
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
            <ChristmasTicTacToe
              onWin={() => setState(AppState.WISH)}
              playerName={name}
              theme={theme}
            />
          </div>
        </div>
      )}

      {state === AppState.WISH && (
        <WishMaker
          userName={name}
          theme={theme}
          onComplete={() => setState(AppState.OUTRO)}
        />
      )}

      {state === AppState.OUTRO && outroData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#020617]/90 backdrop-blur-xl animate-[fadeIn_3s_ease-out]">
            <div className="text-center space-y-12 max-w-4xl px-8">
               {renderFinalName()}
               <div className="space-y-6">
                 <Heart className="mx-auto text-pink-400 animate-bounce" size={32} />
                 <h3 className="text-3xl font-serif italic text-white/90">{outroData.title}</h3>
                 <p className="font-serif italic text-white/70 text-xl max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
                   {outroData.message}
                 </p>
               </div>

               {/* Memory information */}
               <div className="space-y-4 text-sm text-white/50">
                 <p className="text-xs">Ton souvenir a été sauvegardé dans les étoiles d'hiver</p>
               </div>

               <div className="flex flex-col items-center gap-4">
                 <button
                   onClick={handleRestart}
                   className="text-[9px] tracking-[0.5em] uppercase text-white/20 hover:text-white transition-all"
                 >
                   Recommencer le voyage
                 </button>
                 <button
                   onClick={() => navigator.share?.({ title: 'Mon souvenir d\'Étoile d\'Hiver', url: outroData.shareable })}
                   className="text-[8px] tracking-[0.3em] uppercase text-white/10 hover:text-white/30 transition-all"
                 >
                   Partager ce moment
                 </button>
               </div>
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
