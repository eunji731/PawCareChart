package com.pawcarechart.backend.dashboard.controller;

import com.pawcarechart.backend.common.dto.ApiResult;
import com.pawcarechart.backend.dashboard.dto.DashboardResponse;
import com.pawcarechart.backend.dashboard.dto.HealthLogDto;
import com.pawcarechart.backend.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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

    @Operation(summary = "퀵 관찰 메모 등록", description = "반려견의 상태를 실시간으로 간단하게 기록합니다.")
    @PostMapping("/health-logs")
    public ApiResult<Long> createHealthLog(
            @Valid @RequestBody HealthLogDto.Request request,
            @AuthenticationPrincipal String userId) {
        Long id = dashboardService.createHealthLog(request, Long.valueOf(userId));
        return ApiResult.ok(id);
    }

    @Operation(summary = "퀵 관찰 메모 목록 조회", description = "특정 반려견의 관찰 메모 목록을 최신순으로 조회합니다.")
    @GetMapping("/health-logs")
    public ApiResult<List<HealthLogDto.Response>> getHealthLogs(
            @Parameter(description = "반려견 식별자") @RequestParam Long dogId,
            @Parameter(description = "조회 시작일 (선택)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "조회 종료일 (선택)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal String userId) {
        List<HealthLogDto.Response> results = dashboardService.getHealthLogs(dogId, startDate, endDate, Long.valueOf(userId));
        return ApiResult.ok(results);
    }

    @Operation(summary = "퀵 관찰 메모 삭제", description = "기존에 등록된 관찰 메모를 삭제합니다.")
    @DeleteMapping("/health-logs/{id}")
    public ApiResult<Void> deleteHealthLog(
            @Parameter(description = "메모 식별자") @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        dashboardService.deleteHealthLog(id, Long.valueOf(userId));
        return ApiResult.ok(null);
    }
}
