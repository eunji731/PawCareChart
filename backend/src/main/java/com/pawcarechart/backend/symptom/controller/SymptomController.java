package com.pawcarechart.backend.symptom.controller;

import com.pawcarechart.backend.common.dto.ApiResult;
import com.pawcarechart.backend.symptom.dto.SymptomResponse;
import com.pawcarechart.backend.symptom.service.SymptomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Symptom", description = "증상 관리 API")
@RestController
@RequestMapping("/api/symptoms")
@RequiredArgsConstructor
public class SymptomController {

    private final SymptomService symptomService;

    @Operation(summary = "증상 태그 검색 (자동완성)", description = "입력한 키워드를 포함하는 기존 증상 태그 목록을 조회합니다.")
    @GetMapping("/search")
    public ApiResult<List<SymptomResponse>> searchSymptoms(
            @Parameter(description = "검색 키워드") @RequestParam String keyword) {
        List<SymptomResponse> results = symptomService.searchSymptoms(keyword);
        return ApiResult.ok(results);
    }
}
