package com.pawcarechart.backend.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "토큰 재발급 및 로그아웃 요청 정보")
public class RefreshRequest {
    @Schema(description = "재발급 또는 로그아웃 처리에 사용할 리프레시 토큰", example = "eyJhbGciOiJIUzI1NiJ9.refresh.token.sample")
    @NotBlank 
    private String refreshToken;
}
