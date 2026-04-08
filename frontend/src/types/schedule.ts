export type ScheduleType = 'MEDICAL' | 'GROOMING' | 'MEDICATION' | 'CHECKUP' | 'ETC';

export interface Schedule {
  id: number;
  dogId: number;
  dogName: string;
  dogProfileImageUrl?: string | null; // 추가: 반려견 프로필 이미지 URL
  title: string;
  location?: string;
  scheduleDate: string;
  scheduleTypeCode: string | number;
  scheduleTypeId?: number;
  isCompleted: boolean;
  memo?: string;
  symptomTags: string[];
  dDay: number;
}

export interface ScheduleFilters {
  dogId?: number;
  type?: string | number | 'ALL';
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

export interface ScheduleCreateRequest {
  dogId: number;
  title: string;
  location?: string;
  scheduleDate: string;
  scheduleTypeId: number; // 백엔드 scheduleTypeId (Long) 필드명과 일치
  memo?: string;
  symptomTags?: string[];
  fileIds?: number[];
}
