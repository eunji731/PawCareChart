package com.pawcarechart.backend.care.repository;

import com.pawcarechart.backend.care.entity.CareRecordSymptom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CareRecordSymptomRepository extends JpaRepository<CareRecordSymptom, Long> {
    List<CareRecordSymptom> findAllByCareRecordId(Long careRecordId);
    void deleteAllByCareRecordId(Long careRecordId);
}
