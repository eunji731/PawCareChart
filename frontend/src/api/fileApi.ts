import { apiClient } from '@/lib/apiClient';
import type { FileItem, FileUploadParams } from '@/types/file';

export const fileApi = {
  // 파일 업로드: userId를 보내지 않고 인증 정보를 통해 백엔드에서 처리
  uploadFiles: async (params: FileUploadParams) => {
    const formData = new FormData();
    formData.append('targetType', params.targetType);

    if (params.targetId) {
      formData.append('targetId', params.targetId.toString());
    }

    params.files.forEach((file) => formData.append('files', file));

    // Content-Type을 직접 설정하지 않음 (axios/browser가 자동 설정하도록 함)
    const { data } = await apiClient.post<FileItem[]>('/files/upload', formData);
    return data;
  },

  // 파일-대상 매핑 업데이트: userId 필드 제외
  updateMapping: async (params: { fileIds: number[]; targetId: number }) => {
    return apiClient.put('/files/mapping', params);
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
