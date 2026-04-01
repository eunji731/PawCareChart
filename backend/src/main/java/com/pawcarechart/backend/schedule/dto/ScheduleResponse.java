package com.pawcarechart.backend.schedule.dto;

import com.pawcarechart.backend.file.dto.FileResponse;
import lombok.*;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleResponse {
    private Long id;
    private Long dogId;
    private String title;
    private LocalDateTime scheduleDate;
    private String scheduleTypeCode;
    private boolean isCompleted;
    private String memo;
    private List<String> symptomTags;
    private Long dDay;
    private Integer attachmentCount;
    private List<FileResponse> attachments;

    public static ScheduleResponse of(com.pawcarechart.backend.schedule.entity.Schedule schedule, List<String> symptomTags, List<FileResponse> attachments) {
        LocalDateTime now = LocalDateTime.now();
        long dDay = ChronoUnit.DAYS.between(now.toLocalDate(), schedule.getScheduleDate().toLocalDate());

        return ScheduleResponse.builder()
                .id(schedule.getId())
                .dogId(schedule.getDogId())
                .title(schedule.getTitle())
                .scheduleDate(schedule.getScheduleDate())
                .scheduleTypeCode(schedule.getScheduleTypeCode())
                .isCompleted(schedule.getIsCompleted())
                .memo(schedule.getMemo())
                .symptomTags(symptomTags)
                .dDay(dDay)
                .attachmentCount(attachments != null ? attachments.size() : 0)
                .attachments(attachments)
                .build();
    }
}
