
import React, { useState, useEffect, useCallback } from 'react';

interface GameProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

export const NBackGame: React.FC<GameProps> = ({ onComplete, onCancel }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const n = 1; // 1-back for simple demo

  const startGame = () => {
    setIsPlaying(true);
    setSequence(Array.from({ length: 15 }, () => Math.floor(Math.random() * 4)));
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (isPlaying && currentIndex < sequence.length && currentIndex >= 0) {
      const timer = setTimeout(() => {
        if (currentIndex === sequence.length - 1) {
          setIsPlaying(false);
          onComplete(Math.round((score / Math.max(1, totalAttempts)) * 100));
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentIndex, sequence, score, totalAttempts, onComplete]);

  const handleMatch = () => {
    if (!isPlaying) return;
    setTotalAttempts(prev => prev + 1);
    if (currentIndex >= n && sequence[currentIndex] === sequence[currentIndex - n]) {
      setScore(prev => prev + 1);
    }
  };

  const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400'];

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10">
      <h2 className="text-2xl font-bold">1-Back Challenge</h2>
      <p className="text-gray-500 text-center max-w-xs">Click the "MATCH" button if the current color is the same as the one shown <span className="font-bold text-indigo-600">immediately before</span> it.</p>
      
      {!isPlaying && currentIndex === -1 ? (
        <button onClick={startGame} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg">Start Game</button>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {colors.map((color, idx) => (
              <div 
                key={idx} 
                className={`w-24 h-24 rounded-2xl transition-all duration-300 ${
                  currentIndex >= 0 && sequence[currentIndex] === idx ? color + ' scale-110 shadow-xl' : 'bg-gray-100'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleMatch}
              className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold text-xl active:scale-95 transition-transform"
            >
              MATCH
            </button>
          </div>
          <button onClick={onCancel} className="text-gray-400 text-sm">Cancel</button>
        </>
      )}
    </div>
  );
};

export const PairedAssociates: React.FC<GameProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'study' | 'test'>('study');
  const [pairs] = useState([
    { a: 'Dog', b: 'Cloud' },
    { a: 'Phone', b: 'Water' },
    { a: 'Table', b: 'Forest' },
    { a: 'Star', b: 'Sandwich' }
  ]);
  const [testIdx, setTestIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);

  const handleNextTest = () => {
    if (answer.toLowerCase().trim() === pairs[testIdx].b.toLowerCase()) {
      setScore(prev => prev + 1);
    }
    if (testIdx === pairs.length - 1) {
      onComplete(Math.round(((score + (answer.toLowerCase().trim() === pairs[testIdx].b.toLowerCase() ? 1 : 0)) / pairs.length) * 100));
    } else {
      setTestIdx(prev => prev + 1);
      setAnswer('');
    }
  };

  if (step === 'study') {
    return (
      <div className="flex flex-col items-center gap-6 py-10">
        <h2 className="text-2xl font-bold text-center">Memorize the Pairs</h2>
        <div className="grid grid-cols-1 gap-4 w-full">
          {pairs.map((p, i) => (
            <div key={i} className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <span className="font-bold text-lg">{p.a}</span>
              <span className="text-gray-400 text-xl">→</span>
              <span className="font-bold text-lg text-indigo-700">{p.b}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setStep('test')}
          className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold w-full"
        >
          Ready to Test
        </button>
        <button onClick={onCancel} className="text-gray-400 text-sm">Cancel</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      <h2 className="text-2xl font-bold">What was paired with...</h2>
      <div className="bg-white border-2 border-indigo-500 rounded-3xl p-10 shadow-xl w-full text-center">
        <span className="text-4xl font-bold text-gray-800">{pairs[testIdx].a}</span>
      </div>
      <input 
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type the associated word"
        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none text-center text-lg"
        autoFocus
      />
      <button 
        onClick={handleNextTest}
        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold w-full"
      >
        Next
      </button>
    </div>
  );
};
