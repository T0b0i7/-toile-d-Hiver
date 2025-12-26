import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface SpecialCoracheIntroProps {
  name: string;
  onComplete: () => void;
}

const SpecialCoracheIntro: React.FC<SpecialCoracheIntroProps> = ({ name, onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showImages, setShowImages] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showPoem, setShowPoem] = useState(false);

  const messages = [
    "Moi C'est Isa , Corache , Coco tout ce que tu veux",
    "À l'état civil AKPAKOUN MARIE-CORACHE FOLAKÈ EGNONNAM I.",
    "d'origine ivoiro-ghanéenne et de nationalité béninoise ...sorryyy....",
    "Polyvalente et passionnée, je m'épanouis dans l'art sous toutes ses formes : peinture, danse, dessin…",
    "J'aime aussi voyager, cuisiner et me reconnecter à la nature.",
    "L'exploration et la créativité sont au cœur de ma vie.",
    "Ah, et j'ai des frères et sœurs, donc l'esprit de famille, je connais bien.",
    "Euh quoi d'autre ?Le sport me passionne, même si mon corps ne suit pas toujours.",
    "Grande amoureuse des mots, je dévore les livres et j'écris mes propres histoires.",
    "Plutôt réservée, je parle peu, mais en bonne compagnie, je me révèle.",
    "Mon cercle est restreint, car je ne supporte pas la foule – la qualité avant la quantité ...",
    "Je suis un mélange de plusieurs nationalités. Tout ce qui fait mon charme."
  ];

  useEffect(() => {
    if (!showPoem) {
      const interval = setInterval(() => {
        setCurrentMessageIndex(prev => {
          if (prev < messages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setShowImages(true);
            setTimeout(() => setShowVideo(true), 2000);
            return prev;
          }
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [showPoem]);

  const poem = `À Isabelle, étoile filante dans la nuit d'hiver,
Ta grâce illumine chaque flocon qui danse.
Avec ton cœur d'artiste et ton âme voyageuse,
Tu peins le monde de couleurs infinies.

Que cette Noël t'apporte des rêves éveillés,
Des voyages vers des horizons nouveaux,
Et que l'amour de ta famille t'entoure toujours,
Comme une constellation bienveillante.

Joyeux Noël, ma chère Isabelle ! ✨`;


  if (showPoem) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center text-white p-8">
        <div className="max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-magic text-pink-200">Joyeux Noël, {name} ! 🎄</h2>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <p className="text-xl md:text-2xl font-serif italic whitespace-pre-line text-white/90">
              {poem}
            </p>
          </div>
          <button
            onClick={onComplete}
            className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-xl font-bold transition-all"
          >
            Passer au défi ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Video Background */}
      <video
        src="/assets/V.mp4"
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/90 via-purple-900/90 to-indigo-900/90"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              fontSize: `${Math.random() * 30 + 20}px`
            }}
          >
            {['💖', '✨', '🌟', '💕', '🎀', '🌸', '🌹'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl w-full px-4 text-center flex flex-col items-center min-h-screen justify-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-8xl font-magic mb-4 text-pink-200 drop-shadow-2xl">
            {name} 💖
          </h1>
          <p className="text-xl md:text-2xl text-pink-100 font-light">
            Une aventure spéciale t'attend...
          </p>
        </div>

        {/* Messages Container */}
        {!showImages && (
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 min-h-[300px] flex items-center justify-center shadow-2xl border border-white/10 mb-8">
            <p className={`text-2xl md:text-4xl text-white animate-pulse ${currentMessageIndex === 1 ? 'font-sans font-bold text-3xl md:text-5xl' : 'font-serif italic'}`}>
              {messages[currentMessageIndex]}
            </p>
          </div>
        )}

        {/* Images Gallery with Animations */}
        {showImages && !showVideo && (
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="relative group animate-bounce">
              <img
                src="/assets/I1 (1).jpeg"
                alt="Memory 1"
                className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-3xl shadow-2xl border-4 border-pink-300/50 transition-all group-hover:scale-110 group-hover:rotate-3"
              />
              <div className="absolute inset-0 bg-pink-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-lg animate-spin">💕</span>
              </div>
            </div>
            <div className="relative group animate-pulse">
              <img
                src="/assets/I1 (2).jpeg"
                alt="Memory 2"
                className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-3xl shadow-2xl border-4 border-purple-300/50 transition-all group-hover:scale-110 group-hover:-rotate-3"
              />
              <div className="absolute inset-0 bg-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-lg animate-ping">✨</span>
              </div>
            </div>
          </div>
        )}

        {/* Video Spotlight */}
        {showVideo && (
          <div className="relative mb-8 animate-fadeIn">
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50 rounded-full blur-3xl scale-150"></div>
            <video
              src="/assets/V.mp4"
              autoPlay
              muted
              loop
              className="relative w-80 h-60 md:w-[500px] md:h-[300px] object-cover rounded-3xl shadow-2xl border-4 border-white/20"
            />
          </div>
        )}

        {/* Continue Button */}
        {showVideo && (
          <button
            onClick={() => setShowPoem(true)}
            className="px-12 py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full text-2xl font-bold transition-all transform hover:scale-110 shadow-2xl border-2 border-white/20"
          >
            Passer ✨
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default SpecialCoracheIntro;