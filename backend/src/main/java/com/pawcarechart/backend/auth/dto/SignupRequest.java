package com.pawcarechart.backend.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "회원가입 요청 정보")
public record SignupRequest(
        @Schema(description = "로그인에 사용할 이메일 주소", example = "hong@example.com")
        @Email @NotBlank String email,

        @Schema(description = "로그인 비밀번호 (8자 이상)", example = "PawCare123!")
        @NotBlank @Size(min = 8, max = 100) String password,

        @Schema(description = "서비스에 표시할 보호자 이름", example = "홍길동")
        @NotBlank @Size(max = 50) String name
) {
}