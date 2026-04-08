package com.pawcarechart.backend.schedule.service;

import com.pawcarechart.backend.care.dto.CareRecordCreateRequest;
import com.pawcarechart.backend.care.service.CareService;
import com.pawcarechart.backend.code.entity.CommonCode;
import com.pawcarechart.backend.code.repository.CommonCodeRepository;
import com.pawcarechart.backend.dog.repository.DogRepository;
import com.pawcarechart.backend.file.dto.FileCountResponse;
import com.pawcarechart.backend.file.repository.FileMappingRepository;
import com.pawcarechart.backend.file.service.FileService;
import com.pawcarechart.backend.schedule.dto.ScheduleRequest;
import com.pawcarechart.backend.schedule.dto.ScheduleResponse;
import com.pawcarechart.backend.schedule.entity.Schedule;
import com.pawcarechart.backend.schedule.repository.ScheduleRepository;
import com.pawcarechart.backend.symptom.service.SymptomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DogRepository dogRepository;
    private final SymptomService symptomService;
    private final CareService careService;
    private final FileService fileService;
    private final FileMappingRepository fileMappingRepository;
    private final com.pawcarechart.backend.schedule.mapper.ScheduleMapper scheduleMapper;
    private final CommonCodeRepository commonCodeRepository;

    /**
     * 일정 목록 조회 (MyBatis)
     */
    public List<ScheduleResponse> getSchedules(Long userId, Long dogId, Long typeId, String keyword, LocalDate startDate, LocalDate endDate) {
        List<ScheduleResponse> schedules = scheduleMapper.selectSchedules(userId, dogId, typeId, keyword, startDate, endDate);

        if (schedules.isEmpty()) return schedules;

        List<Long> scheduleIds = schedules.stream().map(ScheduleResponse::getId).toList();
        Long scheduleTargetId = getCodeId("FILE_TARGET_TYPE", "SCHEDULE");
        List<FileCountResponse> fileCounts = fileMappingRepository.countFilesByTargetIds(scheduleTargetId, scheduleIds);
        Map<Long, Integer> fileCountMap = fileCounts.stream()
                .collect(Collectors.toMap(FileCountResponse::getTargetId, f -> f.getCount().intValue()));

        LocalDate today = LocalDate.now();
        schedules.forEach(s -> {
            if (s.getScheduleDate() != null) {
                s.setDDay(java.time.temporal.ChronoUnit.DAYS.between(today, s.getScheduleDate().toLocalDate()));
            }
            s.setAttachmentCount(fileCountMap.getOrDefault(s.getId(), 0));
        });

        return schedules;
    }

    /**
     * 일정 상세 조회
     */
    public ScheduleResponse getScheduleDetail(Long id, Long userId) {
        Schedule schedule = findAndValidateSchedule(id, userId);
        
        com.pawcarechart.backend.dog.entity.Dog dog = dogRepository.findById(schedule.getDogId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "반려견 정보를 찾을 수 없습니다."));

        List<String> tags = symptomService.getSymptomNamesByScheduleId(id);
        
        Long scheduleTargetId = getCodeId("FILE_TARGET_TYPE", "SCHEDULE");
        List<com.pawcarechart.backend.file.dto.FileResponse> attachments = fileService.getFiles(scheduleTargetId, id);
        return ScheduleResponse.of(schedule, dog.getName(), dog.getProfileImageUrl(), tags, attachments);
    }

    /**
     * 일정 등록
     */
    @Transactional
    public Long registerSchedule(ScheduleRequest request, Long userId) {
        validateDogOwnership(request.getDogId(), userId);

        CommonCode scheduleType = null;
        if (request.getScheduleTypeId() != null) {
            scheduleType = commonCodeRepository.findById(request.getScheduleTypeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 일정 유형 ID입니다."));
        }

        Schedule schedule = Schedule.builder()
                .dogId(request.getDogId())
                .title(request.getTitle())
                .scheduleDate(request.getScheduleDate())
                .scheduleType(scheduleType)
                .memo(request.getMemo())
                .location(request.getLocation())
                .build();

        Schedule saved = scheduleRepository.save(schedule);
        symptomService.syncScheduleSymptoms(saved.getId(), request.getSymptomTags());

        List<Long> fileIds = request.getFileIds();
        if (fileIds != null && !fileIds.isEmpty()) {
            Long scheduleTargetId = getCodeId("FILE_TARGET_TYPE", "SCHEDULE");
            fileService.connectFilesToTarget(fileIds, scheduleTargetId, saved.getId(), userId);
        }

        return saved.getId();
    }

    /**
     * 일정 수정
     */
    @Transactional
    public void updateSchedule(Long id, ScheduleRequest request, Long userId) {
        Schedule schedule = findAndValidateSchedule(id, userId);
        validateDogOwnership(request.getDogId(), userId);

        CommonCode scheduleType = null;
        if (request.getScheduleTypeId() != null) {
            scheduleType = commonCodeRepository.findById(request.getScheduleTypeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 일정 유형 ID입니다."));
        }

        schedule.update(request.getTitle(), request.getScheduleDate(), scheduleType, request.getMemo(), request.getLocation());
        symptomService.syncScheduleSymptoms(id, request.getSymptomTags());
        
        Long scheduleTargetId = getCodeId("FILE_TARGET_TYPE", "SCHEDULE");
        fileService.syncFilesToTarget(request.getFileIds(), scheduleTargetId, id, userId);
    }

    /**
     * 일정 삭제
     */
    @Transactional
    public void deleteSchedule(Long id, Long userId) {
        findAndValidateSchedule(id, userId);
        symptomService.deleteScheduleSymptoms(id);
        
        Long scheduleTargetId = getCodeId("FILE_TARGET_TYPE", "SCHEDULE");
        fileService.deleteFilesByTarget(scheduleTargetId, id);
        scheduleRepository.deleteById(id);
    }

    /**
     * 완료 상태 토글
     */
    @Transactional
    public void toggleCompletion(Long id, boolean isCompleted, Long userId) {
        Schedule schedule = findAndValidateSchedule(id, userId);
        schedule.toggleCompletion(isCompleted);
    }

    /**
     * 일정 -> 케어기록 전환
     */
    @Transactional
    public Long convertToCareRecord(Long id, Long userId) {
        Schedule schedule = findAndValidateSchedule(id, userId);
        schedule.toggleCompletion(true);

        List<String> tags = symptomService.getSymptomNamesByScheduleId(id);
        Long scheduleTargetId = getCodeId("FILE_TARGET_TYPE", "SCHEDULE");
        List<com.pawcarechart.backend.file.dto.FileResponse> attachments = fileService.getFiles(scheduleTargetId, id);
        List<Long> fileIds = attachments.stream().map(com.pawcarechart.backend.file.dto.FileResponse::getId).toList();
        
        Long medicalRecordTypeId = getCodeId("RECORD_TYPE", "MEDICAL");

        CareRecordCreateRequest builder = CareRecordCreateRequest.builder()
                .dogId(schedule.getDogId())
                .recordTypeId(medicalRecordTypeId)
                .recordDate(schedule.getScheduleDate().toLocalDate())
                .title(schedule.getTitle())
                .note(schedule.getMemo())
                .fileIds(fileIds)
                .medicalDetails(CareRecordCreateRequest.MedicalDetailRequest.builder()
                        .clinicName(schedule.getLocation() != null ? schedule.getLocation() : "일정 기반 등록")
                        .symptoms(schedule.getMemo())
                        .symptomTags(tags)
                        .build())
                .build();

        return careService.registerCareRecord(builder, userId);
    }

    private Schedule findAndValidateSchedule(Long id, Long userId) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "일정을 찾을 수 없습니다."));
        validateDogOwnership(schedule.getDogId(), userId);
        return schedule;
    }

    private void validateDogOwnership(Long dogId, Long userId) {
        dogRepository.findByIdAndUserId(dogId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "반려견 권한이 없습니다."));
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
