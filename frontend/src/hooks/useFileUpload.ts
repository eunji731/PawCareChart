import { useState, useEffect, useCallback } from 'react';
import { fileApi } from '@/api/fileApi';
import type { FileItem } from '@/types/file';

/**
 * 파일 업로드 공통 훅
 * 
 * 모든 파일 업로드가 필요한 화면에서 재사용할 수 있도록 설계됨.
 * - 단일 모드(프로필 사진 등): maxCount=1로 사용
 * - 다중 모드(첨부파일 등): maxCount를 원하는 개수로 설정
 * 
 * @example
 * // 반려견 프로필 사진 (단일 모드)
 * const photo = useFileUpload('DOG');
 * photo.setInitialUrls([dog.profileImageUrl]); // 기존 이미지 세팅
 * <FileUploader displayUrls={photo.displayUrls} onFileSelect={(f) => photo.handleSelect(f, 1)} ... />
 * 
 * @example
 * // 케어기록 첨부파일 (다중 모드)
 * const attachments = useFileUpload('CARE_RECORD');
 * attachments.setInitialUrls(record.imageUrls);
 * <FileUploader displayUrls={attachments.displayUrls} onFileSelect={(f) => attachments.handleSelect(f, 5)} ... />
 */
export const useFileUpload = (targetType: string) => {
  // 서버에 이미 저장된 기존 URL 목록 (수정 모드에서 세팅)
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
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

  // ========== 기존 URL 세팅 (수정 모드 진입 시 호출) ==========
  const setInitialUrls = useCallback((urls: (string | null | undefined)[]) => {
    // null/undefined 필터링 후 세팅
    setExistingUrls(urls.filter((u): u is string => !!u));
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
      setExistingUrls([]); // 새 파일이 기존 URL을 대체
    } else {
      // 다중 모드: 남은 슬롯만큼 추가
      const remaining = maxCount - existingUrls.length - localFiles.length;
      const newFiles = files.slice(0, Math.max(0, remaining));
      if (newFiles.length === 0) return;
      const newPreviews = newFiles.map(f => URL.createObjectURL(f));
      setLocalFiles(prev => [...prev, ...newFiles]);
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  // ========== 파일 삭제 ==========
  const handleDelete = (index: number) => {
    const totalExisting = existingUrls.length;

    if (index < totalExisting) {
      // 기존 서버 URL 삭제
      setExistingUrls(prev => prev.filter((_, i) => i !== index));
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
        targetId: targetId || null, // ID가 없어도 업로드 허용
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
    setExistingUrls([]);
  }, [revokeAllPreviews]);

  // ========== FileUploader 컴포넌트에 넘길 표시용 URL 목록 ==========
  // 단일 모드: handleSelect에서 existingUrls를 비우므로 자연스럽게 새 미리보기만 남음
  // 다중 모드: 기존 URL + 새 미리보기가 합쳐져서 표시됨
  const displayUrls = [...existingUrls, ...previewUrls];

  return {
    /** FileUploader의 displayUrls prop에 전달 */
    displayUrls,
    /** 새로 선택된 로컬 파일 목록 (업로드 대상) */
    localFiles,
    /** 서버에 이미 저장된 기존 URL 목록 */
    existingUrls,
    /** 업로드 진행 중 여부 */
    isUploading,
    /** 새로 선택한 파일이 있는지 여부 */
    hasNewFiles: localFiles.length > 0,
    /** 수정 모드에서 기존 URL 세팅 */
    setInitialUrls,
    /** FileUploader의 onFileSelect에 전달 (maxCount 지정 필수) */
    handleSelect,
    /** FileUploader의 onFileDelete에 전달 */
    handleDelete,
    /** 서버에 파일 업로드 실행 (targetId 필요) */
    upload,
    /** 모든 상태 초기화 */
    clear,
  };
};
