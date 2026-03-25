package com.pawcarechart.backend.file.repository;

import com.pawcarechart.backend.file.constant.FileTargetType;
import com.pawcarechart.backend.file.entity.FileMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FileMappingRepository extends JpaRepository<FileMapping, Long> {
    List<FileMapping> findAllByTargetTypeAndTargetId(FileTargetType targetType, Long targetId);
    void deleteAllByTargetTypeAndTargetId(FileTargetType targetType, Long targetId);
    void deleteByFileId(Long fileId);
    Optional<FileMapping> findByFileId(Long fileId);
}
