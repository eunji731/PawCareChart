package com.pawcarechart.backend.schedule.service;

import com.pawcarechart.backend.care.dto.CareRecordCreateRequest;
import com.pawcarechart.backend.care.service.CareService;
import com.pawcarechart.backend.file.constant.FileTargetType;
import com.pawcarechart.backend.file.dto.FileCountResponse;
import com.pawcarechart.backend.file.repository.FileMappingRepository;
import com.pawcarechart.backend.file.service.FileService;
import com.pawcarechart.backend.symptom.service.SymptomService;
import com.pawcarechart.backend.dog.repository.DogRepository;
import com.pawcarechart.backend.schedule.dto.ScheduleRequest;
import com.pawcarechart.backend.schedule.dto.ScheduleResponse;
import com.pawcarechart.backend.schedule.entity.Schedule;
import com.pawcarechart.backend.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

    /**
     * 일정 목록 조회 (MyBatis)
     */
    public List<ScheduleResponse> getSchedules(Long userId, Long dogId, String type, String keyword, LocalDate startDate, LocalDate endDate) {
        List<ScheduleResponse> schedules = scheduleMapper.selectSchedules(userId, dogId, type, keyword, startDate, endDate);

        if (schedules.isEmpty()) return schedules;

        List<Long> scheduleIds = schedules.stream().map(ScheduleResponse::getId).toList();
        List<FileCountResponse> fileCounts = fileMappingRepository.countFilesByTargetIds(FileTargetType.SCHEDULE, scheduleIds);
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
        List<String> tags = symptomService.getSymptomNamesByScheduleId(id);
        List<com.pawcarechart.backend.file.dto.FileResponse> attachments = fileService.getFiles(FileTargetType.SCHEDULE, id);
        return ScheduleResponse.of(schedule, tags, attachments);
    }

    /**
     * 일정 등록
     */
    @Transactional
    public Long registerSchedule(ScheduleRequest request, Long userId) {
        // [강력 로깅] 어떤 상황에서도 찍히도록 System.out 사용
        System.out.println(">>> [DEBUG] registerSchedule START");
        System.out.println(">>> [DEBUG] fileIds from request: " + request.getFileIds());

        validateDogOwnership(request.getDogId(), userId);

        Schedule schedule = Schedule.builder()
                .dogId(request.getDogId())
                .title(request.getTitle())
                .scheduleDate(request.getScheduleDate())
                .scheduleTypeCode(request.getScheduleTypeCode())
                .memo(request.getMemo())
                .build();

        Schedule saved = scheduleRepository.save(schedule);
        symptomService.syncScheduleSymptoms(saved.getId(), request.getSymptomTags());

        List<Long> fileIds = request.getFileIds();
        if (fileIds != null && !fileIds.isEmpty()) {
            System.out.println(">>> [DEBUG] Calling connectFilesToTarget with " + fileIds.size() + " files");
            fileService.connectFilesToTarget(fileIds, FileTargetType.SCHEDULE, saved.getId(), userId);
        } else {
            System.out.println(">>> [DEBUG] fileIds is NULL or EMPTY. Skipping mapping.");
        }

        return saved.getId();
    }

    /**
     * 일정 수정
     */
    @Transactional
    public void updateSchedule(Long id, ScheduleRequest request, Long userId) {
        System.out.println(">>> [DEBUG] updateSchedule START. id: " + id);
        System.out.println(">>> [DEBUG] fileIds from request: " + request.getFileIds());

        Schedule schedule = findAndValidateSchedule(id, userId);
        validateDogOwnership(request.getDogId(), userId);

        schedule.update(request.getTitle(), request.getScheduleDate(), request.getScheduleTypeCode(), request.getMemo());
        symptomService.syncScheduleSymptoms(id, request.getSymptomTags());
        
        fileService.syncFilesToTarget(request.getFileIds(), FileTargetType.SCHEDULE, id, userId);
    }

    /**
     * 일정 삭제
     */
    @Transactional
    public void deleteSchedule(Long id, Long userId) {
        findAndValidateSchedule(id, userId);
        symptomService.deleteScheduleSymptoms(id);
        fileService.deleteFilesByTarget(FileTargetType.SCHEDULE, id);
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
        List<com.pawcarechart.backend.file.dto.FileResponse> attachments = fileService.getFiles(FileTargetType.SCHEDULE, id);
        List<Long> fileIds = attachments.stream().map(com.pawcarechart.backend.file.dto.FileResponse::getId).toList();
        
        CareRecordCreateRequest builder = CareRecordCreateRequest.builder()
                .dogId(schedule.getDogId())
                .recordDate(schedule.getScheduleDate().toLocalDate())
                .title(schedule.getTitle())
                .note(schedule.getMemo())
                .fileIds(fileIds)
                .build();

        if ("MEDICAL".equals(schedule.getScheduleTypeCode())) {
            builder.setRecordTypeCode("MEDICAL");
            builder.setMedicalDetails(CareRecordCreateRequest.MedicalDetailRequest.builder()
                    .clinicName("일정 기반 등록")
                    .symptomTags(tags)
                    .build());
        } else {
            builder.setRecordTypeCode("MEDICAL");
            builder.setMedicalDetails(CareRecordCreateRequest.MedicalDetailRequest.builder()
                    .clinicName("일정 기반 등록")
                    .symptoms(schedule.getMemo())
                    .symptomTags(tags)
                    .build());
        }

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
}
