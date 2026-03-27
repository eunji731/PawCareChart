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
     * [Step 1] 파일만 먼저 저장 (임시 상태)
     * targetId 없이 파일 정보만 DB에 기록
     */
    @Transactional
    public List<FileResponse> uploadTemporary(Long userId, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return Collections.emptyList();

        return files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .map(file -> savePhysicalFile(userId, file))
                .collect(Collectors.toList());
    }

    /**
     * 물리 파일 저장 및 DB 레코드 생성 (매핑 없음)
     */
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
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path targetLocation = uploadPath.resolve(storedName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

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
     * [Step 2] 저장된 본문 ID와 파일들을 연결
     */
    @Transactional
    public void connectFilesToTarget(List<Long> fileIds, FileTargetType targetType, Long targetId, Long userId) {
        if (fileIds == null || fileIds.isEmpty()) return;

        if (targetId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "대상 ID가 없습니다.");
        }

        fileIds.forEach(fileId -> {

            if (fileId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 ID가 null 입니다.");
            }
            // 소유권 확인: 업로드한 사용자 본인만 매핑 가능 (FileEntity 기준)
            FileEntity fileEntity = fileRepository.findById(fileId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파일 정보를 찾을 수 없습니다. ID: " + fileId));

            if (!fileEntity.getUserId().equals(userId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "파일 매핑 권한이 없습니다.");
            }

            // 매핑 정보 저장 시 userId는 포함하지 않음
            fileMappingRepository.save(FileMapping.builder()
                    .fileId(fileId)
                    .targetType(targetType)
                    .targetId(targetId)
                    .build());
        });
    }

    /**
     * 특정 대상에 매핑된 모든 파일 정보 조회
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
                .sorted(Comparator.comparingLong(f -> fileIds.indexOf(f.getId())))
                .collect(Collectors.toList());
    }

    /**
     * 특정 파일 1건 삭제
     */
    @Transactional
    public void deleteFile(Long fileId, Long userId) {
        // 권한 검증: 파일을 업로드한 사용자 본인만 삭제 가능 (FileEntity 기준)
        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파일 정보를 찾을 수 없습니다."));

        if (!fileEntity.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "파일 삭제 권한이 없습니다.");
        }

        // 물리 파일 삭제
        deletePhysicalFile(fileEntity.getStoredFileName());

        // 매핑 삭제
        fileMappingRepository.deleteByFileId(fileId);
        
        // 엔티티 삭제
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
