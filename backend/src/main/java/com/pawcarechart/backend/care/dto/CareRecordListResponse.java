package com.pawcarechart.backend.care.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(description = "통합 케어 기록 목록 응답")
public record CareRecordListResponse(
    @Schema(description = "기록 식별자")
    Long id,

    @Schema(description = "기록 유형 (MEDICAL, EXPENSE)")
    String recordType,

    @Schema(description = "기록 날짜")
    LocalDate recordDate,

    @Schema(description = "제목")
    String title,

    // 의료 관련 필드
    @Schema(description = "병원명")
    String clinicName,

    @Schema(description = "진단명")
    String diagnosis,

    // 지출 관련 필드
    @Schema(description = "지출 카테고리")
    String categoryCode,

    @Schema(description = "금액")
    Long amount
) {
}
