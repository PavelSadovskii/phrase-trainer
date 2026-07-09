'use client';
import { useState, useMemo } from 'react';

export default function MissingLetters({ phrase, onReview }: any) {
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);

  // Генерируем маску один раз при изменении фразы
  const masked = useMemo(() => {
    return phrase.phrase.split('').map((c: string) => 
      c.match(/[a-zA-Z]/) && Math.random() < 0.4 ? '_' : c
    ).join('');
  }, [phrase.id]);

  return (
    <div className="bg-[#1e1e1e] p-8 rounded-[32px] shadow-2xl">
      <p className="text-gray-400 text-sm mb-4 italic">{phrase.translation}</p>
      <h2 className="text-3xl font-mono font-bold mb-6 text-blue-500 tracking-[0.2em]">{masked}</h2>
      <input 
        className="w-full p-4 bg-[#2a2a2a] rounded-2xl border border-gray-700 text-white placeholder-gray-500 outline-none focus:border-blue-500" 
        placeholder="Впиши недостающие буквы..." 
        value={input}
        onChange={e => setInput(e.target.value)} 
      />
      {!checked ? (
        <button onClick={() => setChecked(true)} className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl font-bold">Проверить</button>
      ) : (
        <div className="mt-6">
          <p className={`font-bold mb-4 ${input.toLowerCase() === phrase.phrase.toLowerCase() ? 'text-green-500' : 'text-red-500'}`}>
            {input.toLowerCase() === phrase.phrase.toLowerCase() ? '✅ Правильно' : '❌ ' + phrase.phrase}
          </p>
          <div className="flex gap-2">
            <button onClick={() => onReview(false)} className="flex-1 py-4 bg-[#333] text-white rounded-2xl">Не помню</button>
            <button onClick={() => onReview(true)} className="flex-1 py-4 bg-green-600 text-white rounded-2xl">Помню</button>
          </div>
        </div>
      )}
    </div>
  );
}