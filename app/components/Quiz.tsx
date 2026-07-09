import { useState } from 'react';

export default function Quiz({ phrase, onReview }: any) {
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  // Генерируем 3 случайных варианта + правильный ответ (в реальности нужно подмешивать из других фраз)
  const options = [phrase.phrase, "To call it a day", "To break the ice", "To hit the nail"].sort(() => Math.random() - 0.5);

  return (
    <div className="bg-[#1C1C1E] p-8 rounded-[32px] shadow-xl text-white">
      <p className="text-gray-400 text-sm mb-6 font-medium italic text-center">{phrase.translation}</p>
      
      <div className="space-y-3">
        {options.map((opt, i) => (
          <button 
            key={i} 
            disabled={checked}
            onClick={() => setSelected(opt)}
            className={`w-full p-4 rounded-2xl text-left border transition-all ${
              checked 
                ? (opt === phrase.phrase ? 'bg-green-600 border-green-600' : 'bg-[#2C2C2E] border-transparent opacity-50')
                : (selected === opt ? 'bg-blue-600 border-blue-600' : 'bg-[#2C2C2E] border-transparent hover:bg-[#3A3A3C]')
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {!checked ? (
        <button 
          disabled={!selected}
          onClick={() => setChecked(true)} 
          className="w-full mt-8 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-4 rounded-2xl font-bold transition-all"
        >
          Ответить
        </button>
      ) : (
        <div className="mt-8">
          <div className="flex gap-2">
            <button onClick={() => onReview(false)} className="flex-1 py-4 bg-[#2C2C2E] rounded-2xl">Не помню</button>
            <button onClick={() => onReview(true)} className="flex-1 py-4 bg-green-600 rounded-2xl">Помню</button>
          </div>
        </div>
      )}
    </div>
  );
}