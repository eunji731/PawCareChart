package com.pawcarechart.backend.schedule.service;

import com.pawcarechart.backend.care.dto.CareRecordCreateRequest;
import com.pawcarechart.backend.care.service.CareService;
import com.pawcarechart.backend.symptom.service.SymptomService;
import com.pawcarechart.backend.dog.repository.DogRepository;
import com.pawcarechart.backend.schedule.dto.ScheduleRequest;
import com.pawcarechart.backend.schedule.dto.ScheduleResponse;
import com.pawcarechart.backend.schedule.entity.Schedule;
import com.pawcarechart.backend.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final DogRepository dogRepository;
    private final SymptomService symptomService;
    private final CareService careService;
    private final com.pawcarechart.backend.schedule.mapper.ScheduleMapper scheduleMapper;

    /**
     * 일정 목록 조회 (MyBatis)
     */
    public List<ScheduleResponse> getSchedules(Long userId, Long dogId, String type, String keyword, LocalDate startDate, LocalDate endDate) {
        // MyBatis 매퍼 호출
        List<ScheduleResponse> schedules = scheduleMapper.selectSchedules(userId, dogId, type, keyword, startDate, endDate);

        // 추가 데이터 (D-Day, 증상 태그) 보완
        LocalDate today = LocalDate.now();
        schedules.forEach(s -> {
            // D-Day 계산
            if (s.getScheduleDate() != null) {
                s.setDDay(java.time.temporal.ChronoUnit.DAYS.between(today, s.getScheduleDate().toLocalDate()));
            }
            // 목록에서도 증상 태그가 필요하다면 여기서 추가 조회 (필요 시)
            // s.setSymptomTags(symptomService.getSymptomNamesByScheduleId(s.getId()));
        });

        return schedules;
    }

    /**
     * 일정 상세 조회
     */
    public ScheduleResponse getScheduleDetail(Long id, Long userId) {
        Schedule schedule = findAndValidateSchedule(id, userId);
        List<String> tags = symptomService.getSymptomNamesByScheduleId(id);
        return ScheduleResponse.of(schedule, tags);
    }

    /**
     * 일정 등록
     */
    @Transactional
    public Long registerSchedule(ScheduleRequest request, Long userId) {
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

        return saved.getId();
    }

    /**
     * 일정 수정
     */
    @Transactional
    public void updateSchedule(Long id, ScheduleRequest request, Long userId) {
        Schedule schedule = findAndValidateSchedule(id, userId);
        validateDogOwnership(request.getDogId(), userId);

        schedule.update(request.getTitle(), request.getScheduleDate(), request.getScheduleTypeCode(), request.getMemo());
        symptomService.syncScheduleSymptoms(id, request.getSymptomTags());
    }

    /**
     * 일정 삭제
     */
    @Transactional
    public void deleteSchedule(Long id, Long userId) {
        findAndValidateSchedule(id, userId);
        symptomService.deleteScheduleSymptoms(id);
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
        
        // 1. 완료 처리
        schedule.toggleCompletion(true);

        // 2. 케어기록 데이터 구성
        List<String> tags = symptomService.getSymptomNamesByScheduleId(id);
        
        CareRecordCreateRequest.CareRecordCreateRequestBuilder builder = CareRecordCreateRequest.builder()
                .dogId(schedule.getDogId())
                .recordDate(schedule.getScheduleDate().toLocalDate())
                .title(schedule.getTitle())
                .note(schedule.getMemo());

        if ("MEDICAL".equals(schedule.getScheduleTypeCode())) {
            builder.recordTypeCode("MEDICAL");
            builder.medicalDetails(CareRecordCreateRequest.MedicalDetailRequest.builder()
                    .clinicName("일정 기반 등록")
                    .symptomTags(tags)
                    .build());
        } else {
            // 그 외 타입은 일단 지출이 아닌 일반 기록(향후 MEMO 등)으로 처리하거나 
            // 기본 MEDICAL로 처리 (현재 프로젝트 정책에 따라 조정 가능)
            builder.recordTypeCode("MEDICAL");
            builder.medicalDetails(CareRecordCreateRequest.MedicalDetailRequest.builder()
                    .clinicName("일정 기반 등록")
                    .symptoms(schedule.getMemo())
                    .symptomTags(tags)
                    .build());
        }

        // 3. 케어기록 등록
        return careService.registerCareRecord(builder.build(), userId);
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
