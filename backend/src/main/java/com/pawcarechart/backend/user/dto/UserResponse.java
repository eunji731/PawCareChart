package com.pawcarechart.backend.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "사용자 정보 응답")
public class UserResponse {
    @Schema(description = "사용자 식별자", example = "1")
    private Long id;

    @Schema(description = "이메일", example = "hong@example.com")
    private String email;

    @Schema(description = "이름", example = "홍길동")
    private String name;

    @Schema(description = "역할 ID", example = "1")
    private Long roleId;

    @Schema(description = "역할명", example = "일반 사용자")
    private String roleName;

    @Schema(description = "가입 일시")
    private LocalDateTime createdAt;

    @Schema(description = "정보 수정 일시")
    private LocalDateTime updatedAt;
}
