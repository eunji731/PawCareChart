package com.pawcarechart.backend.symptom.repository;

import com.pawcarechart.backend.symptom.entity.CareRecordSymptom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CareRecordSymptomRepository extends JpaRepository<CareRecordSymptom, Long> {
    List<CareRecordSymptom> findAllByCareRecordId(Long careRecordId);
    void deleteAllByCareRecordId(Long careRecordId);
}
