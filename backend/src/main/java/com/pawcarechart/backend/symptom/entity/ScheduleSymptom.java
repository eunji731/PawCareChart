package com.pawcarechart.backend.symptom.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Entity
@Table(name = "schedule_symptoms")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ScheduleSymptom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "schedule_id", nullable = false)
    private Long scheduleId;

    @Column(name = "symptom_id", nullable = false)
    private Long symptomId;
}
