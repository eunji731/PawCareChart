package com.pawcarechart.backend.file.service;

import com.pawcarechart.backend.config.FileProperties;
import com.pawcarechart.backend.file.constant.FileTargetType;
import com.pawcarechart.backend.file.dto.FileResponse;
import com.pawcarechart.backend.file.entity.FileEntity;
import com.pawcarechart.backend.file.entity.FileMapping;
import com.pawcarechart.backend.file.repository.FileMappingRepository;
import com.pawcarechart.backend.file.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FileService {

    private final FileRepository fileRepository;
    private final FileMappingRepository fileMappingRepository;
    private final FileProperties fileProperties;

    /**
     * 단일 파일 업로드 및 대상 매핑
     */
    @Transactional
    public FileResponse uploadSingle(FileTargetType targetType, Long targetId, Long userId, MultipartFile file) {
        return uploadFile(targetType, targetId, userId, file);
    }

    /**
     * 다중 파일 업로드 및 대상 매핑
     */
    @Transactional
    public List<FileResponse> uploadMultiple(FileTargetType targetType, Long targetId, Long userId, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return Collections.emptyList();

        return files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .map(file -> uploadFile(targetType, targetId, userId, file))
                .collect(Collectors.toList());
    }

    /**
     * 파일 저장 및 매핑 내부 로직
     */
    private FileResponse uploadFile(FileTargetType targetType, Long targetId, Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) return null;

        // 파일 타입 검증
        String contentType = file.getContentType();
        if (fileProperties.getAllowedTypes() != null && !fileProperties.getAllowedTypes().contains(contentType)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 파일 형식입니다: " + contentType);
        }

        // 고유 파일명 생성
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String storedName = UUID.randomUUID().toString() + extension;

        try {
            // 물리 디렉토리 생성
            Path uploadPath = Paths.get(fileProperties.getUploadDir()).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 파일 복사
            Path targetLocation = uploadPath.resolve(storedName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // DB 저장
            String baseUrl = fileProperties.getBaseUrl();
            if (!baseUrl.endsWith("/")) baseUrl += "/";
            String fileUrl = baseUrl + storedName;

            FileEntity fileEntity = fileRepository.save(FileEntity.builder()
                    .originalFileName(originalName)
                    .storedFileName(storedName)
                    .fileUrl(fileUrl)
                    .fileSize(file.getSize())
                    .fileType(contentType)
                    .build());

            fileMappingRepository.save(FileMapping.builder()
                    .fileId(fileEntity.getId())
                    .targetType(targetType)
                    .targetId(targetId)
                    .userId(userId)
                    .build());

            return FileResponse.from(fileEntity);

        } catch (IOException ex) {
            log.error("Could not store file {}.", storedName, ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장 중 오류가 발생했습니다.");
        }
    }

    /**
     * 특정 대상에 매핑된 모든 파일 정보 조회 (생성순 정렬)
     */
    public List<FileResponse> getFiles(FileTargetType targetType, Long targetId) {
        List<FileMapping> mappings = fileMappingRepository.findAllByTargetTypeAndTargetId(targetType, targetId);
        if (mappings.isEmpty()) return Collections.emptyList();

        List<Long> fileIds = mappings.stream()
                .sorted(Comparator.comparing(FileMapping::getId))
                .map(FileMapping::getFileId)
                .collect(Collectors.toList());
        
        return fileRepository.findAllById(fileIds).stream()
                .map(FileResponse::from)
                .sorted(Comparator.comparingLong(f -> fileIds.indexOf(f.getFileId())))
                .collect(Collectors.toList());
    }

    /**
     * 실제 물리 파일을 Resource로 로드 (다운로드/미리보기용)
     */
    public Resource loadFileAsResource(String storedFileName) {

        log.info("downloadFile 진입: {}", storedFileName);
        try {
            Path filePath = Paths.get(fileProperties.getUploadDir()).toAbsolutePath().normalize().resolve(storedFileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "파일을 찾을 수 없습니다: " + storedFileName);
            }
        } catch (MalformedURLException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "파일 경로가 잘못되었습니다: " + storedFileName);
        }
    }

    /**
     * 특정 파일 1건 삭제 (권한 검증 및 물리 파일 삭제 포함)
     */
    @Transactional
    public void deleteFile(Long fileId, Long userId) {
        FileMapping mapping = fileMappingRepository.findByFileId(fileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파일 매핑 정보를 찾을 수 없습니다."));

        if (!mapping.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "파일 삭제 권한이 없습니다.");
        }

        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파일 정보를 찾을 수 없습니다."));

        // 물리 파일 삭제
        deletePhysicalFile(fileEntity.getStoredFileName());

        // DB 삭제
        fileMappingRepository.delete(mapping);
        fileRepository.delete(fileEntity);
    }

    /**
     * 특정 대상의 모든 파일 매핑 정보 및 물리 파일 삭제
     */
    @Transactional
    public void deleteFilesByTarget(FileTargetType targetType, Long targetId) {
        List<FileMapping> mappings = fileMappingRepository.findAllByTargetTypeAndTargetId(targetType, targetId);
        if (mappings.isEmpty()) return;

        List<Long> fileIds = mappings.stream().map(FileMapping::getFileId).collect(Collectors.toList());
        List<FileEntity> fileEntities = fileRepository.findAllById(fileIds);

        // 물리 파일 일괄 삭제
        fileEntities.forEach(f -> deletePhysicalFile(f.getStoredFileName()));
        
        fileMappingRepository.deleteAllInBatch(mappings);
        fileRepository.deleteAllByIdInBatch(fileIds);
    }

    private void deletePhysicalFile(String storedFileName) {
        try {
            Path filePath = Paths.get(fileProperties.getUploadDir()).toAbsolutePath().normalize().resolve(storedFileName);
            Files.deleteIfExists(filePath);
            log.info("Deleted physical file: {}", storedFileName);
        } catch (IOException ex) {
            log.warn("Could not delete physical file: {}", storedFileName, ex);
        }
    }
}
