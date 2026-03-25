package com.pawcarechart.backend.dog.dto;

import com.pawcarechart.backend.dog.entity.Dog;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;

@Schema(description = "반려견 정보 응답")
public record DogResponse(
    @Schema(description = "반려견 식별자", example = "1")
    Long id,
    @Schema(description = "이름", example = "초코")
    String name,
    @Schema(description = "품종", example = "푸들")
    String breed,
    @Schema(description = "생년월일", example = "2020-01-01")
    LocalDate birthDate,
    @Schema(description = "몸무게(kg)", example = "4.5")
    Double weight,
    @Schema(description = "프로필 이미지 URL")
    String profileImageUrl
) {
    public static DogResponse from(Dog dog) {
        return new DogResponse(
            dog.getId(),
            dog.getName(),
            dog.getBreed(),
            dog.getBirthDate(),
            dog.getWeight(),
            dog.getProfileImageUrl()
        );
    }
}
