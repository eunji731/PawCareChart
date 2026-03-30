export type RecordType = 'MEDICAL' | 'EXPENSE';

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
  treatment?: string;
  medicationStatus?: 'NONE' | 'ACTIVE' | 'COMPLETED';
  medicationStartDate?: string | null;
  medicationDays?: number | null;
  // Common / Expense
  categoryCode?: string;
  amount?: number | null; // 이제 MEDICAL에서도 사용됨
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
  diagnosis?: string;
  treatment?: string;
  amount?: number | null; // 추가됨
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
  medicalDetails?: MedicalDetailRequest | null;
  expenseDetails?: ExpenseDetailRequest | null;
}
