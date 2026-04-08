package com.pawcarechart.backend.file.repository;

import com.pawcarechart.backend.file.constant.FileTargetType;
import com.pawcarechart.backend.file.dto.FileCountResponse;
import com.pawcarechart.backend.file.entity.FileMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface FileMappingRepository extends JpaRepository<FileMapping, Long> {
    List<FileMapping> findAllByTargetType_IdAndTargetId(
            @Param("targetTypeId") Long targetTypeId, 
            @Param("targetId") Long targetId
    );

    @Modifying
    @Transactional
    void deleteAllByTargetType_IdAndTargetId(
            @Param("targetTypeId") Long targetTypeId, 
            @Param("targetId") Long targetId
    );

    @Modifying
    @Transactional
    void deleteByFileId(@Param("fileId") Long fileId);

    List<FileMapping> findAllByFileId(@Param("fileId") Long fileId);

    @Query("SELECT COUNT(f) > 0 FROM FileMapping f " +
           "WHERE f.fileId = :fileId " +
           "AND f.targetType.id = :targetTypeId " +
           "AND f.targetId = :targetId")
    boolean existsMapping(
            @Param("fileId") Long fileId, 
            @Param("targetTypeId") Long targetTypeId, 
            @Param("targetId") Long targetId
    );
    
    // 케어 기록 목록 조회 시 N+1 방지를 위한 벌크 카운트 쿼리 추가
    @Query("SELECT new com.pawcarechart.backend.file.dto.FileCountResponse(f.targetId, COUNT(f)) " +
            "FROM FileMapping f " +
            "WHERE f.targetType.id = :targetTypeId " +
            "AND f.targetId IN :targetIds " +
            "GROUP BY f.targetId")
    List<FileCountResponse> countFilesByTargetIds(
            @Param("targetTypeId") Long targetTypeId,
            @Param("targetIds") List<Long> targetIds
    );
}
