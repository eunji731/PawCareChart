package com.pawcarechart.backend.file.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileCountResponse {
    private Long targetId;
    private Long count;
}
