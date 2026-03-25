import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Table } from '@/components/common/Table';
import type { Column } from '@/components/common/Table';

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

  const columns: Column<RecordData>[] = [
    { header: '날짜', accessor: 'date', headerClassName: 'w-[75px]', cellClassName: 'text-stone-400 font-semibold text-[11px]' },
    { 
      header: '분류', 
      headerClassName: 'w-[60px] text-center', 
      cellClassName: 'text-center',
      cell: (row) => (
        <Badge color={row.category === '병원' ? 'amber' : 'stone'}>
          {row.category}
        </Badge>
      )
    },
    { header: '병원/사용처', accessor: 'clinic', headerClassName: 'w-[130px]', cellClassName: 'text-stone-800 truncate max-w-[130px]' },
    { header: '상세내용', accessor: 'desc', headerClassName: 'w-auto', cellClassName: 'text-stone-600 truncate max-w-[150px] sm:max-w-full' },
    { 
      header: '결제금액', 
      headerClassName: 'w-[90px] text-right', 
      cellClassName: 'text-right font-extrabold text-stone-800 border-r border-dashed border-stone-100',
      cell: (row) => (
        <>{row.amount.toLocaleString()}<span className="text-[10px] font-semibold text-stone-400 ml-0.5">원</span></>
      )
    },
    { 
      header: '반복추가', 
      headerTitle: '이 기록과 똑같은 데이터로 새로 작성하기', 
      headerClassName: 'w-[50px] text-center', 
      cellClassName: 'text-center relative',
      cell: (row) => (
        <Button 
          variant="icon" 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" 
          title="이 내용 복사하여 새 기입창 열기"
          onClick={(e) => { e.stopPropagation(); alert(`${row.desc} 복사 준비 중...`); }}
        >
          <span className="text-[13px] leading-none">🔁</span>
        </Button>
      )
    }
  ];

  return (
    <Card className="h-[600px] lg:h-[824px] overflow-hidden">
      <div className="px-5 py-4 border-b border-orange-100 bg-[#FFF9F2]/60 flex justify-between items-center shrink-0">
        <h2 className="text-[14px] font-extrabold text-stone-800 flex items-center gap-2">
          <span className="text-[16px]">📋</span> 케어 통합 기록망
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="md">
            ➕ 병원기록
          </Button>
          <Button variant="primary" size="md">
            💸 비용기록
          </Button>
        </div>
      </div>
      
      {/* 리팩토링된 Table 컴포넌트 렌더링 */}
      <Table columns={columns} data={dummyData} />
    </Card>
  );
};
