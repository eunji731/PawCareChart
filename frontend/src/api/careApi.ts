import { apiClient } from '@/lib/apiClient';
import type { CareRecord, CareRecordsFilter, CareRecordCreateRequest } from '@/types/care';

export const careApi = {
  getRecords: async (filters: CareRecordsFilter) => {
    const params: Record<string, string | number> = {};

    if (filters.dogId !== undefined) {
      params.dogId = filters.dogId;
    }

    if (filters.type && filters.type !== 'ALL') {
      params.type = filters.type;
    }

    if (filters.keyword?.trim()) {
      params.keyword = filters.keyword.trim();
    }

    if (filters.startDate) {
      params.startDate = filters.startDate;
    }

    if (filters.endDate) {
      params.endDate = filters.endDate;
    }

    const response = await apiClient.get('/care-records', { params });
    return response.data;
  },

  getRecordDetail: async (recordId: number) => {
    const response = await apiClient.get(`/care-records/${recordId}`);
    return response.data;
  },

  createRecord: async (payload: CareRecordCreateRequest) => {
    return apiClient.post('/care-records', payload);
  },

  updateRecord: async (recordId: number, payload: CareRecordCreateRequest) => {
    return apiClient.put(`/care-records/${recordId}`, payload);
  },

  deleteRecord: async (recordId: number) => {
    return apiClient.delete(`/care-records/${recordId}`);
  },

  getDashboardSummary: async (params: { dogId?: number; startDate: string; endDate: string }) => {
    const response = await apiClient.get('/care-records/dashboard/summary', { params });
    return response.data;
  },
};
