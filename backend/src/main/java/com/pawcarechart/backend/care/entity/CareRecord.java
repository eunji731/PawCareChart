package com.pawcarechart.backend.care.entity;

import com.pawcarechart.backend.code.entity.CommonCode;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "record_type_id", nullable = false)
    private CommonCode recordType;

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

    public void update(Long dogId, CommonCode recordType, LocalDate recordDate, String title, String note) {
        this.dogId = dogId;
        this.recordType = recordType;
        this.recordDate = recordDate;
        this.title = title;
        this.note = note;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
