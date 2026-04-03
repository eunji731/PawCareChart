package com.pawcarechart.backend.dashboard.mapper;

import com.pawcarechart.backend.dashboard.dto.DashboardResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface DashboardMapper {

    // 1. 핵심 지표
    DashboardResponse.Stats selectStats(
            @Param("userId") Long userId,
            @Param("dogId") Long dogId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("today") LocalDate today
    );

    // 2. 진행 중인 복약 (최대 3개)
    List<DashboardResponse.ActiveMedication> selectActiveMedications(
            @Param("userId") Long userId,
            @Param("dogId") Long dogId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("today") LocalDate today
    );

    // 3. 증상 랭킹 (Top 5)
    List<DashboardResponse.SymptomRanking> selectTopSymptoms(
            @Param("userId") Long userId,
            @Param("dogId") Long dogId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // 4. 다가오는 일정 (3~5개)
    List<DashboardResponse.UpcomingSchedule> selectUpcomingSchedules(
            @Param("userId") Long userId,
            @Param("dogId") Long dogId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("today") LocalDate today
    );

    // 5. 최근 활동 (전체 조회)
    List<DashboardResponse.RecentRecord> selectRecentRecords(
            @Param("userId") Long userId,
            @Param("dogId") Long dogId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
