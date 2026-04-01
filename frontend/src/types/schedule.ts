export type ScheduleType = 'MEDICAL' | 'GROOMING' | 'MEDICATION' | 'CHECKUP' | 'ETC';

export interface Schedule {
  id: number;
  type: ScheduleType;
  title: string;
  date: string;
  memo?: string;
  tags: string[];
  dDay?: number;
}
