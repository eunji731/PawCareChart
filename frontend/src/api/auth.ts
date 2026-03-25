import { apiClient } from '@/lib/apiClient';

export interface User {
  id: string;
  email: string;
  name: string;
}

export const authApi = {
  login: async (credentials: any) => {
    return apiClient.post('/auth/login', credentials);
  },
  logout: async () => {
    return apiClient.post('/auth/logout');
  },
  getMe: async (): Promise<User> => {
    try {
      const { data } = await apiClient.get<any>('/auth/me');
      
      // 백엔드에서 넘겨주는 JSON 구조: { id: 1, email: "...", name: "이은지", ... }
      return {
        id: String(data.id), // 프론트엔드 User 인터페이스가 string id를 사용하므로 변환
        email: data.email,
        name: data.name,
      };
    } catch (error) {
      console.error('❌ /me 정보를 가져오는 로직 실패:', error);
      throw error;
    }
  },
};
