import { useState } from 'react';
import { Tabs } from '@/components/common/Tabs';

export const ExpenseChart = () => {
  const [activeTab, setActiveTab] = useState<'month'|'history'>('month');

  return (
    <div className="p-8 lg:p-10 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div className="space-y-2">
          <h2 className="text-[24px] font-black text-[#2D2D2D] tracking-tight">
            Financial <span className="text-[#FF6B00]">Insight.</span>
          </h2>
          <p className="text-[14px] text-stone-400 font-medium tracking-tight">지출 패턴을 분석하여 스마트하게 관리하세요.</p>
        </div>
        
        <Tabs 
          tabs={[
            { id: 'month', label: '이번 달 분석' },
            { id: 'history', label: '6개월 추이' }
          ]} 
          activeTab={activeTab} 
          onChange={(id) => setActiveTab(id as 'month'|'history')} 
        />
      </div>
      
      <div className="min-h-[300px] flex flex-col items-center justify-center">
        {activeTab === 'month' ? (
          <div className="flex flex-col lg:flex-row w-full gap-12 items-center animate-in fade-in duration-700">
            <div className="relative w-48 h-48 rounded-full flex items-center justify-center shadow-2xl ring-8 ring-[#FF6B00]/5" style={{ background: "conic-gradient(#FF6B00 0% 86%, #F5F5F5 86% 100%)" }}>
               <div className="absolute w-[9.5rem] h-[9.5rem] bg-white rounded-full flex flex-col items-center justify-center border border-stone-50 shadow-inner">
                 <p className="text-[11px] font-black text-stone-300 uppercase tracking-widest">Total</p>
                 <p className="text-[24px] font-black text-[#2D2D2D] tracking-tighter">150,000<span className="text-[14px] font-bold text-stone-400 ml-[1px]">원</span></p>
               </div>
            </div>
            
            <div className="flex-grow w-full space-y-6">
              {[
                { label: '병원 진료비', amount: 130000, pct: 86, color: 'bg-[#FF6B00]' },
                { label: '약품 및 기타', amount: 20000, pct: 14, color: 'bg-stone-200' },
              ].map((item) => (
                <div key={item.label} className="group cursor-default">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                      <span className="text-[#2D2D2D] font-black text-[15px] tracking-tight">{item.label}</span>
                    </div>
                    <p className="text-[15px] font-black text-[#2D2D2D] tabular-nums">
                      {item.amount.toLocaleString()}원 <span className="text-[12px] text-stone-300 font-bold ml-1">{item.pct}%</span>
                    </p>
                  </div>
                  <div className="w-full h-1.5 bg-stone-50 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
           <div className="w-full animate-in fade-in duration-700">
              <div className="flex items-end justify-between w-full h-48 gap-4 border-b border-stone-100 pb-4 mb-8 px-4">
                 {[30, 45, 20, 80, 50, 60].map((heightPct, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                       <span className="text-[11px] font-black text-[#FF6B00] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">{heightPct}k</span>
                       <div className={`w-full max-w-[32px] rounded-t-xl transition-all duration-500 hover:shadow-lg ${i === 5 ? 'bg-[#FF6B00] shadow-xl shadow-[#FF6B00]/20' : 'bg-stone-100 group-hover:bg-stone-200'}`} style={{ height: `${heightPct}%` }}></div>
                       <span className={`text-[12px] font-black tracking-tighter ${i === 5 ? 'text-[#2D2D2D]' : 'text-stone-300'}`}>{10+i > 12 ? 10+i-12 : 10+i}월</span>
                    </div>
                 ))}
              </div>
              <div className="bg-[#FCFAF8] p-6 rounded-[24px] border border-stone-50 flex items-center justify-between">
                <p className="text-[14px] font-bold text-stone-400">다음 달 예상 지출액</p>
                <p className="text-[20px] font-black text-[#FF6B00] tracking-tighter">45,000<span className="text-[14px] font-bold ml-1">원</span></p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
