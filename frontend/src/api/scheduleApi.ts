import { apiClient } from '@/lib/apiClient';
import type { Schedule, ScheduleFilters, ScheduleCreateRequest } from '@/types/schedule';

export const scheduleApi = {
  // 일정 목록 조회
  getSchedules: async (filters: ScheduleFilters): Promise<Schedule[]> => {
    const params: Record<string, string | number> = {};

    if (filters.dogId !== undefined) params.dogId = filters.dogId;
    if (filters.type && filters.type !== 'ALL') params.type = filters.type;
    if (filters.keyword?.trim()) params.keyword = filters.keyword.trim();
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    const response = await apiClient.get('/schedules', { params });
    return response.data;
  },

  // 일정 상세 조회
  getScheduleDetail: async (id: number): Promise<Schedule> => {
    const response = await apiClient.get(`/schedules/${id}`);
    return response.data;
  },

  // 일정 생성
  createSchedule: async (payload: ScheduleCreateRequest) => {
    return apiClient.post('/schedules', payload);
  },

  // 일정 수정
  updateSchedule: async (id: number, payload: ScheduleCreateRequest) => {
    return apiClient.put(`/schedules/${id}`, payload);
  },

  // 일정 삭제
  deleteSchedule: async (id: number) => {
    return apiClient.delete(`/schedules/${id}`);
  },

  // 일정 완료 상태 토글
  toggleCompletion: async (id: number, isCompleted: boolean) => {
    return apiClient.patch(`/schedules/${id}/completion`, { isCompleted });
  },

  // 일정 -> 케어기록으로 전환
  convertToCareRecord: async (id: number) => {
    const response = await apiClient.post(`/schedules/${id}/convert`);
    return response.data; // 생성된 careRecordId 반환 예상
  }
};
