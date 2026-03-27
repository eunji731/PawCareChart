package com.pawcarechart.backend.file.dto;

import com.pawcarechart.backend.file.entity.FileEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileResponse {
    private Long id;
    private String originalFileName;
    private String fileUrl;
    private Long fileSize;
    private String fileType;

    public static FileResponse from(FileEntity fileEntity) {
        if (fileEntity == null) return null;
        return FileResponse.builder()
                .id(fileEntity.getId())
                .originalFileName(fileEntity.getOriginalFileName())
                .fileUrl(fileEntity.getFileUrl())
                .fileSize(fileEntity.getFileSize())
                .fileType(fileEntity.getFileType())
                .build();
    }
}
