package com.pawcarechart.backend.dog.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "반려견 등록 요청")
public class DogCreateRequest {
    @Schema(description = "이름", example = "초코")
    @NotBlank(message = "강아지 이름은 필수입니다.")
    private String name;
    
    @Schema(description = "품종", example = "푸들")
    private String breed;
    
    @Schema(description = "생년월일", example = "2020-01-01")
    private LocalDate birthDate;
    
    @Schema(description = "몸무게(kg)", example = "4.5")
    private Double weight;
    
    @Schema(description = "프로필 이미지 파일 ID")
    @com.fasterxml.jackson.annotation.JsonProperty("profileImageFileId")
    private Long profileImageFileId;
}
