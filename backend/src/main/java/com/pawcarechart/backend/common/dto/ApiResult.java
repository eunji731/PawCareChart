package com.pawcarechart.backend.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "공통 API 응답 포맷")
public record ApiResult<T>(
        @Schema(description = "요청 처리 성공 여부", example = "true")
        boolean success,

        @Schema(description = "요청 결과 데이터")
        T data,

        @Schema(description = "결과 메시지", example = "로그아웃되었습니다.")
        String message
) {
    /**
     * 성공적인 응답을 생성하는 정적 팩토리 메서드
     * @param data
     * @return
     * @param <T>
     */
    public static <T> ApiResult<T> ok(T data) {
        return new ApiResult<>(true, data, null);
    }

    /**
     * 성공적인 응답을 생성하는 정적 팩토리 메서드 (메시지만 포함)
     * @param message
     * @return
     * @param <T>
     */
    public static <T> ApiResult<T> message(String message) {
        return new ApiResult<>(true, null, message);
    }

    /**
     * 실패한 응답을 생성하는 정적 팩토리 메서드
     * @param message
     * @return
     * @param <T>
     */
    public static <T> ApiResult<T> error(String message) {
        return new ApiResult<>(false, null, message);
    }
}