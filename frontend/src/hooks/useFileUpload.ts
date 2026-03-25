import { useState, useCallback, useEffect } from 'react';
import { fileApi } from '@/api/fileApi';
import type { FileItem } from '@/types/file';

export const useFileUpload = (targetType: string) => {
  const [serverFiles, setServerFiles] = useState<FileItem[]>([]);
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 메모리 정리
  const revokePreviews = useCallback(() => {
    previews.forEach(url => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
  }, [previews]);

  useEffect(() => {
    return () => revokePreviews();
  }, [revokePreviews]);

  const fetchFiles = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const data = await fileApi.getFiles(targetType, id);
      setServerFiles(data || []);
    } catch (err) {
      console.error('파일 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [targetType]);

  const handleSelect = (selectedFiles: File[], maxCount: number = 1) => {
    if (selectedFiles.length === 0) return;

    if (maxCount === 1) {
      // 단일 모드: 기존 로컬 데이터 완전 교체
      revokePreviews();
      const file = selectedFiles[0];
      setLocalFiles([file]);
      setPreviews([URL.createObjectURL(file)]);
    } else {
      // 다중 모드 (확장용)
      const limit = maxCount - serverFiles.length;
      const newFiles = selectedFiles.slice(0, limit);
      setLocalFiles(prev => [...prev, ...newFiles]);
      setPreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
    }
  };

  const handleDelete = async (index: number) => {
    const isServerFile = index < serverFiles.length;

    if (isServerFile) {
      const fileToDelete = serverFiles[index];
      if (window.confirm('저장된 사진을 삭제하시겠습니까?')) {
        try {
          setIsLoading(true);
          await fileApi.deleteFile(fileToDelete.id);
          setServerFiles(prev => prev.filter((_, i) => i !== index));
        } catch (err) {
          alert('파일 삭제에 실패했습니다.');
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      // 로컬 선택 취소
      const localIdx = index - serverFiles.length;
      const urlToRemove = previews[localIdx];
      if (urlToRemove.startsWith('blob:')) URL.revokeObjectURL(urlToRemove);
      
      setLocalFiles(prev => prev.filter((_, i) => i !== localIdx));
      setPreviews(prev => prev.filter((_, i) => i !== localIdx));
    }
  };

  const upload = async (id: number) => {
    if (localFiles.length === 0) return null;
    return fileApi.uploadFiles({
      targetType,
      targetId: id,
      files: localFiles
    });
  };

  const clear = useCallback(() => {
    revokePreviews();
    setLocalFiles([]);
    setPreviews([]);
    setServerFiles([]);
  }, [revokePreviews]);

  const allDisplayUrls = [
    ...serverFiles.map(f => f.fileUrl),
    ...previews
  ];

  return {
    serverFiles,
    localFiles,
    displayUrls: allDisplayUrls,
    isLoading,
    fetchFiles,
    handleSelect,
    handleDelete,
    upload,
    clear
  };
};
