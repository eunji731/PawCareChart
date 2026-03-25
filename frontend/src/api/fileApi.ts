import { apiClient } from '@/lib/apiClient';
import type { FileItem } from '@/types/file';

export const fileApi = {
  // 파일 업로드 (Multipart/FormData)
  uploadFiles: async (params: { targetType: string; targetId: number; files: File[] }) => {
    const formData = new FormData();
    formData.append('targetType', params.targetType);
    formData.append('targetId', params.targetId.toString());
    params.files.forEach((file) => formData.append('files', file));

    const { data } = await apiClient.post<FileItem[]>('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  // 파일 목록 조회
  getFiles: async (targetType: string, targetId: number) => {
    const { data } = await apiClient.get<FileItem[]>('/files', {
      params: { targetType, targetId },
    });
    return data;
  },

  // 파일 삭제
  deleteFile: async (fileId: number) => {
    return apiClient.delete(`/files/${fileId}`);
  },
};
