package com.pawcarechart.backend.care.entity;

import com.pawcarechart.backend.code.entity.CommonCode;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CommonCode category;

    @Column(name = "amount", nullable = false)
    private Long amount;

    @Column(name = "memo", columnDefinition = "TEXT")
    private String memo;

    @Column(name = "related_medical_record_id")
    private Long relatedMedicalRecordId;

    public void update(CommonCode category, Long amount, String memo, Long relatedMedicalRecordId) {
        this.category = category;
        this.amount = amount;
        this.memo = memo;
        this.relatedMedicalRecordId = relatedMedicalRecordId;
    }
}
