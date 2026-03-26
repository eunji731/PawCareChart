import { useState } from 'react';
import { Button } from '@/components/common/Button';

export const HealthWidgets = () => {
  const [memo, setMemo] = useState('');

  return (
    <div className="flex flex-col gap-12">
      
      {/* 1. UPCOMING APPOINTMENTS */}
      <section className="space-y-6">
        <h3 className="text-[11px] font-black text-stone-300 uppercase tracking-[0.2em] flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></span>
          Upcoming Events
        </h3>
        <ul className="space-y-5">
          <li className="group cursor-pointer">
            <p className="text-[11px] font-black text-[#FF6B00] mb-1">APR 15 · THIS WEEK</p>
            <h4 className="text-[15px] font-bold text-[#2D2D2D] group-hover:text-[#FF6B00] transition-colors leading-snug">
              심장사상충 예방약 복용
            </h4>
          </li>
          <li className="group cursor-pointer">
            <p className="text-[11px] font-black text-stone-300 mb-1">APR 20 · NEXT WEEK</p>
            <h4 className="text-[15px] font-bold text-[#2D2D2D] group-hover:text-[#FF6B00] transition-colors leading-snug">
              튼튼동물병원 피부염 2차 재진
            </h4>
          </li>
        </ul>
      </section>

      {/* 2. QUICK NOTES */}
      <section className="space-y-6">
        <h3 className="text-[11px] font-black text-stone-300 uppercase tracking-[0.2em] flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-200"></span>
          Quick Observation
        </h3>
        <div className="space-y-4">
          <textarea 
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="이상 증상을 기록하세요..." 
            className="w-full h-32 text-[14px] font-medium text-[#2D2D2D] bg-[#F9F9F9] border border-transparent rounded-2xl p-4 focus:outline-none focus:border-[#FF6B00] focus:bg-white transition-all resize-none shadow-inner"
          />
          <Button 
             variant="primary" size="md"
             className="w-full h-[52px] shadow-lg shadow-amber-100"
             disabled={!memo.trim()}
          >
            기록 저장하기
          </Button>
        </div>
      </section>

      {/* 3. TOP SYMPTOMS */}
      <section className="space-y-6">
        <h3 className="text-[11px] font-black text-stone-300 uppercase tracking-[0.2em] flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-200"></span>
          Symptom Rank
        </h3>
        <div className="space-y-4">
          {[
            { rank: 1, name: '피부염 (가려움증)', count: 4, color: 'bg-red-50 text-red-500' },
            { rank: 2, name: '외이염 (귀 염증)', count: 2, color: 'bg-orange-50 text-orange-500' },
            { rank: 3, name: '설사 / 무른변', count: 1, color: 'bg-stone-50 text-stone-500' },
          ].map((item) => (
            <div key={item.rank} className="flex items-center justify-between p-4 bg-[#F9F9F9] rounded-2xl border border-transparent hover:border-[#F0F0F0] transition-all group cursor-default">
              <div className="flex items-center gap-4">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black ${item.color}`}>
                  {item.rank}
                </span>
                <span className="text-[14px] font-bold text-[#2D2D2D] group-hover:text-[#FF6B00] transition-colors">{item.name}</span>
              </div>
              <span className="text-[11px] font-black text-stone-300 uppercase">{item.count} times</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
