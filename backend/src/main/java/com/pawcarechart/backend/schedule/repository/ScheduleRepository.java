package com.pawcarechart.backend.schedule.repository;

import com.pawcarechart.backend.schedule.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
}
