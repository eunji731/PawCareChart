package com.pawcarechart.backend.care.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "통합 케어 기록 검색 요청")
public class CareRecordSearchRequest {
    @Schema(description = "사용자 식별자 (필수, 서비스 내부 주입)")
    private Long userId;

    @Schema(description = "반려견 식별자 (선택)")
    private Long dogId;

    @Schema(description = "기록 유형 (ALL, MEDICAL, EXPENSE)")
    private String type;

    @Schema(description = "검색어 (제목, 병원명, 진단명)")
    private String keyword;

    @Schema(description = "조회 시작일")
    private LocalDate startDate;

    @Schema(description = "조회 종료일")
    private LocalDate endDate;
}
