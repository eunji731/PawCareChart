package com.pawcarechart.backend.care.repository;

import com.pawcarechart.backend.care.dto.CareRecordListResponse;
import com.pawcarechart.backend.care.entity.CareRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CareRecordRepository extends JpaRepository<CareRecord, Long> {

    /**
     * 통합 케어 기록 목록 조회 (필터링 및 정렬)
     * [변경] COALESCE(md.amount, ed.amount)를 통해 의료비와 지출비를 하나의 amount 필드로 통합
     */
    @Query("SELECT new com.pawcarechart.backend.care.dto.CareRecordListResponse(" +
           "cr.id, cr.recordTypeCode, cr.recordDate, cr.title, " +
           "md.clinicName, md.diagnosis, " +
           "ed.categoryCode, " +
           "COALESCE(md.amount, ed.amount)) " +
           "FROM CareRecord cr " +
           "LEFT JOIN MedicalDetail md ON md.careRecordId = cr.id " +
           "LEFT JOIN ExpenseDetail ed ON ed.careRecordId = cr.id " +
           "WHERE cr.userId = :userId " +
           "AND (:dogId IS NULL OR cr.dogId = :dogId) " +
           "AND (:type IS NULL OR cr.recordTypeCode = :type) " +
           "AND (:keyword IS NULL OR (cr.title LIKE %:keyword% OR md.clinicName LIKE %:keyword% OR md.diagnosis LIKE %:keyword%)) " +
           "AND (:startDate IS NULL OR cr.recordDate >= :startDate) " +
           "AND (:endDate IS NULL OR cr.recordDate <= :endDate) " +
           "ORDER BY cr.recordDate DESC, cr.createdAt DESC")
    List<CareRecordListResponse> findCareRecordsByFilters(
            @Param("userId") Long userId,
            @Param("dogId") Long dogId,
            @Param("type") String type,
            @Param("keyword") String keyword,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}
