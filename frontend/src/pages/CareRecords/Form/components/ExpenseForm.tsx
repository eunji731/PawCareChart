import React from 'react';
import { Section } from '@/components/common/Section';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Textarea } from '@/components/common/Textarea';

interface ExpenseFormProps {
  data: {
    categoryCode: string;
    amount: string | number;
    memo: string;
    relatedMedicalRecordId: string | number;
  };
  onChange: (data: any) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ data, onChange }) => {
  const categoryOptions = [
    { value: 'FEED', label: '사료/간식' },
    { value: 'SUPPLIES', label: '용품' },
    { value: 'MEDICAL', label: '진료비' },
    { value: 'GROOMING', label: '미용' },
    { value: 'ETC', label: '기타' },
  ];

  return (
    <div className="space-y-10">
      <Section title="지출 정보" description="얼마를 어디에 사용하셨나요?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Select 
            label="카테고리 *" 
            options={categoryOptions} 
            value={data.categoryCode} 
            onChange={(e) => onChange({ ...data, categoryCode: e.target.value })} 
          />
          <div className="relative">
            <Input 
              label="금액 *" 
              type="number" 
              placeholder="0" 
              value={data.amount} 
              onChange={(e) => onChange({ ...data, amount: e.target.value })} 
            />
            <span className="absolute right-5 bottom-4 text-[13px] font-black text-stone-300 uppercase">원</span>
          </div>
        </div>
        <Textarea 
          label="지출 메모" 
          placeholder="지출과 관련된 세부 내용을 기록하세요." 
          value={data.memo} 
          onChange={(e) => onChange({ ...data, memo: e.target.value })} 
        />
      </Section>

      <Section title="연관 정보" description="병원 진료와 관련된 지출인가요?">
        <div className="space-y-4">
          {/* TODO: 최근 병원 기록 목록을 가져와서 매핑 예정 */}
          <Select 
            label="병원 기록 연결 (선택)" 
            options={[{ value: '', label: '연결할 기록 없음' }]} 
            value={data.relatedMedicalRecordId} 
            onChange={(e) => onChange({ ...data, relatedMedicalRecordId: e.target.value })} 
          />
          <p className="text-[12px] text-stone-400 font-medium ml-1">
            진료비 지출인 경우 해당 병원 기록을 연결하면 나중에 한꺼번에 모아보기 편해요.
          </p>
        </div>
      </Section>
    </div>
  );
};
