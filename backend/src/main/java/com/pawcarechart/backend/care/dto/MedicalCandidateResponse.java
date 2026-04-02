package com.pawcarechart.backend.care.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "연결 가능한 병원 기록 후보 응답")
public class MedicalCandidateResponse {
    @Schema(description = "기록 식별자")
    private Long id;

    @Schema(description = "제목")
    private String title;

    @Schema(description = "진료 날짜")
    private LocalDate recordDate;

    @Schema(description = "병원명")
    private String clinicName;

    @Schema(description = "진단명")
    private String diagnosis;
}
