import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { careApi } from '@/api/careApi';
import { fileApi } from '@/api/fileApi';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { RecordType, CareRecordCreateRequest } from '@/types/care';

export const useCareRecordForm = (id?: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [recordType, setRecordType] = useState<RecordType>('MEDICAL');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);
  const [fromScheduleId, setFromScheduleId] = useState<number | null>(null);

  // 1. 공통 정보 상태
  const [commonData, setCommonData] = useState({
    dogId: '',
    recordDate: new Date().toISOString().split('T')[0],
    title: '',
    note: ''
  });

  // 2. 병원 상세 상태
  const [medicalData, setMedicalData] = useState({
    clinicName: '',
    symptoms: '',
    symptomTags: [] as string[],
    diagnosis: '',
    treatment: '',
    amount: '',
    hasMedication: false,
    medicationStartDate: new Date().toISOString().split('T')[0],
    medicationDays: '',
    isMedicationCompleted: false
  });

  // 3. 지출 상세 상태
  const [expenseData, setExpenseData] = useState({
    categoryCode: 'FEED',
    amount: '',
    memo: '',
    relatedMedicalRecordId: '' as string | number
  });

  // 4. 파일 업로드 훅
  const fileUploader = useFileUpload('CARE_RECORD');

  // 전환 데이터 처리 (prefillData)
  useEffect(() => {
    if (id) return; // 수정 모드일 때는 무시

    const prefillData = location.state?.prefillData;
    if (prefillData) {
      if (prefillData.recordType) setRecordType(prefillData.recordType);
      
      setCommonData({
        dogId: prefillData.dogId?.toString() || '',
        recordDate: prefillData.recordDate || new Date().toISOString().split('T')[0],
        title: prefillData.title || '',
        note: prefillData.note || ''
      });

      if (prefillData.medicalDetails) {
        setMedicalData(prev => ({
          ...prev,
          clinicName: prefillData.medicalDetails.clinicName || '',
          symptomTags: prefillData.medicalDetails.symptomTags || []
        }));
      }

      if (prefillData.expenseDetails) {
        setExpenseData(prev => ({
          ...prev,
          categoryCode: prefillData.expenseDetails.categoryCode || 'ETC',
          memo: prefillData.expenseDetails.memo || ''
        }));
      }

      if (prefillData.files && prefillData.files.length > 0) {
        fileUploader.setInitialFiles(prefillData.files);
      }

      if (prefillData.fromScheduleId) {
        setFromScheduleId(prefillData.fromScheduleId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.state]);

  // 데이터 동기화
  useEffect(() => {
    if (recordType === 'MEDICAL') {
      setExpenseData(prev => ({ ...prev, amount: medicalData.amount }));
    } else {
      setMedicalData(prev => ({ ...prev, amount: expenseData.amount }));
    }
  }, [medicalData.amount, expenseData.amount, recordType]);

  // 상세 데이터 로드 (수정 모드)
  useEffect(() => {
    if (!id) return;

    const loadDetail = async () => {
      try {
        setIsFetching(true);
        const [record, files] = await Promise.all([
          careApi.getRecordDetail(Number(id)),
          fileApi.getFiles('CARE_RECORD', Number(id))
        ]);
        
        if (!record) return;

        if (files && files.length > 0) {
          fileUploader.setInitialFiles(files);
        }

        setRecordType(record.recordType);
        
        setCommonData({
          dogId: record.dogId?.toString() || '',
          recordDate: record.recordDate || new Date().toISOString().split('T')[0],
          title: record.title || '',
          note: record.note || ''
        });

        const raw = record as any;
        const getField = (camelField: string, snakeField: string) => 
            raw[camelField] || 
            raw[snakeField] || 
            raw.medicalDetails?.[camelField] || 
            raw.medical_details?.[snakeField] ||
            raw.expenseDetails?.[camelField] || 
            raw.expense_details?.[snakeField];

        const recordAmount = record.amount?.toString() || '';

        setMedicalData({
          clinicName: getField('clinicName', 'clinic_name') || '',
          symptoms: getField('symptoms', 'symptoms') || '',
          symptomTags: record.symptomTags || getField('symptomTags', 'symptom_tags') || [],
          diagnosis: getField('diagnosis', 'diagnosis') || '',
          treatment: getField('treatment', 'treatment') || '',
          amount: recordAmount,
          hasMedication: !!getField('medicationStartDate', 'medication_start_date'),
          medicationStartDate: getField('medicationStartDate', 'medication_start_date') || new Date().toISOString().split('T')[0],
          medicationDays: getField('medicationDays', 'medication_days')?.toString() || '',
          isMedicationCompleted: !!getField('isMedicationCompleted', 'is_medication_completed')
        });

        setExpenseData({
          categoryCode: getField('categoryCode', 'category_code') || 'FEED',
          amount: recordAmount,
          memo: getField('memo', 'memo') || '',
          relatedMedicalRecordId: getField('relatedMedicalRecordId', 'related_medical_record_id') || ''
        });
      } catch (err) {
        console.error('Failed to load record details:', err);
        navigate('/care-records');
      } finally {
        setIsFetching(false);
      }
    };

    loadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleSave = async () => {
    if (!commonData.dogId) return alert('반려견을 선택해주세요.');
    if (!commonData.title.trim()) return alert('제목을 입력해주세요.');

    try {
      setIsLoading(true);

      // 1. 파일 선 업로드
      let uploadedFileIds: number[] = [];
      if (fileUploader.localFiles.length > 0) {
        const uploadedFiles = await fileUploader.upload();
        if (uploadedFiles) {
          uploadedFileIds = uploadedFiles.map(f => f.id);
        }
      }

      const combinedFileIds = [...fileUploader.existingFileIds, ...uploadedFileIds];

      // 2. 페이로드 구성
      const payload: CareRecordCreateRequest = {
        dogId: Number(commonData.dogId),
        recordTypeCode: recordType,
        recordDate: commonData.recordDate,
        title: commonData.title.trim(),
        note: commonData.note.trim() || undefined,
        fileIds: combinedFileIds.length > 0 ? combinedFileIds : undefined,
        sourceScheduleId: fromScheduleId, // 백엔드 자동 삭제를 위해 포함
        medicalDetails: recordType === 'MEDICAL' ? {
          clinicName: medicalData.clinicName.trim() || undefined,
          symptoms: medicalData.symptoms.trim() || undefined,
          symptomTags: medicalData.symptomTags,
          diagnosis: medicalData.diagnosis.trim() || undefined,
          treatment: medicalData.treatment.trim() || undefined,
          amount: medicalData.amount ? Number(medicalData.amount) : null,
          medicationStartDate: medicalData.hasMedication ? medicalData.medicationStartDate : null,
          medicationDays: medicalData.hasMedication && medicalData.medicationDays ? Number(medicalData.medicationDays) : null,
          isMedicationCompleted: medicalData.isMedicationCompleted
        } : null,
        expenseDetails: recordType === 'EXPENSE' ? {
          categoryCode: expenseData.categoryCode,
          amount: Number(expenseData.amount),
          memo: expenseData.memo.trim() || undefined,
          relatedMedicalRecordId: expenseData.relatedMedicalRecordId ? Number(expenseData.relatedMedicalRecordId) : null
        } : null
      };

      if (id) {
        await careApi.updateRecord(Number(id), payload);
        alert('기록이 수정되었습니다! ✨');
      } else {
        await careApi.createRecord(payload);
        alert('기록이 저장되었습니다! ✨');
      }
      navigate('/care-records');
    } catch (err: any) {
      console.error('Save Error:', err);
      alert(err.response?.data?.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recordType, setRecordType,
    commonData, setCommonData,
    medicalData, setMedicalData,
    expenseData, setExpenseData,
    fileUploader,
    handleSave,
    isLoading,
    isFetching
  };
};
