package com.pawcarechart.backend.care.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Table(name = "care_record_expense_details")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ExpenseDetail {

    @Id
    private Long careRecordId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "care_record_id")
    private CareRecord careRecord;

    @Column(name = "category_code", nullable = false, length = 50)
    private String categoryCode;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "memo", columnDefinition = "TEXT")
    private String memo;

    @Column(name = "related_medical_record_id")
    private Long relatedMedicalRecordId;

    public void update(String categoryCode, Long amount, String memo, Long relatedMedicalRecordId) {
        this.categoryCode = categoryCode;
        this.amount = amount;
        this.memo = memo;
        this.relatedMedicalRecordId = relatedMedicalRecordId;
    }
}
