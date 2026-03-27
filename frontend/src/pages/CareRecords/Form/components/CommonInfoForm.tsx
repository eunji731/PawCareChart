import React, { useEffect, useState } from 'react';
import { Section } from '@/components/common/Section';
import { Select } from '@/components/common/Select';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { dogApi } from '@/api/dogApi';
import type { Dog } from '@/types/dog';

interface CommonInfoFormProps {
  data: {
    dogId: string | number;
    recordDate: string;
    title: string;
    note: string;
  };
  onChange: (data: any) => void;
}

export const CommonInfoForm: React.FC<CommonInfoFormProps> = ({ data, onChange }) => {
  const [dogs, setDogs] = useState<Dog[]>([]);

  useEffect(() => {
    dogApi.getDogs().then(setDogs).catch(() => setDogs([]));
  }, []);

  const dogOptions = [
    { value: '', label: '반려견 선택' },
    ...dogs.map(dog => ({ value: dog.id, label: dog.name }))
  ];

  return (
    <Section title="기본 정보" description="어떤 아이의 어떤 날 기록인가요?">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Select 
          label="반려견 *" 
          options={dogOptions} 
          value={data.dogId} 
          onChange={(e) => onChange({ ...data, dogId: e.target.value })} 
        />
        <Input 
          label="기록일 *" 
          type="date" 
          value={data.recordDate} 
          onChange={(e) => onChange({ ...data, recordDate: e.target.value })} 
        />
      </div>
      <div className="space-y-6">
        <Input 
          label="제목 *" 
          placeholder="오늘의 주요 활동이나 병원 방문 목적" 
          value={data.title} 
          onChange={(e) => onChange({ ...data, title: e.target.value })} 
        />
        <Textarea 
          label="공통 메모" 
          placeholder="추가적으로 남기고 싶은 내용을 자유롭게 적어주세요." 
          value={data.note} 
          onChange={(e) => onChange({ ...data, note: e.target.value })} 
        />
      </div>
    </Section>
  );
};
