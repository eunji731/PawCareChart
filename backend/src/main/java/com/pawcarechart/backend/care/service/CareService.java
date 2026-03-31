package com.pawcarechart.backend.care.service;

import com.pawcarechart.backend.care.dto.CareRecordCreateRequest;
import com.pawcarechart.backend.care.dto.CareRecordDetailQueryResult;
import com.pawcarechart.backend.care.dto.CareRecordDetailResponse;
import com.pawcarechart.backend.care.dto.CareRecordListResponse;
import com.pawcarechart.backend.care.entity.CareRecord;
import com.pawcarechart.backend.care.entity.ExpenseDetail;
import com.pawcarechart.backend.care.entity.MedicalDetail;
import com.pawcarechart.backend.care.mapper.CareMapper;
import com.pawcarechart.backend.care.repository.CareRecordRepository;
import com.pawcarechart.backend.care.repository.ExpenseDetailRepository;
import com.pawcarechart.backend.care.repository.MedicalDetailRepository;
import com.pawcarechart.backend.dog.repository.DogRepository;
import com.pawcarechart.backend.file.constant.FileTargetType;
import com.pawcarechart.backend.file.dto.FileCountResponse;
import com.pawcarechart.backend.file.repository.FileMappingRepository;
import com.pawcarechart.backend.file.service.FileService;
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

    /**
     * 통합 케어 기록 목록 조회
     */
    public List<CareRecordListResponse> getCareRecords(
            Long userId, Long dogId, String type, String keyword, LocalDate startDate, LocalDate endDate) {

        String recordType = (type == null || "ALL".equalsIgnoreCase(type) || type.isBlank()) ? null : type.toUpperCase();
        String searchKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        // 1. 기본 기록 정보 목록 조회 (이 시점에는 attachmentCount가 비어있거나 0이라고 가정)
        List<CareRecordListResponse> baseRecords = careMapper.selectCareRecordsByFilters(
                userId, dogId, recordType, searchKeyword, startDate, endDate
        );

        // 조회된 결과가 없다면 바로 반환
        if (baseRecords.isEmpty()) {
            return baseRecords;
        }

        // 2. 조회된 기록들의 ID(targetId) 목록 추출
        List<Long> recordIds = baseRecords.stream()
                .map(CareRecordListResponse::id)
                .toList();

        // 3. 기록 ID 목록으로 파일 개수 일괄 조회 (In 쿼리 사용)
        // (주의: fileMapper 또는 fileRepository에 해당 메서드가 구현되어 있어야 합니다)
        List<FileCountResponse> fileCounts = fileMappingRepository.countFilesByTargetIds(FileTargetType.CARE_RECORD,recordIds);

        // 4. 매핑을 쉽게 하기 위해 Map으로 변환 (Key: targetId, Value: count)
        Map<Long, Integer> fileCountMap = fileCounts.stream()
                .collect(Collectors.toMap(
                        FileCountResponse::targetId,
                        response -> response.count().intValue() // Long 타입의 count를 Integer로 변환
                ));

        // 5. 기본 기록 정보와 파일 개수를 조합하여 새로운 Record 생성 후 반환
        return baseRecords.stream()
                .map(record -> new CareRecordListResponse(
                        record.id(),
                        record.dogId(),
                        record.dogName(),
                        record.dogProfileImageUrl(),
                        record.recordType(),
                        record.recordDate(),
                        record.title(),
                        record.note(),
                        record.clinicName(),
                        record.diagnosis(),
                        record.medicationStatus(),
                        record.categoryCode(),
                        record.amount(),
                        fileCountMap.getOrDefault(record.id(), 0) // 매칭되는 개수가 없으면 기본값 0
                ))
                .toList();
    }

    /**
     * 통합 케어 기록 상세 조회
     */
    public CareRecordDetailResponse getCareRecordDetail(Long recordId, Long userId) {
        // 1. MyBatis로 기본 상세 정보 조회 (SQL 결과 전용 DTO인 QueryResult로 수신)
        // SQL 결과와 Java Record 생성자 파라미터를 1:1로 맞추기 위해 분리했습니다.
        CareRecordDetailQueryResult queryResult = careMapper.selectCareRecordDetail(recordId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 기록을 찾을 수 없거나 권한이 없습니다."));

        // 2. 첨부파일 목록 별도 조회 (기존의 분리 조회 방식 유지)
        List<com.pawcarechart.backend.file.dto.FileResponse> attachments = fileService.getFiles(FileTargetType.CARE_RECORD, recordId);

        // 3. 최종 응답 DTO(CareRecordDetailResponse) 조립
        // attachmentCount는 실제 조회된 파일 목록의 사이즈를 사용합니다.
        return new CareRecordDetailResponse(
                queryResult.id(),
                queryResult.dogId(),
                queryResult.dogName(),
                queryResult.dogProfileImageUrl(),
                queryResult.recordType(),
                queryResult.recordDate(),
                queryResult.title(),
                queryResult.note(),
                queryResult.clinicName(),
                queryResult.symptoms(),
                queryResult.diagnosis(),
                queryResult.treatment(),
                queryResult.medicationStatus(),
                queryResult.medicationStartDate(),
                queryResult.medicationDays(),
                queryResult.categoryCode(),
                queryResult.amount(),
                attachments.size(),
                attachments
        );
    }

    /**
     * 통합 케어 기록 삭제
     */
    @Transactional
    public void deleteCareRecord(Long recordId, Long userId) {
        // 1. 기존 기록 조회 및 권한 체크
        CareRecord careRecord = careRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 기록을 찾을 수 없습니다."));

        if (!careRecord.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제 권한이 없습니다.");
        }

        // 2. 상세 정보 삭제
        if ("MEDICAL".equals(careRecord.getRecordTypeCode())) {
            medicalDetailRepository.deleteById(recordId);
        } else {
            expenseDetailRepository.deleteById(recordId);
        }

        // 3. 첨부파일 삭제 (물리 파일 포함)
        fileService.deleteFilesByTarget(FileTargetType.CARE_RECORD, recordId);

        // 4. 기본 기록 삭제
        careRecordRepository.delete(careRecord);
    }

    /**
     * 통합 케어 기록 수정
     */
    @Transactional
    public void updateCareRecord(Long recordId, CareRecordCreateRequest request, Long userId) {
        // 1. 기존 기록 조회 및 권한 체크
        CareRecord careRecord = careRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 기록을 찾을 수 없습니다."));

        if (!careRecord.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다.");
        }

        // 2. 기본 정보 업데이트 (CareRecord)
        // 기존 필드들을 업데이트하기 위해 엔티티 내부에서 update 메서드를 제공하거나 여기서 직접 setter/field access를 할 수 있습니다.
        // 여기서는 기존 필드들을 직접 빌더 패턴이 아닌 방식으로 업데이트하거나 새로 생성하는 방식 대신, 
        // 기존 엔티티의 필드를 업데이트하는 방향으로 진행합니다. (엔티티에 @Setter가 없으므로 필드 업데이트를 위해 리플렉션이나 별도 메서드가 필요할 수 있으나,
        // 여기서는 기존 구조를 유지하며 엔티티를 수정하기 위해 CareRecord 클래스에 업데이트 메서드가 있는지 확인하거나 새로 정의해야 할 수 있습니다.)
        // 일단은 필드가 private final이 아니므로 직접 접근이 가능하다고 가정하거나(하지만 @Getter만 있음), 
        // CareRecord에 업데이트 메서드를 추가하는 것이 정석입니다.
        
        // 일단 엔티티 수정은 잠시 미루고 서비스 로직 흐름부터 잡습니다.
        // record_type_code가 변경되는지 확인
        String oldTypeCode = careRecord.getRecordTypeCode();
        String newTypeCode = request.recordTypeCode();

        // 3. 상세 정보 업데이트
        if (oldTypeCode.equals(newTypeCode)) {
            // 동일한 유형인 경우 기존 상세 정보 업데이트
            if ("MEDICAL".equals(newTypeCode)) {
                updateMedicalDetail(recordId, request.medicalDetails());
            } else {
                updateExpenseDetail(recordId, request.expenseDetails());
            }
        } else {
            // 유형이 변경된 경우: 기존 상세 삭제 후 신규 상세 생성
            if ("MEDICAL".equals(oldTypeCode)) {
                medicalDetailRepository.deleteById(recordId);
                saveExpenseDetail(request.expenseDetails(), careRecord);
            } else {
                expenseDetailRepository.deleteById(recordId);
                saveMedicalDetail(request.medicalDetails(), careRecord);
            }
        }

        // 4. CareRecord 필드 업데이트
        careRecord.update(request.dogId(), newTypeCode, request.recordDate(), request.title(), request.note());
        
        // 5. 파일 연결 업데이트
        fileService.syncFilesToTarget(request.fileIds(), FileTargetType.CARE_RECORD, recordId, userId);
    }

    private void updateMedicalDetail(Long recordId, CareRecordCreateRequest.MedicalDetailRequest detailRequest) {
        if (detailRequest == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "병원 상세 정보가 누락되었습니다.");
        }
        MedicalDetail medicalDetail = medicalDetailRepository.findById(recordId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "상세 정보를 찾을 수 없습니다."));

        medicalDetail.update(
                detailRequest.clinicName(),
                detailRequest.symptoms(),
                detailRequest.diagnosis(),
                detailRequest.treatment(),
                detailRequest.medicationStartDate(),
                detailRequest.medicationDays(),
                detailRequest.isMedicationCompleted(),
                detailRequest.amount()
        );
    }

    private void updateExpenseDetail(Long recordId, CareRecordCreateRequest.ExpenseDetailRequest detailRequest) {
        if (detailRequest == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지출 상세 정보가 누락되었습니다.");
        }
        ExpenseDetail expenseDetail = expenseDetailRepository.findById(recordId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "상세 정보를 찾을 수 없습니다."));

        expenseDetail.update(
                detailRequest.categoryCode(),
                detailRequest.amount(),
                detailRequest.memo(),
                detailRequest.relatedMedicalRecordId()
        );
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
