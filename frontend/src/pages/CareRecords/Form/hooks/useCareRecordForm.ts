import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { careApi } from '@/api/careApi';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { RecordType, CareRecordCreateRequest } from '@/types/care';

export const useCareRecordForm = () => {
  const navigate = useNavigate();
  const [recordType, setRecordType] = useState<RecordType>('MEDICAL');
  const [isLoading, setIsLoading] = useState(false);

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
    diagnosis: '',
    treatment: '',
    amount: '', // 추가됨
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
    relatedMedicalRecordId: ''
  });

  // 4. 파일 업로드 훅
  const fileUploader = useFileUpload('CARE_RECORD');

  const handleSave = async () => {
    if (!commonData.dogId) return alert('반려견을 선택해주세요.');
    if (!commonData.title.trim()) return alert('제목을 입력해주세요.');

    const payload: CareRecordCreateRequest = {
      dogId: Number(commonData.dogId),
      recordTypeCode: recordType,
      recordDate: commonData.recordDate,
      title: commonData.title.trim(),
      note: commonData.note.trim() || undefined,
      medicalDetails: recordType === 'MEDICAL' ? {
        clinicName: medicalData.clinicName.trim() || undefined,
        symptoms: medicalData.symptoms.trim() || undefined,
        diagnosis: medicalData.diagnosis.trim() || undefined,
        treatment: medicalData.treatment.trim() || undefined,
        amount: medicalData.amount ? Number(medicalData.amount) : null, // 추가됨
        medicationStartDate: medicalData.hasMedication ? medicalData.medicationStartDate : null,
        medicationDays: medicalData.hasMedication && medicalData.medicationDays ? Number(medicalData.medicationDays) : null,
        isMedicationCompleted: medicalData.isMedicationCompleted
      } : null,
      expenseDetails: recordType === 'EXPENSE' ? {
        categoryCode: expenseData.categoryCode,
        amount: Number(expenseData.amount) || 0,
        memo: expenseData.memo.trim() || undefined,
        relatedMedicalRecordId: expenseData.relatedMedicalRecordId ? Number(expenseData.relatedMedicalRecordId) : null
      } : null
    };

    try {
      setIsLoading(true);

      // 1. 파일 선(先) 업로드 실행
      let uploadedFileIds: number[] = [];
      if (fileUploader.localFiles.length > 0) {
        const uploadedFiles = await fileUploader.upload();
        if (uploadedFiles) {
          console.log('uploadedFiles', uploadedFiles);
          uploadedFileIds = uploadedFiles.map(f => f.id);
        }
      }

      // 2. 본문 저장
      const finalPayload: CareRecordCreateRequest = {
        ...payload,
        fileIds: uploadedFileIds.length > 0 ? uploadedFileIds : undefined
      };


      console.log('uploadedFileIds', uploadedFileIds);
      console.log('finalPayload', finalPayload);

      await careApi.createRecord(finalPayload);

      alert('기록이 성공적으로 저장되었습니다! ✨');
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
    isLoading
  };
};
