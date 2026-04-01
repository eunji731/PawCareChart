package com.pawcarechart.backend.care.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "care_record_symptoms")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CareRecordSymptom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "care_record_id", nullable = false)
    private Long careRecordId;

    @Column(name = "symptom_id", nullable = false)
    private Long symptomId;

    @Column(name = "dog_id", nullable = false)
    private Long dogId;

    @Column(name = "severity_code", length = 50)
    private String severityCode;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
