package com.pawcarechart.backend.file.repository;

import com.pawcarechart.backend.file.constant.FileTargetType;
import com.pawcarechart.backend.file.dto.FileCountResponse;
import com.pawcarechart.backend.file.entity.FileMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FileMappingRepository extends JpaRepository<FileMapping, Long> {
    List<FileMapping> findAllByTargetTypeAndTargetId(FileTargetType targetType, Long targetId);
    void deleteAllByTargetTypeAndTargetId(FileTargetType targetType, Long targetId);
    void deleteByFileId(Long fileId);
    List<FileMapping> findAllByFileId(Long fileId);
    boolean existsByFileIdAndTargetTypeAndTargetId(Long fileId, FileTargetType targetType, Long targetId);
    // 케어 기록 목록 조회 시 N+1 방지를 위한 벌크 카운트 쿼리 추가
    @Query("SELECT new com.pawcarechart.backend.file.dto.FileCountResponse(f.targetId, COUNT(f)) " +
            "FROM FileMapping f " +
            "WHERE f.targetType = :targetType " +
            "AND f.targetId IN :targetIds " +
            "GROUP BY f.targetId")
    List<FileCountResponse> countFilesByTargetIds(
            @Param("targetType") FileTargetType targetType,
            @Param("targetIds") List<Long> targetIds
    );
}
