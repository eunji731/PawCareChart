package com.pawcarechart.backend.care.dto;

import lombok.*;
import java.time.LocalDate;

/**
 * MyBatis 상세 조회 SQL 결과를 담기 위한 전용 DTO.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareRecordDetailQueryResult {
    private Long id;
    private Long dogId;
    private String dogName;
    private String dogProfileImageUrl;
    private String recordType;
    private LocalDate recordDate;
    private String title;
    private String note;
    private String clinicName;
    private String symptoms;
    private String diagnosis;
    private String treatment;
    private LocalDate medicationStartDate;
    private Integer medicationDays;
    private String medicationStatus;
    private String categoryCode;
    private Long amount;
}
