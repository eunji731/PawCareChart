import React from 'react';
import { Section } from '@/components/common/Section';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { TagInput } from '@/components/common/TagInput';

interface MedicalFormProps {
  data: {
    clinicName: string;
    symptoms: string; // 기존 서술형 텍스트 필드 유지
    symptomTags: string[]; // 새롭게 추가된 태그 필드
    diagnosis: string;
    treatment: string;
    amount: string | number;
    hasMedication: boolean;
    medicationStartDate: string;
    medicationDays: string | number;
    isMedicationCompleted: boolean;
  };
  onChange: (data: any) => void;
}

export const MedicalForm: React.FC<MedicalFormProps> = ({ data, onChange }) => {
  // 임시 추천 태그
  const commonSymptoms = ['구토', '설사', '무기력', '식욕부진', '가려움', '눈물과다', '기침', '콧물'];

  return (
    <div className="space-y-10">
      <Section title="진료 상세" description="병원에서 확인한 내용을 꼼꼼히 기록하세요.">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="병원명" 
              placeholder="동물병원 이름을 입력하세요" 
              value={data.clinicName} 
              onChange={(e) => onChange({ ...data, clinicName: e.target.value })} 
            />
            <div className="relative">
              <Input 
                label="진료비 (금액)" 
                type="number" 
                placeholder="0" 
                value={data.amount} 
                onChange={(e) => onChange({ ...data, amount: e.target.value })} 
              />
              <span className="absolute right-5 bottom-4 text-[13px] font-black text-stone-300 uppercase">원</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <TagInput 
              label="주요 증상 태그" 
              placeholder="아이가 보인 핵심 증상을 태그로 입력하세요 (예: 구토, 설사)"
              tags={data.symptomTags || []}
              suggestions={commonSymptoms}
              onChange={(tags) => onChange({ ...data, symptomTags: tags })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Textarea 
              label="증상 및 진료 소견 (상세)" 
              placeholder="아이가 어떤 점이 불편해 보였는지 구체적으로 적어주세요." 
              value={data.symptoms} 
              onChange={(e) => onChange({ ...data, symptoms: e.target.value })} 
            />
            <Textarea 
              label="진단명" 
              placeholder="수의사 선생님의 진단 결과는 무엇인가요?" 
              value={data.diagnosis} 
              onChange={(e) => onChange({ ...data, diagnosis: e.target.value })} 
            />
          </div>
          <Textarea 
            label="처치 및 진료 내용" 
            placeholder="어떤 치료나 처치를 받았나요?" 
            value={data.treatment} 
            onChange={(e) => onChange({ ...data, treatment: e.target.value })} 
          />
        </div>
      </Section>

      <Section 
        title="복약 정보" 
        description="처방받은 약이 있다면 기록하고 관리하세요."
        rightElement={
          <button
            type="button"
            onClick={() => onChange({ ...data, hasMedication: !data.hasMedication })}
            className={`px-4 py-1.5 rounded-full text-[12px] font-black transition-all ${
              data.hasMedication 
                ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20' 
                : 'bg-stone-100 text-stone-400'
            }`}
          >
            {data.hasMedication ? '복약 있음' : '복약 없음'}
          </button>
        }
      >
        {data.hasMedication ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="복약 시작일" 
                type="date" 
                value={data.medicationStartDate} 
                onChange={(e) => onChange({ ...data, medicationStartDate: e.target.value })} 
              />
              <div className="relative">
                <Input 
                  label="복약 일수" 
                  type="number" 
                  placeholder="예: 7" 
                  value={data.medicationDays} 
                  onChange={(e) => onChange({ ...data, medicationDays: e.target.value })} 
                />
                <span className="absolute right-5 bottom-4 text-[13px] font-black text-stone-300 uppercase">일분</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
              <input 
                type="checkbox" 
                id="isMedicationCompleted"
                checked={data.isMedicationCompleted}
                onChange={(e) => onChange({ ...data, isMedicationCompleted: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-[#FF6B00] focus:ring-[#FF6B00]"
              />
              <label htmlFor="isMedicationCompleted" className="text-[14px] font-bold text-stone-600 cursor-pointer">
                이미 복약을 모두 마쳤습니다.
              </label>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center border-2 border-dashed border-stone-50 rounded-2xl">
            <p className="text-stone-300 font-bold text-sm text-wrap-balance">처방받은 약이 있다면 <br className="md:hidden" /> 우측 상단 '복약 있음'을 켜주세요. 💊</p>
          </div>
        )}
      </Section>
    </div>
  );
};
