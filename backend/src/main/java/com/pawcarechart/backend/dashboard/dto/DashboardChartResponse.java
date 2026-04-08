package com.pawcarechart.backend.dashboard.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.util.List;

public class DashboardChartResponse {

    @Getter @Setter @Builder
    @Schema(description = "지출 항목별 분석 (도넛 차트용)")
    public static class ExpenseAnalysis {
        private Long totalAmount;
        private Long medicalAmount;
        private Long otherAmount;
        private List<CategorySummary> categories;
    }

    @Getter @Setter @Builder
    public static class CategorySummary {
        private String categoryCode;
        private String categoryName;
        private Long amount;
        private Double percentage;
    }

    @Getter @Setter @Builder
    @Schema(description = "월별 지출 추이 (시계열 차트용)")
    public static class MonthlyTrend {
        private String month; // YYYY-MM
        private Long totalAmount;
        private Long medicalAmount;
        private Long otherAmount;
    }
}
