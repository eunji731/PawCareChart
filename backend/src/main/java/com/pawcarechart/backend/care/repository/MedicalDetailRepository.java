package com.pawcarechart.backend.care.repository;

import com.pawcarechart.backend.care.entity.MedicalDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicalDetailRepository extends JpaRepository<MedicalDetail, Long> {
}
