'use client';
import { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import GapFill from './components/GapFill';
import Scramble from './components/Scramble';
import MissingLetters from './components/MissingLetters';

export default function Home() {
  const [lang, setLang] = useState<'en' | 'de' | null>(null);
  const [phrases, setPhrases] = useState<any[]>([]);
  const [dailyQueue, setDailyQueue] = useState<any[]>([]);
  const [isViewingList, setIsViewingList] = useState(false);
  const [mode, setMode] = useState<string>('flashcard');
  const [newPhrase, setNewPhrase] = useState({ phrase: '', translation: '', example: '', context: '' });
  const [importText, setImportText] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (!lang) return;
    const saved = localStorage.getItem(`phrases-${lang}`);
    const data = saved ? JSON.parse(saved) : [];
    setPhrases(data);
    setDailyQueue(data.filter((p: any) => !p.nextReview || p.nextReview <= Date.now()));
  }, [lang]);

  const saveAll = (updatedPhrases: any[]) => {
    setPhrases(updatedPhrases);
    localStorage.setItem(`phrases-${lang}`, JSON.stringify(updatedPhrases));
    // Пересчитываем очередь на основе обновленного списка
    setDailyQueue(updatedPhrases.filter((p: any) => !p.nextReview || p.nextReview <= Date.now()));
  };

  const currentPhrase = dailyQueue.length > 0 ? dailyQueue[0] : null;

  useEffect(() => {
    if (!currentPhrase) return;
    const modes = ['flashcard', 'gapfill', 'scramble', 'missingLetters'];
    setMode(modes[Math.floor(Math.random() * modes.length)]);
  }, [currentPhrase?.id]);

  const addPhrase = () => {
    if (!newPhrase.phrase) return;
    const newEntry = { ...newPhrase, id: Date.now(), nextReview: 0 };
    saveAll([...phrases, newEntry]);
    setNewPhrase({ phrase: '', translation: '', example: '', context: '' });
  };

  const handleImport = () => {
    const newPhrases = importText.split('\n').map(line => {
      const [phrase, translation, example, context] = line.split('|');
      return { id: Date.now() + Math.random(), phrase: phrase?.trim() || '', translation: translation?.trim() || '...', example: example?.trim() || '', context: context?.trim() || '', nextReview: 0 };
    }).filter(p => p.phrase);
    saveAll([...phrases, ...newPhrases]);
    setImportText('');
  };

  const deleteSelected = () => {
    const updated = phrases.filter(p => !selectedIds.includes(p.id));
    saveAll(updated);
    setSelectedIds([]);
  };

  const clearAll = () => {
    if (confirm('Удалить все фразы?')) {
      saveAll([]);
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleReview = (isKnown: boolean) => {
    if (isKnown) {
      saveAll(phrases.map(p => p.id === currentPhrase.id ? { ...p, nextReview: Date.now() + 86400000 } : p));
    } else {
      setDailyQueue(prev => [...prev.slice(1), prev[0]]);
    }
  };

  if (!lang) return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <h1 className="text-3xl font-bold mb-10">Какой язык учим сегодня?</h1>
      <div className="flex gap-4">
        <button onClick={() => setLang('en')} className="px-10 py-6 bg-blue-600 rounded-3xl text-2xl font-bold">English</button>
        <button onClick={() => setLang('de')} className="px-10 py-6 bg-green-600 rounded-3xl text-2xl font-bold">Deutsch</button>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#000000] p-6 flex flex-col items-center text-white">
      <div className="flex gap-2 mb-8">
        <button onClick={() => setLang(null)} className="bg-[#333] px-4 py-2 rounded-xl text-xs">Смена языка</button>
        <button onClick={() => setIsViewingList(!isViewingList)} className="bg-[#1e1e1e] px-6 py-2 rounded-xl border border-[#333]">
          {isViewingList ? "К тренировке" : "Словарь"}
        </button>
      </div>

      {isViewingList ? (
        <div className="w-full max-w-md space-y-6">
          <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-[#333]">
            <input className="w-full p-3 bg-[#2a2a2a] rounded-xl mb-2" placeholder="Фраза" value={newPhrase.phrase} onChange={e => setNewPhrase({...newPhrase, phrase: e.target.value})} />
            <input className="w-full p-3 bg-[#2a2a2a] rounded-xl mb-2" placeholder="Перевод" value={newPhrase.translation} onChange={e => setNewPhrase({...newPhrase, translation: e.target.value})} />
            <input className="w-full p-3 bg-[#2a2a2a] rounded-xl mb-2" placeholder="Пример (для GapFill)" value={newPhrase.example} onChange={e => setNewPhrase({...newPhrase, example: e.target.value})} />
            <input className="w-full p-3 bg-[#2a2a2a] rounded-xl mb-4" placeholder="Контекст" value={newPhrase.context} onChange={e => setNewPhrase({...newPhrase, context: e.target.value})} />
            <button onClick={addPhrase} className="w-full bg-blue-600 py-3 rounded-xl font-bold">Добавить</button>
          </div>
          <div className="bg-[#1e1e1e] p-6 rounded-3xl border border-[#333]">
            <h3 className="font-bold mb-2">Массовый импорт</h3>
            <textarea className="w-full p-3 bg-[#2a2a2a] rounded-xl text-white mb-2 h-20" placeholder="фраза|перевод|пример|контекст" value={importText} onChange={e => setImportText(e.target.value)}/>
            <button onClick={handleImport} className="w-full bg-[#333] py-3 rounded-xl font-bold">Импортировать</button>
          </div>
          {phrases.length > 0 && (
            <div className="flex gap-2">
              <button onClick={deleteSelected} className="flex-1 bg-red-900 py-2 rounded-xl text-sm font-bold">Удалить ({selectedIds.length})</button>
              <button onClick={clearAll} className="bg-[#333] px-4 py-2 rounded-xl text-sm font-bold">Очистить всё</button>
            </div>
          )}
          {phrases.map(p => (
            <div key={p.id} className={`p-4 rounded-2xl border flex items-center gap-3 ${selectedIds.includes(p.id) ? 'bg-[#2a1a1a] border-red-500' : 'bg-[#1e1e1e] border-[#333]'}`} onClick={() => toggleSelect(p.id)}>
              <input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => {}} className="w-5 h-5" />
              <div className="text-sm font-bold">{p.phrase} - <span className="text-gray-400 font-normal">{p.translation}</span></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-md">
            {!currentPhrase ? (
                <div className="text-xl font-bold mt-20 text-center">Всё выучено! 🎉</div>
            ) : (
                <>
                    <div className="mb-6 text-gray-400 text-sm">Осталось повторить: {dailyQueue.length}</div>
                    {mode === 'flashcard' && <Flashcard key={currentPhrase.id} phrase={currentPhrase} onReview={handleReview} />}
                    {mode === 'gapfill' && <GapFill key={currentPhrase.id} phrase={currentPhrase} onReview={handleReview} />}
                    {mode === 'scramble' && <Scramble key={currentPhrase.id} phrase={currentPhrase} onReview={handleReview} />}
                    {mode === 'missingLetters' && <MissingLetters key={currentPhrase.id} phrase={currentPhrase} onReview={handleReview} />}
                </>
            )}
        </div>
      )}
    </main>
  );
}