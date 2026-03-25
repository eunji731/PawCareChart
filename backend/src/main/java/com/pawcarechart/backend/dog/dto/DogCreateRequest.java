package com.pawcarechart.backend.dog.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Schema(description = "반려견 등록 요청")
public record DogCreateRequest(
    @Schema(description = "이름", example = "초코")
    @NotBlank(message = "강아지 이름은 필수입니다.")
    String name,
    
    @Schema(description = "품종", example = "푸들")
    String breed,
    
    @Schema(description = "생년월일", example = "2020-01-01")
    LocalDate birthDate,
    
    @Schema(description = "몸무게(kg)", example = "4.5")
    Double weight,
    
    @Schema(description = "프로필 이미지 URL")
    String profileImageUrl
) {}
