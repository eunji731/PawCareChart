import { useState, useEffect, useCallback } from 'react';
import { careApi } from '@/api/careApi';
import { fileApi } from '@/api/fileApi';
import type { CareRecord } from '@/types/care';
import type { FileItem } from '@/types/file';

// [임시] 상세 페이지 UI 확인을 위한 Mock 데이터 모드 (true: Mock 사용, false: API 사용)
const USE_MOCK_DETAIL = true;

// 테스트용 Mock 데이터
const MOCK_RECORD: CareRecord = {
  id: 999,
  dogId: 1,
  dogName: '초코',
  dogProfileImageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200',
  recordType: 'MEDICAL',
  recordDate: '2024-03-27',
  title: '환절기 알러지 정기 검진 및 약 처방',
  note: '최근 눈 주변을 자주 긁는 모습이 보여 병원에 방문함.\n수의사 선생님 말씀으로는 전형적인 계절성 알러지 증상이라고 하심.\n\n안약과 먹는 약 7일분을 처방받았으며, 가급적 산책 후에는 젖은 수건으로 발과 얼굴을 잘 닦아주라고 조언해주심.\n다음 주에 증상이 호전되지 않으면 다시 방문할 예정.',
  clinicName: '튼튼 동물병원',
  diagnosis: '계절성 피부 알러지',
  medicationStatus: 'ACTIVE',
  amount: 45000,
  attachmentCount: 2
};

const MOCK_FILES: FileItem[] = [
  {
    id: 101,
    originalFileName: '진료비_영수증.jpg',
    storedFileName: 'mock_receipt.jpg',
    fileUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=800',
    fileSize: 1024 * 500,
    fileType: 'image/jpeg',
    targetType: 'CARE_RECORD',
    targetId: 999,
    createdAt: new Date().toISOString()
  },
  {
    id: 102,
    originalFileName: '처방전_상세.png',
    storedFileName: 'mock_prescription.png',
    fileUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    fileSize: 1024 * 300,
    fileType: 'image/png',
    targetType: 'CARE_RECORD',
    targetId: 999,
    createdAt: new Date().toISOString()
  }
];

export const useCareRecordDetail = (id: string | undefined) => {
  const [record, setRecord] = useState<CareRecord | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);

    // Mock 모드일 경우 즉시 반환
    if (USE_MOCK_DETAIL) {
      setTimeout(() => {
        setRecord(MOCK_RECORD);
        setFiles(MOCK_FILES);
        setIsLoading(false);
      }, 500); // 실제 API 느낌을 위해 약간의 딜레이
      return;
    }
    
    try {
      const [recordData, filesData] = await Promise.all([
        careApi.getRecordDetail(Number(id)),
        fileApi.getFiles('CARE_RECORD', Number(id))
      ]);
      
      setRecord(recordData);
      setFiles(filesData);
    } catch (err) {
      console.error('Failed to fetch care record detail:', err);
      // API 실패 시에도 UI 확인을 위해 에러를 띄우지 않고 Mock 데이터로 Fallback 가능
      // 여기서는 명시적으로 Mock 모드를 끄면 에러를 띄우도록 유지
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
