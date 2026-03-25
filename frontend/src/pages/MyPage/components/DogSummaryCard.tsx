import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/common/Card';

interface DogSummaryCardProps {
  dog: {
    id: number;
    name: string;
    breed?: string;
    weight?: number;
  };
}

export const DogSummaryCard: React.FC<DogSummaryCardProps> = ({ dog }) => {
  const navigate = useNavigate();

  return (
    <Card 
      onClick={() => navigate(`/dogs/edit/${dog.id}`)}
      className="p-4 hover:border-amber-200 transition-all cursor-pointer group hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 text-2xl shadow-inner">
          🐶
        </div>
        <div>
          <h4 className="text-[15px] font-black text-stone-800 group-hover:text-amber-600 transition-colors tracking-tight">{dog.name}</h4>
          <p className="text-[11px] text-stone-400 font-extrabold mt-0.5">
            {dog.breed || '견종 미지정'} · {dog.weight ? `${dog.weight}kg` : '몸무게 미등록'}
          </p>
        </div>
      </div>
    </Card>
  );
};

