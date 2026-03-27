package com.pawcarechart.backend.care.service;

import com.pawcarechart.backend.care.dto.CareRecordCreateRequest;
import com.pawcarechart.backend.care.dto.CareRecordListResponse;
import com.pawcarechart.backend.care.entity.CareRecord;
import com.pawcarechart.backend.care.entity.ExpenseDetail;
import com.pawcarechart.backend.care.entity.MedicalDetail;
import com.pawcarechart.backend.care.repository.CareRecordRepository;
import com.pawcarechart.backend.care.repository.ExpenseDetailRepository;
import com.pawcarechart.backend.care.repository.MedicalDetailRepository;
import com.pawcarechart.backend.dog.repository.DogRepository;
import com.pawcarechart.backend.file.constant.FileTargetType;
import com.pawcarechart.backend.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CareService {

    private final CareRecordRepository careRecordRepository;
    private final MedicalDetailRepository medicalDetailRepository;
    private final ExpenseDetailRepository expenseDetailRepository;
    private final DogRepository dogRepository;
    private final FileService fileService;

    /**
     * 통합 케어 기록 목록 조회
     */
    public List<CareRecordListResponse> getCareRecords(
            Long userId, Long dogId, String type, String keyword, LocalDate startDate, LocalDate endDate) {
        
        String recordType = (type == null || "ALL".equalsIgnoreCase(type) || type.isBlank()) ? null : type.toUpperCase();
        String searchKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        return careRecordRepository.findCareRecordsByFilters(
                userId, dogId, recordType, searchKeyword, startDate, endDate);
    }

    /**
     * 통합 케어 기록 등록
     */
    @Transactional
    public Long registerCareRecord(CareRecordCreateRequest request, Long userId) {
        dogRepository.findByIdAndUserId(request.dogId(), userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "반려견 정보를 찾을 수 없거나 권한이 없습니다."));

        CareRecord careRecord = CareRecord.builder()
                .dogId(request.dogId())
                .userId(userId)
                .recordTypeCode(request.recordTypeCode())
                .recordDate(request.recordDate())
                .title(request.title())
                .note(request.note())
                .build();

        CareRecord savedRecord = careRecordRepository.save(careRecord);
        Long recordId = savedRecord.getId();

        if ("MEDICAL".equals(request.recordTypeCode())) {
            saveMedicalDetail(request.medicalDetails(), savedRecord);
        } else if ("EXPENSE".equals(request.recordTypeCode())) {
            saveExpenseDetail(request.expenseDetails(), savedRecord);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 기록 유형 코드입니다.");
        }

        if (request.fileIds() != null && !request.fileIds().isEmpty()) {
            fileService.connectFilesToTarget(request.fileIds(), FileTargetType.CARE_RECORD, recordId, userId);
        }

        return recordId;
    }

    private void saveMedicalDetail(CareRecordCreateRequest.MedicalDetailRequest detailRequest, CareRecord careRecord) {
        if (detailRequest == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "병원 상세 정보가 누락되었습니다.");
        }

        MedicalDetail medicalDetail = MedicalDetail.builder()
                .careRecord(careRecord)
                .clinicName(detailRequest.clinicName())
                .symptoms(detailRequest.symptoms())
                .diagnosis(detailRequest.diagnosis())
                .treatment(detailRequest.treatment())
                .medicationStartDate(detailRequest.medicationStartDate())
                .medicationDays(detailRequest.medicationDays())
                .isMedicationCompleted(detailRequest.isMedicationCompleted() != null && detailRequest.isMedicationCompleted())
                .amount(detailRequest.amount()) // [추가] 의료 비용 저장
                .build();

        medicalDetailRepository.save(medicalDetail);
    }

    private void saveExpenseDetail(CareRecordCreateRequest.ExpenseDetailRequest detailRequest, CareRecord careRecord) {
        if (detailRequest == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지출 상세 정보가 누락되었습니다.");
        }

        ExpenseDetail expenseDetail = ExpenseDetail.builder()
                .careRecord(careRecord)
                .categoryCode(detailRequest.categoryCode())
                .amount(detailRequest.amount())
                .memo(detailRequest.memo())
                .relatedMedicalRecordId(detailRequest.relatedMedicalRecordId())
                .build();

        expenseDetailRepository.save(expenseDetail);
    }
}
