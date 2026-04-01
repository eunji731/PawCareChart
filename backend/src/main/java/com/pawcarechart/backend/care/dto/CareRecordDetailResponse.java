package com.pawcarechart.backend.care.dto;

import com.pawcarechart.backend.file.dto.FileResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "통합 케어 기록 상세 응답")
public class CareRecordDetailResponse {
    @Schema(description = "기록 식별자")
    private Long id;

    @Schema(description = "강아지 식별자")
    private Long dogId;

    @Schema(description = "강아지 이름")
    private String dogName;

    @Schema(description = "강아지 프로필 이미지 URL")
    private String dogProfileImageUrl;

    @Schema(description = "기록 유형 (MEDICAL, EXPENSE)")
    private String recordType;

    @Schema(description = "기록 날짜")
    private LocalDate recordDate;

    @Schema(description = "제목")
    private String title;

    @Schema(description = "노트/메모")
    private String note;

    // 의료 관련 필드
    @Schema(description = "병원명")
    private String clinicName;

    @Schema(description = "증상")
    private String symptoms;

    @Schema(description = "증상 태그 목록")
    private List<String> symptomTags;

    @Schema(description = "진단명")
    private String diagnosis;

    @Schema(description = "처방/처치 내용")
    private String treatment;

    @Schema(description = "투약 상태 (NONE, ACTIVE, COMPLETED)")
    private String medicationStatus;

    @Schema(description = "투약 시작일")
    private LocalDate medicationStartDate;

    @Schema(description = "투약 일수")
    private Integer medicationDays;

    // 지출 관련 필드
    @Schema(description = "지출 카테고리")
    private String categoryCode;

    @Schema(description = "금액")
    private Long amount;

    @Schema(description = "첨부파일 개수")
    private Integer attachmentCount;

    @Schema(description = "첨부파일 목록")
    private List<FileResponse> attachments;
}
