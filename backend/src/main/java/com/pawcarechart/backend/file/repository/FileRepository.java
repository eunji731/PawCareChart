package com.pawcarechart.backend.file.repository;

import com.pawcarechart.backend.file.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<FileEntity, Long> {
}
