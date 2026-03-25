package com.pawcarechart.backend.file.service;

import com.pawcarechart.backend.file.constant.FileTargetType;
import com.pawcarechart.backend.file.dto.FileResponse;
import com.pawcarechart.backend.file.entity.FileEntity;
import com.pawcarechart.backend.file.entity.FileMapping;
import com.pawcarechart.backend.file.repository.FileMappingRepository;
import com.pawcarechart.backend.file.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FileService {

    private final FileRepository fileRepository;
    private final FileMappingRepository fileMappingRepository;
    private final StorageService storageService;

    /**
     * 단일 파일 업로드 및 대상 매핑
     * @return 저장된 파일 정보 DTO
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

        String storedName = storageService.store(file);
        String fileUrl = storageService.getFileUrl(storedName);

        FileEntity fileEntity = fileRepository.save(FileEntity.builder()
                .originalFileName(file.getOriginalFilename())
                .storedFileName(storedName)
                .fileUrl(fileUrl)
                .fileSize(file.getSize())
                .fileType(file.getContentType())
                .build());

        fileMappingRepository.save(FileMapping.builder()
                .fileId(fileEntity.getId())
                .targetType(targetType)
                .targetId(targetId)
                .userId(userId)
                .build());

        return FileResponse.from(fileEntity);
    }

    /**
     * 특정 대상에 매핑된 모든 파일 정보 조회 (생성순 정렬)
     */
    public List<FileResponse> getFiles(FileTargetType targetType, Long targetId) {
        List<FileMapping> mappings = fileMappingRepository.findAllByTargetTypeAndTargetId(targetType, targetId);
        
        if (mappings.isEmpty()) return Collections.emptyList();

        // 생성순(id순) 정렬
        List<Long> fileIds = mappings.stream()
                .sorted(Comparator.comparing(FileMapping::getId))
                .map(FileMapping::getFileId)
                .collect(Collectors.toList());
        
        return fileRepository.findAllById(fileIds).stream()
                .map(FileResponse::from)
                // DB에서 가져온 순서가 보장되지 않을 수 있으므로 다시 한번 fileIds 순서대로 정렬하거나 mapping 기준으로 반환
                .sorted(Comparator.comparingLong(f -> fileIds.indexOf(f.getFileId())))
                .collect(Collectors.toList());
    }

    /**
     * 특정 파일 1건 삭제 (권한 검증 포함)
     */
    @Transactional
    public void deleteFile(Long fileId, Long userId) {
        FileMapping mapping = fileMappingRepository.findByFileId(fileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파일 매핑 정보를 찾을 수 없습니다."));

        // 권한 검증: 파일을 업로드한 사용자 본인만 삭제 가능
        // (필요 시 관리자 권한 등 추가 가능)
        if (!mapping.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "파일 삭제 권한이 없습니다.");
        }

        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "파일 정보를 찾을 수 없습니다."));

        // 물리 파일 삭제
        storageService.delete(fileEntity.getStoredFileName());

        // 매핑 및 DB 데이터 삭제
        fileMappingRepository.delete(mapping);
        fileRepository.delete(fileEntity);
    }

    /**
     * 특정 대상의 모든 파일 매핑 정보 및 파일 데이터 삭제 (일괄 삭제)
     * 이 메서드는 보통 도메인 엔티티 삭제 시 호출됨
     */
    @Transactional
    public void deleteFilesByTarget(FileTargetType targetType, Long targetId) {
        List<FileMapping> mappings = fileMappingRepository.findAllByTargetTypeAndTargetId(targetType, targetId);
        if (mappings.isEmpty()) return;

        List<Long> fileIds = mappings.stream().map(FileMapping::getFileId).collect(Collectors.toList());
        List<FileEntity> fileEntities = fileRepository.findAllById(fileIds);

        // 물리 파일 일괄 삭제
        fileEntities.forEach(f -> storageService.delete(f.getStoredFileName()));
        
        fileMappingRepository.deleteAllInBatch(mappings);
        fileRepository.deleteAllByIdInBatch(fileIds);
    }
}
