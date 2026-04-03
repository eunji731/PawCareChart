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

  // 연관 진료 기록 후보 조회 (지출 기록 등록용 - 서버 측 검색 지원)
  getMedicalRecordCandidates: async (dogId: number, keyword?: string): Promise<CareRecord[]> => {
    const response = await apiClient.get(`/care-records/medical-candidates`, {
      params: { dogId, keyword }
    });
    return response.data;
  },

  // 증상 마스터 목록 검색 (자동완성용)
  searchSymptomMasters: async (keyword: string): Promise<string[]> => {
    const response = await apiClient.get('/symptoms/search', {
      params: { keyword }
    });
    // apiClient 인터셉터에서 이미 response.data.data를 리턴했으므로 response.data는 배열입니다.
    const symptomList = response.data || [];
    return symptomList.map((item: { id: number; name: string }) => item.name);
  },
};
