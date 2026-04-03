package com.pawcarechart.backend.dashboard.service;

import com.pawcarechart.backend.dashboard.dto.DashboardResponse;
import com.pawcarechart.backend.dashboard.mapper.DashboardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final DashboardMapper dashboardMapper;

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
}
