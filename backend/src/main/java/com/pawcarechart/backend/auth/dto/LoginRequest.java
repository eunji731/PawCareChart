package com.pawcarechart.backend.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "로그인 요청 정보")
public record LoginRequest(
        @Schema(description = "가입된 사용자 이메일", example = "hong@example.com")
        @Email @NotBlank String email,

        @Schema(description = "가입 시 설정한 비밀번호", example = "PawCare123!")
        @NotBlank String password
) {
}