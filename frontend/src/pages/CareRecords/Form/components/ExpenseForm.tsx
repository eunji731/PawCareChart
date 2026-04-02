import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Section } from '@/components/common/Section';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Textarea } from '@/components/common/Textarea';
import { careApi } from '@/api/careApi';
import type { CareRecord } from '@/types/care';
import { RelatedMedicalRecordModal } from './RelatedMedicalRecordModal';

interface ExpenseFormProps {
  data: {
    categoryCode: string;
    amount: string | number;
    memo: string;
    relatedMedicalRecordId: string | number | null;
  };
  dogId?: string | number;
  onDogChange?: (dogId: string) => void;
  onChange: (data: any) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ data, dogId, onDogChange, onChange }) => {
  const [medicalCandidates, setMedicalCandidates] = useState<CareRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecordInfo, setSelectedRecordInfo] = useState<CareRecord | null>(null);
  
  const debounceTimerRef = useRef<number | null>(null);

  const categoryOptions = [
    { value: 'CONSULTATION', label: '🩺 진료비' },
    { value: 'MEDICINE', label: '💊 약값' },
    { value: 'EXAM', label: '🔬 검사비' },
    { value: 'VACCINE', label: '💉 예방접종' },
    { value: 'GROOMING', label: '✂️ 미용' },
    { value: 'FEED', label: '🍖 사료/간식' },
    { value: 'SUPPLIES', label: '🧸 용품' },
    { value: 'ETC', label: '기타' },
  ];

  const fetchCandidates = useCallback(async (id: number, keyword: string) => {
    try {
      setIsLoading(true);
      const results = await careApi.getMedicalRecordCandidates(id, keyword);
      setMedicalCandidates(results);
    } catch (err) {
      console.error('Failed to search medical records:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback((keyword: string) => {
    if (!dogId) return;
    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => {
      fetchCandidates(Number(dogId), keyword);
    }, 300);
  }, [dogId, fetchCandidates]);

  useEffect(() => {
    if (dogId) fetchCandidates(Number(dogId), '');
  }, [dogId, fetchCandidates]);

  useEffect(() => {
    if (data.relatedMedicalRecordId && medicalCandidates.length > 0) {
      const found = medicalCandidates.find(m => m.id.toString() === data.relatedMedicalRecordId?.toString());
      if (found) setSelectedRecordInfo(found);
    } else if (!data.relatedMedicalRecordId) {
      setSelectedRecordInfo(null);
    }
  }, [data.relatedMedicalRecordId, medicalCandidates]);

  const handleSelectRecord = (record: CareRecord) => {
    onChange({ ...data, relatedMedicalRecordId: record.id });
    setSelectedRecordInfo(record);
  };

  const handleDogChangeInModal = (newDogId: string) => {
    if (onDogChange) onDogChange(newDogId);
    onChange({ ...data, relatedMedicalRecordId: null }); // 아이가 바뀌면 연관 기록 초기화
  };

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
          {selectedRecordInfo ? (
            <div className="p-6 bg-[#FF6B00]/5 border-2 border-[#FF6B00]/20 rounded-[24px] flex items-center justify-between group">
              <div className="space-y-1">
                <span className="text-[#FF6B00] text-[10px] font-black uppercase tracking-widest">연결된 진료 기록</span>
                <h4 className="text-[16px] font-bold text-stone-800">
                  [{selectedRecordInfo.recordDate}] {selectedRecordInfo.title || selectedRecordInfo.clinicName || '진료 기록'}
                </h4>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-[12px] font-bold text-stone-600 hover:border-[#FF6B00] transition-all">변경</button>
                <button type="button" onClick={() => onChange({ ...data, relatedMedicalRecordId: null })} className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-[12px] font-bold text-red-400 hover:border-red-200 transition-all">해제</button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full p-8 border-2 border-dashed border-stone-200 rounded-[24px] text-stone-400 hover:border-[#FF6B00] hover:text-[#FF6B00] hover:bg-orange-50/30 transition-all flex flex-col items-center gap-2 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🔍</span>
              <span className="font-bold text-[14px]">연관된 병원 진료 기록 찾기</span>
              <span className="text-[12px] opacity-60 font-medium">지출과 관련된 진료 내역이 있다면 선택해 주세요.</span>
            </button>
          )}
        </div>
      </Section>

      <RelatedMedicalRecordModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidates={medicalCandidates}
        isLoading={isLoading}
        selectedDogId={dogId}
        onDogChange={handleDogChangeInModal}
        onSearch={handleSearch}
        onSelect={handleSelectRecord}
      />
    </div>
  );
};
