import { apiClient } from '@/lib/apiClient';
import type { CareRecord, CareRecordsFilter } from '@/types/care';

export const careApi = {
  getRecords: async (params: CareRecordsFilter) => {
    // 인터셉터가 이미 data/response 껍데기를 벗긴 상태라고 가정 (response.data 가 결과)
    const { data } = await apiClient.get<CareRecord[]>('/care-records', { params });
    return data || [];
  }
};
