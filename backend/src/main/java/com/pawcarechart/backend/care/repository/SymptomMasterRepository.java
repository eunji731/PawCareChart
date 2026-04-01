package com.pawcarechart.backend.care.repository;

import com.pawcarechart.backend.care.entity.SymptomMaster;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SymptomMasterRepository extends JpaRepository<SymptomMaster, Long> {
    Optional<SymptomMaster> findByName(String name);
}
