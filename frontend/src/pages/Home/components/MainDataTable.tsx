import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

interface RecordData {
  id: number;
  date: string;
  category: '병원' | '지출';
  clinic: string;
  desc: string;
  amount: number;
}

export const MainDataTable = () => {
  const dummyData: RecordData[] = [
    { id: 1, date: '26.03.15', category: '병원', clinic: '튼튼동물병원', desc: '심장사상충 예방접종 / 추가 진찰', amount: 50000 },
    { id: 2, date: '26.03.02', category: '병원', clinic: '튼튼동물병원', desc: '기본검진 및 엑스레이 점검', amount: 80000 },
    { id: 3, date: '26.03.02', category: '지출', clinic: '튼튼동물병원', desc: '구충제(내부) 1달치 처방', amount: 20000 },
    { id: 4, date: '26.02.10', category: '지출', clinic: '해피펫온라인', desc: '관절영양제 2박스 정기결제', amount: 45000 },
    { id: 5, date: '26.01.25', category: '병원', clinic: '플러스동물병원', desc: '피부병 진료 및 연고 처방', amount: 35000 },
    { id: 6, date: '26.01.10', category: '지출', clinic: '해피펫온라인', desc: '심장사상충약 개별 구매', amount: 25000 },
  ];

  return (
    <div className="p-8 lg:p-10 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-stone-50 pb-8">
        <div className="space-y-2">
          <h2 className="text-[24px] font-black text-[#2D2D2D] tracking-tight">
            Activity <span className="text-[#FF6B00]">Log.</span>
          </h2>
          <p className="text-[14px] text-stone-400 font-medium tracking-tight">최근 멍케어 활동 내역을 확인하세요.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl px-4 py-2 border-stone-100">+ 병원</Button>
          <Button variant="outline" size="sm" className="rounded-xl px-4 py-2 border-stone-100">+ 지출</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[11px] font-black text-stone-300 uppercase tracking-widest text-left">
              <th className="pb-6 pl-2">Date</th>
              <th className="pb-6">Category</th>
              <th className="pb-6">Detail</th>
              <th className="pb-6 text-right">Amount</th>
              <th className="pb-6 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {dummyData.map((item) => (
              <tr key={item.id} className="group hover:bg-[#FCFAF8] transition-colors">
                <td className="py-6 pl-2 text-[13px] font-bold text-stone-400 tabular-nums">{item.date}</td>
                <td className="py-6">
                  <Badge color={item.category === '병원' ? 'orange' : 'stone'}>
                    {item.category}
                  </Badge>
                </td>
                <td className="py-6">
                  <div className="space-y-1">
                    <p className="text-[15px] font-black text-[#2D2D2D] tracking-tight">{item.clinic}</p>
                    <p className="text-[13px] font-medium text-stone-400 truncate max-w-[200px] lg:max-w-md">{item.desc}</p>
                  </div>
                </td>
                <td className="py-6 text-right">
                  <span className="text-[16px] font-black text-[#2D2D2D] tabular-nums">
                    {item.amount.toLocaleString()}
                    <span className="text-[12px] ml-1 text-stone-300 font-bold">원</span>
                  </span>
                </td>
                <td className="py-6 text-right pr-2">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-300 hover:text-[#FF6B00] active:scale-90">
                    <span className="text-xl">🔁</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pt-4 flex justify-center">
        <button className="text-[13px] font-black text-stone-300 hover:text-[#2D2D2D] transition-colors tracking-widest uppercase">
          View All Activities
        </button>
      </div>
    </div>
  );
};
