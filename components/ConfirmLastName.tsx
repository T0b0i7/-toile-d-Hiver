import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface ConfirmLastNameProps {
  firstName: string;
  onConfirm: (lastName: string) => void;
}

const ConfirmLastName: React.FC<ConfirmLastNameProps> = ({ firstName, onConfirm }) => {
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(lastName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center text-white">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full mx-4 text-center">
        <Heart className="mx-auto mb-4 text-pink-400" size={48} />
        <h2 className="text-2xl font-magic mb-4">Bienvenue, {firstName} !</h2>
        <p className="mb-6 text-white/80">
          Pour une expérience personnalisée, pouvez-vous préciser votre nom de famille ?
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Votre nom de famille"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-pink-400"
            autoFocus
          />
          <button
            type="submit"
            className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold transition-all"
          >
            Confirmer
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmLastName;