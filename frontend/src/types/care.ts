export type RecordType = 'MEDICAL' | 'EXPENSE';

export interface CareRecord {
  id: number;
  dogId: number;
  recordType: RecordType;
  recordDate: string; // YYYY-MM-DD
  title: string;
  // Medical Details
  clinicName?: string;
  diagnosis?: string;
  medicationStatus?: 'NONE' | 'ACTIVE' | 'COMPLETED';
  // Expense Details
  categoryCode?: string;
  amount?: number;
  // Common
  attachmentCount: number;
}

export interface CareRecordsFilter {
  dogId?: number | string;
  type: RecordType | 'ALL';
  keyword: string;
  startDate: string;
  endDate: string;
}
