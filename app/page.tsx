'use client';
import { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import GapFill from './components/GapFill';
import Scramble from './components/Scramble';
import MissingLetters from './components/MissingLetters';

export default function Home() {
  const [phrases, setPhrases] = useState<any[]>([]);
  const [dailyQueue, setDailyQueue] = useState<any[]>([]);
  const [isViewingList, setIsViewingList] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mode, setMode] = useState<string>('flashcard');

  useEffect(() => {
    const saved = localStorage.getItem('phrase-trainer-data');
    if (saved) {
      const data = JSON.parse(saved);
      setPhrases(data);
      // Считаем фразы, которые нужно повторить сегодня (nextReview <= сейчас)
      setDailyQueue(data.filter((p: any) => !p.nextReview || p.nextReview <= Date.now()));
    }
    setIsLoaded(true);
  }, []);

  const currentPhrase = dailyQueue.length > 0 ? dailyQueue[0] : null;

  useEffect(() => {
    if (!currentPhrase) return;
    const modes = ['flashcard', 'gapfill', 'scramble', 'missingLetters'];
    setMode(modes[Math.floor(Math.random() * modes.length)]);
  }, [currentPhrase?.id]);

  const handleReview = (isKnown: boolean) => {
    let updatedPhrases;
    if (isKnown) {
      // Убираем из очереди и ставим дату повтора на завтра
      setDailyQueue(prev => prev.slice(1));
      updatedPhrases = phrases.map(p => 
        p.id === currentPhrase.id ? { ...p, nextReview: Date.now() + 86400000 } : p
      );
    } else {
      // Оставляем в очереди, перемещая в конец
      setDailyQueue(prev => [...prev.slice(1), prev[0]]);
      updatedPhrases = phrases;
    }
    setPhrases(updatedPhrases);
    localStorage.setItem('phrase-trainer-data', JSON.stringify(updatedPhrases));
  };

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-[#000000] p-6 flex flex-col items-center text-white">
      <button 
        onClick={() => setIsViewingList(!isViewingList)} 
        className="mb-8 bg-[#1e1e1e] px-6 py-3 rounded-2xl font-medium border border-[#333] hover:bg-[#2a2a2a] transition-all"
      >
        {isViewingList ? "К тренировке" : "Словарь"}
      </button>
      
      {!isViewingList && currentPhrase && (
        <div className="w-full max-w-md mb-6 flex justify-between items-center text-gray-400 text-sm">
          <span>Осталось повторить: {dailyQueue.length}</span>
          <div className="w-32 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500" 
              style={{ width: `${((phrases.length - dailyQueue.length) / (phrases.length || 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {isViewingList ? (
        <div className="w-full max-w-md space-y-3">
          {phrases.map(p => (
            <div key={p.id} className="bg-[#1e1e1e] p-4 rounded-2xl text-white font-bold border border-[#333]">
              {p.phrase}
            </div>
          ))}
        </div>
      ) : !currentPhrase ? (
        <div className="text-xl font-bold mt-20">Всё выучено на сегодня! 🎉</div>
      ) : (
        <div className="w-full max-w-md">
          {mode === 'flashcard' && <Flashcard phrase={currentPhrase} onReview={handleReview} />}
          {mode === 'gapfill' && <GapFill phrase={currentPhrase} onReview={handleReview} />}
          {mode === 'scramble' && <Scramble phrase={currentPhrase} onReview={handleReview} />}
          {mode === 'missingLetters' && <MissingLetters phrase={currentPhrase} onReview={handleReview} />}
        </div>
      )}
    </main>
  );
}