package com.pawcarechart.backend.dog.dto;

import com.pawcarechart.backend.dog.entity.Dog;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "반려견 정보 응답")
public class DogResponse {
    @Schema(description = "반려견 식별자", example = "1")
    private Long id;
    @Schema(description = "이름", example = "초코")
    private String name;
    @Schema(description = "품종", example = "푸들")
    private String breed;
    @Schema(description = "생년월일", example = "2020-01-01")
    private LocalDate birthDate;
    @Schema(description = "몸무게(kg)", example = "4.5")
    private Double weight;
    @Schema(description = "프로필 이미지 URL")
    private String profileImageUrl;

    public static DogResponse from(Dog dog) {
        return DogResponse.builder()
            .id(dog.getId())
            .name(dog.getName())
            .breed(dog.getBreed())
            .birthDate(dog.getBirthDate())
            .weight(dog.getWeight())
            .profileImageUrl(dog.getProfileImageUrl())
            .build();
    }
}
