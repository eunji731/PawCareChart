package com.pawcarechart.backend.file.service;

import com.pawcarechart.backend.config.FileProperties;
import com.pawcarechart.backend.code.entity.CommonCode;
import com.pawcarechart.backend.code.repository.CommonCodeRepository;
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
    private final CommonCodeRepository commonCodeRepository;

    /**
     * [Step 1] 파일만 먼저 저장 (임시 상태)
     */
    @Transactional
    public List<FileResponse> uploadTemporary(Long userId, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return Collections.emptyList();

        return files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .map(file -> savePhysicalFile(userId, file))
                .collect(Collectors.toList());
    }

    private FileResponse savePhysicalFile(Long userId, MultipartFile file) {
        String contentType = file.getContentType();
        if (fileProperties.getAllowedTypes() != null && !fileProperties.getAllowedTypes().contains(contentType)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 파일 형식입니다: " + contentType);
        }

        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String storedName = UUID.randomUUID().toString() + extension;

        try {
            Path uploadPath = Paths.get(fileProperties.getUploadDir()).toAbsolutePath().normalize();
            log.info("[FileService] Target upload directory: {}", uploadPath);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("[FileService] Created directory: {}", uploadPath);
            }

            Path targetLocation = uploadPath.resolve(storedName);
            log.info("[FileService] Saving file to: {}", targetLocation);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            log.info("[FileService] File copy successful.");

            String baseUrl = fileProperties.getBaseUrl();
            if (!baseUrl.endsWith("/")) baseUrl += "/";
            String fileUrl = baseUrl + storedName;

            FileEntity fileEntity = fileRepository.save(FileEntity.builder()
                    .userId(userId)
                    .originalFileName(originalName)
                    .storedFileName(storedName)
                    .fileUrl(fileUrl)
                    .fileSize(file.getSize())
                    .fileType(contentType)
                    .build());

            return FileResponse.from(fileEntity);

        } catch (IOException ex) {
            log.error("Could not store file {}.", storedName, ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장 중 오류가 발생했습니다.");
        }
    }

    /**
     * [Step 2] 저장된 본문 ID와 파일들을 연결 (Long targetTypeId 기반)
     */
    @Transactional
    public void connectFilesToTarget(List<Long> fileIds, Long targetTypeId, Long targetId, Long userId) {
        log.info("[FileService] connectFilesToTarget START. fileIds={}, targetTypeId={}, targetId={}, userId={}", fileIds, targetTypeId, targetId, userId);
        if (fileIds == null || fileIds.isEmpty()) return;

        fileIds.forEach(fileId -> {
            if (fileId == null) return;

            FileEntity fileEntity = fileRepository.findById(fileId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파일을 찾을 수 없습니다. ID: " + fileId));

            if (!fileEntity.getUserId().equals(userId)) {
                log.warn("[FileService] Ownership mismatch. fileId={}, fileOwner={}, currentUser={}", fileId, fileEntity.getUserId(), userId);
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "파일 매핑 권한이 없습니다.");
            }

            if (fileMappingRepository.existsMapping(fileId, targetTypeId, targetId)) {
                log.info("[FileService] Mapping already exists for fileId={}, targetTypeId={}, targetId={}", fileId, targetTypeId, targetId);
                return;
            }

            CommonCode targetType = commonCodeRepository.findById(targetTypeId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 대상 유형 ID입니다: " + targetTypeId));

            FileMapping mapping = FileMapping.builder()
                    .fileId(fileId)
                    .targetType(targetType)
                    .targetId(targetId)
                    .build();
            
            fileMappingRepository.save(mapping);
            log.info("[FileService] Mapping saved. fileId={}, targetType={}, targetId={}", fileId, targetType.getCode(), targetId);
        });
        fileMappingRepository.flush();
    }

    @Transactional
    public void syncFilesToTarget(List<Long> fileIds, Long targetTypeId, Long targetId, Long userId) {
        log.info("[FileService] syncFilesToTarget. fileIds={}, targetTypeId={}, targetId={}", fileIds, targetTypeId, targetId);
        // 기존 매핑 정보 삭제 (물리 파일은 유지)
        fileMappingRepository.deleteAllByTargetType_IdAndTargetId(targetTypeId, targetId);

        // 새로운 매핑 정보 생성
        if (fileIds != null && !fileIds.isEmpty()) {
            connectFilesToTarget(fileIds, targetTypeId, targetId, userId);
        }
    }

    public List<FileResponse> getFiles(Long targetTypeId, Long targetId) {
        List<FileMapping> mappings = fileMappingRepository.findAllByTargetType_IdAndTargetId(targetTypeId, targetId);
        if (mappings.isEmpty()) return Collections.emptyList();

        List<Long> fileIds = mappings.stream()
                .sorted(Comparator.comparing(FileMapping::getId))
                .map(FileMapping::getFileId)
                .collect(Collectors.toList());
        
        return fileRepository.findAllById(fileIds).stream()
                .map(FileResponse::from)
                .sorted(Comparator.comparingLong(f -> fileIds.indexOf(f.getId())))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteFile(Long fileId, Long userId) {
        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파일 정보를 찾을 수 없습니다."));

        if (!fileEntity.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "파일 삭제 권한이 없습니다.");
        }

        deletePhysicalFile(fileEntity.getStoredFileName());
        fileMappingRepository.deleteByFileId(fileId);
        fileRepository.delete(fileEntity);
    }

    @Transactional
    public void deleteFilesByTarget(Long targetTypeId, Long targetId) {
        List<FileMapping> mappings = fileMappingRepository.findAllByTargetType_IdAndTargetId(targetTypeId, targetId);
        if (mappings.isEmpty()) return;

        List<Long> fileIds = mappings.stream().map(FileMapping::getFileId).collect(Collectors.toList());
        List<FileEntity> fileEntities = fileRepository.findAllById(fileIds);

        fileEntities.forEach(f -> deletePhysicalFile(f.getStoredFileName()));
        
        fileMappingRepository.deleteAllInBatch(mappings);
        fileRepository.deleteAllByIdInBatch(fileIds);
    }

    private void deletePhysicalFile(String storedFileName) {
        try {
            Path filePath = Paths.get(fileProperties.getUploadDir()).toAbsolutePath().normalize().resolve(storedFileName);
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            log.warn("Could not delete physical file: {}", storedFileName, ex);
        }
    }

    public Resource loadFileAsResource(String storedFileName) {
        try {
            Path filePath = Paths.get(fileProperties.getUploadDir()).toAbsolutePath().normalize().resolve(storedFileName);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) return resource;
            else throw new ResponseStatusException(HttpStatus.NOT_FOUND, "파일을 찾을 수 없습니다: " + storedFileName);
        } catch (MalformedURLException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "파일 경로가 잘못되었습니다: " + storedFileName);
        }
    }
}
