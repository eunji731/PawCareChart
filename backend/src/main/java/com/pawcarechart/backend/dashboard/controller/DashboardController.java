package com.pawcarechart.backend.dashboard.controller;

import com.pawcarechart.backend.common.dto.ApiResult;
import com.pawcarechart.backend.dashboard.dto.DashboardResponse;
import com.pawcarechart.backend.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@Tag(name = "Dashboard", description = "대시보드 API")
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "대시보드 통합 요약 조회", description = "핵심 지표, 복약 현황, 증상 랭킹, 일정, 최근 활동을 한 번에 조회합니다.")
    @GetMapping("/summary")
    public ApiResult<DashboardResponse> getSummary(
            @Parameter(description = "반려견 ID (선택)") @RequestParam(required = false) Long dogId,
            @Parameter(description = "집계 시작일 (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "집계 종료일 (YYYY-MM-DD)") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal String userId) {

        DashboardResponse response = dashboardService.getDashboardSummary(
                Long.valueOf(userId), dogId, startDate, endDate);
        return ApiResult.ok(response);
    }
}
