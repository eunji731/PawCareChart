package com.pawcarechart.backend.dashboard.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "대시보드 통합 요약 정보 응답")
public class DashboardResponse {

    private Stats stats;
    private List<ActiveMedication> activeMedications;
    private List<SymptomRanking> topSymptoms;
    private List<UpcomingSchedule> upcomingSchedules;
    private List<RecentRecord> recentRecords;

    @Getter @Setter @Builder
    public static class Stats {
        @Schema(description = "총 지출 금액")
        private Long totalExpense;
        @Schema(description = "진료 횟수")
        private Long medicalCount;
        @Schema(description = "현재 복약 중인 처방 수")
        private Long activeMedicationCount;
        @Schema(description = "다가오는 일정 수")
        private Long upcomingScheduleCount;
    }

    @Getter @Setter @Builder
    public static class ActiveMedication {
        private String dogName;
        private String title;
        private LocalDate startDate;
        private LocalDate endDate;
        @Schema(description = "남은 복약 일수")
        private Integer remainingDays;
    }

    @Getter @Setter @Builder
    public static class SymptomRanking {
        private String name;
        private Long count;
    }

    @Getter @Setter @Builder
    public static class UpcomingSchedule {
        private Long id;
        private String title;
        private java.time.LocalDateTime scheduleDate;
        private String location;
        private Long dDay;
    }

    @Getter @Setter @Builder
    public static class RecentRecord {
        private Long id;
        private String type;
        private LocalDate date;
        private String title;
        private Long amount;
    }
}
