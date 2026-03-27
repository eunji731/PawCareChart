import { apiClient } from '@/lib/apiClient';
import type { CareRecord, CareRecordsFilter, CareRecordCreateRequest } from '@/types/care';

export const careApi = {
  getRecords: async (params: CareRecordsFilter) => {
    const { data } = await apiClient.get<CareRecord[]>('/care-records', { params });
    return data || [];
  },

  createRecord: async (payload: CareRecordCreateRequest) => {
    return apiClient.post('/care-records', payload);
  },
};
