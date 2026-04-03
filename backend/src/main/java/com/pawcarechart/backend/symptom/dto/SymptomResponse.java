package com.pawcarechart.backend.symptom.dto;

import com.pawcarechart.backend.symptom.entity.SymptomMaster;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "증상 태그 응답")
public class SymptomResponse {
    @Schema(description = "증상 식별자")
    private Long id;

    @Schema(description = "증상 이름")
    private String name;

    public static SymptomResponse from(SymptomMaster symptom) {
        return SymptomResponse.builder()
                .id(symptom.getId())
                .name(symptom.getName())
                .build();
    }
}
