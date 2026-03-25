import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const HealthWidgets = () => {
  const [memo, setMemo] = useState('');

  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* 1. 다가오는 케어 & 예약 */}
      <Card className="pt-4 pb-5">
        <h3 className="px-5 text-[13px] font-extrabold text-stone-800 mb-3 flex items-center gap-2">
          <span className="text-[15px] opacity-90">📅</span> 다가오는 케어 및 예약
        </h3>
        <ul className="px-5 space-y-3">
          <li className="flex items-start gap-3 group">
            <input type="checkbox" className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-stone-300 cursor-pointer transition-colors" />
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold text-amber-600 mb-[1px]">4월 15일 (이번주 금)</span>
              <span className="text-[13px] font-extrabold text-stone-800 group-hover:underline cursor-pointer transition-all">심장사상충 예방약 복용</span>
            </div>
          </li>
          <li className="flex items-start gap-3 group">
            <input type="checkbox" className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-stone-300 cursor-pointer transition-colors" />
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold text-stone-400 mb-[1px]">4월 20일 (다음주 수)</span>
              <span className="text-[13px] font-extrabold text-stone-800 group-hover:underline cursor-pointer transition-all">튼튼동물병원 피부염 2차 재진</span>
            </div>
          </li>
        </ul>
      </Card>

      {/* 2. 빠른 이상 징후 메모 */}
      <Card className="overflow-hidden bg-white">
        <div className="px-5 py-3 border-b border-orange-50 bg-[#FFF9F2]/60">
          <h3 className="text-[13px] font-extrabold text-stone-800 flex items-center gap-2">
             <span className="text-[15px] opacity-90">⚡</span> 빠른 관찰 메모
          </h3>
          <p className="text-[10.5px] font-extrabold text-stone-400 mt-1 tracking-tight">구토, 설사, 수면 등 특이사항을 즉시 기록하세요.</p>
        </div>
        <div className="p-4 bg-white relative">
          <textarea 
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="비정상적인 증상이 보이나요?" 
            className="w-full h-24 text-[13px] font-bold text-stone-700 bg-orange-50/40 border border-orange-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none placeholder:text-stone-300 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]"
          ></textarea>
          <Button 
             variant="primary" size="sm"
             className="absolute bottom-6 right-6 bg-stone-800 hover:bg-stone-900 border-stone-800 hover:border-stone-900 !text-[11px] !px-3.5 !py-1.5"
             disabled={!memo.trim()}
          >
            기록
          </Button>
        </div>
      </Card>

      {/* 3. 증상 랭킹 */}
      <Card className="p-5 flex-1 h-full">
         <h3 className="text-[13px] font-extrabold text-stone-800 mb-4 flex items-center gap-2">
            <span className="text-[15px] opacity-90">🏆</span> 2026년 봉봉 증상 워스트 Top 3
         </h3>
         <ol className="space-y-4 px-1 pb-1">
           <li className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 font-extrabold text-[11px] flex items-center justify-center shrink-0">1</div>
             <div className="flex justify-between items-center w-full">
               <span className="text-[13px] font-extrabold text-stone-800">피부염 (가려움증)</span>
               <span className="text-[11px] font-extrabold text-stone-400">4회 발생</span>
             </div>
           </li>
           <li className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-extrabold text-[11px] flex items-center justify-center shrink-0">2</div>
             <div className="flex justify-between items-center w-full">
               <span className="text-[13px] font-extrabold text-stone-800">외이염 (귀 냄새/염증)</span>
               <span className="text-[11px] font-extrabold text-stone-400">2회 발생</span>
             </div>
           </li>
           <li className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-500 font-extrabold text-[11px] flex items-center justify-center shrink-0">3</div>
             <div className="flex justify-between items-center w-full">
               <span className="text-[13px] font-extrabold text-stone-800">설사 / 무른변</span>
               <span className="text-[11px] font-extrabold text-stone-400">1회 발생</span>
             </div>
           </li>
         </ol>
      </Card>

    </div>
  );
};
