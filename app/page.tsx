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
  const [newPhrase, setNewPhrase] = useState({ phrase: '', translation: '', example: '', context: '' });

  useEffect(() => {
    const saved = localStorage.getItem('phrase-trainer-data');
    if (saved) {
      const data = JSON.parse(saved);
      setPhrases(data);
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

  const addPhrase = () => {
    if (!newPhrase.phrase || !newPhrase.translation) return;
    const updated = [...phrases, { ...newPhrase, id: Date.now(), nextReview: 0 }];
    setPhrases(updated);
    setDailyQueue([...dailyQueue, updated[updated.length - 1]]);
    localStorage.setItem('phrase-trainer-data', JSON.stringify(updated));
    setNewPhrase({ phrase: '', translation: '', example: '', context: '' });
  };

  const handleReview = (isKnown: boolean) => {
    if (isKnown) {
      setDailyQueue(prev => prev.slice(1));
      const updated = phrases.map(p => p.id === currentPhrase.id ? { ...p, nextReview: Date.now() + 86400000 } : p);
      setPhrases(updated);
      localStorage.setItem('phrase-trainer-data', JSON.stringify(updated));
    } else {
      setDailyQueue(prev => [...prev.slice(1), prev[0]]);
    }
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

      {/* Прогресс-бар */}
      {!isViewingList && currentPhrase && (
        <div className="w-full max-w-md mb-6 flex justify-between items-center text-gray-400 text-sm">
          <span>Осталось повторить: {dailyQueue.length}</span>
          <div className="w-32 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${((phrases.length - dailyQueue.length) / (phrases.length || 1)) * 100}%` }}></div>
          </div>
        </div>
      )}

      {/* Форма добавления */}
      {isViewingList && (
        <div className="w-full max-w-md bg-[#1e1e1e] p-6 rounded-3xl mb-6 border border-[#333]">
          <input className="w-full p-3 bg-[#2a2a2a] rounded-xl mb-2" placeholder="Фраза" value={newPhrase.phrase} onChange={e => setNewPhrase({...newPhrase, phrase: e.target.value})} />
          <input className="w-full p-3 bg-[#2a2a2a] rounded-xl mb-2" placeholder="Перевод" value={newPhrase.translation} onChange={e => setNewPhrase({...newPhrase, translation: e.target.value})} />
          <input className="w-full p-3 bg-[#2a2a2a] rounded-xl mb-2" placeholder="Пример (для GapFill)" value={newPhrase.example} onChange={e => setNewPhrase({...newPhrase, example: e.target.value})} />
          <input className="w-full p-3 bg-[#2a2a2a] rounded-xl mb-4" placeholder="Контекст" value={newPhrase.context} onChange={e => setNewPhrase({...newPhrase, context: e.target.value})} />
          <button onClick={addPhrase} className="w-full bg-blue-600 py-3 rounded-xl font-bold">Добавить фразу</button>
        </div>
      )}

      {/* Контент */}
      {isViewingList ? (
        <div className="w-full max-w-md space-y-3">
          {phrases.map(p => (
            <div key={p.id} className="bg-[#1e1e1e] p-4 rounded-2xl border border-[#333] font-bold">
              {p.phrase} - <span className="text-gray-400 font-normal">{p.translation}</span>
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