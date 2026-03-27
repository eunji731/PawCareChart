package com.pawcarechart.backend.file.controller;

import com.pawcarechart.backend.common.dto.ApiResult;
import com.pawcarechart.backend.file.constant.FileTargetType;
import com.pawcarechart.backend.file.dto.FileResponse;
import com.pawcarechart.backend.file.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Tag(name = "File", description = "파일 공통 API")
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @Operation(summary = "파일 임시 업로드", description = "파일을 먼저 업로드하고 fileId 목록을 반환받습니다. (매핑 전 상태)")
    @PostMapping("/upload")
    public ApiResult<List<FileResponse>> uploadTemporary(
            @RequestParam List<MultipartFile> files,
            @AuthenticationPrincipal String userId) {
        return ApiResult.ok(fileService.uploadTemporary(Long.valueOf(userId), files));
    }

    @Operation(summary = "파일 목록 조회", description = "특정 대상에 매핑된 모든 파일 정보를 조회합니다.")
    @GetMapping
    public ApiResult<List<FileResponse>> getFiles(
            @RequestParam FileTargetType targetType,
            @RequestParam Long targetId) {
        return ApiResult.ok(fileService.getFiles(targetType, targetId));
    }

    @Operation(summary = "파일 다운로드/미리보기", description = "저장된 파일명을 통해 실제 파일을 조회합니다.")
    @GetMapping("/download/{storedFileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String storedFileName, HttpServletRequest request) {
        Resource resource = fileService.loadFileAsResource(storedFileName);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            log.info("Could not determine file type.");
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
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
