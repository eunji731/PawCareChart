package com.pawcarechart.backend.care.dto;

import java.time.LocalDate;

/**
 * MyBatis 상세 조회 SQL 결과를 담기 위한 전용 DTO.
 * symptoms와 treatment 필드가 추가되었습니다.
 */
public record CareRecordDetailQueryResult(
        Long id,
        Long dogId,
        String dogName,
        String dogProfileImageUrl,
        String recordType,
        LocalDate recordDate,
        String title,
        String note,
        String clinicName,
        String symptoms,
        String diagnosis,
        String treatment,
        String medicationStatus,
        LocalDate medicationStartDate,
        Integer medicationDays,
        String categoryCode,
        Long amount
) { }
