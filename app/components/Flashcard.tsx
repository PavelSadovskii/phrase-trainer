'use client';
import { useState } from 'react';

export default function Flashcard({ phrase, onReview }: any) {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="bg-[#1e1e1e] p-8 rounded-[32px] shadow-2xl text-center">
      <h2 onClick={() => setIsFlipped(!isFlipped)} className="text-3xl font-bold cursor-pointer min-h-[150px] flex items-center justify-center text-white">
        {isFlipped ? phrase.translation : phrase.phrase}
      </h2>
      <div className="flex gap-2 mt-8">
        <button onClick={() => onReview(false)} className="flex-1 py-4 bg-[#333] text-white rounded-2xl font-bold">Не помню</button>
        <button onClick={() => onReview(true)} className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold">Помню</button>
      </div>
    </div>
  );
}