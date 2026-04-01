import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { careApi } from '@/api/careApi';
import { fileApi } from '@/api/fileApi';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { RecordType, CareRecordCreateRequest } from '@/types/care';

export const useCareRecordForm = (id?: string) => {
  const navigate = useNavigate();
  const [recordType, setRecordType] = useState<RecordType>('MEDICAL');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);

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
    symptomTags: [] as string[], // 추가됨
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
    relatedMedicalRecordId: ''
  });

  // 4. 파일 업로드 훅
  const fileUploader = useFileUpload('CARE_RECORD');

  // 데이터 동기화: 금액 (Medical <-> Expense)
  useEffect(() => {
    if (recordType === 'MEDICAL') {
      setExpenseData(prev => ({ ...prev, amount: medicalData.amount }));
    } else {
      setMedicalData(prev => ({ ...prev, amount: expenseData.amount }));
    }
  }, [medicalData.amount, expenseData.amount, recordType]);

  // 데이터 동기화: 메모 (Common Note <-> Expense Memo)
  useEffect(() => {
    if (recordType === 'MEDICAL') {
      setExpenseData(prev => ({ ...prev, memo: commonData.note }));
    } else {
      // Expense 모드에서 지출 메모를 수정하면 공통 메모도 같이 업데이트할지 선택 가능
      // 여기서는 동기화하여 전환 시 데이터 유실 방지
      setCommonData(prev => ({ ...prev, note: expenseData.memo }));
    }
  }, [commonData.note, expenseData.memo, recordType]);

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
        // 필드 추출 헬퍼: camelCase, snake_case, 그리고 상세 객체 내부까지 확인
        const getField = (camelField: string, snakeField: string) => 
            raw[camelField] || 
            raw[snakeField] || 
            raw.medicalDetails?.[camelField] || 
            raw.medical_details?.[snakeField] ||
            raw.expenseDetails?.[camelField] || 
            raw.expense_details?.[snakeField];

        const recordAmount = record.amount?.toString() || '';
        const recordNote = record.note || '';

        // 병원 기록 정보 세팅
        const medStatus = record.medicationStatus;
        const isCompleted = medStatus === 'COMPLETED' || raw.is_medication_completed || raw.medicalDetails?.is_medication_completed || raw.medical_details?.is_medication_completed;
        const medDays = getField('medicationDays', 'medication_days');
        const medStart = getField('medicationStartDate', 'medication_start_date');

        setMedicalData({
          clinicName: getField('clinicName', 'clinic_name') || '',
          symptoms: getField('symptoms', 'symptoms') || '',
          symptomTags: record.symptomTags || getField('symptomTags', 'symptom_tags') || [], // 추가됨
          diagnosis: getField('diagnosis', 'diagnosis') || '',
          treatment: getField('treatment', 'treatment') || '',
          amount: recordAmount,
          hasMedication: medStatus === 'ACTIVE' || medStatus === 'COMPLETED' || !!medDays || !!medStart || isCompleted,
          medicationStartDate: medStart || new Date().toISOString().split('T')[0],
          medicationDays: medDays?.toString() || '',
          isMedicationCompleted: !!isCompleted
        });

        // 지출 정보 세팅
        setExpenseData({
          categoryCode: getField('categoryCode', 'category_code') || 'FEED',
          amount: recordAmount,
          memo: getField('memo', 'memo') || recordNote, // memo가 없으면 note를 사용
          relatedMedicalRecordId: getField('relatedMedicalRecordId', 'related_medical_record_id') || ''
        });
      } catch (err) {
        console.error('Failed to load record details:', err);
        alert('기록을 불러오는 중 오류가 발생했습니다.');
        navigate('/care-records');
      } finally {
        setIsFetching(false);
      }
    };

    loadDetail();
  }, [id, navigate]);

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
        symptomTags: medicalData.symptomTags.length > 0 ? medicalData.symptomTags : undefined, // 추가됨
        diagnosis: medicalData.diagnosis.trim() || undefined,
        treatment: medicalData.treatment.trim() || undefined,
        amount: medicalData.amount ? Number(medicalData.amount) : null,
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
      const combinedFileIds = [...fileUploader.existingFileIds, ...uploadedFileIds];
      
      const finalPayload: any = {
        ...payload,
        recordType: recordType, // recordTypeCode 외에 recordType도 명시적으로 추가
        fileIds: combinedFileIds.length > 0 ? combinedFileIds : undefined
      };


      console.log('uploadedFileIds', uploadedFileIds);
      console.log('finalPayload', finalPayload);

      if (id) {
        await careApi.updateRecord(Number(id), finalPayload);
        alert('기록이 성공적으로 수정되었습니다! ✨');
        navigate(`/care-records/${id}`);
      } else {
        await careApi.createRecord(finalPayload);
        alert('기록이 성공적으로 저장되었습니다! ✨');
        navigate('/care-records');
      }
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
    isFetching // 페이지에서 로딩 상태 표시용
  };
};
