package com.pawcarechart.backend.symptom.repository;

import com.pawcarechart.backend.symptom.entity.ScheduleSymptom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScheduleSymptomRepository extends JpaRepository<ScheduleSymptom, Long> {
    List<ScheduleSymptom> findAllByScheduleId(Long scheduleId);
    void deleteAllByScheduleId(Long scheduleId);
}
