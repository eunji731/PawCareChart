package com.pawcarechart.backend.care.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Entity
@Table(name = "care_record_medical_details")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class MedicalDetail {

    @Id
    private Long careRecordId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "care_record_id")
    private CareRecord careRecord;

    @Column(name = "clinic_name", nullable = false, length = 100)
    private String clinicName;

    @Column(name = "symptoms", columnDefinition = "TEXT")
    private String symptoms;

    @Column(name = "diagnosis", columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "treatment", columnDefinition = "TEXT")
    private String treatment;

    @Column(name = "medication_start_date")
    private LocalDate medicationStartDate;

    @Column(name = "medication_days")
    private Integer medicationDays;

    @Column(name = "is_medication_completed", nullable = false)
    @Builder.Default
    private Boolean isMedicationCompleted = false;

    @Column(name = "amount")
    private Long amount; // [추가] 병원비

    public void update(String clinicName, String symptoms, String diagnosis, String treatment, 
                       LocalDate medicationStartDate, Integer medicationDays, Boolean isMedicationCompleted, Long amount) {
        this.clinicName = clinicName;
        this.symptoms = symptoms;
        this.diagnosis = diagnosis;
        this.treatment = treatment;
        this.medicationStartDate = medicationStartDate;
        this.medicationDays = medicationDays;
        this.isMedicationCompleted = isMedicationCompleted != null && isMedicationCompleted;
        this.amount = amount;
    }
}
