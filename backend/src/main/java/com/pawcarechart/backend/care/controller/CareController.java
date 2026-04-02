package com.pawcarechart.backend.care.controller;

import com.pawcarechart.backend.care.dto.CareRecordCreateRequest;
import com.pawcarechart.backend.care.dto.CareRecordDetailResponse;
import com.pawcarechart.backend.care.dto.CareRecordListResponse;
import com.pawcarechart.backend.care.service.CareService;
import com.pawcarechart.backend.common.dto.ApiResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Tag(name = "CareRecord", description = "통합 케어 기록(병원/지출) API")
@RestController
@RequestMapping("/api/care-records")
@RequiredArgsConstructor
public class CareController {

    private final CareService careService;

    @Operation(summary = "통합 케어 기록 목록 조회", description = "필터 조건에 맞는 통합 케어 기록 목록을 조회합니다.")
    @GetMapping
    public ApiResult<List<CareRecordListResponse>> getCareRecords(
            @Parameter(description = "반려견 ID (선택)") @RequestParam(required = false) Long dogId,
            @Parameter(description = "기록 유형 (ALL, MEDICAL, EXPENSE)") @RequestParam(required = false) String type,
            @Parameter(description = "검색어 (제목, 병원명, 진단명)") @RequestParam(required = false) String keyword,
            @Parameter(description = "조회 시작일 (YYYY-MM-DD)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "조회 종료일 (YYYY-MM-DD)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal String userId) {

        log.info("principal userId = {}", userId);
        log.info("dogId={}, type={}, keyword={}, startDate={}, endDate={}",
                dogId, type, keyword, startDate, endDate);

        List<CareRecordListResponse> result = careService.getCareRecords(
                Long.valueOf(userId), dogId, type, keyword, startDate, endDate);
        return ApiResult.ok(result);
    }

    @Operation(summary = "통합 케어 기록 상세 조회", description = "기록 ID를 기반으로 통합 케어 기록 상세 정보를 조회합니다.")
    @GetMapping("/{id}")
    public ApiResult<CareRecordDetailResponse> getCareRecordDetail(
            @Parameter(description = "기록 식별자") @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        CareRecordDetailResponse detail = careService.getCareRecordDetail(id, Long.valueOf(userId));
        return ApiResult.ok(detail);
    }

    @Operation(summary = "연결 가능한 병원 기록 후보 조회", description = "특정 강아지의 지출 기록과 연결할 수 있는 병원 진료 기록 목록을 가져옵니다 (페이징 지원).")
    @GetMapping("/medical-candidates")
    public ApiResult<List<com.pawcarechart.backend.care.dto.MedicalCandidateResponse>> getMedicalCandidates(
            @Parameter(description = "반려견 식별자") @RequestParam Long dogId,
            @Parameter(description = "검색어 (제목, 병원명, 진단명)") @RequestParam(required = false) String keyword,
            @Parameter(description = "페이지 번호 (0부터 시작)") @RequestParam(required = false, defaultValue = "0") Integer page,
            @Parameter(description = "페이지당 개수 (기본 20)") @RequestParam(required = false, defaultValue = "20") Integer size,
            @AuthenticationPrincipal String userId) {
        List<com.pawcarechart.backend.care.dto.MedicalCandidateResponse> candidates = 
                careService.getMedicalCandidates(dogId, keyword, page, size, Long.valueOf(userId));
        return ApiResult.ok(candidates);
    }

    @Operation(summary = "통합 케어 기록 수정", description = "기존 케어 기록과 상세 정보, 첨부파일을 수정합니다.")
    @PutMapping("/{id}")
    public ApiResult<Void> updateCareRecord(
            @Parameter(description = "기록 식별자") @PathVariable Long id,
            @Valid @RequestBody CareRecordCreateRequest request,
            @AuthenticationPrincipal String userId) {
        careService.updateCareRecord(id, request, Long.valueOf(userId));
        return ApiResult.ok(null);
    }

    @Operation(summary = "통합 케어 기록 삭제", description = "기존 케어 기록과 상세 정보, 첨부파일을 모두 삭제합니다.")
    @DeleteMapping("/{id}")
    public ApiResult<Void> deleteCareRecord(
            @Parameter(description = "기록 식별자") @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        careService.deleteCareRecord(id, Long.valueOf(userId));
        return ApiResult.ok(null);
    }

    @Operation(summary = "통합 케어 기록 등록", description = "병원 진료 또는 지출 내역을 통합하여 등록합니다.")
    @PostMapping
    public ApiResult<Long> registerCareRecord(
            @Valid @RequestBody CareRecordCreateRequest request,
            @AuthenticationPrincipal String userId) {
        Long recordId = careService.registerCareRecord(request, Long.valueOf(userId));
        return ApiResult.ok(recordId);
    }
}
