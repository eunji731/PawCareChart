export interface FileItem {
  id: number;
  originalFileName: string;
  storedFileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  targetType: string;
  targetId: number | null;
  createdAt: string;
}

export interface FileUploadParams {
  targetType: string;
  targetId?: number | null;
  files: File[];
}
