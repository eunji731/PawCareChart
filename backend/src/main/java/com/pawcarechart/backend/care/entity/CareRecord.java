package com.pawcarechart.backend.care.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "care_records")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CareRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dog_id", nullable = false)
    private Long dogId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "record_type_code", nullable = false, length = 50)
    private String recordTypeCode; // MEDICAL, EXPENSE

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    @Column(name = "title", length = 200)
    private String title;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
