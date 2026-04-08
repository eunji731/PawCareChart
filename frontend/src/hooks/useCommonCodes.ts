import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';

export interface CodeItem {
  id: number;
  code: string;
  codeName: string;
  sortOrder: number;
}

/**
 * 공통 코드를 실시간으로 가져오는 훅
 */
export const useCommonCodes = (groupCode: string) => {
  const [codes, setCodes] = useState<CodeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!groupCode) return;

    const fetchCodes = async () => {
      try {
        setIsLoading(true);
        /**
         * 캐시 방지(Cache Busting): 
         * URL 뒤에 현재 시간을 붙여 브라우저나 중간 서버가 캐시된 응답을 주지 못하게 강제합니다.
         */
        const response = await apiClient.get(`/codes/${groupCode}`, {
          params: { _t: Date.now() } 
        });
        
        const data = response.data || [];
        setCodes(data);
      } catch (err) {
        console.error(`Failed to fetch codes for ${groupCode}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCodes();
  }, [groupCode]);

  const findIdByCode = (codeValue: string) => {
    return codes.find(c => c.code === codeValue)?.id;
  };

  const getCodeName = (codeValue: string) => {
    return codes.find(c => c.code === codeValue)?.codeName || codeValue;
  };

  const getCodeNameById = (id?: number) => {
    if (!id) return '';
    return codes.find(c => c.id === id)?.codeName || '';
  };

  const getCodeById = (id?: number) => {
    if (!id) return '';
    return codes.find(c => c.id === id)?.code || '';
  };

  return { 
    codes, 
    isLoading, 
    getCodeName,
    findIdByCode,
    getCodeNameById,
    getCodeById
  };
};
