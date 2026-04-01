export type ScheduleType = 'MEDICAL' | 'GROOMING' | 'MEDICATION' | 'CHECKUP' | 'ETC';

export interface Schedule {
  id: number;
  dogId: number;
  dogName: string;
  title: string;
  scheduleDate: string; // ISO-8601
  scheduleTypeCode: ScheduleType;
  isCompleted: boolean;
  memo?: string;
  symptomTags: string[];
  dDay: number;
}

export interface ScheduleFilters {
  dogId?: number;
  type?: ScheduleType | 'ALL';
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

export interface ScheduleCreateRequest {
  dogId: number;
  title: string;
  scheduleDate: string;
  scheduleTypeCode: ScheduleType;
  memo?: string;
  symptomTags?: string[];
}
