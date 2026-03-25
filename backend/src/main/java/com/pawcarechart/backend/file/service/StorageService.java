package com.pawcarechart.backend.file.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    /**
     * 파일을 저장하고 저장된 파일의 이름을 반환
     */
    String store(MultipartFile file);

    /**
     * 저장된 파일 삭제
     */
    void delete(String storedFileName);

    /**
     * 저장된 파일로부터 접근 가능한 URL 생성
     */
    String getFileUrl(String storedFileName);
}
