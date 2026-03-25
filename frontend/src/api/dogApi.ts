import { apiClient } from '@/lib/apiClient';
import type { Dog, DogCreateRequest, DogUpdateRequest } from '@/types/dog';

export const dogApi = {
  // 목록 조회
  getDogs: async () => {
    const { data } = await apiClient.get<Dog[]>('/dogs');
    return data || [];
  },

  // 단일 조회
  getDogById: async (id: number) => {
    const { data } = await apiClient.get<Dog>(`/dogs/${id}`);
    return data;
  },

  // 등록
  createDog: async (payload: DogCreateRequest) => {
    return apiClient.post('/dogs', payload);
  },

  // 수정
  updateDog: async (id: number, payload: DogUpdateRequest) => {
    return apiClient.put(`/dogs/${id}`, payload);
  },

  // 삭제
  deleteDog: async (id: number) => {
    return apiClient.delete(`/dogs/${id}`);
  },
};
