import { useState, useEffect, useCallback } from 'react';
import { careApi } from '@/api/careApi';
import { fileApi } from '@/api/fileApi';
import type { CareRecord } from '@/types/care';
import type { FileItem } from '@/types/file';

export const useCareRecordDetail = (id: string | undefined) => {
  const [record, setRecord] = useState<CareRecord | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const [recordData, filesData] = await Promise.all([
        careApi.getRecordDetail(Number(id)),
        fileApi.getFiles('CARE_RECORD', Number(id))
      ]);
      
      setRecord(recordData);
      setFiles(filesData);
    } catch (err) {
      console.error('Failed to fetch care record detail:', err);
      setError('기록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    record,
    files,
    isLoading,
    error,
    refetch: fetchDetail
  };
};
