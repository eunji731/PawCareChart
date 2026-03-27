package com.pawcarechart.backend.care.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record CareRecordCreateRequest(
    @NotNull(message = "반려견 ID는 필수입니다.")
    Long dogId,

    @NotBlank(message = "기록 유형 코드는 필수입니다.")
    String recordTypeCode, // MEDICAL, EXPENSE

    @NotNull(message = "기록 날짜는 필수입니다.")
    LocalDate recordDate,

    @NotBlank(message = "제목은 필수입니다.")
    String title,

    String note,

    List<Long> fileIds,

    MedicalDetailRequest medicalDetails,
    ExpenseDetailRequest expenseDetails
) {
    public record MedicalDetailRequest(
        @NotBlank(message = "병원명은 필수입니다.")
        String clinicName,
        String symptoms,
        String diagnosis,
        String treatment,
        LocalDate medicationStartDate,
        Integer medicationDays,
        Boolean isMedicationCompleted,
        Long amount // [추가] 병원비
    ) {}

    public record ExpenseDetailRequest(
        @NotBlank(message = "지출 카테고리는 필수입니다.")
        String categoryCode,
        @NotNull(message = "지출 금액은 필수입니다.")
        Long amount,
        String memo,
        Long relatedMedicalRecordId
    ) {}
}
