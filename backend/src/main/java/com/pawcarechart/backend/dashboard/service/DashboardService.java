package com.pawcarechart.backend.dashboard.service;

import com.pawcarechart.backend.dashboard.dto.DashboardChartResponse;
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
import java.util.ArrayList;
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

    /**
     * 탭 1: 지출 분석 (도넛 차트 및 카테고리 요약)
     */
    public DashboardChartResponse.ExpenseAnalysis getExpenseAnalysis(Long userId, Long dogId, LocalDate startDate, LocalDate endDate) {
        // 1. 병원비 합계 조회
        Long medicalAmount = dashboardMapper.selectMedicalTotalAmount(userId, dogId, startDate, endDate);
        
        // 2. 지출 카테고리별 합계 조회
        List<DashboardChartResponse.CategorySummary> expenseCategories = dashboardMapper.selectCategorySummaries(userId, dogId, startDate, endDate);
        
        // 3. 병원비를 하나의 카테고리로 추가하여 통합 리스트 생성
        List<DashboardChartResponse.CategorySummary> allCategories = new ArrayList<>();
        if (medicalAmount > 0) {
            allCategories.add(DashboardChartResponse.CategorySummary.builder()
                    .categoryCode("MEDICAL")
                    .categoryName("병원진료")
                    .amount(medicalAmount)
                    .build());
        }
        allCategories.addAll(expenseCategories);

        // 4. 전체 합계 계산 및 비율(Percentage) 산출
        long totalAmount = allCategories.stream().mapToLong(DashboardChartResponse.CategorySummary::getAmount).sum();
        long otherAmount = expenseCategories.stream().mapToLong(DashboardChartResponse.CategorySummary::getAmount).sum();

        if (totalAmount > 0) {
            for (DashboardChartResponse.CategorySummary cat : allCategories) {
                double pct = (double) cat.getAmount() / totalAmount * 100;
                cat.setPercentage(Math.round(pct * 10.0) / 10.0); // 소수점 첫째자리 반올림
            }
        }

        return DashboardChartResponse.ExpenseAnalysis.builder()
                .totalAmount(totalAmount)
                .medicalAmount(medicalAmount)
                .otherAmount(otherAmount)
                .categories(allCategories)
                .build();
    }

    /**
     * 탭 2: 6개월 추이 (월별 시계열)
     */
    public List<DashboardChartResponse.MonthlyTrend> getMonthlyTrends(Long userId, Long dogId, LocalDate startDate, LocalDate endDate) {
        return dashboardMapper.selectMonthlyTrends(userId, dogId, startDate, endDate);
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
