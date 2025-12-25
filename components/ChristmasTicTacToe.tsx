
import React, { useState, useEffect } from 'react';
import { RotateCcw, Trophy, Snowflake } from 'lucide-react';

interface TicTacToeProps {
  onWin: () => void;
}

const ChristmasTicTacToe: React.FC<TicTacToeProps> = ({ onWin }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // X is Player (Santa), O is AI (Rudolph)
  const [winner, setWinner] = useState<string | null>(null);

  const playerIcons = {
    X: '🎅',
    O: '🦌'
  };

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

  const handleClick = (i: number) => {
    if (board[i] || winner || !isXNext) return;
    const newBoard = board.slice();
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
  };

  // AI Logic (Simple Random / Sub-optimal to let player win)
  useEffect(() => {
    if (!isXNext && !winner) {
      const timer = setTimeout(() => {
        const availableMoves = board
          .map((v, i) => (v === null ? i : null))
          .filter((v) => v !== null) as number[];
        
        if (availableMoves.length > 0) {
          const newBoard = board.slice();
          // AI randomly picks but doesn't try too hard to block
          const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
          newBoard[randomMove] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner]);

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
      
      <div className="grid grid-cols-3 gap-4">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center text-4xl bg-white/5 border border-white/10 transition-all
              ${!cell && isXNext ? 'hover:bg-white/10 hover:border-amber-200/30' : ''}
              ${cell === 'X' ? 'border-amber-200/20' : ''}
            `}
          >
            {cell ? playerIcons[cell as keyof typeof playerIcons] : ''}
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
          <div className="flex flex-col items-center gap-2">
            <p className="text-white/60">Match nul ! La glace résiste...</p>
            <button onClick={resetGame} className="text-amber-200/60 flex items-center gap-2 text-xs">
              <RotateCcw size={14} /> Réessayer
            </button>
          </div>
        ) : (
          <div className="text-sm font-light text-white/40 tracking-[0.3em] uppercase">
            Tour de : {isXNext ? 'Toi 🎅' : 'Gardien 🦌'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChristmasTicTacToe;
