import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Dog } from '@/types/dog';
import { Card } from '@/components/common/Card';

interface DogCardProps {
  dog: Dog;
  onDelete?: (id: number, name: string) => void;
}

export const DogCard: React.FC<DogCardProps> = ({ dog, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent) => {
    console.log('DogCard: Trash bin clicked');
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      console.log('DogCard: Calling onDelete prop');
      onDelete(dog.id, dog.name);
    } else {
      console.warn('DogCard: onDelete prop is missing');
    }
  };

  const handleCardClick = () => {
    console.log('DogCard: Card body clicked (Navigation)');
    navigate(`/dogs/edit/${dog.id}`);
  };

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
      onClick={handleCardClick}
      className="group hover:shadow-xl hover:border-amber-200 transition-all duration-300 overflow-hidden relative"
    >
      <div className="relative h-48 bg-orange-50 overflow-hidden">
        {dog.profileImageUrl ? (
          <img src={dog.profileImageUrl} alt={dog.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl opacity-50 select-none font-sans">🐶</div>
        )}
        
        {/* 액션 버튼 영역: z-index 추가 및 이벤트 버블링 방지 강화 */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              navigate(`/dogs/edit/${dog.id}`);
            }}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white text-stone-400 hover:text-amber-600 transition-all active:scale-95 cursor-pointer border-none outline-none"
            title="수정"
          >
            <span className="pointer-events-none">✏️</span>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white text-stone-400 hover:text-red-500 transition-all active:scale-95 cursor-pointer border-none outline-none"
            title="삭제"
          >
            <span className="pointer-events-none">🗑️</span>
          </button>
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
