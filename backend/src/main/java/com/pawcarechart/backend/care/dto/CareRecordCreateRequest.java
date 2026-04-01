package com.pawcarechart.backend.care.dto;

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

    @NotBlank(message = "기록 유형 코드는 필수입니다.")
    private String recordTypeCode; // MEDICAL, EXPENSE

    @NotNull(message = "기록 날짜는 필수입니다.")
    private LocalDate recordDate;

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    private String note;

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
        @NotBlank(message = "지출 카테고리는 필수입니다.")
        private String categoryCode;
        @NotNull(message = "지출 금액은 필수입니다.")
        private Long amount;
        private String memo;
        private Long relatedMedicalRecordId;
    }
}
