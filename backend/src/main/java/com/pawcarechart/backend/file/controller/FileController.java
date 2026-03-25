package com.pawcarechart.backend.file.controller;

import com.pawcarechart.backend.common.dto.ApiResult;
import com.pawcarechart.backend.file.constant.FileTargetType;
import com.pawcarechart.backend.file.dto.FileResponse;
import com.pawcarechart.backend.file.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "File", description = "파일 공통 API")
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @Operation(summary = "다중 파일 업로드", description = "여러 파일을 특정 대상(targetType, targetId)에 업로드합니다.")
    @PostMapping("/upload")
    public ApiResult<List<FileResponse>> uploadMultiple(
            @RequestParam FileTargetType targetType,
            @RequestParam Long targetId,
            @RequestParam List<MultipartFile> files,
            @AuthenticationPrincipal String userId) {
        return ApiResult.ok(fileService.uploadMultiple(targetType, targetId, Long.valueOf(userId), files));
    }

    @Operation(summary = "파일 목록 조회", description = "특정 대상에 매핑된 모든 파일 정보를 조회합니다.")
    @GetMapping
    public ApiResult<List<FileResponse>> getFiles(
            @RequestParam FileTargetType targetType,
            @RequestParam Long targetId) {
        return ApiResult.ok(fileService.getFiles(targetType, targetId));
    }

    @Operation(summary = "파일 개별 삭제", description = "fileId를 기준으로 특정 파일을 삭제합니다. (본인 파일만 가능)")
    @DeleteMapping("/{fileId}")
    public ApiResult<Void> deleteFile(
            @PathVariable Long fileId,
            @AuthenticationPrincipal String userId) {
        fileService.deleteFile(fileId, Long.valueOf(userId));
        return ApiResult.ok(null);
    }
}
