export type RecordType = 'MEDICAL' | 'EXPENSE' | 'MEMO';

export interface CareRecord {
  id: number;
  dogId: number;
  dogName: string;
  dogProfileImageUrl: string | null;
  recordType: RecordType;
  recordDate: string;
  title: string;
  note?: string;
  // Medical Details
  clinicName?: string;
  diagnosis?: string;
  symptoms?: string;
  symptomTags?: string[];
  treatment?: string;
  medicationStatus?: 'NONE' | 'ACTIVE' | 'COMPLETED';
  medicationStartDate?: string | null;
  medicationDays?: number | null;
  // Common / Expense
  categoryCode?: string;
  amount?: number | null;
  // Expense Specific
  relatedMedicalRecordId?: number | null;
  relatedMedicalRecord?: { id: number; title: string; recordDate: string; clinicName?: string } | null;
  // Common
  attachmentCount: number;
}

export interface CareRecordsFilter {
  dogId?: number;
  type?: RecordType | 'ALL';
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

export interface MedicalDetailRequest {
  clinicName?: string;
  symptoms?: string;
  symptomTags?: string[];
  diagnosis?: string;
  treatment?: string;
  amount?: number | null;
  medicationStartDate?: string | null;
  medicationDays?: number | null;
  isMedicationCompleted?: boolean;
}

export interface ExpenseDetailRequest {
  categoryCode: string;
  amount: number;
  memo?: string;
  relatedMedicalRecordId?: number | null;
}

export interface CareRecordCreateRequest {
  dogId: number;
  recordTypeCode: RecordType;
  recordDate: string;
  title: string;
  note?: string;
  fileIds?: number[];
  sourceScheduleId?: number | null; // 추가: 전환 시 원본 일정 ID
  medicalDetails?: MedicalDetailRequest | null;
  expenseDetails?: ExpenseDetailRequest | null;
}
