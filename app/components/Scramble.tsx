'use client';
import React, { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';

export default function Scramble({ phrase, onReview }: any) {
  // Добавляем индекс к словам, чтобы дубликаты стали уникальными объектами
  const [words] = useState(
    phrase.phrase.split(' ').map((w: string, i: number) => ({ id: i, text: w }))
      .sort(() => Math.random() - 0.5)
  );
  
  const [selected, setSelected] = useState<typeof words>([]);
  const [checked, setChecked] = useState(false);
  
  const isCorrect = selected.map((w: { text: any; }) => w.text).join(' ') === phrase.phrase;

  return (
    <div className="bg-[#1e1e1e] p-8 rounded-[32px] shadow-2xl text-center">
      <p className="text-gray-400 text-sm mb-6 italic">{phrase.translation}</p>
      
      {/* Зона предложения */}
      <div className={`flex flex-wrap gap-2 justify-center mb-8 p-6 rounded-2xl min-h-[100px] border-2 transition-colors ${
        checked 
          ? (isCorrect ? 'border-green-500 bg-[#162618]' : 'border-red-500 bg-[#261818]') 
          : 'border-[#333] bg-[#121215]'
      }`}>
        {selected.map((w: { id: Key | null | undefined; text: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, i: any) => (
          <button key={w.id} onClick={() => {
              setSelected((s: any[]) => s.filter((_: any, idx: any) => idx !== i));
            }} 
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold border border-blue-400">
            {w.text}
          </button>
        ))}
      </div>

      {/* Зона выбора */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {words.filter((w: { id: any; }) => !selected.find((s: { id: any; }) => s.id === w.id)).map((w: { id: Key | null | undefined; text: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
          <button key={w.id} onClick={() => setSelected((s: any) => [...s, w])} 
            className="px-4 py-3 bg-[#2a2a2a] text-white rounded-xl font-medium border border-gray-600 hover:bg-[#3d3d3d]">
            {w.text}
          </button>
        ))}
      </div>

      {!checked ? (
        <button onClick={() => setChecked(true)} 
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-colors">
          Проверить
        </button>
      ) : (
        <div className="mt-4">
          <p className="font-bold mb-6 text-white text-lg">{isCorrect ? '✅ Правильно!' : '❌ ' + phrase.phrase}</p>
          <div className="flex gap-3">
            <button onClick={() => onReview(false)} className="flex-1 py-4 bg-[#333] text-gray-300 rounded-2xl font-bold">Не помню</button>
            <button onClick={() => onReview(true)} className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold">Помню</button>
          </div>
        </div>
      )}
    </div>
  );
}