package com.pawcarechart.backend.care.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(description = "통합 케어 기록 검색 요청")
public record CareRecordSearchRequest(
    @Schema(description = "사용자 식별자 (필수, 서비스 내부 주입)")
    Long userId,

    @Schema(description = "반려견 식별자 (선택)")
    Long dogId,

    @Schema(description = "기록 유형 (ALL, MEDICAL, EXPENSE)")
    String type,

    @Schema(description = "검색어 (제목, 병원명, 진단명)")
    String keyword,

    @Schema(description = "조회 시작일")
    LocalDate startDate,

    @Schema(description = "조회 종료일")
    LocalDate endDate
) {
}
