package com.pawcarechart.backend.care.service;

import com.pawcarechart.backend.care.dto.CareRecordCreateRequest;
import com.pawcarechart.backend.care.dto.CareRecordDetailQueryResult;
import com.pawcarechart.backend.care.dto.CareRecordDetailResponse;
import com.pawcarechart.backend.care.dto.CareRecordListResponse;
import com.pawcarechart.backend.care.entity.CareRecord;
import com.pawcarechart.backend.care.entity.ExpenseDetail;
import com.pawcarechart.backend.care.entity.MedicalDetail;
import com.pawcarechart.backend.care.mapper.CareMapper;
import com.pawcarechart.backend.care.repository.*;
import com.pawcarechart.backend.code.entity.CommonCode;
import com.pawcarechart.backend.code.repository.CommonCodeRepository;
import com.pawcarechart.backend.dog.repository.DogRepository;
import com.pawcarechart.backend.file.constant.FileTargetType;
import com.pawcarechart.backend.file.dto.FileCountResponse;
import com.pawcarechart.backend.file.repository.FileMappingRepository;
import com.pawcarechart.backend.file.service.FileService;
import com.pawcarechart.backend.symptom.service.SymptomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CareService {

    private final CareRecordRepository careRecordRepository;
    private final MedicalDetailRepository medicalDetailRepository;
    private final ExpenseDetailRepository expenseDetailRepository;
    private final DogRepository dogRepository;
    private final FileService fileService;
    private final CareMapper careMapper;
    private final FileMappingRepository fileMappingRepository;
    private final SymptomService symptomService;
    private final com.pawcarechart.backend.schedule.repository.ScheduleRepository scheduleRepository;
    private final CommonCodeRepository commonCodeRepository;

    /**
     * 통합 케어 기록 목록 조회
     */
    public List<CareRecordListResponse> getCareRecords(
            Long userId, Long dogId, Long typeId, String keyword, LocalDate startDate, LocalDate endDate) {

        String searchKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        List<CareRecordListResponse> baseRecords = careMapper.selectCareRecordsByFilters(
                userId, dogId, typeId, searchKeyword, startDate, endDate
        );

        if (baseRecords.isEmpty()) {
            return baseRecords;
        }

        List<Long> recordIds = baseRecords.stream()
                .map(CareRecordListResponse::getId)
                .toList();

        // TODO: FileTargetType enum to ID mapping
        Long careRecordTargetId = getCodeId("FILE_TARGET_TYPE", "CARE_RECORD");
        List<FileCountResponse> fileCounts = fileMappingRepository.countFilesByTargetIds(careRecordTargetId, recordIds);

        Map<Long, Integer> fileCountMap = fileCounts.stream()
                .collect(Collectors.toMap(
                        FileCountResponse::getTargetId,
                        response -> response.getCount().intValue()
                ));

        return baseRecords.stream()
                .map(record -> CareRecordListResponse.builder()
                        .id(record.getId())
                        .dogId(record.getDogId())
                        .dogName(record.getDogName())
                        .dogProfileImageUrl(record.getDogProfileImageUrl())
                        .recordTypeId(record.getRecordTypeId())
                        .recordTypeName(record.getRecordTypeName())
                        .recordDate(record.getRecordDate())
                        .title(record.getTitle())
                        .note(record.getNote())
                        .clinicName(record.getClinicName())
                        .diagnosis(record.getDiagnosis())
                        .medicationStatus(record.getMedicationStatus())
                        .medicationStartDate(record.getMedicationStartDate())
                        .medicationDays(record.getMedicationDays())
                        .categoryId(record.getCategoryId())
                        .categoryName(record.getCategoryName())
                        .amount(record.getAmount())
                        .relatedMedicalRecordId(record.getRelatedMedicalRecordId())
                        .attachmentCount(fileCountMap.getOrDefault(record.getId(), 0))
                        .build()
                )
                .toList();
    }

    /**
     * 통합 케어 기록 상세 조회
     */
    public CareRecordDetailResponse getCareRecordDetail(Long recordId, Long userId) {
        CareRecordDetailQueryResult queryResult = careMapper.selectCareRecordDetail(recordId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 기록을 찾을 수 없거나 권한이 없습니다."));

        List<String> symptomTags = symptomService.getSymptomNamesByCareRecordId(recordId);
        
        Long careRecordTargetId = getCodeId("FILE_TARGET_TYPE", "CARE_RECORD");
        List<com.pawcarechart.backend.file.dto.FileResponse> attachments = fileService.getFiles(careRecordTargetId, recordId);

        CareRecordDetailResponse.CareRecordDetailResponseBuilder responseBuilder = CareRecordDetailResponse.builder()
                .id(queryResult.getId())
                .dogId(queryResult.getDogId())
                .dogName(queryResult.getDogName())
                .dogProfileImageUrl(queryResult.getDogProfileImageUrl())
                .recordTypeId(queryResult.getRecordTypeId())
                .recordTypeName(queryResult.getRecordTypeName())
                .recordDate(queryResult.getRecordDate())
                .title(queryResult.getTitle())
                .note(queryResult.getNote())
                .clinicName(queryResult.getClinicName())
                .symptoms(queryResult.getSymptoms())
                .symptomTags(symptomTags)
                .diagnosis(queryResult.getDiagnosis())
                .treatment(queryResult.getTreatment())
                .medicationStatus(queryResult.getMedicationStatus())
                .medicationStartDate(queryResult.getMedicationStartDate())
                .medicationDays(queryResult.getMedicationDays())
                .categoryId(queryResult.getCategoryId())
                .categoryName(queryResult.getCategoryName())
                .amount(queryResult.getAmount())
                .attachmentCount(attachments.size())
                .attachments(attachments);

        // 연관 병원 기록 정보가 있는 경우 조립
        if (queryResult.getRelatedMedicalId() != null) {
            responseBuilder.relatedMedicalRecord(CareRecordDetailResponse.RelatedMedicalRecordInfo.builder()
                    .id(queryResult.getRelatedMedicalId())
                    .title(queryResult.getRelatedMedicalTitle())
                    .recordDate(queryResult.getRelatedMedicalDate())
                    .clinicName(queryResult.getRelatedMedicalClinicName())
                    .build());
        }

        return responseBuilder.build();
    }

    /**
     * 지출 기록 연동을 위한 병원 기록 후보 목록 조회 (페이징 지원)
     */
    public List<com.pawcarechart.backend.care.dto.MedicalCandidateResponse> getMedicalCandidates(Long dogId, String keyword, Integer page, Integer size, Long userId) {
        // 권한 체크
        dogRepository.findByIdAndUserId(dogId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "반려견 권한이 없습니다."));

        // 기본값 설정
        int pageNum = (page == null || page < 0) ? 0 : page;
        int pageSize = (size == null || size <= 0) ? 20 : size;
        int offset = pageNum * pageSize;
        
        String searchKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        return careMapper.selectMedicalCandidates(dogId, searchKeyword, offset, pageSize);
    }

    /**
     * 통합 케어 기록 삭제
     */
    @Transactional
    public void deleteCareRecord(Long recordId, Long userId) {
        CareRecord careRecord = careRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 기록을 찾을 수 없습니다."));

        if (!careRecord.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제 권한이 없습니다.");
        }

        String recordTypeCode = careRecord.getRecordType().getCode();

        if ("MEDICAL".equals(recordTypeCode)) {
            medicalDetailRepository.deleteById(recordId);
            symptomService.deleteCareRecordSymptoms(recordId);
        } else {
            expenseDetailRepository.deleteById(recordId);
        }

        Long careRecordTargetId = getCodeId("FILE_TARGET_TYPE", "CARE_RECORD");
        fileService.deleteFilesByTarget(careRecordTargetId, recordId);
        careRecordRepository.delete(careRecord);
    }

    /**
     * 통합 케어 기록 수정
     */
    @Transactional
    public void updateCareRecord(Long recordId, CareRecordCreateRequest request, Long userId) {
        CareRecord careRecord = careRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 기록을 찾을 수 없습니다."));

        if (!careRecord.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다.");
        }

        String oldTypeCode = careRecord.getRecordType().getCode();
        String newTypeCode = getCodeValue(request.getRecordTypeId());

        if (oldTypeCode.equals(newTypeCode)) {
            if ("MEDICAL".equals(newTypeCode)) {
                updateMedicalDetail(recordId, request.getMedicalDetails());
                symptomService.syncCareRecordSymptoms(recordId, request.getDogId(), request.getMedicalDetails().getSymptomTags());
            } else {
                updateExpenseDetail(recordId, request.getExpenseDetails());
            }
        } else {
            if ("MEDICAL".equals(oldTypeCode)) {
                medicalDetailRepository.deleteById(recordId);
                symptomService.deleteCareRecordSymptoms(recordId);
                saveExpenseDetail(request.getExpenseDetails(), careRecord);
            } else {
                expenseDetailRepository.deleteById(recordId);
                saveMedicalDetail(request.getMedicalDetails(), careRecord);
                symptomService.processAndConnectSymptoms(recordId, request.getDogId(), request.getMedicalDetails().getSymptomTags());
            }
        }

        CommonCode recordType = commonCodeRepository.findById(request.getRecordTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 기록 유형 ID입니다."));

        careRecord.update(request.getDogId(), recordType, request.getRecordDate(), request.getTitle(), request.getNote());
        
        Long careRecordTargetId = getCodeId("FILE_TARGET_TYPE", "CARE_RECORD");
        fileService.syncFilesToTarget(request.getFileIds(), careRecordTargetId, recordId, userId);
    }

    private void updateMedicalDetail(Long recordId, CareRecordCreateRequest.MedicalDetailRequest detailRequest) {
        if (detailRequest == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "병원 상세 정보가 누락되었습니다.");
        }
        MedicalDetail medicalDetail = medicalDetailRepository.findById(recordId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "상세 정보를 찾을 수 없습니다."));

        medicalDetail.update(
                detailRequest.getClinicName(),
                detailRequest.getSymptoms(),
                detailRequest.getDiagnosis(),
                detailRequest.getTreatment(),
                detailRequest.getMedicationStartDate(),
                detailRequest.getMedicationDays(),
                detailRequest.getIsMedicationCompleted(),
                detailRequest.getAmount()
        );
    }

    private void updateExpenseDetail(Long recordId, CareRecordCreateRequest.ExpenseDetailRequest detailRequest) {
        if (detailRequest == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지출 상세 정보가 누락되었습니다.");
        }
        ExpenseDetail expenseDetail = expenseDetailRepository.findById(recordId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "상세 정보를 찾을 수 없습니다."));

        CommonCode category = commonCodeRepository.findById(detailRequest.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 카테고리 ID입니다."));

        expenseDetail.update(
                category,
                detailRequest.getAmount(),
                detailRequest.getMemo(),
                detailRequest.getRelatedMedicalRecordId()
        );
    }

    /**
     * 통합 케어 기록 등록
     */
    @Transactional
    public Long registerCareRecord(CareRecordCreateRequest request, Long userId) {
        dogRepository.findByIdAndUserId(request.getDogId(), userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "반려견 정보를 찾을 수 없거나 권한이 없습니다."));

        CommonCode recordType = commonCodeRepository.findById(request.getRecordTypeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 기록 유형 ID입니다."));

        CareRecord careRecord = CareRecord.builder()
                .dogId(request.getDogId())
                .userId(userId)
                .recordType(recordType)
                .recordDate(request.getRecordDate())
                .title(request.getTitle())
                .note(request.getNote())
                .build();

        CareRecord savedRecord = careRecordRepository.save(careRecord);
        Long recordId = savedRecord.getId();

        String recordTypeCode = recordType.getCode();

        if ("MEDICAL".equals(recordTypeCode)) {
            saveMedicalDetail(request.getMedicalDetails(), savedRecord);
            symptomService.processAndConnectSymptoms(recordId, request.getDogId(), request.getMedicalDetails().getSymptomTags());
        } else if ("EXPENSE".equals(recordTypeCode)) {
            saveExpenseDetail(request.getExpenseDetails(), savedRecord);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 기록 유형입니다.");
        }

        if (request.getFileIds() != null && !request.getFileIds().isEmpty()) {
            Long careRecordTargetId = getCodeId("FILE_TARGET_TYPE", "CARE_RECORD");
            fileService.connectFilesToTarget(request.getFileIds(), careRecordTargetId, recordId, userId);
        }

        // 일정 전환인 경우 이전 일정 삭제
        if (request.getSourceScheduleId() != null) {
            com.pawcarechart.backend.schedule.entity.Schedule schedule = scheduleRepository.findById(request.getSourceScheduleId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "이전 일정 정보를 찾을 수 없습니다."));

            // 일정 권한 확인 (일정이 속한 강아지의 소유주인지 확인)
            dogRepository.findByIdAndUserId(schedule.getDogId(), userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "이전 일정에 대한 권한이 없습니다."));

            // 일정 데이터 정리
            symptomService.deleteScheduleSymptoms(schedule.getId());
            
            Long scheduleTargetId = getCodeId("FILE_TARGET_TYPE", "SCHEDULE");
            fileMappingRepository.deleteAllByTargetType_IdAndTargetId(scheduleTargetId, schedule.getId());
            scheduleRepository.delete(schedule);
        }

        return recordId;
    }

    private void saveMedicalDetail(CareRecordCreateRequest.MedicalDetailRequest detailRequest, CareRecord careRecord) {
        if (detailRequest == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "병원 상세 정보가 누락되었습니다.");
        }

        MedicalDetail medicalDetail = MedicalDetail.builder()
                .careRecord(careRecord)
                .clinicName(detailRequest.getClinicName())
                .symptoms(detailRequest.getSymptoms())
                .diagnosis(detailRequest.getDiagnosis())
                .treatment(detailRequest.getTreatment())
                .medicationStartDate(detailRequest.getMedicationStartDate())
                .medicationDays(detailRequest.getMedicationDays())
                .isMedicationCompleted(detailRequest.getIsMedicationCompleted() != null && detailRequest.getIsMedicationCompleted())
                .amount(detailRequest.getAmount())
                .build();

        medicalDetailRepository.save(medicalDetail);
    }

    private void saveExpenseDetail(CareRecordCreateRequest.ExpenseDetailRequest detailRequest, CareRecord careRecord) {
        if (detailRequest == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지출 상세 정보가 누락되었습니다.");
        }

        CommonCode category = commonCodeRepository.findById(detailRequest.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 카테고리 ID입니다."));

        ExpenseDetail expenseDetail = ExpenseDetail.builder()
                .careRecord(careRecord)
                .category(category)
                .amount(detailRequest.getAmount())
                .memo(detailRequest.getMemo())
                .relatedMedicalRecordId(detailRequest.getRelatedMedicalRecordId())
                .build();

        expenseDetailRepository.save(expenseDetail);
    }

    private String getCodeValue(Long id) {
        return commonCodeRepository.findById(id)
                .map(CommonCode::getCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 코드 ID입니다."));
    }

    private Long getCodeId(String groupCode, String code) {
        return commonCodeRepository.findAllByGroupCodeAndUseYnOrderBySortOrderAsc(groupCode, "Y")
                .stream()
                .filter(c -> c.getCode().equals(code))
                .findFirst()
                .map(CommonCode::getId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "필요한 공통 코드가 정의되지 않았습니다: " + code));
    }
}

