package com.pawcarechart.backend.care.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "통합 케어 기록 목록 응답")
public class CareRecordListResponse {
    @Schema(description = "기록 식별자")
    private Long id;

    @Schema(description = "강아지 식별자")
    private Long dogId;

    @Schema(description = "강아지 이름")
    private String dogName;

    @Schema(description = "강아지 프로필 이미지 URL")
    private String dogProfileImageUrl;

    @Schema(description = "기록 유형 ID")
    private Long recordTypeId;

    @Schema(description = "기록 유형명 (병원 기록, 지출 기록 등)")
    private String recordTypeName;

    @Schema(description = "기록 날짜")
    private LocalDate recordDate;

    @Schema(description = "제목")
    private String title;

    @Schema(description = "노트/메모")
    private String note;

    // 의료 관련 필드
    @Schema(description = "병원명")
    private String clinicName;

    @Schema(description = "진단명")
    private String diagnosis;

    @Schema(description = "투약 상태 (NONE, ACTIVE, COMPLETED)")
    private String medicationStatus;

    @Schema(description = "투약 시작일")
    private LocalDate medicationStartDate;

    @Schema(description = "투약 기간")
    private Integer medicationDays;


    // 공통/지출 관련 필드
    @Schema(description = "지출 카테고리 ID")
    private Long categoryId;

    @Schema(description = "지출 카테고리명")
    private String categoryName;

    @Schema(description = "금액")
    private Long amount;

    @Schema(description = "연동된 병원 기록 ID (지출 타입일 때 존재)")
    private Long relatedMedicalRecordId;

    @Schema(description = "첨부파일 개수")
    private Integer attachmentCount;
}
