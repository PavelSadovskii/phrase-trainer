'use client';
import { useState } from 'react';

export default function GapFill({ phrase, onReview }: any) {
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);

  return (
    <div className="bg-[#1e1e1e] p-8 rounded-[32px] shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-white">{phrase.example.replace(new RegExp(phrase.phrase, 'ig'), '[...]')}</h2>
      <input 
        className="w-full p-4 bg-[#2a2a2a] rounded-2xl border border-gray-700 text-white outline-none focus:border-blue-500" 
        placeholder="Впиши фразу..." 
        onChange={e => setInput(e.target.value)} 
      />
      <p className="mt-4 text-sm italic text-gray-400">Подсказка: {phrase.context}</p>
      {!checked ? (
        <button onClick={() => setChecked(true)} className="w-full mt-6 bg-blue-600 text-white py-4 rounded-2xl font-bold">Проверить</button>
      ) : (
        <div className="mt-6 text-white">
          <p className="font-bold mb-4">{input.toLowerCase() === phrase.phrase.toLowerCase() ? '✅ Правильно' : '❌ ' + phrase.phrase}</p>
          <div className="flex gap-2">
            <button onClick={() => onReview(false)} className="flex-1 py-4 bg-[#333] rounded-2xl">Не помню</button>
            <button onClick={() => onReview(true)} className="flex-1 py-4 bg-green-600 rounded-2xl">Помню</button>
          </div>
        </div>
      )}
    </div>
  );
}