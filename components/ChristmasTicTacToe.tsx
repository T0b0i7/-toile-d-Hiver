
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Trophy, Snowflake, Zap } from 'lucide-react';
import { EmotionalTheme } from '../themes';

interface TicTacToeProps {
  onWin: () => void;
  playerName?: string;
  theme: EmotionalTheme;
}

// Helper functions
const calculateWinner = (squares: (string | null)[]) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const findLosingMove = (board: (string | null)[], aiSymbol: string): number | null => {
  // Find moves that would let the player win, or just pick randomly
  const availableMoves = board
    .map((v, i) => (v === null ? i : null))
    .filter((v) => v !== null) as number[];

  if (availableMoves.length === 0) return null;

  // Check if any move would block a player win
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = aiSymbol;
    if (calculateWinner(testBoard) === aiSymbol) {
      return move; // Take winning move if available
    }
  }

  // Otherwise, pick a move that doesn't help the player too much
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const findStrategicMove = (board: (string | null)[], aiSymbol: string): number | null => {
  const availableMoves = board
    .map((v, i) => (v === null ? i : null))
    .filter((v) => v !== null) as number[];

  if (availableMoves.length === 0) return null;

  // Sometimes pretend to lose (30% chance for normal users)
  if (Math.random() < 0.3) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // Simple strategy: try to win, then block, then center, then corners
  const playerSymbol = aiSymbol === 'X' ? 'O' : 'X';

  // Check for winning move
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = aiSymbol;
    if (calculateWinner(testBoard) === aiSymbol) {
      return move;
    }
  }

  // Check for blocking move
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = playerSymbol;
    if (calculateWinner(testBoard) === playerSymbol) {
      return move;
    }
  }

  // Prefer center, then corners
  const preferredMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  for (const move of preferredMoves) {
    if (availableMoves.includes(move)) {
      return move;
    }
  }

  return availableMoves[0];
};

const ChristmasTicTacToe: React.FC<TicTacToeProps> = ({ onWin, playerName, theme }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // X is Player (Santa), O is AI (Rudolph)
  const [winner, setWinner] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [lightningCell, setLightningCell] = useState<number | null>(null);
  const [aiThoughts, setAiThoughts] = useState<string>('');

  const isSpecial = playerName && (playerName.toLowerCase().includes('peace') || playerName.toLowerCase().includes('noukouyekpon') || playerName.toLowerCase().includes('isabelle') || playerName.toLowerCase().includes('corache') || playerName.toLowerCase().includes('akpakoun'));
  const difficulty = isSpecial ? 'romantic' : 'festive';
  const aiRef = useRef<HTMLDivElement>(null);

  const playerIcons = {
    X: '🎅',
    O: '🦌'
  };

  const handleClick = (i: number) => {
    if (board[i] || winner || !isXNext) return;
    const newBoard = board.slice();
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
  };

  // AI Logic with cinematic effects
  useEffect(() => {
    if (!isXNext && !winner) {
      setThinking(true);

      // Show thinking effect
      const thoughts = difficulty === 'romantic'
        ? [
            "Hmm... Quel coup serait le plus élégant ?",
            "La princesse mérite une victoire magnifique...",
            "Comment rendre ce moment mémorable ?"
          ]
        : [
            "Le vent d'hiver murmure des secrets...",
            "Chaque flocon a son chemin...",
            "La magie de Noël guide ma main..."
          ];

      setAiThoughts(thoughts[Math.floor(Math.random() * thoughts.length)]);

      // Dramatic pause
      const timer = setTimeout(async () => {
        setThinking(false);
        setAiThoughts('');

        const move = difficulty === 'romantic'
          ? findLosingMove(board, 'O')
          : findStrategicMove(board, 'O');

        if (move !== null) {
          // Lightning effect
          setLightningCell(move);
          await new Promise(resolve => setTimeout(resolve, 800));

          const newBoard = board.slice();
          newBoard[move] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
          setLightningCell(null);
        }
      }, 2000); // Longer pause for drama

      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner, difficulty]);

  useEffect(() => {
    const gameWinner = calculateWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
    } else if (board.every((cell) => cell !== null)) {
      setWinner('Draw');
    }
  }, [board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <h2 className="text-3xl font-serif italic text-white/90">Rituel du Jeu</h2>

      {/* AI Thinking Effect */}
      {thinking && (
        <div
          ref={aiRef}
          className="absolute top-4 right-4 bg-black/80 border border-white/20 rounded-lg p-4 max-w-xs animate-fadeIn"
          style={{ background: theme.gradient, backgroundClip: 'padding-box' }}
        >
          <div className="flex items-center gap-2">
            <Snowflake className="animate-spin" size={16} />
            <p className="text-white text-sm italic">{aiThoughts}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 relative">
        {board.map((cell, i) => (
          <button
            key={i}
            data-position={i}
            onClick={() => handleClick(i)}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center text-4xl bg-white/5 border border-white/10 transition-all relative
              ${!cell && isXNext ? 'hover:bg-white/10 hover:border-amber-200/30' : ''}
              ${cell === 'X' ? 'border-amber-200/20' : ''}
              ${lightningCell === i ? 'lightning-strike' : ''}
            `}
            style={{
              background: cell === 'O' ? `${theme.primary}20` : undefined,
              borderColor: cell === 'O' ? `${theme.primary}40` : undefined
            }}
          >
            {cell ? playerIcons[cell as keyof typeof playerIcons] : ''}
            {lightningCell === i && (
              <Zap className="absolute inset-0 m-auto text-yellow-400 animate-ping" size={24} />
            )}
          </button>
        ))}
      </div>

      <div className="h-16 flex items-center">
        {winner === 'X' ? (
          <div className="flex flex-col items-center gap-4 animate-bounce">
            <Trophy className="text-amber-400" size={32} />
            <p className="text-amber-100 font-light">Bravo ! La magie se libère...</p>
            <button 
              onClick={onWin}
              className="mt-2 px-8 py-2 bg-amber-400/20 text-amber-100 rounded-full text-xs uppercase tracking-widest"
            >
              Continuer
            </button>
          </div>
        ) : winner === 'O' ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-white/60">Le Gardien a gagné cette fois...</p>
            <button onClick={resetGame} className="text-amber-200/60 flex items-center gap-2 text-xs">
              <RotateCcw size={14} /> Réessayer
            </button>
          </div>
        ) : winner === 'Draw' ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-white/60 text-center">Match nul ! La glace résiste encore...<br />Mais ton cœur peut la faire fondre avec persévérance.</p>
            <div className="flex gap-4">
              <button onClick={resetGame} className="px-4 py-2 bg-amber-200/20 text-amber-100 rounded-full text-xs uppercase tracking-widest hover:bg-amber-200/30 transition-all">
                Continuer le défi
              </button>
              <button onClick={onWin} className="px-4 py-2 bg-white/10 text-white/80 rounded-full text-xs uppercase tracking-widest hover:bg-white/20 transition-all">
                Libérer mon vœu
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm font-light text-white/40 tracking-[0.3em] uppercase">
            Tour de : {isXNext ? 'Toi 🎅' : 'Gardien 🦌'}
          </div>
        )}
      </div>

      <style>{`
        .lightning-strike {
          animation: lightning 0.8s ease-out;
          box-shadow: 0 0 30px ${theme.primary}, 0 0 60px ${theme.primary}40;
        }

        @keyframes lightning {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); background-color: rgba(255, 255, 255, 0.3); }
          100% { transform: scale(1); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ChristmasTicTacToe;
