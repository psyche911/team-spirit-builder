import React, { useState, useEffect, useRef } from 'react';
import { Trophy, RefreshCw, Play, RotateCcw, Award } from 'lucide-react';
import { Person, DrawHistoryItem } from '../types';

interface PrizeDrawProps {
  people: Person[];
}

const PrizeDraw: React.FC<PrizeDrawProps> = ({ people }) => {
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [history, setHistory] = useState<DrawHistoryItem[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState<string>("Ready to Draw");
  
  // Animation refs
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Filter eligible candidates
  const candidates = allowRepeats 
    ? people 
    : people.filter(p => !history.some(h => h.winner.id === p.id));

  const startDraw = () => {
    if (candidates.length === 0) return;
    if (isSpinning) return;

    setIsSpinning(true);
    let speed = 50;
    let duration = 3000; // 3 seconds spin
    let elapsed = 0;

    // Fast cycling effect
    const cycleNames = () => {
      const randomIdx = Math.floor(Math.random() * candidates.length);
      setCurrentDisplay(candidates[randomIdx].name);
      
      elapsed += speed;
      
      if (elapsed < duration) {
        // Slow down slightly near the end
        if (elapsed > duration - 1000) speed += 10;
        timeoutRef.current = window.setTimeout(cycleNames, speed);
      } else {
        finishDraw();
      }
    };

    cycleNames();
  };

  const finishDraw = () => {
    // Select winner
    const winnerIndex = Math.floor(Math.random() * candidates.length);
    const winner = candidates[winnerIndex];

    setCurrentDisplay(winner.name);
    setIsSpinning(false);
    
    const newHistoryItem: DrawHistoryItem = {
      timestamp: Date.now(),
      winner
    };
    
    setHistory(prev => [newHistoryItem, ...prev]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const resetHistory = () => {
    if (confirm("Clear draw history?")) {
      setHistory([]);
      setCurrentDisplay("Ready to Draw");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Main Draw Stage */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-2 flex justify-center items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-300" />
            Lucky Draw
          </h2>
          <p className="opacity-80">
            {candidates.length} eligible participants remaining
          </p>
        </div>

        <div className="p-10 flex flex-col items-center justify-center space-y-8 min-h-[300px]">
          
          {/* Slot Machine Display */}
          <div className={`
            relative w-full max-w-lg h-32 bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden border-4 border-slate-800 shadow-inner
            ${isSpinning ? 'ring-4 ring-indigo-400 ring-opacity-50' : ''}
          `}>
             {/* Decorative shine */}
             <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-5 pointer-events-none rounded-t-lg"></div>

             <span className={`
               text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 tracking-wide text-center px-4
               ${isSpinning ? 'blur-[1px] scale-105 transition-all duration-75' : 'scale-100 transition-all duration-300'}
             `}>
               {currentDisplay}
             </span>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-4 w-full">
            <button
              onClick={startDraw}
              disabled={isSpinning || candidates.length === 0}
              className={`
                px-12 py-4 rounded-full font-bold text-xl shadow-lg transform transition-all active:scale-95 flex items-center gap-3
                ${isSpinning || candidates.length === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/30'
                }
              `}
            >
              {isSpinning ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  Drawing...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  Draw Winner
                </>
              )}
            </button>

            <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={allowRepeats}
                onChange={(e) => setAllowRepeats(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="font-medium select-none">Allow Repeat Winners</span>
            </label>
          </div>
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              Recent Winners
            </h3>
            <button
              onClick={resetHistory}
              className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset History
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {history.map((item, idx) => (
              <div 
                key={item.timestamp + idx} 
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center font-bold text-sm border border-yellow-200">
                  {history.length - idx}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{item.winner.name}</div>
                  <div className="text-xs text-slate-400">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrizeDraw;
