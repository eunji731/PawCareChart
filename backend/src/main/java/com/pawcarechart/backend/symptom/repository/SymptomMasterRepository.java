package com.pawcarechart.backend.symptom.repository;

import com.pawcarechart.backend.symptom.entity.SymptomMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SymptomMasterRepository extends JpaRepository<SymptomMaster, Long> {
    Optional<SymptomMaster> findByName(String name);
}
