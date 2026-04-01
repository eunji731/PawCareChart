package com.pawcarechart.backend.schedule.controller;

import com.pawcarechart.backend.common.dto.ApiResult;
import com.pawcarechart.backend.schedule.dto.ScheduleRequest;
import com.pawcarechart.backend.schedule.dto.ScheduleResponse;
import com.pawcarechart.backend.schedule.service.ScheduleService;
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
import java.util.Map;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@Tag(name = "Schedule", description = "일정 및 예약 관리 API")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @Operation(summary = "일정 목록 조회", description = "필터링 조건을 포함한 일정 목록을 조회합니다.")
    @GetMapping
    public ApiResult<List<ScheduleResponse>> getSchedules(
            @RequestParam(required = false) Long dogId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String keyword,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal String userId) {
        return ApiResult.ok(scheduleService.getSchedules(Long.valueOf(userId), dogId, type, keyword, startDate, endDate));
    }

    @Operation(summary = "일정 상세 조회")
    @GetMapping("/{id}")
    public ApiResult<ScheduleResponse> getScheduleDetail(@PathVariable Long id, @AuthenticationPrincipal String userId) {
        return ApiResult.ok(scheduleService.getScheduleDetail(id, Long.valueOf(userId)));
    }

    @Operation(summary = "일정 등록")
    @PostMapping
    public ApiResult<Long> registerSchedule(@Valid @RequestBody ScheduleRequest request, @AuthenticationPrincipal String userId) {
        return ApiResult.ok(scheduleService.registerSchedule(request, Long.valueOf(userId)));
    }

    @Operation(summary = "일정 수정")
    @PutMapping("/{id}")
    public ApiResult<Void> updateSchedule(@PathVariable Long id, @Valid @RequestBody ScheduleRequest request, @AuthenticationPrincipal String userId) {
        scheduleService.updateSchedule(id, request, Long.valueOf(userId));
        return ApiResult.ok(null);
    }

    @Operation(summary = "일정 삭제")
    @DeleteMapping("/{id}")
    public ApiResult<Void> deleteSchedule(@PathVariable Long id, @AuthenticationPrincipal String userId) {
        scheduleService.deleteSchedule(id, Long.valueOf(userId));
        return ApiResult.ok(null);
    }

    @Operation(summary = "일정 완료 상태 토글")
    @PatchMapping("/{id}/completion")
    public ApiResult<Void> toggleCompletion(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request,
            @AuthenticationPrincipal String userId) {
        scheduleService.toggleCompletion(id, request.get("isCompleted"), Long.valueOf(userId));
        return ApiResult.ok(null);
    }

    @Operation(summary = "일정 -> 케어기록 전환", description = "일정을 완료 처리하고 케어기록으로 변환하여 저장합니다.")
    @PostMapping("/{id}/convert")
    public ApiResult<Long> convertToCareRecord(@PathVariable Long id, @AuthenticationPrincipal String userId) {
        return ApiResult.ok(scheduleService.convertToCareRecord(id, Long.valueOf(userId)));
    }
}
