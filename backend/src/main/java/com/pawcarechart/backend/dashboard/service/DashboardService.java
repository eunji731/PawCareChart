package com.pawcarechart.backend.dashboard.service;

import com.pawcarechart.backend.dashboard.dto.DashboardResponse;
import com.pawcarechart.backend.dashboard.dto.HealthLogDto;
import com.pawcarechart.backend.dashboard.entity.HealthLog;
import com.pawcarechart.backend.dashboard.mapper.DashboardMapper;
import com.pawcarechart.backend.dashboard.repository.HealthLogRepository;
import com.pawcarechart.backend.dog.repository.DogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final DashboardMapper dashboardMapper;
    private final HealthLogRepository healthLogRepository;
    private final DogRepository dogRepository;

    public DashboardResponse getDashboardSummary(Long userId, Long dogId, LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();

        return DashboardResponse.builder()
                .stats(dashboardMapper.selectStats(userId, dogId, startDate, endDate, today))
                .activeMedications(dashboardMapper.selectActiveMedications(userId, dogId, startDate, endDate, today))
                .topSymptoms(dashboardMapper.selectTopSymptoms(userId, dogId, startDate, endDate))
                .upcomingSchedules(dashboardMapper.selectUpcomingSchedules(userId, dogId, startDate, endDate, today))
                .recentRecords(dashboardMapper.selectRecentRecords(userId, dogId, startDate, endDate))
                .build();
    }

    @Transactional
    public Long createHealthLog(HealthLogDto.Request request, Long userId) {
        // 반려견 권한 확인
        dogRepository.findByIdAndUserId(request.getDogId(), userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "반려견 권한이 없습니다."));

        HealthLog healthLog = HealthLog.builder()
                .dogId(request.getDogId())
                .content(request.getContent())
                .build();

        return healthLogRepository.save(healthLog).getId();
    }

    public List<HealthLogDto.Response> getHealthLogs(Long dogId, LocalDate startDate, LocalDate endDate, Long userId) {
        // 반려견 권한 확인
        dogRepository.findByIdAndUserId(dogId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "반려견 권한이 없습니다."));

        List<HealthLog> logs;
        if (startDate != null && endDate != null) {
            logs = healthLogRepository.findAllByDogIdAndLogDateBetweenOrderByCreatedAtDesc(dogId, startDate, endDate);
        } else {
            logs = healthLogRepository.findAllByDogIdOrderByCreatedAtDesc(dogId);
        }

        return logs.stream()
                .map(HealthLogDto.Response::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteHealthLog(Long id, Long userId) {
        HealthLog healthLog = healthLogRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 메모를 찾을 수 없습니다."));

        // 반려견 권한 확인을 통해 소유권 검증
        dogRepository.findByIdAndUserId(healthLog.getDogId(), userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "삭제 권한이 없습니다."));

        healthLogRepository.delete(healthLog);
    }
}
