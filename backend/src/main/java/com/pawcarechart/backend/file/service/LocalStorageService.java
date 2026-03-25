package com.pawcarechart.backend.file.service;

import com.pawcarechart.backend.config.FileProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * 로컬 파일 시스템 또는 임시 저장을 위한 구현체
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LocalStorageService implements StorageService {

    private final FileProperties fileProperties;

    @Override
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        
        // 파일 타입 검증
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
            
            return storedName;
        } catch (IOException ex) {
            log.error("Could not store file {}. Please try again!", storedName, ex);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 저장 중 오류가 발생했습니다.");
        }
    }

    @Override
    public void delete(String storedFileName) {
        if (storedFileName == null) return;
        
        try {
            Path filePath = Paths.get(fileProperties.getUploadDir()).toAbsolutePath().normalize().resolve(storedFileName);
            Files.deleteIfExists(filePath);
            log.info("Deleted file from storage: {}", storedFileName);
        } catch (IOException ex) {
            log.warn("Could not delete file from storage: {}", storedFileName, ex);
        }
    }

    @Override
    public String getFileUrl(String storedFileName) {
        if (storedFileName == null) return null;
        String baseUrl = fileProperties.getBaseUrl();
        if (!baseUrl.endsWith("/")) {
            baseUrl += "/";
        }
        return baseUrl + storedFileName;
    }
}
