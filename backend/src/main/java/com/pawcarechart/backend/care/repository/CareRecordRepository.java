package com.pawcarechart.backend.care.repository;

import com.pawcarechart.backend.care.dto.CareRecordListResponse;
import com.pawcarechart.backend.care.entity.CareRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CareRecordRepository extends JpaRepository<CareRecord, Long> {


}
