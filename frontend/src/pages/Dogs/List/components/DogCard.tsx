import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Dog } from '@/types/dog';
import { Card } from '@/components/common/Card';

interface DogCardProps {
  dog: Dog;
}

export const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  const navigate = useNavigate();

  const calculateAge = (birthDate?: string | null) => {
    if (!birthDate) return '나이 미등록';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age <= 0 ? '1살 미만' : `${age}살`;
  };

  return (
    <Card
      onClick={() => navigate(`/dogs/edit/${dog.id}`)}
      className="group hover:shadow-xl hover:border-amber-200 transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-48 bg-orange-50 overflow-hidden">
        {dog.profileImageUrl ? (
          <img src={dog.profileImageUrl} alt={dog.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-50 select-none">🐶</div>
        )}
        <div className="absolute top-3 right-3">
          <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white text-stone-400 hover:text-amber-600 transition-colors">✏️</button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-[18px] font-black text-stone-800 tracking-tight group-hover:text-amber-600 transition-colors">{dog.name}</h3>
            <p className="text-[12px] font-bold text-amber-600/70">{dog.breed || '견종 미지정'}</p>
          </div>
          <div className="bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
            <span className="text-[11px] font-black text-orange-600">{dog.weight ? `${dog.weight}kg` : '0kg'}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-orange-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-stone-400 font-bold">🎂 {dog.birthDate || '날짜 미등록'}</span>
          </div>
          <span className="text-[12px] text-stone-500 font-black bg-stone-100 px-2 py-0.5 rounded-md">{calculateAge(dog.birthDate)}</span>
        </div>
      </div>
    </Card>
  );
};
