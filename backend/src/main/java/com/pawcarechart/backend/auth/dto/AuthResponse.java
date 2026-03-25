package com.pawcarechart.backend.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "인증 처리 결과 응답")
public record AuthResponse(
        @Schema(description = "API 인증에 사용하는 액세스 토큰", example = "eyJhbGciOiJIUzI1NiJ9.access.token.sample")
        String accessToken,

        @Schema(description = "액세스 토큰 만료 후 재발급에 사용하는 리프레시 토큰", example = "eyJhbGciOiJIUzI1NiJ9.refresh.token.sample")
        String refreshToken,

        @Schema(description = "인증 토큰 타입", example = "Bearer")
        String tokenType,

        @Schema(description = "액세스 토큰 만료 시간(초)", example = "3600")
        long expiresIn,

        @Schema(description = "로그인한 사용자 식별자", example = "1")
        Long userId,

        @Schema(description = "로그인한 사용자 이메일", example = "hong@example.com")
        String email,

        @Schema(description = "로그인한 사용자 이름", example = "홍길동")
        String name
) {
}