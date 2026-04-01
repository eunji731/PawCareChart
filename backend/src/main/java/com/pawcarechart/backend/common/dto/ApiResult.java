package com.pawcarechart.backend.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "공통 API 응답 포맷")
public class ApiResult<T> {
    @Schema(description = "요청 처리 성공 여부", example = "true")
    private boolean success;

    @Schema(description = "요청 결과 데이터")
    private T data;

    @Schema(description = "결과 메시지", example = "로그아웃되었습니다.")
    private String message;

    /**
     * 성공적인 응답을 생성하는 정적 팩토리 메서드
     * @param data
     * @return
     * @param <T>
     */
    public static <T> ApiResult<T> ok(T data) {
        return ApiResult.<T>builder()
                .success(true)
                .data(data)
                .message(null)
                .build();
    }

    /**
     * 성공적인 응답을 생성하는 정적 팩토리 메서드 (메시지만 포함)
     * @param message
     * @return
     * @param <T>
     */
    public static <T> ApiResult<T> message(String message) {
        return ApiResult.<T>builder()
                .success(true)
                .data(null)
                .message(message)
                .build();
    }

    /**
     * 실패한 응답을 생성하는 정적 팩토리 메서드
     * @param message
     * @return
     * @param <T>
     */
    public static <T> ApiResult<T> error(String message) {
        return ApiResult.<T>builder()
                .success(false)
                .data(null)
                .message(message)
                .build();
    }
}
