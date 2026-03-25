export interface FileItem {
  id: number;
  originalFileName: string;
  storedFileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  targetType: string;
  targetId: number;
  createdAt: string;
}

export interface FileUploadParams {
  targetType: 'DOG' | 'CARE_RECORD' | 'HEALTH_LOG';
  targetId: number;
  files: File[];
}
