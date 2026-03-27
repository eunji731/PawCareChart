package com.pawcarechart.backend.file.repository;

import com.pawcarechart.backend.file.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
    
    /**
     * 매핑 정보가 없는(Orphan) 임시 파일 중 특정 시간 이전에 생성된 파일 조회
     */
    @Query("SELECT f FROM FileEntity f WHERE f.id NOT IN (SELECT m.fileId FROM FileMapping m) AND f.createdAt < :threshold")
    List<FileEntity> findOrphansCreatedBefore(@Param("threshold") LocalDateTime threshold);
}
