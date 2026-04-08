package com.pawcarechart.backend.code.controller;

import com.pawcarechart.backend.code.dto.CodeResponse;
import com.pawcarechart.backend.code.service.CodeService;
import com.pawcarechart.backend.common.dto.ApiResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Code", description = "공통 코드 관리 API")
@RestController
@RequestMapping("/api/codes")
@RequiredArgsConstructor
public class CodeController {

    private final CodeService codeService;

    @Operation(summary = "코드 그룹별 목록 조회", description = "특정 코드 그룹에 속한 활성화된 코드 목록을 정렬 순서대로 조회합니다.")
    @GetMapping("/{groupCode}")
    public ApiResult<List<CodeResponse>> getCodesByGroup(
            @Parameter(description = "코드 그룹 (예: RECORD_TYPE, EXPENSE_CATEGORY, SCHEDULE_TYPE)") 
            @PathVariable String groupCode) {
        List<CodeResponse> codes = codeService.getCodesByGroup(groupCode);
        return ApiResult.ok(codes);
    }
}
