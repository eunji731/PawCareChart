import { useState, useEffect, useCallback } from 'react';
import { fileApi } from '@/api/fileApi';
import type { FileItem } from '@/types/file';

/**
 * 파일 업로드 공통 훅
 * 
 * 모든 파일 업로드가 필요한 화면에서 재사용할 수 있도록 설계됨.
 * - 단일 모드(프로필 사진 등): maxCount=1로 사용
 * - 다중 모드(첨부파일 등): maxCount를 원하는 개수로 설정
 */
export const useFileUpload = (targetType: string) => {
  // 서버에 이미 저장된 기존 파일 객체 목록 (수정 모드에서 세팅)
  const [existingFiles, setExistingFiles] = useState<FileItem[]>([]);
  // 유저가 새로 선택한 File 객체 목록
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  // 새로 선택한 파일들의 blob 미리보기 URL 목록
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  // 업로드 진행 중 여부
  const [isUploading, setIsUploading] = useState(false);

  // ========== blob URL 메모리 정리 ==========
  const revokeAllPreviews = useCallback(() => {
    previewUrls.forEach(url => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
  }, [previewUrls]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => revokeAllPreviews();
  }, [revokeAllPreviews]);

  // ========== 기존 파일 세팅 (수정 모드 진입 시 호출) ==========
  const setInitialFiles = useCallback((files: FileItem[]) => {
    setExistingFiles(files || []);
  }, []);

  // ========== 파일 선택 ==========
  const handleSelect = (files: File[], maxCount: number = 1) => {
    if (files.length === 0) return;

    if (maxCount === 1) {
      // 단일 모드: 기존 전부 교체
      revokeAllPreviews();
      const file = files[0];
      setLocalFiles([file]);
      setPreviewUrls([URL.createObjectURL(file)]);
      setExistingFiles([]); // 새 파일이 기존 파일을 대체
    } else {
      // 다중 모드: 남은 슬롯만큼 추가
      const remaining = maxCount - existingFiles.length - localFiles.length;
      const newFiles = files.slice(0, Math.max(0, remaining));
      if (newFiles.length === 0) return;
      const newPreviews = newFiles.map(f => URL.createObjectURL(f));
      setLocalFiles(prev => [...prev, ...newFiles]);
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  // ========== 파일 삭제 ==========
  const handleDelete = (index: number) => {
    const totalExisting = existingFiles.length;

    if (index < totalExisting) {
      // 기존 서버 파일 삭제
      setExistingFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      // 로컬 미리보기 삭제
      const localIdx = index - totalExisting;
      const urlToRevoke = previewUrls[localIdx];
      if (urlToRevoke?.startsWith('blob:')) URL.revokeObjectURL(urlToRevoke);
      setLocalFiles(prev => prev.filter((_, i) => i !== localIdx));
      setPreviewUrls(prev => prev.filter((_, i) => i !== localIdx));
    }
  };

  // ========== 서버 업로드 ==========
  const upload = async (targetId?: number | null): Promise<FileItem[] | null> => {
    if (localFiles.length === 0) return null;
    try {
      setIsUploading(true);
      const result = await fileApi.uploadFiles({
        targetType,
        targetId: targetId || null,
        files: localFiles,
      });
      return Array.isArray(result) ? result : null;
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // ========== 전체 초기화 ==========
  const clear = useCallback(() => {
    revokeAllPreviews();
    setLocalFiles([]);
    setPreviewUrls([]);
    setExistingFiles([]);
  }, [revokeAllPreviews]);

  // ========== 표시용 파일 정보 목록 ==========
  const fileInfos = [
    ...existingFiles.map(f => ({
      url: f.fileUrl,
      name: f.originalFileName,
      isExisting: true
    })),
    ...localFiles.map((f, i) => ({
      url: previewUrls[i],
      name: f.name,
      isExisting: false
    }))
  ];

  // ========== 기존 파일의 ID 목록 ==========
  const existingFileIds = existingFiles.map(f => f.id);

  return {
    fileInfos, // displayUrls 대신 사용 권장
    //displayUrls, // 하위 호환성 유지
    localFiles,
    existingFiles,
    existingFileIds,
    isUploading,
    hasNewFiles: localFiles.length > 0,
    setInitialFiles,
    handleSelect,
    handleDelete,
    upload,
    clear,
  };
};
