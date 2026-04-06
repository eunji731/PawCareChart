package com.pawcarechart.backend.dashboard.repository;

import com.pawcarechart.backend.dashboard.entity.HealthLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface HealthLogRepository extends JpaRepository<HealthLog, Long> {
    List<HealthLog> findAllByDogIdOrderByCreatedAtDesc(Long dogId);
    List<HealthLog> findAllByDogIdAndLogDateBetweenOrderByCreatedAtDesc(Long dogId, LocalDate startDate, LocalDate endDate);
}
