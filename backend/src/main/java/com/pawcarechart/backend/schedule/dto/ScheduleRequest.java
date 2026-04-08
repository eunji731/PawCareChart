package com.pawcarechart.backend.schedule.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleRequest {
    @NotNull(message = "반려견 ID는 필수입니다.")
    private Long dogId;

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    @NotNull(message = "일정 날짜 및 시간은 필수입니다.")
    private LocalDateTime scheduleDate;

    private Long scheduleTypeId;
    private String memo;
    private String location;
    private List<String> symptomTags;

    @JsonProperty("fileIds")
    private List<Long> fileIds;
}
