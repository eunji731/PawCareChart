package com.pawcarechart.backend.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "사용자 정보 응답")
public record UserResponse(
        @Schema(description = "사용자 식별자", example = "1")
        Long id,

        @Schema(description = "이메일", example = "hong@example.com")
        String email,

        @Schema(description = "이름", example = "홍길동")
        String name,

        @Schema(description = "역할", example = "ROLE_USER")
        String role,

        @Schema(description = "가입 일시")
        LocalDateTime createdAt,

        @Schema(description = "정보 수정 일시")
        LocalDateTime updatedAt
) {
}
