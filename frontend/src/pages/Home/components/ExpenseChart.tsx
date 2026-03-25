import { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Tabs } from '@/components/common/Tabs';

export const ExpenseChart = () => {
  const [activeTab, setActiveTab] = useState<'month'|'history'>('month');

  return (
    <Card className="h-[400px]">
      <div className="px-5 pt-4 border-b border-orange-100 bg-[#FFF9F2]/60 shrink-0 rounded-t-2xl flex flex-col gap-3">
        <h2 className="text-[14px] font-extrabold text-stone-800 flex items-center gap-2 tracking-tight">
          <span className="text-[16px]">📊</span> 지출 및 차트
        </h2>
        
        {/* 리팩토링된 Tabs 컴포넌트 적용 */}
        <Tabs 
          tabs={[
            { id: 'month', label: '이번 달 분석' },
            { id: 'history', label: '최근 6개월 추이' }
          ]} 
          activeTab={activeTab} 
          onChange={(id) => setActiveTab(id as 'month'|'history')} 
          className="pt-2" 
        />
      </div>
      
      <div className="flex-1 flex flex-col p-5 overflow-y-auto w-full relative content-center justify-center">
        {activeTab === 'month' ? (
          <div className="flex flex-col w-full animate-[fadeIn_0.3s_ease-out]">
            <div className="relative w-36 h-36 rounded-full flex mx-auto items-center justify-center mb-5 shrink-0 shadow-sm" style={{ background: "conic-gradient(#f59e0b 0% 86%, #fed7aa 86% 100%)" }}>
               <div className="absolute w-[6.5rem] h-[6.5rem] bg-white rounded-full flex flex-col items-center justify-center border border-orange-50 shadow-inner">
                 <span className="text-[10px] font-extrabold text-stone-400 leading-tight">3월 지출액</span>
                 <span className="text-[15px] font-extrabold text-stone-800 tracking-tight mt-1">150,000<span className="text-[10px] font-bold text-stone-400 ml-[1px]">원</span></span>
               </div>
            </div>
            
            <ul className="space-y-4 text-xs mt-2 px-2">
              <li className="flex justify-between items-center group cursor-pointer hover:opacity-80">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-[4px] bg-amber-500 shadow-sm"></span>
                  <span className="text-stone-600 font-extrabold text-[13px]">병원 진료비</span>
                </div>
                <div className="flex items-center">
                  <span className="font-extrabold text-stone-800 tracking-tight text-[13px]">130,000</span><span className="text-stone-400 text-[10px] ml-1 font-bold">원 (86%)</span>
                </div>
              </li>
              <li className="flex justify-between items-center group cursor-pointer hover:opacity-80">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-[4px] bg-orange-200 shadow-sm"></span>
                  <span className="text-stone-600 font-extrabold text-[13px]">약품/기타</span>
                </div>
                <div className="flex items-center">
                  <span className="font-extrabold text-stone-800 tracking-tight text-[13px]">20,000</span><span className="text-stone-400 text-[10px] ml-1 font-bold">원 (14%)</span>
                </div>
              </li>
            </ul>
          </div>
        ) : (
           <div className="flex flex-col h-full items-center justify-center text-center animate-[fadeIn_0.3s_ease-out] relative z-10 w-full px-2">
              <div className="flex items-end justify-between w-full h-32 gap-3 border-b-2 border-stone-100 pb-2 mb-6">
                 {[30, 45, 20, 80, 50, 60].map((heightPct, i) => (
                    <div key={i} className="flex-1 shrink-0 flex flex-col items-center gap-2 group">
                       <span className="text-[9px] font-extrabold text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">{heightPct}k</span>
                       <div className={`w-full max-w-[20px] rounded-t-[4px] shadow-sm transition-all hover:-translate-y-1 ${i === 5 ? 'bg-amber-400' : 'bg-orange-100'}`} style={{ height: `${heightPct}%` }}></div>
                       <span className={`text-[10px] font-extrabold shrink-0 ${i === 5 ? 'text-stone-800' : 'text-stone-400'}`}>{10+i > 12 ? 10+i-12 : 10+i}월</span>
                    </div>
                 ))}
              </div>
              <div className="bg-[#FFF9F2]/80 border border-orange-100 rounded-xl py-4 px-4 w-full shadow-sm text-center">
                <p className="text-[11px] font-extrabold text-stone-500 mb-0.5">다음 달 예상되는 고정 지출액</p>
                <p className="text-[18px] font-extrabold text-amber-600 tracking-tight">45,000<span className="text-[12px] font-bold text-stone-500 ml-1.5">원</span></p>
              </div>
           </div>
        )}
      </div>
    </Card>
  );
};
