package com.pawcarechart.backend.care.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareRecordCreateRequest {
    @NotNull(message = "반려견 ID는 필수입니다.")
    private Long dogId;

    @NotNull(message = "기록 유형 ID는 필수입니다.")
    private Long recordTypeId;

    @NotNull(message = "기록 날짜는 필수입니다.")
    private LocalDate recordDate;

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    private String note;

    private Long sourceScheduleId; // [추가] 전환의 원본이 되는 일정 ID

    @JsonProperty("fileIds")
    private List<Long> fileIds;

    private MedicalDetailRequest medicalDetails;
    private ExpenseDetailRequest expenseDetails;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MedicalDetailRequest {
        @NotBlank(message = "병원명은 필수입니다.")
        private String clinicName;
        private String symptoms;
        private List<String> symptomTags;
        private String diagnosis;
        private String treatment;
        private LocalDate medicationStartDate;
        private Integer medicationDays;
        private Boolean isMedicationCompleted;
        private Long amount; // [추가] 병원비
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExpenseDetailRequest {
        @NotNull(message = "지출 카테고리 ID는 필수입니다.")
        private Long categoryId;
        @NotNull(message = "지출 금액은 필수입니다.")
        private Long amount;
        private String memo;
        private Long relatedMedicalRecordId;
    }
}
