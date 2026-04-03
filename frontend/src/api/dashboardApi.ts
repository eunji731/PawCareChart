import { apiClient } from '@/lib/apiClient';

export interface DashboardSummary {
  stats: {
    totalExpense: number;
    medicalCount: number;
    activeMedicationCount: number;
    upcomingScheduleCount: number;
  };
  topSymptoms: Array<{ name: string; count: number }>;
  upcomingSchedules: Array<{
    id: number;
    title: string;
    scheduleDate: string;
    location?: string;
    dDay: number;
  }>;
  recentRecords: Array<{
    id: number;
    type: string;
    date: string;
    title: string;
    amount: number;
  }>;
}

export const dashboardApi = {
  // 홈 대시보드 통합 요약 정보 조회
  getSummary: async (params: { dogId?: number; startDate: string; endDate: string }): Promise<DashboardSummary> => {
    const response = await apiClient.get('/dashboard/summary', { params });
    // apiClient 인터셉터가 response.data.data를 반환한다고 가정
    return response.data;
  },

  // 차트 데이터 등 추가 대시보드 API는 여기에 정의
};
