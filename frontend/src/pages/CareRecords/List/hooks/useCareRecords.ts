import { useState, useEffect, useCallback } from 'react';
import { careApi } from '@/api/careApi';
import type { CareRecord, CareRecordsFilter } from '@/types/care';

export const useCareRecords = () => {
  const [records, setRecords] = useState<CareRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 필터값 (이번 달 기준)
  const [filters, setFilters] = useState<CareRecordsFilter>({
    dogId: '',
    type: 'ALL',
    keyword: '',
    startDate: '',
    endDate: ''
  });

  const fetchRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await careApi.getRecords(filters);
      setRecords(data);
    } catch (err) {
      console.error('CareRecords Load Failed:', err);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const updateFilter = (newFilters: Partial<CareRecordsFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    records,
    isLoading,
    filters,
    updateFilter,
    refetch: fetchRecords
  };
};
