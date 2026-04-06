package com.pawcarechart.backend.dashboard.dto;

import com.pawcarechart.backend.dashboard.entity.HealthLog;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class HealthLogDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "퀵 관찰 메모 생성 요청")
    public static class Request {
        @NotNull(message = "반려견 ID는 필수입니다.")
        private Long dogId;

        @NotBlank(message = "메모 내용은 필수입니다.")
        private String content;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Schema(description = "퀵 관찰 메모 응답")
    public static class Response {
        private Long id;
        private Long dogId;
        private LocalDate logDate;
        private String content;
        private LocalDateTime createdAt;

        public static Response from(HealthLog entity) {
            return Response.builder()
                    .id(entity.getId())
                    .dogId(entity.getDogId())
                    .logDate(entity.getLogDate())
                    .content(entity.getContent())
                    .createdAt(entity.getCreatedAt())
                    .build();
        }
    }
}
